<template lang="pug">

	li
		a(
			class="dropdown-item"
			href="#"
			@mouseup="onMouseup"
			@mousedown="event => $emit('mousedown', event)"
			@click.prevent
		)
			slot/

</template>


<script>

export default {

	name: 'bsDropdownItem',

	data () {
		return {
			//id: 'button-123',
		}
	},

	methods: {
		onMouseup (event) {
			//console.log('* DropdownItem onMouseup', event)
			this.$emit('select', event)
		}
	}
}

</script>
