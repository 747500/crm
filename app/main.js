
import './main.css'

// --------------------------------------------------------------------------

import Vue from 'vue'

import Vue2Filters from 'vue2-filters'
Vue.use(Vue2Filters)

//import { BIconHouseDoor } from 'bootstrap-icons-vue'
//Vue.component(BIconHouseDoor)

// --------------------------------------------------------------------------

import rawView from './components/raw-view.vue'
Vue.component('raw-view', rawView)

// --------------------------------------------------------------------------

import VueResource from 'vue-resource';
Vue.use(VueResource);

// --------------------------------------------------------------------------
import VueFormulate from '@braid/vue-formulate'
Vue.use(VueFormulate)

import SelectOwner from './components/SelectOwner.vue'
Vue.component('SelectOwner', SelectOwner)

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
