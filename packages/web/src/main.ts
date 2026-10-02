import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

import App from './App.vue'
import ContactsView from './views/ContactsView.vue'

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{ path: '/', redirect: '/contacts' },
		{ path: '/contacts', name: 'contacts', component: ContactsView },
	],
})

createApp(App).use(router).mount('#app')
