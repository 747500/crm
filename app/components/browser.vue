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
			<List
				class="list"
				v-model="result"
				v-slot:default="props"
				@open="openDoc"
				>
				<!--
				@edit="(doc) => $emit('edit', doc)"
				@remove="(doc) => $emit('remove', doc)"
				-->

				<MDoc :oid="props.item.attrs.oid" :schema="schema" />

			</List>

		</div>

	</div>

</template>

<style>

.browser .query {
	padding: 3em;
	text-align: center;
}

.result ul.doc-list li:first-child {
	border-top: 1px solid var(--border-color);
}

</style>

<script>

import List from './List.vue'

import MDoc from './M/doc.vue'

export default {
	name: 'browser',
	components: {
		List,
		MDoc
	},
	data () {
		return {
			kinds: [],
			search: '',
			result: [],
			schema: {
				person: {
					icon: true,
					image: true,
				},
				property: {
					icon: true,
					image: true,
					person: {
						icon: false,
						image: false
					}
				},
				contract: {
					icon: true,
					image: false
				}
			}
		}
	},
	created () {
		this.searchInput()
	},
	methods: {
		openDoc (item) {
			//console.log('<browser.vue> openDoc', item)
			this.$router.push({
				path: `${item.attrs.kind}/${item.attrs.oid}`
			})
		},
		searchInput () {
			this.result = []

			this.$http.post('/s',
				{
					q: this.search,
					kind: this.kinds
				}
			)
			.then(response => {

				//console.log('<browser.vue> response:', response)

				this.result = response.body
			})
			.catch(err => {
				console.error(err)
			})
		},

	}
}

</script>
