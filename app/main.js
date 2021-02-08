'use strict'

import Vue from 'vue'

import './main.css'

// --------------------------------------------------------------------------

import rawView from './components/raw-view.vue'
Vue.component('raw-view', rawView)

// --------------------------------------------------------------------------

import VueResource from 'vue-resource';
Vue.use(VueResource);

// --------------------------------------------------------------------------
import VueFormulate from '@braid/vue-formulate'
Vue.use(VueFormulate)

// --------------------------------------------------------------------------

// --------------------------------------------------------------------------

import router from './router.js'

// --------------------------------------------------------------------------

import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		count: 0
	},
	mutations: {
		increment (state) {
			state.count ++
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
