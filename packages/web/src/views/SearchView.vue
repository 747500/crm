<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { api } from '../api';

const route = useRoute();
const router = useRouter();

const q = ref(String(route.query.q ?? ''));
const kinds = ref<string[]>([]);
const results = ref<Array<{ oid: string; kind: string; content?: string }>>(
  [],
);
const total = ref(0);
const error = ref('');
const loading = ref(false);

const KIND_OPTIONS = [
  { value: 'person', label: 'Контакты' },
  { value: 'property', label: 'Объекты' },
  { value: 'contract', label: 'Сделки' },
];

async function run() {
  if (!q.value.trim()) {
    results.value = [];
    total.value = 0;
    return;
  }
  loading.value = true;
  error.value = '';
  try {
    const res = await api.searchDocs(q.value.trim(), kinds.value);
    results.value = res.result;
    total.value = res.total_found;
  } catch (e) {
    error.value = String(e);
  } finally {
    loading.value = false;
  }
}

watch(
  () => route.query.q,
  (v) => {
    q.value = String(v ?? '');
    run();
  },
  { immediate: true },
);
watch(kinds, run);
</script>

<template>
  <h1>Поиск</h1>
  <div class="filters">
    <label v-for="o in KIND_OPTIONS" :key="o.value" class="filter">
      <input type="checkbox" :value="o.value" v-model="kinds" />
      <span>{{ o.label }}</span>
    </label>
  </div>

  <p v-if="loading">Загрузка…</p>
  <p v-else-if="error" class="error">{{ error }}</p>
  <p v-else-if="q" class="muted">Найдено: {{ total }}</p>

  <ul v-if="results.length" class="list">
    <li
      v-for="r in results"
      :key="r.oid"
      @click="router.push(`/${r.kind}/${r.oid}`)"
    >
      <span class="kind">{{ r.kind }}</span> {{ r.content }}
    </li>
  </ul>
</template>

<style scoped>
.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.75rem;
}
.filter {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;
}
.list {
  list-style: none;
  padding: 0;
  max-width: 40rem;
}
.list li {
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}
.list li:hover {
  background: #f6f6f6;
}
.kind {
  font-size: 0.75rem;
  color: #888;
  text-transform: uppercase;
  margin-right: 0.5rem;
}
.muted {
  color: #777;
}
.error {
  color: #b00;
}
</style>
