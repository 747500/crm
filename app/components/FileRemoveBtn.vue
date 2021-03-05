<template lang="pug">

	bsDropdown(:schema="schema")/

</template>


<script>

	import bsDropdown from './bs/Dropdown.vue'

	export default {

		name: 'FileRemoveBtn',

		components: {
			bsDropdown,
		},

		props: {
			item: Object,
		},

		data () {
			return {
				schema: {
					text: '🗑',
					class: [
						'btn-sm',
						//'btn-danger',
						'btn-outline-danger',
					],
					menu: [
						{
							text: 'Cancel',
							handler: this.onCancel
						},
						{
							text: 'Ok',
							handler: this.onConfirm
						}
					]
				},
			}
		},

		methods: {
			onConfirm() {
				this.$emit('remove', this.$props.item)
			},

			onCancel() {
				// no-op
				//console.log('onCancel', args)
			},

		},

	}

</script>
