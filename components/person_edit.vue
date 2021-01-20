

<template>
	<div class="panel-body">

		<FormulateForm
			v-model="model"
			:schema="person"
			/>

	</div>
</template>

<script>

import Vue from 'vue'

import VueFormulate from '@braid/vue-formulate'
Vue.use(VueFormulate)

export default {
	components: {
	},
	data: function () {
	    return {
			model: {
				id: 1,
				lastName: 'Иванов',
				firstName: 'Иван',
				middleName: 'Иванович',
				password: 'J0hnD03!x4',
				skills: ['Javascript', 'VueJS'],
				email: 'john.doe@gmail.com',
				status: true,
				comment: '',
				b: ''
			},
			person: [
				{
					name: 'lastName',
					type: 'text',
					label: 'Фамилия'
				},
				{
					name: 'firstName',
					type: 'text',
					label: 'Имя'
				},
				{
					name: 'middleName',
					type: 'text',
					label: 'Отчество'
				},
				{
					name: 'b',
					type: 'date',
					label: 'Отчество'
				},
				{
					name: 'comment',
					type: 'textarea',
					label: 'Комментарии'
				}
			]
		}
	},
	methods: {
		submit: function (e) {
			// this.model contains the valid data according your JSON Schema.
			// You can submit your model to the server here

			console.log('submit:', this.model);
		}
	},
	created: function () {

		console.log('Created');
	}
};
</script>
