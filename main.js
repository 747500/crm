'use strict'

import './main.css'

import Vue from 'vue'

// --------------------------------------------------------------------------

import rawView from './components/raw-view.vue'
Vue.component('raw-view', rawView)

// --------------------------------------------------------------------------

import VueRouter from 'vue-router'
Vue.use(VueRouter)

import l1 from './components/l1.vue'
import l2 from './components/l2.vue'
import l3 from './components/l3.vue'
import l4 from './components/l4.vue'
import l9 from './components/l9.vue'
import person from './components/person.vue'
import person_edit from './components/person_edit.vue'

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

const router = new VueRouter({ routes })

// --------------------------------------------------------------------------

import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		count: 0
	},
	mutations: {
		increment (state) {
			state.count++
		}
	}
})

// --------------------------------------------------------------------------

new Vue({
//	el: '#app',
	components: {},
	router,
	store,
	data: {
		currentView: 'l1',
		messages: [],
		routes
	},
	methods: {
		haveMessage (message) {
			this.messages.push({
				ts: new Date(),
				text: message
			})
		}
	},
	created () {
		console.log('Created')
	}
}).$mount('#app')
