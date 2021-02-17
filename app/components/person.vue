
<template>
	<div class="person">

		<List
			class="list"
			v-model="list"
			v-slot:default="props"
			@edit="(doc) => $emit('edit', doc)"
			@remove="(doc) => $emit('remove', doc)"
			@create="(doc) => $emit('create')"
			>

			<MPerson :person="props.item" />

		</List>

	</div>
</template>

<script>

	import List from './List.vue'
	import MPerson from './M/person.vue'

	export default {
		name: 'person',

		components: {
			List,
			MPerson
		},

		model: {
			prop: 'list'
		},

		props: {
			list: Array
		},

		methods: {

			handler (...a) {
				console.log(a)
			},

			switchView (event, item) {
				//console.log(event)
				if (event.target.localName === 'div') {
					this.$emit('switchView', item)
				}
			}
		}

	}

</script>

<style>

</style>
