<template>

	<div class="m-property">
		<div class="address">{{ model.address }}</div>
		<div class="price">{{ model.price | currency('₽', 2) }}</div>
	</div>

</template>

<script>

import oidImage from '../oidImage.vue'
import MPerson from './person.vue'

export default {

	name: 'MProperty',

	components: {
	},

	props: {
		model: Object,
	},

	data () {
		return {
		}
	}
}

</script>
