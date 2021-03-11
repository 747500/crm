'use strict'

import Vue from 'vue'

import VueRouter from 'vue-router'

// --------------------------------------------------------------------------

import Nav from './components/nav.vue'

import EnquiryList from './components/EnquiryList.vue'

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
					kind: 'enquiry',
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
				name: 'contractList',
				path: '/contract',
				component: DocList,
				props: true,
				meta: {
					title: 'Сделки',
					icon: '⇄',
					kind: 'contract',
				},
				children: [
					{
						name: 'contract', // kind
						path: ':id',
						component: Doc,
						props: true,
						meta: {
							title: '📄 Сделка',
						},
					}
				]
			},

			{
				name: 'propertyList',
				path: '/property',
				props: true,
				component: DocList,
				meta: {
					title: 'Объекты',
					icon: '🏠',
					kind: 'property',
				},
				children: [
					{
						name: 'property', // kind
						path: ':id',
						component: Doc,
						props: true,
						meta: {
							title: '🏠 Объект',
						},
					}
				]
			},

			{
				title: 'Контакты',
				name: 'personList',
				path: '/person',
				component: DocList,
				props: true,
				meta: {
					title: 'Контакты',
					icon: '👤',
					kind: 'person',
				},
				children: [
					{
						name: 'person', // kind
						path: ':id',
						component: Doc,
						props: true,
						meta: {
							title: '👤 Контакт',
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
