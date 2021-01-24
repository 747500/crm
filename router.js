'use strict'

import Vue from 'vue'

import VueRouter from 'vue-router'

// --------------------------------------------------------------------------

import l1 from './components/l1.vue'
import l2 from './components/l2.vue'
import l3 from './components/l3.vue'
import l4 from './components/l4.vue'
import l9 from './components/l9.vue'

// --------------------------------------------------------------------------

import calendar from './components/calendar.vue'

import person from './components/person.vue'
import person_edit from './components/person_edit.vue'

// --------------------------------------------------------------------------

Vue.use(VueRouter)

const routes = [
	{
		title: 'Lesson 1',
		name: 'l1',
		path: '/l1',
		component: l1
	},
	{
		title: 'Lesson 2',
		name: 'l2',
		path: '/l2',
		component: l2
	},
	{
		title: 'Lesson 3',
		name: 'l3',
		path: '/l3',
		component: l3
	},
	{
		title: 'Lesson 4',
		name: 'l4',
		path: '/l4',
		component: l4
	},
	{
		title: 'Часть 9 - Создание событий',
		name: 'l9',
		path: '/l9',
		component: l9
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
