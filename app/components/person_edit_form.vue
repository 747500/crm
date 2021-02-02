<template>

	<div class="edit-form">
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

export default {
	name: 'personEditForm',
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
				_id: null,
				kind: 'person',
				lastName: '',
				firstName: '',
				middleName: '',
				birthDay: '',
				passport: ''
			},
			schema: personSchema
		}
	},
	beforeRouteEnter (to, from, next) {
		next(vm => {
			vm.updateModel(vm)
		})
	},
	beforeRouteUpdate (to, from, next) {
		this.$nextTick(() => {
			this.updateModel(this)
		})
		next()
	},
	methods: {
		submitHandler (formData) {

			console.log('<person_edit_form> submitHandler', formData, this.model)

			var ok

			if (null === this.model._id) {
				ok = this.$http.put('/doc', formData)
			}
			else {
				ok = this.$http.post(`/doc/${this.model._id}`, formData)
			}

			ok.then(response => {
				this.model = response.body
				console.log('<person_edit_form> submitHandler', response)
			}).catch((err) => {
				console.error('<person_edit_form> submitHandler', err)
			})

		},
		updateModel() {
			console.log('<person_edit_form> updateModel', this.$props.oid)
		}
	},
	created () {
		console.log('<person_edit_form> created', this.$props.oid)

		const docId = this.$props.oid

		if (docId) {

			this.$http.get(`/doc/${docId}`)
					.then(response => {

						const person = Object.assign({}, response.body)

						person.birthDay = moment(response.body.birthDay).format('YYYY-MM-DD')

						this.model = person

						console.log('<person_edit_form> updateModel', this.model)
					})
					.catch(err => {
						console.error(err)
					})

		}

	}
}

</script>
