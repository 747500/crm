
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
		//	slot(name="button")/

		bsDropdownMenu(
			:aria-labelledby="id"
			ref="menu"
			:schema="schema.menu"
			)/
		//	slot(name="menu")/

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
			buttonClassList: [
			],
			popper: null,
			expadned: false
		}
	},

	methods: {
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
			//console.log('onBlur target', event.relatedTarget)
			//console.log('onBlur related', event.relatedTarget)

			setTimeout(() => {
				this.expadned = false
				this.$refs.button.$el.classList.remove('show')
				this.$refs.menu.$el.classList.remove('show')
			}, 75)
		},
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
