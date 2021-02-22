<template>

	<div class="m-contract">
		<div class="data">
			<pre>{{ $props.model }}</pre>
		</div>
	</div>

</template>

<script>

	export default {

		name: 'MContract',

		props: {
			model: Object,
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
