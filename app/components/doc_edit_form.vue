<template>

	<div>
		<FormulateForm
			v-model="model"
			:schema="schema"
			@submit="submitHandler"
			/>

		<div v-if="'contract' === model.kind">
			<hr />

			<!-- input
				name="property"
				type="text"
				:value="model.property"
				@change="changes"
				/ -->

			<doc :oid="model.property" :key="model.property || 'empty'"/>

		</div>
	</div>

</template>

<script>

import moment from 'moment'

import personSchema from './schema/person.js'
import propertySchema from './schema/property.js'
import contractSchema from './schema/contract.js'

import doc from './M/doc.vue'

const docSchema = {
	person: personSchema,
	property: propertySchema,
	contract: contractSchema
}

export default {
	name: 'docEditForm',
	components: {
		doc
	},
	model: {
		prop: 'oid'
	},
	props: {
		oid: {
			type: [ String, undefined ]
		},
		kind: {
			type: [ String ]
		}
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

				//console.log('<doc_edit_form> submitHandler', response)
			}).catch((err) => {
				console.error('<doc_edit_form> submitHandler', err)
			})

			return ok // https://vueformulate.com/guide/forms/#context-object
		},

		afterSchemaDefined () {

			this.$nextTick(() => {
				console.log('<doc_edit_form.vue> afterSchemaDefined', this)
		//propertyObj
			})

		}
	},
	created () {
		//console.log('<doc_edit_form> created', this.$props.oid)

		const docId = this.$props.oid

		if (docId) { // existent doc

			this.$http.get(`/doc/${docId}`)
			.then(response => {

				const doc = Object.assign({}, response.body)

				this.schema = docSchema[doc.kind]
				this.afterSchemaDefined()

				// FIXME - dirty schemaless hack
				if (response.body.birthDay) {
					doc.birthDay = moment(response.body.birthDay).format('YYYY-MM-DD')
				}

				this.model = doc

				//console.log('<doc_edit_form> updateModel', this.model)
			})
			.catch(err => {
				console.error(err)
			})

		}
		else { // new doc

			//console.log('<doc_edit_form.vue>', this)

			const kind = this.$route.path.split('/')[1]
			this.model.kind = kind

			this.schema = docSchema[kind]
			this.afterSchemaDefined()

		}
	}
}

</script>
