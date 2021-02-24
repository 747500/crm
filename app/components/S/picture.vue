<template>
	<div class="s-picture">

		<oidImage  v-if="model" :oid="model" />

	</div>
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
