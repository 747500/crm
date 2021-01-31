<script>

export default {
	model: {
		prop: 'text',
		event: 'submit'
	},
	props: {
		text: String,
		label: String
	},
	data: () => {
		return {
			saved: ''
		}
	},
	created () {
		this.saved = this.$props.text
	},
	render (createElement) {

		const elButton = createElement('input', {
			attrs: {
				type: 'submit',
				value: this.$props.label,
				disabled: true
			},
			on: {
				click: (event) => {
					this.$emit('submit', this.saved)
				}
			}
		})

		const elText = createElement('input', {
			attrs: {
				type: 'text',
				value: this.$props.text
			},
			on: {
				input: (event) => {

					this.saved = event.target.value

					elButton.elm.disabled = (
						this.$props.text === event.target.value
					)
				}
			}
		})

		const div = createElement('div', {},
			[
				elText,
				elButton
			]
		)

		return div;
	}

}

</script>
