'use strict'

import Vue from 'vue'

import VueRouter from 'vue-router'

// --------------------------------------------------------------------------

import calendar from './components/calendar.vue'

import person from './components/person.vue'
import person_edit from './components/person_edit.vue'

//import property from './components/property.vue'
//import property_edit from './components/property_edit.vue'

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
	},
/*	{
		title: 'Собственность',
		name: 'property',
		path: '/property',
		component: property,
		children: [
			{
				name: 'property_edit',
				path: ':id',
				component: property_edit,
			}
		]
	}*/
]

export default new VueRouter({ routes })
