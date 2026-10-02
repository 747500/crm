import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

import App from './App.vue'
import DocList from './views/DocList.vue'
import DocEdit from './views/DocEdit.vue'

const K = '(person|property)'

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{ path: '/', redirect: '/person' },
		{ path: `/:kind${K}`, name: 'list', component: DocList, props: true },
		{ path: `/:kind${K}/new`, name: 'new', component: DocEdit, props: true },
		{ path: `/:kind${K}/:id`, name: 'doc', component: DocEdit, props: true },
	],
})

createApp(App).use(router).mount('#app')
