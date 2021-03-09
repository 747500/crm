
<template lang="pug">

	div(
		class="files-list"
		style="max-height: calc(100vh - 15em); overflow: auto;"
	)

		FileData(
			:oid="file._id"
			v-for="(file) in files.slice().reverse()"
			:key="file.key"
			:class="[ 'item', { busy: true == file.busy, avatar: file._id === $props.avatar } ]"
			@click.prevent="onFileClick"
		)
			template(slot="toolbar")
				div(class="toolbar")
					div(class="tools")
						FileRemoveBtn(
							:item="file"
							@remove="removeFile"
						)/

						bsButton(
							class="btn-dark btn-sm"
							:disabled="file._id === $props.avatar"
							@mouseup.prevent="() => $emit('setMain', file._id)"
						) 💡

</template>

<style>

.dropdown-menu {
	margin: 0;
}

.item .content .img {
	position: relative;
}

.item .content .img .lamp {
	position: absolute;
	line-height: 2em;
	bottom: 0px;
	right: 0px;
	display: none;
	width: 2em;
	height: 2em;
	text-align: center;
	text-shadow: 1px 0px 3px #fff, -1px 0px 3px #fff, 0px 1px 3px #fff, 0px -1px 3px #fff;
}

.item.avatar .content .img .lamp {
	display: block;
}

.busy {
	outline: 1px dotted red;
}

</style>

<script>

import bsButton from '../bs/Button.vue'

import FileRemoveBtn from './FileRemoveBtn.vue'
import FileData from './FileData.vue'

export default {

	name: 'filesList',

	components: {
		FileData,
		FileRemoveBtn,
		bsButton,
	},

	model: {
		prop: 'oid',
	},

	props: {
		oid: [ String, undefined ],
		avatar: String,
	},

	data () {
		return {
			files: [], //this.$props.files.map(oid => { oid: oid })
		}
	},

	methods: {

		removeFile (file) {

			file.busy = true

			this.$http.delete(`f/${file._id}`)
			.then(() => {

				this.files = this.files.filter(item => {
					return file._id !== item._id
				})

			})
			.catch(console.error)
			.finally(() => {
				file.busy = false
			})

		},

		onFileClick (event) {
			console.log('* <files_list.vue> onFileClick', event)
		},
	},

	mounted () {

	},

	created () {

		const docId = this.$props.oid

		//console.log('<file_list.vue> created', docId)

		if (!docId) {
			return
		}

		this.$http
		.get(`doc/${docId}/files`)
		.then(response => {

			//console.log('<files_list> created:', response)

			this.files = response.body.map(oid => {
				return {
					_id: oid,
					key: oid
				}
			})

		})
	}
}

</script>
