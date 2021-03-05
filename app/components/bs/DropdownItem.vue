
<template lang="pug">

	li()
		a(:class="classList" href="#" @click.prevent @mouseup="event => $emit('select', event)")
			slot/

</template>


<script>

export default {

	name: 'bsDropdownItem',

	data () {
		return {
			//id: 'button-123',
			classList: [
				'dropdown-item',
			]
		}
	},

}

</script>
