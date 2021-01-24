
<template>

	<div>
		<pre>focus: {{ focus }}</pre>
		<pre>events: {{ events }}</pre>
	</div>

</template>

<script>

	export default {
		data () {
			return  {
				focus: '2020-04-05',
		        events: []
			}
		},
		beforeRouteEnter (to, from, next) {
			next(vm => {
				vm.updateModel()
			})
		},
		beforeRouteUpdate (to, from, next) {
			this.$nextTick(() => {
				this.updateModel()
			})
			next()
		},
		created () {
		},
		methods: {
			updateModel () {
				this.$http.get('/calendar/events').then((response) => {
					this.events = Object.assign({}, response.body)
				}).catch((err) => {
					console.error(err)
				})
			}
		}
	};

</script>
