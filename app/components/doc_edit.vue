<template>

	<Modal @close="closeEdit">

		<template v-slot:title>
			{{ $route.meta.title || '-' }}
		</template>

		<ul class="tabs">
			<li class="tab"
				:class="{ active: tabView === 'docEditForm' }"
				role="tab"
				data-tab-component="docEditForm"
				@click.prevent="clickTab"
				>
				Форма
			</li>
			<li class="tab"
				:class="{ active: tabView === 'filesPanel' }"
				role="tab"
				data-tab-component="filesPanel"
				@click.prevent="clickTab"
				>
				Файлы
			</li>
		</ul>

		<div class="doc-edit">
			<component :is="tabView" :oid="docId" />
		</div>

		<!-- div class="doc-edit">
			<div class="doc">
				<div class="edit-form">
					<docEditForm :oid="docId" />
				</div>

				<div class="files">
					<filesPanel v-if="docId" :oid="docId" />
				</div>
			</div>
		</div -->

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
				tabView: 'docEditForm',
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
			},
			clickTab (event) {
				const el = event.target

				this.tabView = el.dataset.tabComponent

				console.log(event)
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

ul.tabs {
	margin: 0 0 1em 0;
	padding: 0;
	border-bottom: 1px solid var(--border-color);
}

li.tab {
	cursor: pointer;
	display: inline-block;
	margin: 0;
	padding: 0 2em;
	border-bottom: 2px solid transparent;
}

li.tab.active {
	font-weight: bold;
	border-bottom: 2px solid var(--border-color);
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
