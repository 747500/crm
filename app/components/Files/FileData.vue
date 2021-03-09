<template lang="pug">

	div
		slot(v-bind:file="model")
			pre {{ model }}

</template>


<script>

import FileItem from './FileItem.vue'

export default {

	name: 'FileData',

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
			file.ctime = response.data.ctime
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
