'use strict;'

import './main.css';

import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import rawView from './components/raw-view.vue';
import l1 from './components/l1.vue';
import l2 from './components/l2.vue';
import l3 from './components/l3.vue';
import l4 from './components/l4.vue';
import l9 from './components/l9.vue';
import person from './components/person.vue';
import person_edit from './components/person_edit.vue';

Vue.component('raw-view', rawView);

const routes = [
	{
		name: 'Lesson 1',
		path: '/l1',
		component: l1
	},
	{
		name: 'Lesson 2',
		path: '/l2',
		component: l2
	},
	{
		name: 'Lesson 3',
		path: '/l3',
		component: l3
	},
	{
		name: 'Lesson 4',
		path: '/l4',
		component: l4
	},
	{
		name: 'Часть 9 - Создание событий',
		path: '/l9',
		component: l9
	},
	{
		name: 'Person',
		path: '/person',
		component: person

	},
	{
		name: 'Person edit',
		path: '/person_edit',
		component: person_edit

	}
];

const router = new VueRouter({ routes })

new Vue({
//	el: '#app',
	/*components: {
		l1: l1,
		l2: l2,
		l3: l3,
		l4: l4,
		l9: l9,
		person: person,
		person_edit: person_edit
	},*/
	router,
	data: {
		currentView: 'l1',
		messages: [],
		routes: routes
	},
	methods: {
		switchView: function (view) {
			this.currentView = view;
		},
		workDone: function (message) {
			this.messages.push({
				ts: new Date(),
				text: message
			});
		}
	},
	created () {
		console.log('Created');
	}
}).$mount('#app');
