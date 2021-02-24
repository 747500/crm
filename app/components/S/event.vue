<template>

	<div class="s-event" @click="() => $emit('click', oid)">

		<SDoc :oid="oid" />

		<div class="event-data">
			<div>
				{{ type }}
			</div>
			<div>
				{{ title }}
			</div>
		</div>

	</div>

</template>

<script>

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
		}

	}

</script>

<style>

.s-event {
	display: flex;
}

.s-event:hover {
	background-color: var(--hover-color);
}

.s-event > .s-doc {
	flex: 2;
}

.s-event > .event-data {
	flex: 1;
}

</style>
