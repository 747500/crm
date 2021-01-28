'use strict'

import Vue from 'vue'

import VueRouter from 'vue-router'

// --------------------------------------------------------------------------

import calendar from './components/calendar.vue'

import person from './components/person.vue'
import person_edit from './components/person_edit.vue'

// --------------------------------------------------------------------------

Vue.use(VueRouter)

const routes = [
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
		component: person,
		children: [
			{
				name: 'person_edit',
				path: ':id',
				component: person_edit,
			}
		]
	}
]

export default new VueRouter({ routes })
