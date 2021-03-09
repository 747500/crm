<template lang="pug">

	div(class="search")
		div(class="query")
			// 🔍
			input(
				class="form-control form-control-dark"
				type="text"
				placeholder="Search"
				aria-label="Search"
				ref="search"
				v-model="search"
				@focus="searchFocus"
				@keyup.enter="searchInput"
				@input="searchInput"
			)/

		div(class="search-panel-slot")
			div(
				v-if="searchActive"
				class="search-panel border border-primary shadow bg-body rounded"
			)
				div(class="header")
					div(class="buttons p-1")
						button(
							class="btn btn-outline-primary btn-sm"
							@click="() => { searchActive = false }"
						)
							| 🗙

				div(class="filter px-3")
					FormulateInput(
						type="checkbox"
						v-model="kind"
						:options="{ person: 'Контакты', property: 'Объекты', contract: 'Сделки' }"
						@input="searchFilter"
						)/

				div(class="px-3")
					span Найдено: {{ total_found }}

				div(class="result")
					List(
						class="list list-unstyled"
						v-model="result"
						v-slot:default="data"
						@open="openDoc"
					)
						// @edit="(doc) => $emit('edit', doc)"
						// @remove="(doc) => $emit('remove', doc)"

						MDoc(:oid="data.item._id")/


</template>

<style>

.search {

}

.search-panel-slot {
	position: relative;
	width: 100%;
	height: 0px;
}

.search-panel {
	position: absolute;
	width: 100%;
	height: auto;
	max-height: 90vh;
	background-color: white;
}

.search-panel .header {
	position: relative;
	width: 100%;
	height: 0px;
}

.search-panel .header .buttons {
	position: absolute;
	width: auto;
	height: auto;
	right: 0;
	top: 0;
}

/*
.search-panel .header .buttons .btn .close-btn {

}
*/

.search-panel .result {
	max-height: 80vh;
	overflow-x: hidden;
	overflow-y: auto;
}

.search-panel .filter label {
	margin: 0;
	padding: 0;
}

.search-panel .filter .formulate-input-group {
	max-width: 50vh;
	margin: 0 auto;
	display: flex;
}

.search-panel .filter .formulate-input-group > div {
	margin: 0.5rem;
	flex: 1;
}

.search-panel .filter .formulate-input-element--checkbox {
	display: inline-block;
}

</style>

<script>

	import List from './List.vue'
	import MDoc from './M/doc.vue'

	export default {

		name: 'Search',

		components: {
			List,
			MDoc,
		},

		data () { return {

			kind: [ this.$route.meta.kind ],
			search: '',
			result: [],
			total_found: 0,
			searchActive: false,

		} },

		methods: {
			searchFocus () {

				if (this.searchActive) {
					return
				}

				console.log('searchFocus')

				this.searchActive = true

				this.searchInput()
			},

			searchFilter () {
				if (0 === this.kind.length) {
					this.kind = [ 'person', 'property', 'contract' ]
				}

				//console.log(this.kind)
				this.searchInput()
			},

			searchInput () {
				//this.result = []

				this.$http.post('doc/s',
					{
						q: this.search,
						kind: this.kind
					}
				)
				.then(response => {

					// console.log('* <browser.vue> response:', response)

					this.total_found = response.body.total_found

					this.result = response.body.result.map(item => {
						return {
							_id: item.oid,
							kind: item.kind,
						}
					})
				})
				.catch(err => {
					console.error(err)
				})
			},

			openDoc (item) {
				// console.log('* <browser.vue> openDoc', item)
				this.$router.push({
					path: `/${item.kind}/${item._id}`
				})
			},

		},

		// Options / Data
		// props: [],
		// propsData: {},
		// computed: {},
		// methods: {},
		// watch: {},
		// Options / DOM
		// el () {},
		// template: '',
		// render () {},
		// Options / Lifecycle Hooks
		// beforeCreate () {},
		// created () {},
		// beforeMount () {},
		// mounted () {},
		// beforeUpdate () {},
		// updated () {},
		// activated () {},
		// deactivated () {},
		// beforeDestroy () {},
		// destroyed () {},
		// Options / Assets
		// directives: {},
		// filters: {},
		// components: {},
		// Options / Misc
		// parent: null,
		// mixins: [],
		// name: '',
		// extends: {},
		// delimiters: [ '{{', '}}' ],
		// functional: false
	}
</script>
