<template lang="pug">

	bsDropdown(
		:schema="schema"
		@select="onSelect"
	)/

</template>


<script>

	import bsDropdown from '../bs/Dropdown.vue'

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
						'btn-outline-danger',
					],
					menu: [
						{
							text: 'Cancel',
							value: false,
						},
						{
							text: 'Ok',
							value: true,
						}
					],
				},
			}
		},

		methods: {
			onSelect(value) {
				console.log('* FileRemoveBtn onSelect', value)
				if (value) {
					this.$emit('remove', this.$props.item)
				}
			},
		},

		created () {
			//console.log('* FileRemoveBtn created', this);
		}
	}

</script>
