<template lang="pug">

	div(class="file" :key="key")
		div(class="content")
			div(class="img")
				iimg(:src="blob")/
				div(class="lamp") 💡

			div(class="text")

				// div(class="oid") {{ file._id }}
				// div(style="width: 95%; overflow: hidden;") {{ file.name }}
				// div {{ new Date(file.lastModified).toLocaleString() }}
				// div {{ file.size }}

				inplaceTextEdit(
					@savetext="onSaveText"
					v-model="caption"
					label="🖉"
				)/

		slot(name="toolbar")

</template>


<script>

import iimg from './iimg.vue'
import inplaceTextEdit from './inplaceTextEdit.vue'

export default {

	name: 'File',

	components: {
		iimg,
		inplaceTextEdit,
	},

	props: {
		oid: String,
	},

	data () {
		return {
			_id: null,
			blob: null,
			size: 0,
			type: '',
			lastModified: new Date(),
			name: 'blob',
			caption: ''
		}
	},

	computed: {
		key () {
			const ts = this.lastModified.getTime()
			return `${this._id}-${ts}`
		}
	},

	methods: {

		onSaveText (text) {
			console.log('* <File.vue> onSaveText', text)

			this.$http.post(
				`f/${this._id}`,
				{
					caption: text
				},
				{
					headers: {
						'Content-Type': 'application/json'
					}
				}
			).then(result => {
				const key = Date.now()

				console.log('saveCaption http result', result)

				this.caption = text

			}).catch(console.error)

		},

	},

	created () {

		this._id = this.$props.oid

		return this.$http.get(`f/${this._id}/t`, {
			responseType: 'blob'
		})
		.then(response => {

			const contentDisposition = response.headers.get('content-disposition') || 'blob'
			const filename = contentDisposition.replace(/^.*;filename=/, '' )
			const lastModified = new Date(response.headers.get('last-modified'))
			const caption = response.headers.get('x-meta-caption') || ''

			this.blob = response.body
			this.size = response.body.size
			this.type = response.headers.get('content-type')
			this.lastModified = lastModified
			this.name = decodeURIComponent(filename)
			this.caption = decodeURIComponent(caption)

		})
		.catch(err => {
			console.error(err)
		})

	},
}

</script>
