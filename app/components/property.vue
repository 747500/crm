
<template>
	<div class="property">


		<List
			class="list"
			v-model="list"
			v-slot:default="props"
			@edit="(doc) => $emit('edit', doc)"
			@remove="(doc) => $emit('remove', doc)"
			@create="(doc) => $emit('create')"
			>

			<div class="item">

				<div class="owner">
					<div v-if="'object' === typeof props.item.ownerId">
						<MPerson :person="props.item.ownerId"/>
					</div>
				</div>

				<div class="property">
					<div class="address">{{ props.item.address }}</div>
					<div class="price">{{ props.item.price | currency('₽', 0) }}</div>
				</div>

			</div>
		</List>

	</div>
</template>

<script>

	import List from './List.vue'
	import MPerson from './M/person.vue'

	export default {
		name: 'property',
		components: {
			List,
			MPerson
		},
		model: {
			prop: 'list',
		},
		props: {
			list: Array
		},
		methods: {
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

.property .list li .item {
	display: flex;
}

.property .list li .owner {
	flex: 5;
}

.property .list li .property {
	flex: 3;
}


</style>
