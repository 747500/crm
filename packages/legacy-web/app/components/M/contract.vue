<template lang="pug">

	bsCard(
		class="m-contract"
		v-on="$listeners"
	)
		bsCardBody
			<pre>{{ $props.model }}</pre>

</template>

<script>

import bsCard from '../bs/Card.vue'
import bsCardBody from '../bs/CardBody.vue'

export default {

	name: 'MContract',

	components: {
		bsCard,
		bsCardBody,
	},

	props: {
		model: Object,
	},

}

</script>

<style>

</style>
