<template>

	<div>
		<div v-for="(item, n) in model" :key="item._id">
			<slot v-bind:item="item">
				<pre>{{ n }}: {{ item }}</pre>
			</slot>
		</div>
	</div>

</template>

<style>
</style>

<script>


export default {
	name: 'browserList',
	components: {
	},
	model: {
		prop: 'model'
	},
	props: {
		model: Array,
		required: true,
	},
	data () {
		return {
			//model: []
		}
	},
	created () {
		console.log(this)
	},
	methods: {

	}
}

</script>
