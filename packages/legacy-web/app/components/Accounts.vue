<template lang="pug">

	div
		div(class="account btn-toolbar" role="toolbar")

			//div(
			//	class="input-group me-2"
			//	role="group"
			//)
			//	label(
			//		class="input-group-text"
			//		id="basic-addon1"
			//		for="select-or-create-user"
			//	)
			//		| @

			//	class="form-select"
			select(
				:key="selectUserKey"
				@change="onUserChange"
				class="btn btn-dark"
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

			Modal(v-if="createUserShow")
				template(slot="title")
					h4 Новый пользователь
				form(
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
						@input="onCreateUserInput"
					)/
					button(
						class="btn btn-primary"
						type="submit"
						:disabled="createUserOk"
					) Ok
					button(
						class="btn btn-outline-primary"
						type="button"
						@click="onCreateUserCancel"
					) Cancel

		//div(class="hr")

</template>

<script>

	import Modal from './Modal.vue'

	export default {

		name: 'Accounts',

		components: {
			Modal,
		},

		data () {
			return {
				users: [],
				user: null,
				createUserShow: false,
				createUserOk: true,
				selectUserKey: null,
			}
		},

		created () {

			this.loadUsers()
		},

		methods: {

			loadUsers () {

				return this.$http
					.get('u/list')
					.then(response => {
						// console.log('<Accounts.vue> users', response.body)
						this.users = response.body

						this.users.forEach(u => {
							if (u.current) {
								this.user = u._id
							}
						})
						this.selectUserKey = Date.now()
					})
					.catch(err => console.error(err))

			},

			onUserChange (event) {
				const userId = event.target.value

				if ('new' === userId) {
					this.createUserShow = true
					return
				}

				if (this.user === userId) {
					this.createUserShow = false
					return
				}

				this.user = userId

				this.$http.post('u/set',
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

				this.$http.put('u',
					{
						name: newUserName
					}
				)
				.then(() => {
					document.location.reload()
				})
				.catch(err => console.error(err))
			},

			onCreateUserInput (event) {
				const username = event.target.value

				this.createUserOk = username ? false : true
			},

			onCreateUserCancel () {
				this.createUserOk = false
				this.createUserShow = false
				this.selectUserKey = Date.now()
			}
		}
	}

</script>
