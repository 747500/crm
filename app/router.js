'use strict'

import Vue from 'vue'

import VueRouter from 'vue-router'

// --------------------------------------------------------------------------

import browser from './components/browser.vue'
import calendar from './components/calendar.vue'

import doc from './components/doc.vue'
import doc_edit from './components/doc_edit.vue'

// --------------------------------------------------------------------------

Vue.use(VueRouter)

const routes = [
	{
		title: 'Поиск',
		name: 'browse',
		path: '/browse',
		component: browser
	},
	{
		title: 'Календарь',
		name: 'calendar',
		path: '/calendar',
		component: calendar
	},
	{
		title: 'Люди',
		name: 'person',
		path: '/person',
		props: true,
		component: doc,
		children: [
			{
				name: 'person_edit',
				path: ':id',
				component: doc_edit,
			}
		]
	},
	{
		title: 'Собственность',
		name: 'property',
		path: '/property',
		props: true,
		component: doc,
		children: [
			{
				name: 'property_edit',
				path: ':id',
				component: doc_edit,
			}
		]
	},
	{
		title: 'Сделки',
		name: 'contract',
		path: '/contract',
		props: true,
		component: doc,
		children: [
			{
				name: 'contract_edit',
				path: ':id',
				component: doc_edit,
			}
		]
	}
]

export default new VueRouter({ routes })
