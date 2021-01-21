

<template>
	<div class="panel-body">

		<FormulateForm
			v-model="model"
			:schema="schema"
			@submit="submitHandler"
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
				birthDay: '',
				passport: ''
			},
			schema: [
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
					name: 'birthDay',
					type: 'date',
					label: 'Дата рождения'
				},
				{
					name: 'passport',
					type: 'textarea',
					label: 'Паспорт'
				},
				{
					name: 'submit',
					type: 'submit',
					label: 'Сохранить'
				}
			]
		}
	},
	methods: {
		submitHandler: function (e) {
			console.log('submit:', arguments);
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
