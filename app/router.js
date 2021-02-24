'use strict'

import Vue from 'vue'

import VueRouter from 'vue-router'

// --------------------------------------------------------------------------

import Nav from './components/nav.vue'

import Browser from './components/browser.vue'
import Calendar from './components/calendar.vue'

import DocList from './components/DocList.vue'
import Doc from './components/Doc.vue'

// --------------------------------------------------------------------------

Vue.use(VueRouter)

const routes = [
	{
		name: 'home',
		path: '/',
		component: Nav,
		meta: {
			title: '⌂',
		},
		children: [

			{
				title: 'Поиск',
				name: 'browse',
				path: '/browse',
				component: Browser,
				meta: {
					title: 'Поиск'
				}
			},
			{
				title: 'Календарь',
				name: 'calendar',
				path: '/calendar',
				component: Calendar,
				meta: {
					title: 'Календарь'
				}
			},
			/*
			{
				title: 'Doc',
				name: 'doc',
				path: '/doc/:kind',
				component: doc,
				props: true,
				children: [
					{
						name: 'view',
						path: ':id',
						component: DocEdit,
						props: true
					}
				]
			},
			*/
			{
				title: 'Контакты',
				name: 'person',
				path: '/person',
				component: DocList,
				props: true,
				meta: {
					title: 'Контакты'
				},
				children: [
					{
						name: 'person_edit',
						path: ':id',
						component: Doc,
						props: true,
						meta: {
							title: '👤 Контакт',
							kind: 'person',
						},
					}
				]
			},
			{
				name: 'property',
				path: '/property',
				props: true,
				component: DocList,
				meta: {
					title: 'Объекты',
				},
				children: [
					{
						name: 'property_edit',
						path: ':id',
						component: Doc,
						props: true,
						meta: {
							title: '🏠 Объект',
							kind: 'property',
						},
					}
				]
			},
			{
				name: 'contract',
				path: '/contract',
				component: DocList,
				props: true,
				meta: {
					title: 'Сделки',
				},
				children: [
					{
						name: 'contract_edit',
						path: ':id',
						component: Doc,
						props: true,
						meta: {
							title: '📄 Сделка',
							kind: 'contract',
						},
					}
				]
			}

		]
	}
]

const router = new VueRouter({ routes })

/*
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Your Website Title')
  next()
})
*/

/*
router.afterEach((to, from) => {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title + ' | Any suffix'
  }
})
*/

export default router
