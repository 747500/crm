<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { api, type PersonDoc } from '../api'

const docs = ref<PersonDoc[]>([])
const loading = ref(true)
const error = ref<string>('')

function title (d: PersonDoc): string {
	const p = d.person ?? {}
	return [ p.lastName, p.firstName, p.middleName ].filter(Boolean).join(' ') || d._id
}

onMounted(async () => {
	try {
		docs.value = await api.listDocs<PersonDoc>('person')
	}
	catch (e) {
		error.value = String(e)
	}
	finally {
		loading.value = false
	}
})
</script>

<template>
	<h1>Контакты</h1>
	<p v-if="loading">Загрузка…</p>
	<p v-else-if="error" class="error">{{ error }}</p>
	<ul v-else>
		<li v-for="d in docs" :key="d._id">{{ title(d) }}</li>
	</ul>
</template>

<style scoped>
ul { list-style: none; padding: 0; max-width: 32rem; }
li { padding: .4rem .6rem; border-bottom: 1px solid #eee; }
</style>
