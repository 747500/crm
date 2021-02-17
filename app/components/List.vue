<template>

	<ul>
		<li class="create">
			<div class="btn-group btn-group-sm" role="group" aria-label="">
				<button @click.prevent="() => $emit('create')" class="btn btn-primary">
					+
				</button>
			</div>
		</li>

		<!-- @click.prevent="(event) => switchView(event, p)" -->

		<li v-for="(item, n) in model"
			v-bind:class="{ 'strike': item.status }"
			v-bind:key="item._id"
			>

			<div class="item">
				<slot v-bind:item="item">
					<pre>{{ n }}: {{ item }}</pre>
				</slot>
			</div>

			<div class="toolbar">
				<div class="btn-group-vertical btn-group-sm" role="group" aria-label="">
					<button	@click.prevent="() => $emit('edit', item)" class="btn btn-secondary">
						🖉
					</button>
					<button @click.prevent="() => $emit('remove', item)" class="btn btn-danger">
						🗑
					</button>
				</div>
			</div>

		</li>

	</ul>

</template>

<script>

export default {

	name: 'List',

	components: {
	},

	model: {
		prop: 'model'
	},

	props: {
		model: Array,
		required: true,
	},

	data () {
		return {
		}
	},

	created () {
	},

	methods: {
	}

}

</script>

<style>

ul.list {
	margin-top: 0;
	margin-bottom: 0;
	padding-top: 0.33em;
	padding-bottom: 0.33em;
}

ul.list li {
	padding: .33em;
	display: flex;
	border-bottom: 1px solid var(--border-color);
}

ul.list li:hover {
	background-color: var(--hover-color);
}

ul.list li .item {
	flex: 10;
}

ul.list li .toolbar {
	flex: 1;
	text-align: right;
}

ul.list li.create {
	list-style-type: circle;
}

</style>
