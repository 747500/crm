<template>


	<div class="doc">

		<div class="doc-list">
			<component :is="kind" v-model="list"></component>
		</div>

		<div class="doc-view">
			<!-- header>
				<header>
					<button class="button-close" @click="closeHandler">
						&lt;&lt;
					</button>
					<hr/>
				</header>
			</header -->

			<router-view :key="$route.fullPath"></router-view>
		</div>

	</div>

</template>

<style>

.doc {
	display: flex;
	margin: 0;
}

.doc-list {
	flex: 10;
	border-left: 1px solid gray;
}

.doc-view {
	flex: 20;
	border-left: 1px solid gray;
}

</style>

<script>

import person from './person.vue'
import property from './property.vue'
import contract from './contract.vue'

export default {
	name: 'doc',

	components: {
		person,
		property,
		contract
	},

	data () {
		return  {
			kind: null,
			list: []
		}
	},

	on: {
		listChange (event) {
			console.log('<doc.vue> on listChange', event)
		}
	},

	beforeRouteEnter (to, from, next) {
		next(vm => {
			vm.updateModel(to, from)
		})
	},
	beforeRouteUpdate (to, from, next) {
		this.$nextTick(() => {
			this.updateModel(to, from)
		})
		next()
	},

	created () {
		this.kind = this.$route.path.split('/')[1]
	},
	methods: {
		updateModel () {
			// magic
			this.kind = this.$route.path.split('/')[1]

			this.$http.get(`/list/${this.kind}`)
			.then(response => {
				console.log('<doc> response', response.body)
				this.list = response.body
			})
			.catch(err => {
				console.error(err)
			})

		},
		closeHandler () {
			//this.$router.push({ name: 'person' })
			this.$router.push('.')
		}
	}
}

</script>
