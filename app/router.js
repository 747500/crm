'use strict'

import Vue from 'vue'

import VueRouter from 'vue-router'

// --------------------------------------------------------------------------

import Nav from './components/nav.vue'

import Browser from './components/browser.vue'
import Calendar from './components/calendar.vue'

import Doc from './components/doc.vue'
import DocEdit from './components/doc_edit.vue'

// --------------------------------------------------------------------------

Vue.use(VueRouter)

const routes = [
	{
		title: '⌂',
		name: 'home',
		path: '/',
		component: Nav,
		children: [

			{
				title: 'Поиск',
				name: 'browse',
				path: '/browse',
				component: Browser
			},
			{
				title: 'Календарь',
				name: 'calendar',
				path: '/calendar',
				component: Calendar
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
				component: Doc,
				props: true,
				children: [
					{
						name: 'person_edit',
						path: ':id',
						component: DocEdit,
						props: true,
					}
				]
			},
			{
				title: 'Объекты',
				name: 'property',
				path: '/property',
				props: true,
				component: Doc,
				children: [
					{
						name: 'property_edit',
						path: ':id',
						component: DocEdit,
						props: true,
					}
				]
			},
			{
				title: 'Сделки',
				name: 'contract',
				path: '/contract',
				component: Doc,
				props: true,
				children: [
					{
						name: 'contract_edit',
						path: ':id',
						component: DocEdit,
						props: true,
					}
				]
			}

		]
	}
]

export default new VueRouter({ routes })
