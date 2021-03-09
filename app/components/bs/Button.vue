
<template lang="pug">

	button(
		class="btn"
		:id="id"
		@click="event => $emit('click', event)"
		@mouseup="event => $emit('mouseup', event)"
		@blur="event => $emit('blur', event)"
	)
		slot/

</template>


<script>

export default {

	name: 'bsButton',

	data () {
		return {
			id: `button-${this.uid}`,
		}
	}

}

</script>
