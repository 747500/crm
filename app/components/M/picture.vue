<template lang="pug">

	div(class="m-picture")
		oidImage(v-if="model" :oid="model")/
		div(v-else class="placeholder") {{ placeholder || ' ' }}

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

		created () {
			//console.log('<M/picture.vue> created', this)
		}
	}

</script>

<style>
</style>
