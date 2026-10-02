<template lang="pug">

	// @click.prevent="onEventClick"

	div(class="s-event")

		SDoc(
			ref="doc"
			:oid="oid"
			@open="onDocOpen"
		)/

		div(class="event-data")
			div
			| {{ Icon }}
			| {{ title }}

</template>

<script>

	const typeIcons = {
		birthday: '🎁',
		default: '💥',
	}

	import SDoc from './doc.vue'

	export default {

		name: 'SEvent',

		components: {
			SDoc
		},

		props: {
			oid: String,
			type: String,
			title: String
		},

		methods: {

			onDocOpen (item) {
				//console.log('* <S/event.vue> onDocOpen', item)
				this.$router.push(`/${item.kind}/${item._id}`)
			},

		},

		computed: {
			Icon () {
				return typeIcons[this.$props.type] || typeIcons.default
			},
		},
	}

</script>

<style>

.s-event {
	position: relative;
}

.s-event:hover .s-doc {
	background-color: var(--hover-color);
}

.s-event > .s-doc {
	width: calc(100% - 1em);
	border: 1px solid var(--border-color);
	margin-bottom: 1em;
	margin-right: 1em;
	border-radius: 0.3em;
}

.s-event > .event-data {
	position: absolute;
	right: 0;
	bottom: -0.5em;
	background: rgba(0, 0.05, 0.05, 0.2);
	border-radius: 1em;
	padding: 0.5em .75em;
	border: 1px solid var(--border-color);
}

</style>
