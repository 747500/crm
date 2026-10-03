import 'bootstrap/dist/css/bootstrap.css';

import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';

import App from './App.vue';
import DocList from './views/DocList.vue';
import DocEdit from './views/DocEdit.vue';
import SearchView from './views/SearchView.vue';
import SettingsView from './views/SettingsView.vue';
import CalendarView from './views/CalendarView.vue';
import EnquiriesView from './views/EnquiriesView.vue';

const K = '(person|property|contract)';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/person' },
    {
      path: '/calendar',
      name: 'calendar',
      component: CalendarView,
      meta: { title: 'Календарь', icon: '📆' },
    },
    {
      path: '/enquiries',
      name: 'enquiries',
      component: EnquiriesView,
      meta: { title: 'Заявки', icon: '📋' },
    },
    {
      path: '/search',
      name: 'search',
      component: SearchView,
      meta: { title: 'Поиск', icon: '🔎' },
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
      meta: { title: 'Настройки', icon: '⚙️', section: true },
    },
    { path: `/:kind${K}`, name: 'list', component: DocList, props: true },
    { path: `/:kind${K}/new`, name: 'new', component: DocEdit, props: true },
    { path: `/:kind${K}/:id`, name: 'doc', component: DocEdit, props: true },
  ],
});

createApp(App).use(router).mount('#app');
