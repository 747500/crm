
<template lang="pug">

	ul(class="dropdown-menu" role="menu")
		bsDropdownItem(
			v-for="item in menu"
			:key="item.text"
			@select="() => $emit('select', item.value)"
			@mousedown="event => $emit('mousedown', event)"
		) {{ item.text }}

</template>


<script>

import bsDropdownItem from './DropdownItem.vue'

export default {

	name: 'bsDropdownMenu',

	components: {
		bsDropdownItem,
	},

	props: {
		menu: Array,
	},

}

</script>
