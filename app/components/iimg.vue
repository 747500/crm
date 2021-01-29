<script>


	export default {
		name: 'iimg',
		render(createElement) {

			const img = createElement('img', {
				attrs: {
					alt: ''
				}
			});

			if (this.$props.src) {
				this.$nextTick(() => {
					img.elm.src = URL.createObjectURL(this.$props.src);
					img.elm.alt = this.$props.src.name;
				});
			}

			return img;
		},
		props: {
			src: {
				type: [ File ],
				required: false,
			},
		}
	}

</script>
