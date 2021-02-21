<template>

	<ul class="tab-view">
		<li v-for="(item, n) in $props.schema" :key="item.component"
			class="tab"
			role="tab"
			:class="{ active: currentTab === item.component }"
			:data-tab-component="item.component"
			@click.prevent="clickTab"
			>
			{{ item.title }}
		</li>
	</ul>

</template>

<script>

/*
	[
		{
			component: 'name',
			title: 'Text',
		}
	]
*/

	export default {

		name: 'TabView',

		props: {
			schema: Array,
		},

		data () {
			return {
				currentTab: this.$props.schema[0].component
			}
		},

		created () {
			this.$emit('tab', this.currentTab)
		},

		methods: {

			clickTab (event) {
				const el = event.target
				this.currentTab = el.dataset.tabComponent
				this.$emit('tab', this.currentTab)
			},

		}
	}
</script>

<style>

ul.tab-view {
	list-style: none;
	margin: 0;
	padding: 0;
	border-bottom: 1px solid var(--border-color);
	width: 100%;
	display: flex;
}

ul.tab-view li.tab {
	cursor: pointer;
	display: inline-block;
	margin: 0;
	padding: 0 2em .33em 2em;
	flex: initial;
	border-bottom: 2px solid transparent;
}

ul.tab-view li.tab.active {
	font-weight: bold;
	border-bottom: 2px solid var(--border-color);
}

</style>
