<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { api, type DocModel } from '../api'
import { KINDS, docTitle } from '../schema'

const route = useRoute()
const router = useRouter()

const kind = computed(() => String(route.params.kind))
const def = computed(() => KINDS[kind.value])
const docs = ref<DocModel[]>([])
const loading = ref(false)
const error = ref('')

async function load () {
	loading.value = true
	error.value = ''
	try { docs.value = await api.listDocs(kind.value) }
	catch (e) { error.value = String(e) }
	finally { loading.value = false }
}

watch(kind, load, { immediate: true })
</script>

<template>
	<h1>{{ def?.title }}</h1>
	<button class="btn" @click="router.push(`/${kind}/new`)">+ Новый</button>

	<p v-if="loading">Загрузка…</p>
	<p v-else-if="error" class="error">{{ error }}</p>
	<ul v-else class="list">
		<li v-for="d in docs" :key="d._id!" @click="router.push(`/${kind}/${d._id}`)">
			{{ docTitle(d, def!) }}
		</li>
	</ul>
</template>

<style scoped>
.list { list-style: none; padding: 0; max-width: 40rem; }
.list li { padding: .5rem .75rem; border-bottom: 1px solid #eee; cursor: pointer; }
.list li:hover { background: #f6f6f6; }
</style>
