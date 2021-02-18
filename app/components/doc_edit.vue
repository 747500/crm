<template>

	<Modal @close="closeEdit">

		<template v-slot:title>
			{{ $route.meta.title || '-' }}
		</template>

		<div class="doc-edit">
			<div class="doc">
				<div class="edit-form">
					<docEditForm :oid="docId" />
				</div>

				<div class="files">
					<filesPanel v-if="docId" :oid="docId" />
				</div>
			</div>
		</div>

	</Modal>

</template>

<script>

	import Modal from './Modal.vue'

	import docEditForm from './doc_edit_form.vue'
	import filesPanel from './files_panel.vue'

	export default {
		name: 'docEdit',
		components: {
			Modal,
			docEditForm,
			filesPanel
		},
		data () {
		    return {
				docId: null
			}
		},
		params: {
			oid: {
				type: String,
				required: true
			}
		},
		props: {
			kind: String
		},
		computed: {
		},
		created () {
			//console.log('<doc_edit.vue> created', this)

			this.docId = this.$route.params.id;

			if ('new' === this.docId) {
				this.docId = null
			}

		},
		mounted () {

		},
		methods: {
			closeEdit () {
				this.$router.push('.')
				this.$emit('updateDoc')
			}
		}
	}

</script>

<style>

a[role=button] {
	padding: 2px 6px;
	border: 1px solid gray;
	border-radius: 2px;
	background-color: #eee;
	cursor: pointer;
	font-size: 13.333px;
	color: black;
}

.doc-edit .doc {
	display: flex;
	margin: 0;
	padding: 0;
	width: 100%;
}

.doc-edit .doc > div {
	margin: 0.5em;
}

.doc-edit .doc .edit-form {
	flex: 1;
	overflow: hidden;
}

.doc-edit .doc .files {
	flex: 2;
	overflow: hidden;
}

.doc-edit .doc .edit-upload {
	flex: 2;
	overflow: hidden;
}

.doc .contact-list .formulate-input-group {
	padding-left: 0;
}

.contact-list .formulate-input-group-repeatable-remove {
	position: absolute;
	right: 0.5em;
	top: calc(50% - 2em);
}

.contact-list .formulate-input-group-repeatable-remove:hover {
	text-decoration: none;
}

.contact-list .formulate-input-group-add-more {
	float: right;
}

.doc .formulate-form > .formulate-input {
	margin: 0.5em 0;
}

.doc .formulate-form .formulate-input-group-add-more {
	margin: 0.5em 0;
}

.doc .formulate-form .formulate-input-group-repeatable {
	border: 1px solid #ccc;
	border-radius: 0.333em;
	padding: 0.5em;
	margin: 0.25em 0;
	position: relative;
}

.doc .formulate-form textarea {
	resize: vertical;
	width: 95%;
}

.doc .formulate-form input[type=text] {
	width: 95%;
}


.files .list {
	margin-top: 1em;
}

.files .list .item {
	margin: 0.5em 0;
	padding: 0.5em;
	background-color: #faebd7;
	border-radius: 1em;
	display: flex;
}

.files .queue .list .item {
	background-color: #b9c97b; /* #c0ffee; */
}

.files .list .text {
	padding: 0.25em;
}

.files .list .text > div {
	padding: 0.25em;
	flex: 1;
	font-size: smaller;
}

.files .list .item img {
  object-fit: cover;
  width: 9em;
  height: 9em;
  border-radius: 1em;
  display: block;
}

</style>
