<template lang="pug">

	span(
		:class="[ 'confirm', { active: null !== confirm } ]"
	)
		a(
			v-if="confirm"
			href=""
			@click.prevent="onCancel"
		)
			| {{ $props.message || 'Cancel' }}

		a(
			href=""
			@click.prevent="onClick"
		)
			slot

</template>

<style>

.confirm.active a:last-child {
	color: red;
}

</style>

<script>

export default {
	name: 'aYesNo',
	props: {
		onconfirm: {
			type: Function,
			required: true
		},
		message: {
			type: String,
			required: false
		}
	},
	data () {
		return {
			confirm: null
		}
	},
	methods: {
		onClick (event) {
			if (this.confirm) {
				this.confirm(event)
				this.confirm = null
				return;
			}

			this.confirm = this.$props.onconfirm
		},
		onCancel (event) {
			this.confirm = null
		}
	}
}

</script>
