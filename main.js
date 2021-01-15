'use strict;'

import './main.css';

import Vue from 'vue';

import rawView from './components/raw-view.vue';
import l1 from './components/l1.vue';
import l2 from './components/l2.vue';
import l3 from './components/l3.vue';
import l4 from './components/l4.vue';
import l9 from './components/l9.vue';

Vue.component('raw-view', rawView);

new Vue({
//	el: '#app',
	components: {
		l1: l1,
		l2: l2,
		l3: l3,
		l4: l4,
		l9: l9
	},
	data: {
		currentView: 'l1',
		messages: []
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
