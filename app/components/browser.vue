<template>

	<div class="browser">

		<div class="query">
			<div>
				<input
					ref="search"
					v-model="search"
					type="text"
					@keyup.enter="searchInput"
					@input="searchInput"
					/><input type="button" value="🔍" @click="searchInput"/>
			</div>

			<!-- div>
				<label>
					Люди
					<input v-model="kinds" type="checkbox" name="kind" value="person" checked />
				</label>

				<label>
					Собственность
					<input v-model="kinds" type="checkbox" name="kind" value="property" checked />
				</label>

				<label>
					Сделки
					<input v-model="kinds" type="checkbox" name="kind" value="contract" checked />
				</label>
			</div -->

			<div>
				<span>{{ result.length }} results found</span>
			</div>
		</div>

		<div class="result">
			<browserList class="list" v-model="result" v-slot:default="props">
				<div class="item">
					<doc :oid="props.item.attrs.oid" />
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

.browser .list .item {
	margin: 1em 0;
	padding: 1em;
	border: 1px solid gray;
	border-radius: 1em;
}

</style>

<script>

import browserList from './browser_list.vue'

import doc from './M/doc.vue'

export default {
	name: 'browser',
	components: {
		browserList,
		doc
	},
	data () {
		return {
			kinds: [],
			search: '',
			result: [],
			slotProps: { a: 'b' }
		}
	},
	created () {
		this.searchInput()
	},
	methods: {

		searchInput () {
			this.result = []

			this.$http.post('/s',
				{
					q: this.search,
					kind: this.kinds
				}
			)
			.then(response => {

				console.log('+++++', response)

				this.result = response.body
			})
			.catch(err => {
				console.error(err)
			})
		},

	}
}

</script>
