<template lang="pug">

	div(class="doc-edit")
		div(v-for="(item, n) in Schema[doc.kind]" :key="item.is" :class="[item.class]")
			component(:is="item.is" v-bind="item")/

</template>

<script>

	import moment from  'moment'

	import oidImage from './oidImage.vue'
	import DocFormOwner from './DocFormOwner.vue'
	import DocForm from './DocForm.vue'

	export default {

		name: 'DocEdit',

		components: {
			oidImage,
			DocFormOwner,
			DocForm,
		},

		props: {
			model: Object,
		},

		data () {
			return {
				doc: this.$props.model
			}
		},

		created () {

			if (this.doc) {
				if (this.doc.person && this.doc.person.birthDay) {
					this.doc.person.birthDay = moment(this.doc.person.birthDay).format('YYYY-MM-DD')
				}

				this.key = `${this.doc._id}-${this.doc.__v}`
			}

		},

		computed: {

			Schema () {

				return {

					person: [
						{
							is: 'oidImage',
							class: 'picture',
							oid: this.doc.mainPicture,
						},
						{
							is: 'DocForm',
							class: 'form',
							model: this.doc.person,
							kind: this.doc.kind,
							submit: this.submitHandler,
						},

					],

					property: [
						{
							is: 'DocFormOwner',
							class: 'owner',
							oid: this.doc.owner,
							select: this.selectOwner,
						},
						{
							is: 'DocForm',
							class: 'form',
							model: this.doc.property,
							kind: this.doc.kind,
							submit: this.submitHandler,
						},
					],

					contract: [
						{
							is: 'DocForm',
							class: 'form',
							model: this.doc.contract,
							kind: this.doc.kind,
							submit: this.submitHandler,
						},
					],

				}
			},

		},

		methods: {

			selectOwner (oid) {
				console.log('selectOwner', oid, this.doc)
				this.doc.owner = oid
			},

			submitHandler (formData) {

				//console.log('<DocEdit.vue> submitHandler', formData, this.model)

				const postData = {}

				if (this.doc._id) { // update
					postData._id = this.doc._id
				}
				else { // create new
					postData.kind = this.doc.kind
				}

				postData[this.doc.kind] = formData

				if ('property' === this.doc.kind) {
					postData.owner = this.doc.owner
				}

				this.$emit('update', postData)

			},

		}

	}

</script>

<style>

.doc-edit .picture {
	width: 9rem;
	height: 9rem;
}

.doc-edit .picture img {
	width: 9rem;
	height: 9rem;
	object-fit: cover;
}

.doc-edit .form-content {
	display: flex;
}

.doc-edit .form-column {
	padding: 0.33rem;
	flex: 1;
}

.doc-edit .doc-form {
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

/*
.doc-edit .contact-list .formulate-input-group {
	padding-left: 0;
}
*/

.doc-edit .contact-list .contact-remove {
	position: absolute;
	right: 0.5rem;
	top: calc(25%);
}

/*
.doc-edit .contact-list .formulate-input-group-repeatable-remove:hover {
	text-decoration: none;
}
*/

.doc-edit .contact-list .contact-add {
	float: right;
	width: 3rem;
}

.doc-edit .contact-list .contact-add button {
	margin: -.6rem -1.25rem;
	padding: .6rem 1.25rem;
	border: none;
	background-color: transparent;
}

.doc-edit .contact-list .contact-add button span {
	display: block;
	color: var(--bs-success);
	font-weight: 700;
}

.doc-edit .contact-list .contact-add button:hover span {
	color: white;
}

/*
.doc-edit .formulate-form > .formulate-input {
	margin: 0.5em 0;
}

.doc-edit .formulate-form .formulate-input-group-add-more {
	margin: 0.5em 0;
}
*/

.doc-edit .formulate-form .formulate-input-group-repeatable {
	border: 1px solid #ccc;
	border-radius: 0.333rem;
	padding: 0.5rem;
	margin: 0.25rem 0;
	position: relative;
}

.doc-edit .formulate-form .formulate-input-group-repeatable .form-control {
	width: calc(100% - 3.5rem);
}

/*
.doc-edit .formulate-form textarea {
	resize: vertical;
	width: 95%;
}
*/
/*
.doc-edit .formulate-form input[type=text] {
	width: 95%;
}
*/

.doc-edit > .owner {
	width: 33.3%;
	padding: 0.33rem;
}

</style>
