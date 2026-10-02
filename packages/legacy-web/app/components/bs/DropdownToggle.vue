
<template lang="pug">

	bsButton(
		class="dropdown-toggle"
		:id="id"
		@mouseup="event => $emit('toggle', event)"
		@blur="event => $emit('blur', event)"
	)
		slot/

</template>


<script>

import bsButton from './Button.vue'

export default {

	name: 'bsDropdownToggle',

	components: {
		bsButton
	},

	data () {
		return {
			id: `toggle-${this.uid}`
		}
	}

}

</script>
