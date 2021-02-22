<template>

	<div class="doc-edit-form">

		<!--
		<FormulateForm
			v-model="doc"
			:schema="schema"
			@submit="submitHandler"
			/>
		-->

		<!--
		<Modal v-if="selectPictureModal" @close="() => { selectPictureModal = false }">
			<template slot="title">
				Blah
			</template>
			<div>
				blah
			</div>
		</Modal>
		-->

		<div v-for="(item, n) in schema" :key="item.is" :class="[item.class]">

			<FormulateForm v-if="item.is === 'FormulateForm'"
				v-model="doc[item.model]"
				:schema="formSchema"
				@submit="item.submit"
				/>

			<component v-if="item.is !== 'FormulateForm'"
				:is="item.is"
				v-bind="item"
				/>

		</div>

	</div>

</template>

<script>

import moment from 'moment'

import oidImage from './oidImage.vue'
import Modal from './Modal.vue'

import personSchema from './schema/person.js'
import propertySchema from './schema/property.js'
import contractSchema from './schema/contract.js'


const docSchema = {
	person: personSchema,
	property: propertySchema,
	contract: contractSchema
}

export default {

	name: 'docEditForm',

	components: {
		oidImage,
		Modal,
	},

	props: {
		model: Object,
	},

	data () {
		return {
			schema: null,
			doc: null,
			mainPicture: null,
			selectPictureModal: false,
		}
	},

	mounted () {

		this.doc = this.$props.model
		this.schema = this.Schema[this.doc.kind]

		console.log(this.schema)
	},

	created () {

	},

	methods: {

		selectPicture () {
			this.selectPictureModal = true
			console.log()
		},

		submitHandler (formData) {

			console.log('<doc_edit_form.vue> submitHandler', formData, this.model)

			//return

			var ok

			if (null === this.model._id) {
				ok = this.$http.put('/doc', formData)
			}
			else {
				ok = this.$http.post(`/doc/${this.model._id}`, formData)
			}

			ok.then(response => {
				//this.key = `${response.body._id}-${response.body.__v}`
				this.model = response.body

				// FIXME - dirty schemaless hack
				if (response.body.birthDay) {
					this.model.birthDay = moment(response.body.birthDay).format('YYYY-MM-DD')
				}

				//console.log('<doc_edit_form> submitHandler', response)
			}).catch((err) => {
				console.error('<doc_edit_form> submitHandler', err)
			})

			return ok // https://vueformulate.com/guide/forms/#context-object
		},

	},

	computed: {

		kind () {
			return this.$props.model.kind || this.$route.path.split('/')[1]
		},

		Schema () {

			return {

				person: [
					{
						is: 'oidImage',
						class: 'picture',
						oid: this.doc.mainPicture,
					},
					{
						is: 'FormulateForm',
						class: 'form',
						model: 'person',
						schema: personSchema,
						submit: this.submitHandler
					},

				],

				property: [
					{
						is: 'oidImage',
						class: 'picture',
						oid: this.doc.mainPicture,
					},
					{
						is: 'FormulateForm',
						class: 'form',
						model: 'property',
						schema: propertySchema,
						submit: this.submitHandler
					},
				],

				contract: [
					{
						is: 'FormulateForm',
						model: 'contract',
						class: 'form',
						schema: contractSchema,
						submit: this.submitHandler
					},
				],

			}
		},

		formSchema () {
			var kind = this.kind;

			var emptySchema = [
				{
			        name: '_id',
			        type: 'text',
			        label: 'ID',
			        readonly: true,
			        class: 'oid'
			   	}
			]

			var schema = docSchema[kind] || emptySchema

			return [
				...schema,
				{
					name: 'submit',
					type: 'submit',
					label: 'Сохранить'
				}
			]
		}
	}
}

</script>

<style>

.doc-edit-form .picture {
	width: 12em;
	height: 12em;
	overflow: hidden;
	border: 1px solid var(--border-color);
	position: relative;
}

/*
.main-picture .toolbar {
	width: 100%;
	position: absolute;
	right: 0px;
}

.main-picture .toolbar .content {
	visibility: hidden;
}

.main-picture:hover .toolbar {
	background: rgba(0, 0, 0, 0.33);
}

.main-picture:hover .toolbar .content {
	visibility: visible;
}
*/

.doc-edit-form .picture img {
	width: 12em;
	height: 12em;

	object-fit: cover;
}

</style>
