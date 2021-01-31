<script>


	export default {
		name: 'iimg',
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
						img.elm.src = URL.createObjectURL(this.$props.src);
					}
				}
				catch (e) {
					console.error('>>>>>', e)
				}
			});

			return img;
		},
		props: {
			src: {
				type: [ Blob, File ],
				required: false,
			}
		}
	}

</script>
