<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { api, type User } from './api';

interface NavItem {
  title: string;
  icon: string;
  to: string;
  section?: boolean;
}

// Пункты сайдбара (соответствуют legacy nav.vue + router meta).
const SIDEBAR: NavItem[] = [
  { title: 'Календарь', icon: '📆', to: '/calendar' },
  { title: 'Заявки', icon: '📋', to: '/enquiries' },
  { title: 'Сделки', icon: '⇄', to: '/contract', section: true },
  { title: 'Объекты', icon: '🏠', to: '/property' },
  { title: 'Контакты', icon: '👤', to: '/person' },
  { title: 'Настройки', icon: '⚙️', to: '/settings', section: true },
];

const router = useRouter();

const users = ref<User[]>([]);
const current = ref<string>('');
const error = ref<string>('');
const q = ref<string>('');
const createUserShow = ref(false);
const newUserName = ref('');

onMounted(async () => {
  try {
    users.value = await api.listUsers();
    current.value = users.value.find((u) => u.current)?._id ?? '';
  } catch (e) {
    error.value = String(e);
  }
});

async function switchUser(event: Event) {
  const value = (event.target as HTMLSelectElement).value;
  if (value === 'new') {
    newUserName.value = '';
    createUserShow.value = true;
    return;
  }
  await api.setUser(value);
  location.reload();
}

async function createUser() {
  const name = newUserName.value.trim();
  if (!name) return;
  try {
    await api.createUser(name);
    location.reload();
  } catch (e) {
    error.value = String(e);
  }
}

function search() {
  const value = q.value.trim();
  if (!value) return;
  router.push({ path: '/search', query: { q: value } });
}
</script>

<template>
  <header
    class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow"
  >
    <router-link class="navbar-brand col-md-3 col-lg-2 me-0 px-3" to="/"
      >CRM</router-link
    >

    <form class="search w-100" @submit.prevent="search">
      <input
        class="form-control form-control-dark"
        type="search"
        placeholder="Search"
        v-model="q"
        aria-label="Search"
      />
    </form>

    <div class="navbar-nav px-3">
      <select
        class="form-select form-select-sm bg-dark text-light"
        :value="current"
        @change="switchUser"
      >
        <option value="" disabled>— пользователь —</option>
        <option value="new">&lt;Создать&gt;</option>
        <option v-for="u in users" :key="u._id" :value="u._id">
          {{ u.name }}
        </option>
      </select>
    </div>
  </header>

  <div
    v-if="createUserShow"
    class="user-modal"
    @click.self="createUserShow = false"
  >
    <div class="user-dialog">
      <div class="user-header">
        <strong>Новый пользователь</strong>
        <button type="button" class="close" @click="createUserShow = false">
          ×
        </button>
      </div>
      <form class="user-form" @submit.prevent="createUser">
        <input
          v-model="newUserName"
          type="text"
          placeholder="Имя"
          autofocus
        />
        <div class="user-actions">
          <button
            class="btn btn-primary"
            type="submit"
            :disabled="!newUserName.trim()"
          >
            Ok
          </button>
          <button
            class="btn btn-outline-primary"
            type="button"
            @click="createUserShow = false"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  </div>

  <div class="container-fluid">
    <div class="row">
      <nav
        id="sidebarMenu"
        class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse"
      >
        <div class="position-sticky pt-3">
          <ul class="nav flex-column">
            <li
              v-for="r in SIDEBAR"
              :key="r.to"
              :class="['nav-item', { 'mt-4': r.section }]"
            >
              <router-link class="nav-link" :to="r.to">
                <span class="nav-icon">{{ r.icon }}</span>
                <span>{{ r.title }}</span>
              </router-link>
            </li>
          </ul>
        </div>
      </nav>

      <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <p v-if="error" class="error">{{ error }}</p>
        <router-view />
      </main>
    </div>
  </div>
</template>

<style>
:root {
  --hover-color: #ffffba;
  --border-color: #cccccc;
}
body {
  font-family: system-ui, sans-serif;
  margin: 0;
}
a {
  text-decoration: none;
  color: #113569;
}
.nav-item .nav-link .nav-icon {
  display: inline-block;
  width: 2em;
  text-align: center;
}
.sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  padding: 48px 0 0;
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, 0.1);
}
main {
  padding-top: 1.25rem;
}
.error {
  color: #b00;
}
.search input {
  border-radius: 0;
}
.user-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}
.user-dialog {
  background: #fff;
  border-radius: 0.4rem;
  padding: 1rem;
  min-width: 20rem;
}
.user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}
.user-header .close {
  cursor: pointer;
  font-size: 1.25rem;
  border: none;
  background: transparent;
}
.user-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.user-form input {
  padding: 0.4rem;
  font: inherit;
}
.user-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}
</style>
