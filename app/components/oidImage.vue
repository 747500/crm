<template lang="pug">

	iimg(
		v-if="isImage"
		:src="src"
		:alt="alt"
		:key="key"
	)/
	svg(
		v-else
		viewBox="0 0 300 300"
		preserveAspectRatio="xMidYMid meet"
	)
		text(x="18" y="220" style="font-size: 90px;") {{ type }}

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
				key: '',
				type: ''
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

			var path = 'full' === this.$props.size ? '' : '/t'

			this.$http.get(
				`f/${this.$props.oid}${path}`,
				{
					responseType: 'blob'
				}
			)
			.then(response => {
				this.src = response.body

				const caption = response.headers.get('x-meta-caption') || ''
				this.alt = decodeURIComponent(caption)

				const contentType = response.headers.get('content-type') || 'application/binary'
				var content
				[ content, this.type ] = contentType.split('/')

				if ('image' === content) {
					this.isImage = true
				}

				this.key = this.$props.oid
			})
			.catch(console.error)
		}

	}

</script>
