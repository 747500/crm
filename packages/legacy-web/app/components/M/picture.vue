<template lang="pug">

	div
		div(
			class="m-picture"
			:class="classList"
		)
			oidImage(v-if="model" :oid="model")/
			svg(
				v-else
				viewBox="0 0 300 300"
				preserveAspectRatio="xMidYMid meet"
			)
				text(x="18" y="220" style="font-size: 210px;") 👤

</template>

<script>

	import oidImage from '../oidImage.vue'

	export default {
		name: 'MPicture',

		components: {
			oidImage
		},

		props: {
			model: String,
			placeholder: String,
		},

		data () {
			return {
			}
		},

		computed: {
			classList () {
				return this.model ? [] : [
					'd-none',
					'd-md-block',
				]
			}
		},

		created () {
			//console.log('<M/picture.vue> created', this)
		}
	}

</script>

<style>
</style>
