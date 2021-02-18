<template>

	<div class="m-contract">
		<div class="icon" v-if="$props.icon">
			📄
		</div>

		<div class="data">
			<pre>{{ model }}</pre>
		</div>

	</div>

</template>

<script>

	export default {

		name: 'contract',

		props: {
			model: Object,
			icon: Boolean
		},

	}

</script>

<style>

.m-contract {
	display: flex;
}

.m-contract .icon {
	flex: 1;
}

.m-contract .data {
	flex: 20;
}

</style>
