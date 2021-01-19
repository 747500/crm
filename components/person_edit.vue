

<template>
	<div class="panel-body">
		<vue-form-generator
			:schema="schema"
			:model="model"
			:options="formOptions">
		</vue-form-generator>

		<hr>

	</div>
</template>

<script>

import Vue from 'vue'
import VueFormGenerator from 'vue-form-generator'
//import schema from './person_edit_schema.json'

//import 'vue-form-generator/dist/vfg.css'

Vue.use(VueFormGenerator)

export default {
	components: {
//		VueFormGenerator: VueFormGenerator
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
				status: true
			},
			schema2: schema2,
			schema: {
				fields: [
					{
						type: 'input',
						inputType: 'text',
						label: 'ID (disabled text field)',
						model: 'id',
						readonly: true,
						disabled: true
					},
					{
						type: 'input',
						inputType: 'text',
						label: 'Фамилия',
						model: 'lastName',
						placeholder: '',
						featured: true,
						required: true
					},
					{
						type: 'input',
						inputType: 'text',
						label: 'Имя',
						model: 'firstName',
						placeholder: '',
						featured: true,
						required: true
					},
					{
						type: 'input',
						inputType: 'text',
						label: 'Отчество',
						model: 'middleName',
						placeholder: '',
						featured: true,
						required: true
					},
					{
						type: 'input',
						inputType: 'password',
						label: 'Password',
						model: 'password',
						min: 6,
						required: true,
						hint: 'Minimum 6 characters',
						validator: VueFormGenerator.validators.string
					},
					{
						type: 'select',
						label: 'Skills',
						model: 'skills',
						values: ['Javascript', 'VueJS', 'CSS3', 'HTML5']
					},
					{
						type: 'input',
						inputType: 'email',
						label: 'E-mail',
						model: 'email',
						placeholder: 'User\'s e-mail address'
					},
					{
						type: 'checkbox',
						label: 'Status',
						model: 'status',
						default: true
					}				]
			},
			formOptions: {
				validateAfterLoad: true,
				validateAfterChanged: true,
				validateAsync: true
			}
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
