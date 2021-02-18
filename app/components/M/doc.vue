<template>
	<div>
<!--
v-on="$listeners.open ? { click: () => $emit('open', item) } : {}"
-->
		<component v-if="model"
			:is="model.kind"
			:model="model"
			v-on="$listeners.open ? { click: (event) => $emit('open', event) } : {}"
			:icon="$props.icon"
			/>

		<pre v-else>{{ raw }}</pre>

	</div>
</template>

<script>

import async from 'async'

import Person from './person.vue'
import Property from './property.vue'
import Contract from './contract.vue'

const component = {
	'person': {
		template: Person,
	},
	'property': {
		template: Property,
	},
	'contract': {
		template: Contract,
	}
}

export default {

	name: 'doc',

	components: {
		Person,
		Property,
		Contract,
	},

	props: {
		oid: String,
		icon: Boolean
	},

	data () {
		return {
			model: null,
			raw: null
		}
	},

	created () {
		const docId = this.$props.oid

		if (!docId) {
			return
		}

		const q = async.queue((task, cb) => {

			this.$http.get(task.uri)
			.then(response => {
				task.cb(response.body)
				cb()
			})
			.catch(cb)

		}, 1)

		q.error(err => {
			console.log('<doc.vue>', err)
		})

		/*
		q.drain(() => {
			console.log('<doc.vue> queue drian', this)
		})
		*/

		q.push({
			uri: `/doc/${docId}`,
			cb: doc => {
				const C = component[doc.kind]

				if (C) {
					this.model = doc
				}
				else {
					this.raw = doc
				}

				if ('property' === doc.kind && doc.ownerId) {

					q.push({
						uri: `/doc/${doc.ownerId}`,
						cb: owner => {
							doc.ownerId = owner
						}
					})
				}
			}
		})

	},

	computed: {
	},

	methods: {

	}
}
</script>
