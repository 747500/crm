<template>
	<div class="files-panel">
		<filesUpload class="queue"
			:oid="$props.oid"
			@active="uploadActive"
			/>

		<filesList class="list"
			v-if="showFilesList"
			:oid="$props.oid"
			/>
	</div>

</template>

<script>

	import docEditForm from './doc_edit_form.vue'
	import filesUpload from './files_upload_queue.vue'
	import filesList from './files_list.vue'

export default {
	name: 'FilesPanel',
	components: {
		filesUpload,
		filesList
	},
	props: {
		oid: String
	},
	data () {
		return {
			showFilesList: true
		}
	},
	methods: {
		uploadActive (message) {
			this.showFilesList = !message
		}
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
}

/*
.files-panel .list .item .content {
	display: flex;
}
*/

.files-panel .queue .list .item {
	background-color:  white; /*#b9c97b; #c0ffee; */
}

.files-panel .list .text {
	padding: 0.25em;
	display: flex;
	flex-direction: column;
}

.files-panel .list .text > div {
	padding: 0.12em;
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

</style>
