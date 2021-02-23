<template>

	<div>
		<div v-for="(item, n) in Schema[doc.kind]" :key="item.is" :class="[item.class]">
			<component :is="item.is" v-bind="item" />
		</div>
	</div>

</template>

<script>

	import oidImage from './oidImage.vue'
	import DocForm from './DocForm.vue'

	export default {

		name: 'DocEdit',

		components: {
			oidImage,
			DocForm,
		},

		props: {
			model: Object,
		},

		data () {
			return {
				doc: null
			}
		},

		created () {
			this.doc = this.$props.model
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
							submit: this.submitHandler
						},

					],

					property: [
						//{
						//	is: 'oidImage',
						//	class: 'picture',
						//	oid: this.doc.mainPicture,
						//},
						{
							is: 'DocForm',
							class: 'form',
							model: this.doc.property,
							kind: this.doc.kind,
							submit: this.submitHandler
						},
					],

					contract: [
						{
							is: 'DocForm',
							class: 'form',
							model: this.doc.contract,
							kind: this.doc.kind,
							submit: this.submitHandler
						},
					],

				}
			},

		},

		methods: {

			submitHandler (formData) {

				console.log('<DocEdit.vue> submitHandler', formData, this.model)

				return

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

		}

	}

</script>
