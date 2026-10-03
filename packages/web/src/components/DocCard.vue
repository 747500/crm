<script setup lang="ts">
import { api, type DocModel } from '../api'

const props = defineProps<{ doc: DocModel }>()
const emit = defineEmits<{ (e: 'open', doc: DocModel): void }>()

function fullName (p: any) {
	return [ p?.lastName, p?.firstName, p?.middleName ].filter(Boolean).join(' ')
}
</script>

<template>
	<div class="doc-card" @click="emit('open', doc)">
		<div class="pic">
			<img v-if="doc.mainPicture" :src="api.fileUrl(doc.mainPicture, true)" alt="" />
			<div v-else class="ph">👤</div>
		</div>

		<div class="body">
			<template v-if="doc.kind === 'person'">
				<div class="title">{{ fullName(doc.person) || doc._id }}</div>
				<ul class="contacts">
					<li v-for="c in doc.person?.contact" :key="c._id">
						{{ c.data }}<span v-if="c.description"> ({{ c.description }})</span>
					</li>
				</ul>
				<div v-if="doc.person?.comments" class="comments">{{ doc.person.comments }}</div>
			</template>

			<template v-else-if="doc.kind === 'property'">
				<div class="title">{{ doc.property?.address || doc._id }}</div>
				<div v-if="doc.property?.price" class="price">{{ doc.property.price }} ₽</div>
				<div v-if="doc.property?.type || doc.property?.area" class="meta">
					{{ doc.property?.type }} {{ doc.property?.area ? doc.property.area + ' м²' : '' }}
				</div>
			</template>

			<template v-else-if="doc.kind === 'contract'">
				<div class="title">{{ doc.contract?.title || doc._id }}</div>
				<div v-if="doc.contract?.description" class="comments">{{ doc.contract.description }}</div>
			</template>
		</div>
	</div>
</template>

<style scoped>
.doc-card { display: flex; gap: .75rem; padding: .5rem .75rem; border-bottom: 1px solid #eee; cursor: pointer; }
.doc-card:hover { background: #f6f6f6; }
.doc-card .pic { flex: 0 0 5rem; width: 5rem; height: 5rem; }
.doc-card .pic img { width: 100%; height: 100%; object-fit: cover; border-radius: .25rem; display: block; }
.doc-card .pic .ph { width: 5rem; height: 5rem; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; background: #f0f0f0; border-radius: .25rem; }
.doc-card .body { flex: 1; min-width: 0; }
.doc-card .title { font-weight: 600; }
.doc-card .contacts { list-style: none; margin: .25rem 0; padding: 0; font-size: .85rem; color: #555; }
.doc-card .comments { font-size: .85rem; color: #777; }
.doc-card .price { color: #080; font-weight: 600; }
.doc-card .meta { font-size: .85rem; color: #555; }
</style>
