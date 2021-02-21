<template>

	<Modal @close="closeEdit">

		<template v-slot:title>
			<TabView :schema="tabSchema" @tab="tab => { tabView = tab }" />
		</template>

		<div class="doc-edit">
			<component :is="tabView" :oid="docId" />
		</div>

	</Modal>

</template>

<script>

	import Modal from './Modal.vue'
	import TabView from './TabView.vue'

	import docEditForm from './doc_edit_form.vue'
	import filesPanel from './files_panel.vue'

	export default {
		name: 'docEdit',

		components: {
			Modal,
			TabView,
			docEditForm,
			filesPanel
		},

		data () {
		    return {
				docId: null,
				tabView: null,
				tabSchema: [
					{
						component: 'docEditForm',
						title: this.$route.meta.title
					},
					{
						component: 'filesPanel',
						title: 'Файлы'
					}
				]
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
			},

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

.form-content {
	display: flex;
}

.form-column {
	flex: 1;
}

.doc-edit .edit-form {
	flex: 1;
	overflow: hidden;
}

.doc-edit .files {
	flex: 2;
	overflow: hidden;
}

.doc-edit .edit-upload {
	flex: 2;
	overflow: hidden;
}

.doc-edit .contact-list .formulate-input-group {
	padding-left: 0;
}

.doc-edit .contact-list .formulate-input-group-repeatable-remove {
	position: absolute;
	right: 0.5em;
	top: calc(50% - 2em);
}

.doc-edit .contact-list .formulate-input-group-repeatable-remove:hover {
	text-decoration: none;
}

.doc-edit .contact-list .formulate-input-group-add-more {
	float: right;
}

.doc-edit  .formulate-form > .formulate-input {
	margin: 0.5em 0;
}

.doc-edit  .formulate-form .formulate-input-group-add-more {
	margin: 0.5em 0;
}

.doc-edit  .formulate-form .formulate-input-group-repeatable {
	border: 1px solid #ccc;
	border-radius: 0.333em;
	padding: 0.5em;
	margin: 0.25em 0;
	position: relative;
}

.doc-edit  .formulate-form textarea {
	resize: vertical;
	width: 95%;
}

.doc-edit  .formulate-form input[type=text] {
	width: 95%;
}


</style>
