<template>
	<div class="m-picture">

		<oidImage  v-if="model" :oid="model" />

	</div>
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
