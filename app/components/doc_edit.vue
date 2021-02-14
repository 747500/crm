<template>

	<Modal @close="closeEdit">

		<template v-slot:title>
			Заголовко
		</template>

		<div class="person-edit">
			<div class="person">
				<div class="edit-form">
					<docEditForm :oid="docId" :kind="$props.kind" />
				</div>

				<div class="files">
					<filesPanel v-if="docId" :oid="docId" />
				</div>
			</div>
		</div>

	</Modal>

</template>

<style>

img {
	display: block;
}

a[role=button] {
	padding: 2px 6px;
	border: 1px solid gray;
	border-radius: 2px;
	background-color: #eee;
	cursor: pointer;
	font-size: 13.333px;
	color: black;
}

.person-edit .person {
	display: flex;
	margin: 0;
	padding: 0;
	width: 100%;
}

.person-edit .person > div {
	margin: 0.5em;
}

.person-edit .person .edit-form {
	flex: 1;
	overflow: hidden;
}

.person-edit .person .files {
	flex: 2;
	overflow: hidden;
}

.person-edit .person .edit-upload {
	flex: 2;
	overflow: hidden;
}

.person .contact-list .formulate-input-group {
	padding-left: 0;
}

.contact-list .formulate-input-group-repeatable-remove {
	float: right;
}
.contact-list .formulate-input-group-add-more {
	float: right;
}

.person .formulate-form > .formulate-input {
	margin: 0.5em 0;
}

.person .formulate-form .formulate-input-group-add-more {
	margin: 0.5em 0;
}

.person .formulate-form .formulate-input-group-repeatable {
	border: 1px solid #ccc;
	border-radius: 0.333em;
	padding: 0.5em;
	margin: 0.25em 0;
}

.person .formulate-form textarea {
	resize: vertical;
	width: 95%;
}

.person .formulate-form input[type=text] {
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

<script>

	import Modal from './Modal.vue'

	import docEditForm from './doc_edit_form.vue'
	import filesPanel from './files_panel.vue'

	export default {
		name: 'personEdit',
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
			//console.log('<doc_edit> created', this.$props.id)

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
			}
		}
	}

</script>
