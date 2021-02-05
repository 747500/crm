<template>
	<div>
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
