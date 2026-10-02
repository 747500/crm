<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { api, type DocModel } from '../api'
import { KINDS } from '../schema'
import FilesPanel from '../components/FilesPanel.vue'

const route = useRoute()
const router = useRouter()

const kind = computed(() => String(route.params.kind))
const def = computed(() => KINDS[kind.value])
const id = computed(() => (route.params.id ? String(route.params.id) : 'new'))

const model = ref<Record<string, any>>({})
const contacts = ref('')
const owner = ref('')
const persons = ref<DocModel[]>([])
const saved = ref<DocModel | null>(null)
const error = ref('')
const status = ref('')

async function load () {
	error.value = ''
	status.value = ''

	if (def.value?.special === 'owner') {
		try { persons.value = await api.listDocs('person') } catch { /* ignore */ }
	}

	if (id.value === 'new') {
		model.value = {}
		contacts.value = ''
		owner.value = ''
		saved.value = null
		return
	}

	try {
		const doc = await api.getDoc(id.value)
		saved.value = doc
		model.value = { ...(doc[def.value!.nested] ?? {}) }
		owner.value = doc.owner ?? ''
		const c = (doc[def.value!.nested]?.contact ?? []) as Array<{ data?: string; description?: string }>
		contacts.value = c.map(x => [ x.data, x.description ].filter(Boolean).join(' | ')).join('\n')
	}
	catch (e) { error.value = String(e) }
}

watch([ kind, id ], load, { immediate: true })

function parseContacts () {
	return contacts.value.split('\n').map(l => l.trim()).filter(Boolean).map(line => {
		const [ data, description ] = line.split('|').map(s => s.trim())
		return { data, description: description ?? '' }
	})
}

async function save () {
	error.value = ''
	status.value = ''

	const nested: Record<string, any> = { ...model.value }
	if (def.value?.special === 'contact') nested.contact = parseContacts()

	const payload: Record<string, any> = { [def.value!.nested]: nested }
	if (def.value?.special === 'owner') payload.owner = owner.value

	try {
		const doc = id.value === 'new'
			? await api.createDoc({ kind: kind.value, ...payload })
			: await api.updateDoc(id.value, { _id: id.value, ...payload })
		saved.value = doc
		status.value = 'Сохранено'
		if (id.value === 'new') router.replace(`/${kind.value}/${doc._id}`)
	}
	catch (e) { error.value = String(e) }
}
</script>

<template>
	<h1>{{ def?.title }} — {{ id === 'new' ? 'новый' : 'правка' }}</h1>
	<p><router-link :to="`/${kind}`">← к списку</router-link></p>
	<p v-if="error" class="error">{{ error }}</p>
	<p v-if="status" class="ok">{{ status }}</p>

	<form class="grid" @submit.prevent="save">
		<label v-for="f in def?.fields" :key="f.name" class="field">
			<span>{{ f.label }}</span>
			<textarea v-if="f.type === 'textarea'" v-model="model[f.name]" rows="3" />
			<select v-else-if="f.type === 'select'" v-model="model[f.name]">
				<option value=""></option>
				<option v-for="o in f.options" :key="o" :value="o">{{ o }}</option>
			</select>
			<input v-else :type="f.type" v-model="model[f.name]" />
		</label>

		<label v-if="def?.special === 'contact'" class="field">
			<span>Контакты (строка: значение | описание)</span>
			<textarea v-model="contacts" rows="4" />
		</label>

		<label v-if="def?.special === 'owner'" class="field">
			<span>Собственник</span>
			<select v-model="owner">
				<option value=""></option>
				<option v-for="p in persons" :key="p._id!" :value="p._id">
					{{ [ p.person?.lastName, p.person?.firstName ].filter(Boolean).join(' ') || p._id }}
				</option>
			</select>
		</label>

		<div class="actions"><button class="btn" type="submit">Сохранить</button></div>
	</form>

	<FilesPanel v-if="saved?._id" :doc-id="saved._id" />
</template>

<style scoped>
.grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .75rem; max-width: 50rem; }
.field { display: flex; flex-direction: column; gap: .25rem; }
.field > span { font-size: .85rem; color: #555; }
.field input, .field textarea, .field select { padding: .35rem; font: inherit; }
.actions { grid-column: 1 / -1; }
.error { color: #b00; }
.ok { color: #070; }
</style>
