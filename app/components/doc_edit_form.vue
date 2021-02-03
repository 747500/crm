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

import personSchema from './person_edit_schema.mjs'
import propertySchema from './property_edit_schema.mjs'

const docSchema = {
	person: personSchema,
	property: propertySchema
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
	beforeRouteEnter (to, from, next) {
		next(vm => {
			vm.updateModel()
		})
	},
	beforeRouteUpdate (to, from, next) {
		this.$nextTick(() => {
			this.updateModel()
		})
		next()
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
				this.model = response.body
				console.log('<doc_edit_form> submitHandler', response)
			}).catch((err) => {
				console.error('<doc_edit_form> submitHandler', err)
			})

		},
		updateModel() {
		//	console.log('<doc_edit_form> updateModel', this.$props.oid)
		}
	},
	created () {
		//console.log('<doc_edit_form> created', this.$props.oid)

		const docId = this.$props.oid

		if (docId) {

			this.$http.get(`/doc/${docId}`)
			.then(response => {

				const doc = Object.assign({}, response.body)

				if (response.body.birthDay) {
					doc.birthDay = moment(response.body.birthDay).format('YYYY-MM-DD')
				}

				this.model = doc

				this.$nextTick(() => {
					this.schema = docSchema[doc.kind]
				})


				console.log('<doc_edit_form> updateModel', this.model)
			})
			.catch(err => {
				console.error(err)
			})

		}

	}
}

</script>
