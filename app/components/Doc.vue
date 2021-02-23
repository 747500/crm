<template>

	<Modal @close="closeEdit">

		<template v-slot:title>
			<TabView :schema="TabViewSchema" @tab="tab => { tabView = tab }" />
		</template>

		<div class="doc-edit">

			<component
				v-if="tabView"
				:is="tabView.component"
				:model="model"
				:key="model._id"
				/>

		</div>

	</Modal>

</template>

<script>

	import moment from 'moment'

	import Modal from './Modal.vue'
	import TabView from './TabView.vue'

	import DocEdit from './DocEdit.vue'
	import filesPanel from './files_panel.vue'
	import PersonSelect from './person_select.vue'

	export default {
		name: 'Doc',

		components: {
			Modal,
			TabView,
			DocEdit,
			filesPanel,
			PersonSelect
		},

		data () {
		    return {
				docId: null,
				tabView: null,
				model: {}
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

			TabViewSchema () {

				return [

					{
						kind: '*',
						title: this.$route.meta.title,
						component: 'DocEdit',
					},
					{
						kind: [ 'property' ],
						title: 'Собственник',
						component: 'PersonSelect',
					},
					{
						kind: [ 'person', 'property', 'contract' ],
						title: 'Файлы',
						component: 'filesPanel',
					}

				].filter(item => {

					if ('*' === item.kind) {
						return true
					}

					if (this.model && this.model.kind) {
						return item.kind.includes(this.model.kind)
					}

					return false
				})
			},
		},

		mounted () {
			console.log('<doc_edit.vue> mounted', this.$route.params)

			this.docId = this.$route.params.id;

			if ('new' === this.docId) {
				return
			}

			this.$http
			.get(`/doc/${this.docId}`)
			.then(response => {

				const doc = response.body

				// FIXME - dirty schemaless hack
				if (doc.person && doc.person.birthDay) {
					doc.person.birthDay = moment(doc.person.birthDay).format('YYYY-MM-DD')
				}

				this.model = doc
			})
			.catch(console.error)

		},

		created () {

		},

		methods: {

			closeEdit () {
				//this.$router.push('.')
				this.$router.go(-1)
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

.doc-edit .form-content {
	display: flex;
}

.doc-edit .form-column {
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

.doc-edit .formulate-form > .formulate-input {
	margin: 0.5em 0;
}

.doc-edit .formulate-form .formulate-input-group-add-more {
	margin: 0.5em 0;
}

.doc-edit .formulate-form .formulate-input-group-repeatable {
	border: 1px solid #ccc;
	border-radius: 0.333em;
	padding: 0.5em;
	margin: 0.25em 0;
	position: relative;
}

.doc-edit .formulate-form textarea {
	resize: vertical;
	width: 95%;
}

.doc-edit .formulate-form input[type=text] {
	width: 95%;
}


</style>
