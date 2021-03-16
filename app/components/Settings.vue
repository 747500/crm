<template lang="pug">

	div

		div(style="display: flex;")

			form(class="m-3" @submit.prevent="submitUsername")
				div(class="mb-3")
					label(class="form-label") Имя пользователя
					input(class="form-control" type="text" v-model="userinfo.name")/

				fieldset(class="border rounded px-2 mb-2")
					legend(class="fs-6 mt-2") Уведомления в Telegram
					div(class="mb-3")
						div(class="from-text" v-if="!userinfo.notifyTelegramId")
							div(class="text-muted my-2")
								a(href="tg://resolve?domain=crm_bot" class="ext-link") Бот
								span не привязан. Для привязки:
								div
									code /auth {{ userinfo._id }}
									//⎘
						label(class="form-label") Аккаунт
						div(class="input-group")
							input(
								class="form-control"
								type="text"
								readonly="true"
								v-model="userinfo.notifyTelegramId"
							)/
							button(
								class="btn btn-outline-secondary btn-sm"
								type="button"
								@click="userinfo.notifyTelegramId = ''"
								:disabled="!userinfo.notifyTelegramId"
							) 🗙

					div(class="mb-3")
						label(
							:class="[ 'form-label', { 'text-muted': !userinfo.notifyTelegramId } ]"
						) Уведомлять о днях рождения в
						input(
							:class="[ 'form-control', { 'text-muted': !userinfo.notifyTelegramId } ]"
							type="time"
							:disabled="!userinfo.notifyTelegramId"
							v-model="userinfo.notifyBirthdayAt"
						)/

				input(class="btn btn-primary" type="submit" value="Сохранить")/

</template>


<script>

	export default {

		name: 'Settings',

		components: {
		},

		data () {
			return {
				userinfo: {},
			}
		},

		mounted () {

			this.$http.get('u/info')
			.then(response => {
				this.userinfo = response.body
			})
			.catch(console.error)

		},

		methods: {

			submitUsername () {

				this.$http.post('u',
					this.userinfo,
					{
						headers: {
							'Content-Type': 'application/json'
						}
					}
				)
				.then(response => {
					this.userinfo = response.body
				})
				.catch(console.error)
			}
		}
	}


</script>
