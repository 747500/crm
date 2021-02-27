<template lang="pug">

	ul(class="tab-view")
		li(
			v-for="(item, n) in $props.schema"
			:key="item.component"
			class="tab"
			role="tab"
		)
			a(
				href=""
				:class="{ active: currentTab.component === item.component }"
				:data-n="n"
				@click.prevent="clickTab"
				)
				| {{ item.title }}

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
				currentTab: this.$props.schema[0]
			}
		},

		created () {
			this.$emit('tab', this.currentTab)
		},

		methods: {

			clickTab (event) {
				this.currentTab = this.$props.schema[event.target.dataset.n]
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
	display: inline-block;
	margin: 0;
	padding: 0;
	list-style: none;
	flex: initial;
}

ul.tab-view li.tab a {
	display: block;
	margin: 0;
	padding: 0 2rem .33rem 2rem;
	border-bottom: 2px solid transparent;
}

ul.tab-view li.tab a.active {
	font-weight: bold;
	border-bottom: 2px solid var(--border-color);
}

</style>
