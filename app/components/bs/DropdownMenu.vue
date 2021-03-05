
<template lang="pug">

	ul(
		:class="classList"
		role="menu"
	)
		bsDropdownItem(
			v-for="item in schema"
			:key="item.text"
			@select="item.handler") {{ item.text }}

</template>


<script>

import bsDropdownItem from './DropdownItem.vue'

export default {

	name: 'bsDropdownMenu',

	components: {
		bsDropdownItem,
	},

	props: {
		schema: Array,
	},

	data () {
		return {
			classList: [
				'dropdown-menu',
			]
		}
	},

	created () {
		//this.elm.previousSibling
		console.log(this)
	}

}

</script>
