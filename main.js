
		Vue.component('raw', {
			template: '#raw'
		});

		Vue.component('l1', {
			template: '#l1',
			data: function () {
				return  {
					message: "Yo!"
				}
			},
		});

		Vue.component('l2', {
			template: '#l2',
			data: function () {
				return {
					bears: [
						{
							name: 'Гризли',
							age: 10,
							status: false
						},
						{
							name: 'Бурый',
							age: 7,
							status: false
						},
						{
							name: 'Белый',
							age: 19,
							status: false
						},
						{
							name: 'Панда',
							age: 3,
							status: true
						}
					]
				}
			},
			computed: {
				bearsOrdered: function () {
					return _.orderBy(this.bears, 'age', 'name');
				}
			}
		});

		Vue.component('l3', {
			template: '#l3',
			data: function () {
				return {
					message: 'Hello dear'
				}
			},
			methods: {
				onClick: function (event) {
					console.log(this.message, event.target.innerText);
				}
			}
		});

		Vue.component('l4', {
			template: '#l4',
			data: function () {
				return  {
					text: ''
				}
			},
			computed: {
				count: function () {
					return this.text.length;
				}
			}
		});

		new Vue({
			el: '#app',
			data: {
				currentView: 'l2'
			},
			methods: {
				switchView: function (view) {
					this.currentView = view;
				}
			}
		});
