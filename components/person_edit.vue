
<template>
	<div class="panel-body">

		<div>
			<FormulateForm
				v-model="model"
				:schema="schema"
				@submit="submitHandler"
				/>
		</div>

	</div>
</template>

<script>

	import Vue from 'vue'

	import VueFormulate from '@braid/vue-formulate'
	Vue.use(VueFormulate)

	export default {
		components: {
		},
		data () {
		    return {
				model: {
					personId: null,
					lastName: '',
					firstName: '',
					middleName: '',
					birthDay: '',
					passport: ''
				},
				schema: [
					{
						name: 'personId',
						type: 'text',
						label: 'ID',
						readonly: true
					},
					{
						name: 'lastName',
						type: 'text',
						label: 'Фамилия'
					},
					{
						name: 'firstName',
						type: 'text',
						label: 'Имя'
					},
					{
						name: 'middleName',
						type: 'text',
						label: 'Отчество'
					},
					{
						name: 'birthDay',
						type: 'date',
						label: 'Дата рождения'
					},
					{
						name: 'passport',
						type: 'textarea',
						label: 'Паспорт'
					},
					{
						name: 'submit',
						type: 'submit',
						label: 'Сохранить'
					}
				]
			}
		},
		computed: {
			person_id() {
				return this.$route.params.id
			}
		},
		created () {
			console.log('Created');

			setTimeout(() => {

				this.model = {
					personId: this.$route.params.id,
					lastName: 'Иванов',
					firstName: 'Иван',
					middleName: 'Иванович',
					birthDay: '2001-02-03',
					passport: 'имеется'
				}

			}, 250)
		},
		mounted () {

			console.log('Mounted')

		},
		methods: {
			submitHandler(e) {

				console.log('submit:', arguments)

				// this.model contains the valid data according your JSON Schema.
				// You can submit your model to the server here
				console.log('submit:', this.model)

				setTimeout(() => {

					//this.$router.push({ name: 'person' })
					this.$router.push('.')

				}, 250)
			}
		}
	}

</script>
