
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
		beforeRouteEnter (to, from, next) {
			next(vm => {
				//console.log('beforeRouteEnter', vm.$route.params.id)
				vm.updateModel()
			})
		},
		beforeRouteUpdate (to, from, next) {
			this.$nextTick(() => {
				//console.log('beforeRouteUpdate', this.$route.params.id)
				this.updateModel()
			})
			next()
		},
		created () {
			/*
			console.log(new Date(), 'Created - person_edit');

			const personId = this.$route.params.id;

			if (personId === 'create') {
				this.model = {
					personId: personId,
					lastName: '',
					firstName: '',
					middleName: '',
					birthDay: '',
					passport: ''
				}
			}
			else {
				this.$http.get('/person/' + personId).then(response => {
					this.model = Object.assign({}, response.body)
				}).catch((e) => {
					console.error(e)
				});
			}
			*/
		},
		mounted () {

			console.log('Mounted')

		},
		methods: {
			updateModel (vm) {

				const personId = this.$route.params.id;

				if (personId === 'create') {
					this.model = {
						personId: personId,
						lastName: '',
						firstName: '',
						middleName: '',
						birthDay: '',
						passport: ''
					}
				}
				else {
					this.$http.get('/person/' + personId).then(response => {
						this.model = Object.assign({}, response.body)
					}).catch((e) => {
						console.error(e)
					});
				}

			},
			submitHandler(formData) {

				const personId = this.model.personId
				const method = 'post'

				if (personId === 'create') {
					method = 'put'
				}

				console.log('submitHandler:', formData)

				this.$http[method](
					'/person',
					formData
				).then(response => {
					console.log('submitHandler:', response)

					//this.$router.push({ name: 'person' })
					this.$router.push('.')

				}).catch((err) => {
					console.error('submitHandler', err)
				});

			}
		}
	}

</script>
