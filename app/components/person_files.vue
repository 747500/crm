<template>

	<div>
		<span>Файлы:</span>

		<fileUploadQueue
			v-if="docId"
			class="queue list"
			:oid="docId"
			@active="queueActive"
			/>

		<hr>
		<filesList
			class="files list"
			:oid="docId"
			v-if="!queueState"
			/>

	</div>

</template>

<script>

import fileUploadQueue from './files_upload_queue.vue'
import filesList from './files_list.vue'

export default {

	name: 'personFiles',

	components: {
		fileUploadQueue,
		filesList
	},

	model: {
		prop: 'oid'
	},

	props: {
		oid: String
	},

	data () {
		return {
			docId: null,
			queueState: false
		}
	},

	created () {
		this.docId = this.$props.oid
	},

	methods: {
		queueActive (state) {
			this.queueState = state
		}
	}
}
</script>
