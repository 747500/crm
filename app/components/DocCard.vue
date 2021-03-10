<template lang="pug">

	bsCard
		bsCardHeader(v-if="$slots.header")
			slot(name="header")

		bsCardImage(v-if="$slots.image")
			slot(name="image")

		bsCardBody(v-if="$slots.header")
			slot(name="body")

</template>

<script>

export default {

	name: 'DocCard',

}

</script>
