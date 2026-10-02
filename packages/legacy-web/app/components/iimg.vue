<script>

	export default {
		name: 'iimg',

		props: {
			src: {
				type: [ Blob, File ], // String works too
				required: false
			}
		},

		render(createElement) {

			//console.log('<<< iimg src=', typeof this.$props.src)

			const img = createElement('img', {
				attrs: {
					alt: '',
					src: undefined
				}
			});

			this.$nextTick(() => {
				try {
					if (this.$props.src) {
						img.elm.src = URL.createObjectURL(this.$props.src)
						img.elm.onload = event => {
							// no longer need to read the blob so it revoked
							URL.revokeObjectURL(this.$props.src)
						}
					}

				}
				catch (e) {
					console.error('iimg.vue', e)
				}
			});

			return img;
		}
	}

</script>
