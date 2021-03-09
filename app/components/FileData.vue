<template lang="pug">

	FileItem(
		v-if="null !== model"
		:model="model"
		@caption="onCaption"
	)
		template(slot="toolbar")
			slot(name="toolbar")

</template>


<script>

import FileItem from './FileItem.vue'

export default {

	name: 'FileLoader',

	components: {
		FileItem,
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
			console.log('* <FileData.vue> onCaption', text)

			this.$http.post(
				`f/meta/${this.model._id}`,
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

		//console.log('* FileData.vue created')

		const file = {
			_id: this.$props.oid
		}

		this.$http.get(`f/meta/${file._id}`)
		.then(response => {

			// console.log('* FileData.vue meta:', response)

			file.size = response.data.length
			file.contentType = response.data.contentType
			file.mtime = response.data.mtime
			file.name = response.data.filename
			file.caption = response.data.meta.caption

			this.model = file

		})
		.catch(err => {
			console.error(err)
		})

	},
}

</script>
