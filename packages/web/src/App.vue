<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { api, type User } from './api'

const users = ref<User[]>([])
const current = ref<string>('')
const error = ref<string>('')

onMounted(async () => {
	try {
		users.value = await api.listUsers()
		current.value = users.value.find(u => u.current)?._id ?? ''
	}
	catch (e) { error.value = String(e) }
})

async function switchUser (event: Event) {
	await api.setUser((event.target as HTMLSelectElement).value)
	location.reload()
}
</script>

<template>
	<header class="topbar">
		<strong>CRM · Vue 3 + TS</strong>
		<nav>
			<router-link to="/person">Контакты</router-link>
			<router-link to="/property">Объекты</router-link>
		</nav>
		<select :value="current" @change="switchUser">
			<option value="" disabled>— пользователь —</option>
			<option v-for="u in users" :key="u._id" :value="u._id">{{ u.name }}</option>
		</select>
	</header>

	<p v-if="error" class="error">{{ error }}</p>

	<main><router-view /></main>
</template>

<style>
body { font-family: system-ui, sans-serif; margin: 0; }
.topbar { display: flex; gap: 1rem; align-items: center; padding: .75rem 1rem; background: #222; color: #fff; }
.topbar nav { display: flex; gap: .75rem; }
.topbar a { color: #9cf; text-decoration: none; }
.topbar a.router-link-active { text-decoration: underline; }
.topbar select { margin-left: auto; }
main { padding: 1rem; }
.error { color: #b00; padding: 0 1rem; }
</style>
