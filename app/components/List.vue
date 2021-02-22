<template>

	<ul class="doc-list">
		<li v-if="$listeners.create" class="create">
			<div class="btn-group btn-group-sm" role="group" aria-label="">
				<button @click.prevent="() => $emit('create')" class="btn btn-primary">
					+
				</button>
			</div>
		</li>

		<!-- @click.prevent="(event) => switchView(event, p)" -->

		<li v-for="(item, n) in model"
			v-bind:key="item._id"
			>

			<div
				v-on="$listeners.open ? { click: () => $emit('open', item) } : {}"
				:class="[ { 'active': $listeners.open }, 'item' ]"
				>
				<slot v-bind:item="item">
					<pre>{{ n }}: {{ item }}</pre>
				</slot>
			</div>

			<div class="toolbar">
				<div class="btn-group-vertical btn-group-sm" role="group" aria-label="">
					<button
						v-if="$listeners.edit"
						@click.prevent="() => $emit('edit', item)"
						class="btn btn-secondary">
						🖉
					</button>
					<button
						v-if="$listeners.remove"
						@click.prevent="() => $emit('remove', item)"
						class="btn btn-danger">
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
		//console.log('<List.vue>', this)
	},

	methods: {
	}

}

</script>

<style>

ul.doc-list {
	margin: 0;
	padding: 0.33em 0;
}

ul.doc-list > li {
	padding: .33em;
	display: flex;
	border-bottom: 1px solid var(--border-color);
}

ul.doc-list > li:hover {
	background-color: var(--hover-color);
}

ul.doc-list > li .item {
	flex: 10;
}

ul.doc-list > li .item.active {
	cursor: pointer;
}

ul.doc-list > li .toolbar {
	flex: 1;
	text-align: right;
}

ul.doc-list > li.create {
	list-style-type: circle;
}

</style>
