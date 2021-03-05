<template lang="pug">

	File(
		v-if="null !== model"
		:model="model"
		@caption="onCaption"
	)
		template(slot="toolbar")
			slot(name="toolbar")

</template>


<script>

import File from './File.vue'

export default {

	name: 'FileLoader',

	components: {
		File,
	},

	props: {
		oid: String,
	},

	data () {
		return {
			model: null
		}
	},

	computed: {
		key () {
			const ts = this.lastModified.getTime()
			return ts
			// return `${this._id}-${ts}`
		}
	},

	methods: {

		onCaption (text) {
			console.log('* <File.vue> onCaption', text)

			this.$http.post(
				`f/${this.model._id}`,
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

				this.model.caption = text
				this.model.lastModified = new Date()

			}).catch(console.error)

		},

	},

	created () {

		console.log('* FileLoader.vue created')

		const file = {
			_id: this.$props.oid
		}

		this.$http.get(`f/${file._id}/t`, {
			responseType: 'blob'
		})
		.then(response => {

			const contentDisposition = response.headers.get('content-disposition') || 'blob'
			const filename = contentDisposition.replace(/^.*;filename=/, '' )
			const lastModified = new Date(response.headers.get('last-modified'))
			const caption = response.headers.get('x-meta-caption') || ''

			file.blob = response.body
			file.size = response.body.size
			file.type = response.headers.get('content-type')
			file.lastModified = lastModified
			file.name = decodeURIComponent(filename)
			file.caption = decodeURIComponent(caption)

			this.model = file
		})
		.catch(err => {
			console.error(err)
		})

	},
}

</script>
