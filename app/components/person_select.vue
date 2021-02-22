<template>

	<div>
		<pre>{{ $props.model }}</pre>
	</div>

</template>

<script>

	export default {

		name: 'PersonSelect',

		props: {
			model: Object
		},

		data () {
			return {

			}
		}
	}

</script>
