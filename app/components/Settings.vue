<template lang="pug">

	div
		h2 Настройки
		pre {{ userinfo }}

</template>


<script>

	export default {

		name: 'Settings',

		data () {
			return {
				userinfo: {}
			}
		},

		mounted () {

			this.$http.get('u/info')
			.then(response => {
				this.userinfo = response.body
			})
			.catch(console.error)

		}
	}


</script>
