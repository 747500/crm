<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { api } from '../api'

const userinfo = ref<Record<string, any>>({})
const error = ref('')
const status = ref('')

onMounted(async () => {
	try { userinfo.value = await api.userInfo() }
	catch (e) { error.value = String(e) }
})

async function save () {
	error.value = ''
	status.value = ''
	try {
		userinfo.value = await api.updateUser({ ...userinfo.value })
		status.value = 'Сохранено'
	}
	catch (e) { error.value = String(e) }
}
</script>

<template>
	<h1>Настройки</h1>
	<p v-if="error" class="error">{{ error }}</p>
	<p v-if="status" class="ok">{{ status }}</p>

	<form class="grid" @submit.prevent="save">
		<label class="field">
			<span>Имя пользователя</span>
			<input type="text" v-model="userinfo.name" />
		</label>

		<fieldset class="field">
			<legend>Уведомления в Telegram</legend>
			<p v-if="!userinfo.notifyTelegramId" class="muted">
				Бот <code>@crm_untyped_net_bot</code> не привязан. Для привязки отправьте боту:
				<code>/auth {{ userinfo.id }}</code>
			</p>

			<label class="field">
				<span>Уведомлять о днях рождения в</span>
				<input
					type="time"
					v-model="userinfo.notifyBirthdayAt"
					:disabled="!userinfo.notifyTelegramId"
				/>
			</label>
		</fieldset>

		<div class="actions"><button class="btn" type="submit">Сохранить</button></div>
	</form>
</template>

<style scoped>
.grid { display: grid; gap: .75rem; max-width: 30rem; }
.field { display: flex; flex-direction: column; gap: .25rem; }
.field > span { font-size: .85rem; color: #555; }
.field input { padding: .35rem; font: inherit; }
.muted { color: #777; font-size: .9rem; }
.actions { grid-column: 1 / -1; }
.error { color: #b00; }
.ok { color: #070; }
</style>
