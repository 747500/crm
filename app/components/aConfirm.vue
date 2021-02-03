<template>
	<span class="confirm" :class="{ active: null !== confirm }">
		<a v-if="confirm" href="" @click.prevent="onCancel">{{ $props.message || 'Cancel' }}</a>
		<a href="" @click.prevent="onClick"><slot></slot></a>
	</span>
</template>

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
			}
			else
			{
				this.confirm = this.$props.onconfirm
			}
		},
		onCancel (event) {
			this.confirm = null
		}
	}
}

</script>
