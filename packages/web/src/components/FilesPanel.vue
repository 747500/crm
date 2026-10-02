<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

import { api, type FileMeta } from '../api'

const props = defineProps<{ docId: string }>()

interface Row { id: string; meta: FileMeta | null; caption: string }

const files = ref<Row[]>([])
const error = ref('')

async function load () {
	error.value = ''
	try {
		const ids = await api.listFiles(props.docId)
		files.value = await Promise.all(ids.map(async id => {
			try { const meta = await api.fileMeta(id); return { id, meta, caption: meta.meta?.caption ?? '' } }
			catch { return { id, meta: null, caption: '' } }
		}))
	}
	catch (e) { error.value = String(e) }
}

onMounted(load)
watch(() => props.docId, load)

async function onPick (event: Event) {
	const input = event.target as HTMLInputElement
	if (!input.files) return
	for (const file of Array.from(input.files)) {
		try { await api.uploadFile(props.docId, file) }
		catch (e) { error.value = String(e) }
	}
	input.value = ''
	await load()
}

async function saveCaption (row: Row) {
	try { await api.saveCaption(row.id, row.caption) } catch (e) { error.value = String(e) }
}

async function remove (id: string) {
	try { await api.deleteFile(id); await load() } catch (e) { error.value = String(e) }
}

const isImage = (m: FileMeta | null) => !!m && m.contentType.startsWith('image/')
</script>

<template>
	<section class="files">
		<h2>Файлы</h2>
		<p v-if="error" class="error">{{ error }}</p>
		<input type="file" multiple @change="onPick" />
		<ul class="thumbs">
			<li v-for="f in files" :key="f.id">
				<img v-if="isImage(f.meta)" :src="api.fileUrl(f.id, true)" alt="" />
				<div v-else class="noimg">{{ f.meta?.contentType ?? '?' }}</div>
				<input v-model="f.caption" @change="saveCaption(f)" placeholder="подпись" />
				<button type="button" @click="remove(f.id)">🗑</button>
			</li>
		</ul>
	</section>
</template>

<style scoped>
.thumbs { list-style: none; padding: 0; display: flex; flex-wrap: wrap; gap: .5rem; }
.thumbs li { border: 1px solid #ddd; border-radius: .4rem; padding: .4rem; width: 10rem; display: flex; flex-direction: column; gap: .25rem; }
.thumbs img { width: 100%; height: 8rem; object-fit: cover; display: block; }
.noimg { height: 8rem; display: flex; align-items: center; justify-content: center; background: #f0f0f0; font-size: .8rem; }
</style>
