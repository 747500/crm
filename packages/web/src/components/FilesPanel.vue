<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

import { api, type DocModel, type FileMeta } from '../api'

const props = defineProps<{ docId: string }>()

interface Row { id: string; meta: FileMeta | null; caption: string }

const files = ref<Row[]>([])
const mainPicture = ref<string>('')
const error = ref('')
const info = ref<FileMeta | null>(null)

const infoJson = computed(() => info.value ? JSON.stringify(info.value, null, 2) : '')

async function load () {
	error.value = ''
	try {
		const doc = await api.getDoc(props.docId)
		mainPicture.value = (doc as DocModel).mainPicture ?? ''
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

async function setMain (id: string) {
	try {
		await api.updateDoc(props.docId, { mainPicture: id })
		mainPicture.value = id
	}
	catch (e) { error.value = String(e) }
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
				<div class="thumb">
					<img v-if="isImage(f.meta)" :src="api.fileUrl(f.id, true)" alt="" />
					<div v-else class="noimg">{{ f.meta?.contentType ?? '?' }}</div>

					<div class="actions">
						<button type="button" title="Сделать главной" :disabled="f.id === mainPicture" @click="setMain(f.id)">💡</button>
						<button type="button" title="Инфо" @click="info = f.meta">🛈</button>
						<button type="button" title="Удалить" @click="remove(f.id)">🗑</button>
					</div>
				</div>
				<input v-model="f.caption" @change="saveCaption(f)" placeholder="подпись" />
			</li>
		</ul>

		<div v-if="info" class="info-modal" @click.self="info = null">
			<div class="info-dialog">
				<div class="info-header">
					<strong>Метаданные файла</strong>
					<button type="button" class="close" @click="info = null">×</button>
				</div>
				<pre class="info-body">{{ infoJson }}</pre>
			</div>
		</div>
	</section>
</template>

<style scoped>
.thumbs { list-style: none; padding: 0; display: flex; flex-wrap: wrap; gap: .5rem; }
.thumbs li { border: 1px solid #ddd; border-radius: .4rem; padding: .4rem; width: 10rem; display: flex; flex-direction: column; gap: .25rem; }
.thumb { position: relative; width: 100%; height: 8rem; }
.thumb img { width: 100%; height: 8rem; object-fit: cover; display: block; }
.noimg { height: 8rem; display: flex; align-items: center; justify-content: center; background: #f0f0f0; font-size: .8rem; }
.actions { position: absolute; top: .25rem; right: .25rem; display: flex; gap: .25rem; }
.actions button { font-size: 1rem; line-height: 1; padding: .1rem .3rem; cursor: pointer; border: 1px solid #ccc; border-radius: .25rem; background: rgba(255,255,255,.85); }
.actions button:disabled { opacity: .4; cursor: default; }
.info-modal { position: fixed; inset: 0; background: rgba(0,0,0,.5); display: flex; align-items: center; justify-content: center; z-index: 1050; }
.info-dialog { background: #fff; border-radius: .4rem; max-width: 40rem; max-height: 80vh; overflow: auto; padding: 1rem; min-width: 24rem; }
.info-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: .5rem; }
.info-header .close { cursor: pointer; font-size: 1.25rem; border: none; background: transparent; }
.info-body { background: #f6f6f6; padding: .75rem; border-radius: .25rem; overflow: auto; margin: 0; }
</style>

