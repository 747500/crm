<template lang="pug">

	div(class="doc-form-owner")
		label(class="form-label") Собственник
		SDoc(tabstop="1" :oid="oid")/

</template>

<script>

	import SDoc from './S/doc.vue'

	export default {

		name: 'DocFormOwner',

		components: {
			SDoc,
		},

		props: {
			oid: String,
			submit: Function,
		},

		data () {
			return {

			}
		},

	}

</script>

<style>

.doc-form-owner > .s-doc {
	border: 1px solid var(--border-color);
	border-radius: 0.25rem;
}

</style>
