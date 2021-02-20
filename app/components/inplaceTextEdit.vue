<style>

.inplace-text {
	overflow: hidden;
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
	overflow-wrap: anywhere;
	white-space: pre-wrap;       /* Since CSS 2.1 */
    white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
    white-space: -pre-wrap;      /* Opera 4-6 */
    white-space: -o-pre-wrap;    /* Opera 7 */
    word-wrap: break-word;       /* Internet Explorer 5.5+ */
	font-family: var(--bs-font-sans-serif);
}

.inplace-text pre:focus {
	outline: 1px solid var(--border-color);
	background-color: var(--hover-color);
}

.inplace-text input[type=submit] {
	border: none;
	margin: 1pt;
	padding: 0 2pt;
	border-radius: calc(50%);
	display: block;
	position: absolute;
	bottom: 0.25em;
	right: 0.25em;
	width: 1.5em;
	height: 1.5em;
	background: rgba(0, 0, 0, 0.25);
}

.inplace-text input[type=submit]:hover {
	border-color: var(--border-color);
	background: rgba(0, 0, 0, 0.50);
}

.inplace-text input[disabled] {
	pointer-events: none;
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
			saved: '',
			model: ''
		}
	},
	created () {
		this.model = this.saved = this.$props.text
	},
	render (createElement) {

		const elButton = createElement('input', {
			attrs: {
				type: 'submit',
				value: this.$props.label,
				disabled: true,
			},
			on: {
				click: (event) => {
					this.$emit('savetext', this.saved = this.model)
					elButton.elm.disabled = true
				}
			}
		})

		const elText = createElement('pre', {
			attrs: {
				contenteditable: true,
			},
			on: {
				input: event => {
					elButton.elm.disabled = (
						this.saved === event.target.innerText
					)
				},
				keyup: event => {
					if ('Enter' === event.key && (event.ctrlKey || event.metaKey)) {
						elButton.elm.click()
						event.preventDefault()
						return
					}
					this.model = event.target.innerText
				}
			}
		})

		elText.text = this.model

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
