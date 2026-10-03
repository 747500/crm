<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { api, type DocModel } from '../api';
import { KINDS } from '../schema';
import FilesPanel from '../components/FilesPanel.vue';
import OwnerSelect from '../components/OwnerSelect.vue';

interface Contact {
  data?: string;
  description?: string;
}

const route = useRoute();
const router = useRouter();

const kind = computed(() => String(route.params.kind));
const def = computed(() => KINDS[kind.value]);
const id = computed(() =>
  route.params.id ? String(route.params.id) : 'new',
);

const model = ref<Record<string, any>>({});
const contacts = ref<Contact[]>([]);
const owner = ref('');
const persons = ref<DocModel[]>([]);
const saved = ref<DocModel | null>(null);
const error = ref('');
const status = ref('');

async function load() {
  error.value = '';
  status.value = '';

  if (def.value?.special === 'owner') {
    try {
      persons.value = await api.listDocs('person');
    } catch {
      /* ignore */
    }
  }

  if (id.value === 'new') {
    model.value = {};
    contacts.value = [];
    owner.value = '';
    saved.value = null;
    return;
  }

  try {
    const doc = await api.getDoc(id.value);
    saved.value = doc;
    model.value = { ...(doc[def.value!.nested] ?? {}) };
    owner.value = doc.owner ?? '';
    contacts.value = (
      (doc[def.value!.nested]?.contact ?? []) as Contact[]
    ).map((c) => ({
      data: c.data ?? '',
      description: c.description ?? '',
    }));
  } catch (e) {
    error.value = String(e);
  }
}

watch([kind, id], load, { immediate: true });

function addContact() {
  contacts.value.push({ data: '', description: '' });
}
function removeContact(i: number) {
  contacts.value.splice(i, 1);
}

async function save() {
  error.value = '';
  status.value = '';

  const nested: Record<string, any> = { ...model.value };
  if (def.value?.special === 'contact') {
    nested.contact = contacts.value
      .map((c) => ({
        data: c.data?.trim() ?? '',
        description: c.description?.trim() ?? '',
      }))
      .filter((c) => c.data || c.description);
  }

  const payload: Record<string, any> = { [def.value!.nested]: nested };
  if (def.value?.special === 'owner') payload.owner = owner.value;

  try {
    const doc =
      id.value === 'new'
        ? await api.createDoc({ kind: kind.value, ...payload })
        : await api.updateDoc(id.value, { _id: id.value, ...payload });
    saved.value = doc;
    status.value = 'Сохранено';
    if (id.value === 'new') router.replace(`/${kind.value}/${doc._id}`);
  } catch (e) {
    error.value = String(e);
  }
}
</script>

<template>
  <h1>{{ def?.title }} — {{ id === 'new' ? 'новый' : 'правка' }}</h1>
  <p><router-link :to="`/${kind}`">← к списку</router-link></p>
  <p v-if="error" class="error">{{ error }}</p>
  <p v-if="status" class="ok">{{ status }}</p>

  <div v-if="saved?.mainPicture" class="main-picture">
    <img :src="api.fileUrl(saved.mainPicture, true)" alt="Главная картинка" />
  </div>

  <form class="grid" @submit.prevent="save">
    <label v-for="f in def?.fields" :key="f.name" class="field">
      <span>{{ f.label }}</span>
      <textarea
        v-if="f.type === 'textarea'"
        v-model="model[f.name]"
        rows="3"
      />
      <select v-else-if="f.type === 'select'" v-model="model[f.name]">
        <option value=""></option>
        <option v-for="o in f.options" :key="o" :value="o">{{ o }}</option>
      </select>
      <input v-else :type="f.type" v-model="model[f.name]" />
    </label>

    <fieldset v-if="def?.special === 'contact'" class="field contacts">
      <legend>Контакты</legend>
      <div v-for="(c, i) in contacts" :key="i" class="contact-row">
        <input v-model="c.data" placeholder="телефон, e-mail" />
        <input v-model="c.description" placeholder="описание" />
        <button type="button" class="remove" @click="removeContact(i)">
          🗑
        </button>
      </div>
      <button type="button" class="add" @click="addContact">+ Контакт</button>
    </fieldset>

    <div v-if="def?.special === 'owner'" class="field">
      <span>Собственник</span>
      <OwnerSelect v-model="owner" :persons="persons" />
    </div>

    <div class="actions">
      <button class="btn" type="submit">Сохранить</button>
    </div>
  </form>

  <FilesPanel v-if="saved?._id" :doc-id="saved._id" />
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  max-width: 50rem;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.field > span {
  font-size: 0.85rem;
  color: #555;
}
.field input,
.field textarea,
.field select {
  padding: 0.35rem;
  font: inherit;
}
.actions {
  grid-column: 1 / -1;
}
.error {
  color: #b00;
}
.ok {
  color: #070;
}
.main-picture img {
  width: 9rem;
  height: 9rem;
  object-fit: cover;
  border-radius: 0.4rem;
  margin-bottom: 0.5rem;
}
.contacts {
  border: 1px solid #ddd;
  border-radius: 0.4rem;
  padding: 0.5rem 0.75rem;
}
.contact-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}
.contact-row input {
  flex: 1;
}
.contact-row .remove {
  cursor: pointer;
}
.contacts .add {
  cursor: pointer;
  margin-top: 0.25rem;
}
</style>
