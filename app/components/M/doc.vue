<template>
	<div>
		<div>{{ model.kind }}</div>
		<pre>{{ model }}</pre>
		<router-link v-if="model.kind" :to="{ name: model.kind + '_edit', params: { id: model._id }}">
			Открыть
		</router-link>
	</div>
</template>

<script>

import moment from 'moment'

export default {
	name: 'doc',
	props: {
		oid: String
	},
	data () {
		return {
			model: {}
		}
	},
	created () {
		const docId = this.$props.oid

		if (!docId) {
			return
		}

		this.$http.get(`/doc/${docId}`).then(response => {

			const doc = Object.assign({}, response.body)

			// FIXME - dirty schemaless hack
			if (response.body.birthDay) {
				doc.birthDay = moment(response.body.birthDay).format('YYYY-MM-DD')
			}

			this.model = doc

			//console.log('<M/doc.vue> created', this.model)
		})
		.catch(err => {
			console.error(err)
		})


	},
	methods: {

	}
}
</script>
