<template lang="pug">

	ul
		li(v-for="(item, n) in model" :key="item._id")
			slot(v-bind:item="item")
				pre {{ n }}: {{ item }}

</template>

<script>

export default {

	name: 'List',

	components: {
	},

	model: {
		prop: 'model'
	},

	props: {
		model: Array,
		required: true,
	},

}

</script>

<style>

</style>
