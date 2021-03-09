
import '../node_modules/bootstrap/dist/css/bootstrap.css'

import './main.css'

// --------------------------------------------------------------------------

import Vue from 'vue'

import UniqueId from 'vue-unique-id'
Vue.use(UniqueId)

import Vue2Filters from 'vue2-filters'
Vue.use(Vue2Filters)

// --------------------------------------------------------------------------

import VueResource from 'vue-resource';
Vue.use(VueResource);
Vue.http.options.root = '/api/v0'
Vue.http.options.credentials = true

// --------------------------------------------------------------------------

import VueFormulate from '@braid/vue-formulate'
Vue.use(VueFormulate)

// --------------------------------------------------------------------------

import router from './router.js'

// --------------------------------------------------------------------------

/*
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
*/

// --------------------------------------------------------------------------

/*
Vue.use(VueGlobalVariable, {
	globals: {
		user: new User(‘user1’),
	},
});
*/

// --------------------------------------------------------------------------

new Vue({
//	el: '#app',

	components: {
	},

	router,

	// store,

	data: {
	},

	methods: {
	},

	created () {
		console.log('<main.js> Created')
	},

	mounted () {
		if ('/' === this.$route.path) {
			this.$router.push({ name: 'browse' })
		}
	}

}).$mount('#app')
