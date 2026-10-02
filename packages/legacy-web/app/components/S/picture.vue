<template lang="pug">

	div(class="s-picture")
		oidImage(v-if="model" :oid="model")/
		div(v-else class="placeholder") {{ placeholder || ' ' }}

</template>

<script>

	import oidImage from '../oidImage.vue'

	export default {
		name: 'SPicture',

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
			//console.log('<M/person.vue> created', this.model)
		}
	}

</script>
