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

			<div>
				<FormulateInput
					type="checkbox"
					v-model="kind"
					:options="{ person: 'Контакты', property: 'Собственность', contract: 'Сделки' }"
					@input="searchFilter"
					/>
					<!--
				<label>
					Люди
					<input v-model="kind" type="checkbox" name="kind" value="person" />
				</label>

				<label>
					Собственность
					<input v-model="kind" type="checkbox" name="kind" value="property" />
				</label>

				<label>
					Сделки
					<input v-model="kind" type="checkbox" name="kind" value="contract" />
				</label>
					-->
			</div>

			<div>
				<span>Найдено: {{ total_found }}</span>
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

				<MDoc :oid="props.item.oid" />

			</List>

		</div>

	</div>

</template>

<style>

.browser .query {
	padding: 3em;
	text-align: center;
}

.result ul.doc-list > li:first-child {
	border-top: 1px solid var(--border-color);
}

.browser .formulate-input-group {
	max-width: 50vh;
	margin: 0.5rem auto;
	display: flex;
}

.browser .formulate-input-group > div{
	margin: 0.5rem;
	flex: 1;
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
			kind: [ ],
			search: '',
			result: [],
			total_found: 0,
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
		this.searchFilter()
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
					kind: this.kind
				}
			)
			.then(response => {

				//console.log('<browser.vue> response:', response)

				this.result = response.body.result
				this.total_found = response.body.total_found
			})
			.catch(err => {
				console.error(err)
			})
		},

		searchFilter() {
			if (0 === this.kind.length) {
				this.kind = [ 'person', 'property', 'contract' ]
			}

			console.log(this.kind)
			this.searchInput()
		}

	}
}

</script>
