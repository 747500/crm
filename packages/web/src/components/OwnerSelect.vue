<script setup lang="ts">
import { computed, ref } from 'vue'

interface Person { _id?: string | null; person?: { lastName?: string; firstName?: string; middleName?: string } }

const props = defineProps<{ modelValue: string; persons: Person[] }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()

const query = ref('')
const open = ref(false)

function fullName (p: Person) {
	return [p.person?.lastName, p.person?.firstName, p.person?.middleName].filter(Boolean).join(' ')
}

const results = computed(() => {
	const q = query.value.trim().toLowerCase()
	if (!q) return []
	return props.persons.filter(p => fullName(p).toLowerCase().includes(q))
})

const selectedName = computed(() => {
	const p = props.persons.find(x => x._id === props.modelValue)
	return p ? fullName(p) : ''
})

function select (id: string) {
	emit('update:modelValue', id)
	query.value = ''
	open.value = false
}
function clear () {
	emit('update:modelValue', '')
}
</script>

<template>
	<div class="owner-select">
		<div v-if="modelValue" class="current">
			<span>{{ selectedName }}</span>
			<button type="button" class="clear" @click="clear">🗙</button>
		</div>

		<input
			type="text"
			v-model="query"
			placeholder="Поиск собственника…"
			@focus="open = true"
			@keydown.esc="open = false"
		/>

		<ul v-if="open && results.length" class="results">
			<li v-for="p in results" :key="p._id!" @click="select(p._id!)">{{ fullName(p) }}</li>
		</ul>
	</div>
</template>

<style scoped>
.owner-select { position: relative; }
.owner-select .current { display: flex; align-items: center; gap: .5rem; margin-bottom: .25rem; }
.owner-select .current .clear { cursor: pointer; border: none; background: transparent; }
.owner-select input { padding: .35rem; font: inherit; width: 100%; }
.owner-select .results { position: absolute; z-index: 20; left: 0; right: 0; background: #fff; border: 1px solid #ccc; list-style: none; margin: 0; padding: 0; max-height: 16rem; overflow: auto; box-shadow: 0 4px 10px rgba(0,0,0,.15); }
.owner-select .results li { padding: .4rem .6rem; cursor: pointer; }
.owner-select .results li:hover { background: #f0f0f0; }
</style>
