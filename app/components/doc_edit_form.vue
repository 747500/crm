<template>

	<div>
		<FormulateForm
			v-model="model"
			:schema="schema"
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
	name: 'docEditForm',
	model: {
		prop: 'oid'
	},
	props: {
		oid: {
			type: [ String, undefined ]
		},
	},
	data () {
		return {
			docId: null,
			model: {
				_id: null
			},
			schema: [
				{
			        name: '_id',
			        type: 'text',
			        label: 'ID',
			        readonly: true,
			        class: 'oid'
			    }
			]
		}
	},
	methods: {
		submitHandler (formData) {

			console.log('<doc_edit_form> submitHandler', formData, this.model)

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

				console.log('<doc_edit_form> submitHandler', response)
			}).catch((err) => {
				console.error('<doc_edit_form> submitHandler', err)
			})

		}
	},
	created () {
		//console.log('<doc_edit_form> created', this.$props.oid)

		const kind = this.$route.path.split('/')[1]
		this.model.kind = kind
		this.schema = docSchema[kind]

		const docId = this.$props.oid

		if (docId) {

			this.$http.get(`/doc/${docId}`)
			.then(response => {

				const doc = Object.assign({}, response.body)

				// FIXME - dirty schemaless hack
				if (response.body.birthDay) {
					doc.birthDay = moment(response.body.birthDay).format('YYYY-MM-DD')
				}

				this.model = doc

				console.log('<doc_edit_form> updateModel', this.model)
			})
			.catch(err => {
				console.error(err)
			})

		}
	}
}

</script>
