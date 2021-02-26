'use strict'

import Vue from 'vue'

import VueRouter from 'vue-router'

// --------------------------------------------------------------------------

import Nav from './components/nav.vue'

import EnquiryList from './components/EnquiryList.vue'

import Browser from './components/browser.vue'
import Events from './components/Events.vue'

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
					title: 'Поиск',
					icon: '🔍',
				}
			},

			{
				title: 'Календарь',
				name: 'calendar',
				path: '/calendar',
				component: Events,
				meta: {
					title: 'Календарь',
					icon: '📆',
				}
			},

			{
				name: 'enquiries',
				path: '/enquiries',
				component: EnquiryList,
				props: true,
				meta: {
					title: 'Заявки',
					icon: '📋',
				},
				/*
				children: [
					{
						name: 'enquiry_edit',
						path: ':id',
						component: Enquiry,
						props: true,
						meta: {
							title: 'Заявка',
						},
					}
				]
				*/
			},

			{
				name: 'contract',
				path: '/contract',
				component: DocList,
				props: true,
				meta: {
					title: 'Сделки',
					icon: '⇄',
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
			},

			{
				name: 'property',
				path: '/property',
				props: true,
				component: DocList,
				meta: {
					title: 'Объекты',
					icon: '🏠',
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
				title: 'Контакты',
				name: 'person',
				path: '/person',
				component: DocList,
				props: true,
				meta: {
					title: 'Контакты',
					icon: '👤',
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
