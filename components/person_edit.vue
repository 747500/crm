
<template>
	<div class="">

		<div class="">
			<FormulateForm
				v-model="model"
				:schema="schema"
				@submit="submitHandler"
				@close="closeHandler"
				/>
		</div>

		<div class="">

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
					_id: null,
					lastName: '',
					firstName: '',
					middleName: '',
					birthDay: '',
					passport: ''
				},
				schema: [
					{
						name: '_id',
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
						name: 'close',
						type: 'button',
						label: 'Закрыть',
						'@click': 'close'
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
				vm.updateModel()
			})
		},
		beforeRouteUpdate (to, from, next) {
			this.$nextTick(() => {
				this.updateModel()
			})
			next()
		},
		created () {
		},
		mounted () {
		},
		methods: {
			updateModel (vm) {
				const personId = this.$route.params.id;

				if (personId === 'create') {
					this.model = {
						_id: personId,
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

				const personId = this.model._id
				var method = 'post'

				if (personId === 'create') {
					method = 'put'
				}

				this.$http[method](
					'/person',
					formData
				).then(response => {
					//this.$router.push({ name: 'person' })
					this.$router.push('.')
				}).catch((err) => {
					console.error('submitHandler', err)
				});

			},
			closeHandler () {
				//this.$router.push({ name: 'person' })
				this.$router.push('.')
			}
		}
	}

</script>
