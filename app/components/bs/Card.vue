<template lang="pug">
	div(class="card" v-on="$listeners")
		slot
</template>

<script>

export default {

	name: 'bsCard',

}

</script>
