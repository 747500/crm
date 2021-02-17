<template>


	<div>

		<component
			:is="kind"
			v-model="list"
			@create="createDoc"
			@open="openDoc"
			@edit="editDoc"
			@remove="removeDoc"/>

		<router-view :key="$route.fullPath" /><!-- /router-view -->

	</div>

</template>

<style>


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

		createDoc() {
			console.log('<doc.vue> on createDoc')
			this.$router.push({
				path: `${this.kind}/new`
			})
		},

		editDoc(item) {
			console.log('<doc.vue> on editDoc', item)
			this.$router.push({
				path: `${item.kind}/${item._id}`
			})
		},

		removeDoc(item) {
			console.log('<doc.vue> on removeDoc', item)
		},

		openDoc (item) {
			console.log('<doc.vue> on removeDoc', item)
			/*
			item.extendedView = !item.extendedView
			this.list = [ ...this.list]
			*/
		},

		updateModel () {
			// magic
			this.kind = this.$route.path.split('/')[1]

			this.$http
			.get(`/list/${this.kind}`)
			.then(response => {
				//console.log('<doc> response', response.body)
				this.list = response.body

				return Promise.allSettled(
					this.list
					.filter(item => {
						item.extendedView = false
						return item.ownerId && item.ownerId.length
					})
					.map(item => this.$http.get(`/doc/${item.ownerId}`)
							.then(response => {
								item.ownerId = response.body
							})
					)
				)
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
