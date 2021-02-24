<template>

	<div class="doc-form">

		<FormulateForm
			v-model="doc"
			:schema="formSchema"
			@submit="submitHandler"
			/>

	</div>

</template>

<script>

import moment from 'moment'

import personSchema from './schema/person.js'
import propertySchema from './schema/property.js'
import contractSchema from './schema/contract.js'


const docSchema = {
	person: personSchema,
	property: propertySchema,
	contract: contractSchema
}

export default {

	name: 'DocForm',

	components: {
	},

	props: {
		model: Object,
		kind: String,
		submit: Function,
	},

	data () {
		return {
			doc: null,
			key: null,
		}
	},

	mounted () {
	},

	created () {
		this.doc = this.$props.model
		console.log('<doc_edit_form.vue> mounted:', this.doc)
	},

	methods: {

		submitHandler(formData) {
			this.$props.submit(formData)
		}

	},

	computed: {

		formSchema () {
			var kind = this.$props.kind;

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
					component: 'div',
					class: 'hr',
				},
				{
					name: 'submit',
					type: 'submit',
					label: 'Сохранить',
					inputClass: 'btn btn-success'
				}
			]
		}
	}
}

</script>

<style>

</style>
