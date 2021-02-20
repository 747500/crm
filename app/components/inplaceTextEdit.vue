<style>

.inplace-text {
	overflow: hidden;
	border-bottom: 1px solid var(--border-color);
	padding: 0;
	position: relative;
}

.inplace-text pre {
	margin: 0;
	padding: 0;
	flex: auto;
	display: block;
	line-height: 1.5em;
	height: 4.5em;
	text-align: center;
}

.inplace-text pre:focus {
	outline: 1px solid var(--border-color);
	background-color: var(--hover-color);
}

.inplace-text input[type=submit] {
	border: none;
	margin: 1pt;
	padding: 0 2pt;
	border-radius: 3px;
	display: block;
	position: absolute;
	right: 0;
	bottom: 0;
}

.inplace-text input[type=submit]:hover {
	box-shadow: 0px 0px 0px 1px var(--border-color);
}

</style>

<script>

export default {
	name: 'inplaceTextEdit',
	model: {
		prop: 'text',
		event: 'savetext'
	},
	props: {
		text: String,
		label: String
	},
	data () {
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
					this.$emit('savetext', this.saved)
				}
			}
		})

		const elText = createElement('pre', {
			attrs: {
				contenteditable: true,
			},
			on: {
				input: event => {
					this.saved = event.target.value

					elButton.elm.disabled = (
						this.$props.text === event.target.value
					)
				},
				keyup: event => {
					if ('Enter' === event.key && (event.ctrlKey || event.metaKey)) {
						elButton.elm.click()
					}
				}
			}
		})

		elText.text = this.$props.text

/*
		const elText = createElement('textarea', {
			attrs: {
				rows: '2',
			},
			on: {
				input: event => {
					this.saved = event.target.value

					elButton.elm.disabled = (
						this.$props.text === event.target.value
					)
				},
				keyup: event => {
					if ('Enter' === event.key) {
						elButton.elm.click()
					}
				}
			}
		})

		elText.text = this.$props.text
*/

/*
		const elText = createElement('input', {
			attrs: {
				type: 'text',
				value: this.$props.text
			},
			on: {
				input: event => {
					this.saved = event.target.value

					elButton.elm.disabled = (
						this.$props.text === event.target.value
					)
				},
				keyup: event => {
					if ('Enter' === event.key) {
						elButton.elm.click()
					}
				}
			}
		})
*/
		const div = createElement('div',
			{
				attrs: {
					class: 'inplace-text'
				}
			},
			[
				elText,
				elButton
			]
		)

		return div;
	}

}

</script>
