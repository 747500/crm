<template lang="pug">

	div(class="search")
		div(class="query")
			div(class="label prefix") 🔍

			input(
				ref="searchInput"
				tabindex="1"
				class="query"
				type="text"
				@input="handleSearchInput"
				@focus="handleSearchFocus"
				@blur="handleSearchFocus"
			)/

			a(
				role="button"
				href=""
				class="label suffix"
				@click.prevent="searchQueryClean"
			)
				| 🗙

		div(:class="[ 'result', { active: searchResults.length } ]")
			ul(
				tabindex="2"
				@focus="handleSearchFocus"
				@blur="handleSearchFocus"
			)
				li(
					v-for="(item, n) in searchResults"
					:key="item.id"
				)
					SDoc(:oid="item.oid")/

</template>

<script>

	import SDoc from './S/doc.vue'

	export default {

		name: 'SearchDropdown',

		components: {
			SDoc
		},

		props: {
			model: Object
		},

		data () {
			return {
				//searchQuery: '',
				searchResults: [],
				searchTotal: 0,
				focusInput: false,
				focusResult: false,
			}
		},

		mounted () {

			/*
			if (this.$props.model.owner) {
				this.$http.get(`doc/${this.$props.model.owner}`)
				.then(response => {
					this.owner = response.body
				})
				.catch(console.error)
			}
			*/
		},

		methods: {

			searchQueryClean () {
				//this.searchQuery = ''
				this.$refs.searchInput.value = ''
				this.searchResults = []
			},

			handleSearchFocus (event) {
				//console.log(event)

				// it's possible to dnf code below, leaved as is for clarity
				if ('blur' === event.type &&
					(
						null === event.relatedTarget
						||
						(
							!(
								'input' === event.relatedTarget.localName
								&&
								'query' === event.relatedTarget.className
							)
							&&
							!(
								'ul' === event.relatedTarget.localName
							)
						)
					)
				) {
					this.searchResults = []
				}

				if (
					'focus' === event.type &&
					'input' === event.target.localName &&
					'query' === event.target.className &&
					event.target.value
				) {
					this.handleSearchInput(event)
				}

			},

			handleSearchInput (event) {
				console.log(event.target.value)

				if ('' === event.target.value) {
					this.searchResults = []
					this.searchTotal = 0
					return
				}

				this.$http.post('s',
					{
						q: event.target.value,
						kind: 'person'
					}
				)
				.then(response => {

					//console.log('<browser.vue> response:', response)
					this.searchResults = response.body.result
					this.searchTotal = response.body.total_found
				})
				.catch(err => {
					console.error(err)
				})
			}

		}
	}

</script>

<style>

.search {
	width: 25em;
}

.search > .query {
	line-height: 2em;
	width: 100%;
	position: relative;
	display: flex;
	border: 1px solid var(--border-color);
	border-radius: 0.3rem;
}

.search > .query > * {
	display: block;
}

.search > .query > input {
	border: none;
	flex: auto;
	margin: 0px;
	padding: 0px;
	padding-bottom: 0.150em;
}

.search > .query > input:focus {
	border: none;
	outline: none;
}

.search > .query > .label {
	text-align: center;
	width: 2.5em;
	height: 2em;
	flex: initial;
	padding-bottom: 0.150em;
}

.search > .result {
	position: relative;
	width: 100%;
}

.search > .result > ul {
	position: absolute;
	margin: 0px;
	padding: 0px;
	top: 0px;
	left: 0px;
	width: 100%;
	background-color: #fff;
	border: 1px solid var(--border-color);
	display: none;
	max-height: 50vh;
	overflow-y: scroll;
	overflow-x: hide;
}

.search > .result.active > ul {
	display: block;
}

.search > .result > ul > li {
	margin: 0px 0px 0px .25em;
	padding: 0.125em 0px;
}

</style>
