<template>

	<div class="browser">

		<div class="query">
			<input
				ref="search"
				v-model="search"
				type="text"
				@keyup.enter="searchInput"
				/>
				<!-- @input="searchInput" -->
		</div>

		<div class="list">
			<browserList v-model="result" v-slot:default="sp">
				<div class="item">
					<pre>{{ sp }}</pre>
				</div>
			</browserList>
		</div>

	</div>

</template>

<style>

.browser .query {
	padding: 3em;
	text-align: center;
}

.browser .list .item pre {
	margin: 1em 0;
	padding: 1em;
	border: 1px solid gray;
	border-radius: 1em;
}

</style>

<script>

import browserList from './browser_list.vue'

export default {
	name: 'browser',
	components: {
		browserList
	},
	data () {
		return {
			search: '',
			result: []
		}
	},
	methods: {

		searchInput (event) {
			console.log(this.search, event)

			this.$http.post('/s', { q: this.search })
			.then(response => {
				this.result = response.body
				console.log('+++++', this.result.length)
			})
			.catch(err => {
				console.error(err)
			})
		},

	}
}

</script>
