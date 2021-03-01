<template lang="pug">

	div
		div(class="account btn-toolbar" role="toolbar")

			div(
				class="input-group me-2"
				role="group"
			)
				label(
					class="input-group-text"
					id="basic-addon1"
					for="select-or-create-user"
				)
					| Пользователь
				select(
					@change="onUserChange"
					class="form-select"
					id="select-or-create-user"
					aria-describedby="basic-addon1"
				)
					option(value="new")
						| <Создать>
					option(
						v-for="u in users"
						:key="u._id"
						:value="u._id"
						:selected="u.current ? 'selected' : ''"
					)
						| {{ u.name }}

			form(
				v-if="createUser"
				@submit.prevent="onUserCreate"
				class="input-group me-2"
				role="group"
			)
				label(
					class="input-group-text"
					id="basic-addon2"
					for="input-new-user-name"
				) Имя
				input(
					id="input-new-user-name"
					type="text"
					class="form-control"
					aria-describedby="basic-addon2"
				)/
				button(
					class="btn btn-primary"
					type="submit"
				) Ok

		div(class="hr")

</template>

<script>

	export default {

		name: 'Accounts',

		components: {
		},

		data () {
			return {
				users: [],
				user: null,
				createUser: false,
			}
		},

		created () {

			this.loadUsers()
		},

		methods: {

			loadUsers () {

				return this.$http
					.get('/u')
					.then(response => {
						// console.log('<Accounts.vue> users', response.body)
						this.users = response.body

						this.users.forEach(u => {
							if (u.current) {
								this.user = u._id
							}
						})
					})
					.catch(err => console.error(err))

			},

			onUserChange (event) {
				const userId = event.target.value

				if ('new' === userId) {
					this.createUser = true
					return
				}

				if (this.user === userId) {
					this.createUser = false
					return
				}

				this.user = userId

				this.$http.post('/u/set',
					{
						_id: userId
					}
				)
				.then(() => {
					//console.log('<Accounts.vue> set user', response)
					return this.loadUsers()
				})
				.then(() => {
					this.$nextTick(() => document.location.reload())
				})
				.catch(err => console.error(err))
			},

			onUserCreate (event) {
				const newUserName = event.target[0].value

				this.$http.put('/u',
					{
						name: newUserName
					}
				)
				.then(() => {
					document.location.reload()
				})
				.catch(err => console.error(err))
			}
		}
	}

</script>
