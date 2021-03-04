<template lang="pug">

	div(class="files-panel")
		filesUpload(
			class="queue"
			:oid="$props.model._id"
			@active="uploadActive"
		)/

		filesList(
			class="list"
			v-if="showFilesList"
			:oid="$props.model._id"
			:avatar="$props.model.mainPicture"
			@setMain="setAsMain"
		)/

</template>

<script>

	import filesUpload from './files_upload_queue.vue'
	import filesList from './files_list.vue'

	export default {
		name: 'FilesPanel',
		components: {
			filesUpload,
			filesList
		},
		props: {
			model: Object
		},
		data () {
			return {
				showFilesList: true
			}
		},
		methods: {
			uploadActive (message) {
				this.showFilesList = !message
			},

			setAsMain (oid) {
				this.$emit('update', {
					_id: this.$props.model._id,
					mainPicture: oid,
				})
			},

		}

	}

</script>

<style>

.files-panel .list {
	margin-top: 1em;
	justify-content: stretch;
}

.files-panel .list .item {
	margin: 0.33em;
	padding: 0em;
	border-radius: 1em;
	border: 1px solid var(--border-color);
	display: inline-block;
	width: 12em;
	overflow: hidden;
	position: relative;
}

/*
.files-panel .list .item .content {
	display: flex;
}
*/

.files-panel .queue .list .item {
	background-color:  white; /*#b9c97b; #c0ffee; */
}

.files-panel .list .item .img {
	border-bottom: 1px solid var(--border-color);
}

.files-panel .list .item .text {
	display: flex;
	flex-direction: column;
}

.files-panel .list .item .text > div {
	flex: 1;
	font-size: small;
}

.files-panel .list .item img {
  object-fit: cover;
  width: 12em;
  height: 12em;
  border-radius: 1em 1em 0 0;
  display: block;
}

.files-list .item .toolbar {
	position: absolute;
	width: 100%;
	top: 0px;
	left: 0px;
	right: 0px;
	/*height: 5em;*/
}

.files-list .item .tools > *{
	display: block;
}

.files-list .item .toolbar:hover {
	background: rgba(0, 0, 0, 0.33);
}

.files-list .item .toolbar .tools {
	text-align: center;
	margin: 0.33em;
	/*
	text-shadow: 0 0 1px #fff, 0 0 1px #fff, 0 0 1px #fff, 0 0 1px #fff;
	*/
	text-shadow: 1px 0px 3px #fff, -1px 0px 3px #fff, 0px 1px 3px #fff, 0px -1px 3px #fff;
	visibility: hidden;
}

.files-list .item .toolbar:hover .tools {
	visibility: visible;
}

</style>
