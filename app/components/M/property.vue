<template>

	<div class="m-property">

		<div class="icon" v-if="options.icon">
			&#x1F3E0;
		</div>

		<div class="picture" v-if="options.image">
			<oidImage  v-if="model.mainPicture" :oid="model.mainPicture" />
		</div>

		<div class="property">
			<div class="address">{{ model.address }}</div>
			<div class="price">{{ model.price | currency('₽', 2) }}</div>
		</div>

		<div class="owner">
			<div v-if="'object' === typeof model.ownerId">
				<MPerson :model="model.ownerId" :schema="options.person"/>
			</div>
		</div>

	</div>

</template>

<script>

import oidImage from '../oidImage.vue'
import MPerson from './person.vue'

export default {
	name: 'Property',
	components: {
		oidImage,
		MPerson,
	},
	props: {
		model: Object,
		schema: Object,
	},

	data () {
		return {
			options: this.$props.schema
		}
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

.m-property .picture img {
	width: 9em;
	height: 9em;
	object-fit: cover;
}

</style>
