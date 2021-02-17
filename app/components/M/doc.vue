<template>
	<div>
		<router-link v-if="kind" :to="{ name: kind + '_edit', params: { id: _id }}">
			{{ title }}
		</router-link>
	</div>
</template>

<script>

const trans = {
	contract (doc) {
		return doc.title
	},
	property (doc) {
		return doc.address
	},
	person (doc) {
		var yobStr = ''

		if (doc.birthDay) {
			if ('string' === typeof doc.birthDay) {
				doc.birthDay = new Date(doc.birthDay)
			}

			yobStr = ', ' + doc.birthDay.getFullYear()
		}

		return `${doc.lastName} ${doc.firstName} ${doc.middleName}${yobStr}`
	},
}

import moment from 'moment'

export default {
	name: 'doc',
	components: [
	],
	props: {
		oid: String
	},
	data () {
		return {
			title: '',
			kind: null,
			_id: null
		}
	},
	created () {
		const docId = this.$props.oid

		if (!docId) {
			return
		}

		this.$http.get(`/doc/${docId}`).then(response => {

			const doc = response.body

			var title = trans[doc.kind]

			if (title instanceof Function) {
				title = title(doc)
			}
			else {
				title = doc
			}

			this.title = title
			this._id = doc._id
			this.kind = doc.kind

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
