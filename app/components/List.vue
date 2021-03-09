<template lang="pug">

	ul
		li(v-for="(item, n) in model" :key="item._id")
			div(
				v-on="$listeners.open ? { click: () => onClick(item) } : {}"
				:class="[ { 'active': $listeners.open }, 'item' ]"
			)
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

	data () {
		return {
		}
	},

	created () {
		//console.log('<List.vue>', this)
	},

	methods: {
		onClick (item) {
			//console.log('* <List.vue>', item)
			this.$emit('open', item)
		}
	}

}

</script>

<style>

</style>
