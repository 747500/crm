<template lang="pug">

	iimg(
		:src="src"
		:alt="alt"
		:key="key"
	)/

</template>

<script>

	import iimg from './iimg.vue'

	export default {

		name: 'oidImage',

		props: {
			oid: String,
			size: String
		},

		data () {
			return {
				src: null,
				alt: '',
				key: ''
			}
		},

		components: {
			iimg
		},

		created () {
		},

		mounted () {

			if ('string' !== typeof this.$props.oid) {
				return
			}

			var path = 'full' === this.$props.size ? 'f' : 't'

			this.$http.get(
				`/${path}/${this.$props.oid}`,
				{
					responseType: 'blob'
				}
			)
			.then(response => {
				this.src = response.body

				const caption = response.headers.get('x-meta-caption') || ''
				this.alt = decodeURIComponent(caption)

				this.key = this.$props.oid
			})
			.catch(console.error)
		}

	}

</script>
