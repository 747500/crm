<template>

	<div :key="owner._id">
		<DocEdit v-if="owner._id" :model="owner" />
		<div v-else>
			$props.owner: {{ owner }}
		</div>
	</div>

</template>

<script>

	import DocEdit from './DocEdit.vue'

	export default {

		name: 'PersonSelect',

		components: {
			DocEdit
		},

		props: {
			model: Object
		},

		data () {
			return {
				owner: {}
			}
		},

		mounted () {

			if (this.$props.model.owner) {
				this.$http.get(`/doc/${this.$props.model.owner}`)
				.then(response => {
					this.owner = response.body
				})
				.catch(console.error)
			}
		}
	}

</script>
