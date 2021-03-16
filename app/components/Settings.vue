<template lang="pug">

	div
		h2 Настройки

		div(class="hr")/

		//pre {{ userinfo }}

		div(style="display: flex;")

			form(class="m-3" @submit.prevent="submitUsername")
				div(class="mb-3")
					label(class="form-label") Имя пользователя
					input(class="form-control" type="text" v-model="userinfo.name")/

				div(class="mb-3")
					label(class="form-label") Telegram аккаунт для уведомлений
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
					div(class="from-text small" v-if="!userinfo.notifyTelegramId")
						div Для привязки:
							div
								a(href="tg://resolve?domain=crm_bot") Бот
							div
								code /auth {{ userinfo._id }}

				div(class="mb-3")
					label(class="form-label") Уведомлять о днях рождения в
					input(
						class="form-control"
						type="time"
						:disabled="!userinfo.notifyTelegramId"
						v-model="userinfo.notifyBirthdayAt"
					)/
					div(class="from-text small" v-if="!userinfo.notifyTelegramId")
						div Бот не привязан

				input(class="btn btn-primary" type="submit" value="Сохранить")/

</template>


<script>

	export default {

		name: 'Settings',

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
