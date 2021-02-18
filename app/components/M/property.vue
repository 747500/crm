<template>

	<div class="m-property">

		<div class="icon" v-if="$props.icon">
			&#x1F3E0;
		</div>

		<div class="property">
			<div class="address">{{ model.address }}</div>
			<div class="price">{{ model.price | currency('₽', 2) }}</div>
		</div>

		<div class="owner">
			<div v-if="'object' === typeof model.ownerId">
				<MPerson :model="model.ownerId"/>
			</div>
		</div>

	</div>

</template>

<script>

import MPerson from './person.vue'

export default {
	name: 'Property',
	components: {
		MPerson
	},
	props: {
		model: Object,
		icon: Boolean,
	}
}

</script>

<style>
.m-property {
	display: flex;
}

.m-property .icon {
	flex: 1;
}

.m-property .owner {
	flex: 12;
}

.m-property .property {
	flex: 9;
}

</style>
