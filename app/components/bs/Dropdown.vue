
<template lang="pug">

	div(class="dropdown")
		bsDropdownToggle(
			:id="id"
			ref="button"
			@toggle="onClick"
			@blur="onBlur"
			:aria-expanded="expadned"
			:class="buttonClassList"
		)
			| {{ schema.text }}

		bsDropdownMenu(
			:aria-labelledby="id"
			ref="menu"
			:menu="$props.schema.menu"
			@select="onSelect"
			@mousedown="onMousedown"
		)/

</template>


<script>

import { createPopper } from '@popperjs/core'

import bsDropdownToggle from './DropdownToggle.vue'
import bsDropdownMenu from './DropdownMenu.vue'

export default {

	name: 'bsDropdown',

	components: {
		bsDropdownToggle,
		bsDropdownMenu,
	},

	props: {
		schema: Object,
	},

	data () {
		return {
			id: `dropdown-${this.uid}`,
			buttonClassList: [],
			popper: null,
			expadned: false,
			mouseActive: false,
		}
	},

	methods: {
		onSelect (event) {
			console.log('* Dropdown onSelect', event)

			if (false === event) {
				this.hideDropdown()
				return
			}

			this.$emit('select', event)
		},

		onMousedown () {
			this.mouseActive = true
		},

		onClick (event) {
			//console.log('Dropdown onClick', event)

			if ('blur'=== event.type) return

			this.expadned = !this.expadned

			if (this.expadned) {
				this.$refs.button.$el.classList.add('show')
				this.$refs.menu.$el.classList.add('show')
				this.popper.update()
			}
			else {
				this.$refs.button.$el.classList.remove('show')
				this.$refs.menu.$el.classList.remove('show')
			}

		},

		onBlur () {
			if (this.mouseActive) {
				return
			}

			this.hideDropdown()
		},

		hideDropdown () {
			setTimeout(() => {
				this.mouseActive = false
				this.expadned = false
				this.$refs.button.$el.classList.remove('show')
				this.$refs.menu.$el.classList.remove('show')
			}, 75)

		}
	},

	created () {

		this.buttonClassList.push(this.$props.schema.class)

		this.$nextTick(() => {
			this.popper = createPopper(
				this.$refs.button.$el,
				this.$refs.menu.$el
			)
		})
	}
}

</script>
