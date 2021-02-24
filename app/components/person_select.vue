<template>

	<div>

		<SearchDropdown />

		<div :key="owner._id">
			<DocForm :model="owner.person" :kind="kind" />
			<!-- div v-else>
				$props.owner: {{ owner }}
			</div-->
		</div>
	</div>

</template>

<script>

	import SearchDropdown from './SearchDropdown.vue'

	import SDoc from './S/doc.vue'
	import DocForm from './DocForm.vue'

	export default {

		name: 'PersonSelect',

		components: {
			SearchDropdown,
			SDoc,
			DocForm
		},

		props: {
			model: Object
		},

		data () {
			return {
				kind: 'person',
				owner: {},
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
		},

		methods: {


		}
	}

</script>

<style>


</style>
