<template>

	<div>

		<List
			:key="modelKey"
			class="list"
			v-model="model"
			v-slot:default="props"
			@create="createDoc"
			@open="openDoc"
			@edit="editDoc"
			@remove="removeDoc"
			>

			<MDoc :oid="props.item" :schema="options" />

		</List>

		<router-view :key="$route.fullPath" />

	</div>

</template>

<style>


</style>

<script>

import List from './List.vue'
import MDoc from './M/doc.vue'

export default {
	name: 'doc',

	components: {
		List,
		MDoc,
		//person,
		//property,
		//contract
	},

	data () {
		return  {
			kind: null,
			model: [],
			modelKey: null,
			options: {
				person: {
					icon: false,
					image: true
				},
				property: {
					icon: false,
					image: true,
					person: {
						icon: false,
						image: false,
					}
				},
				contract: {
					icon: false,
					image: false
				},
			},
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
				path: `${this.kind}/${item}`
			})
		},

		removeDoc(item) {
			console.log('<doc.vue> on removeDoc', item)
		},

		openDoc (item) {
			console.log('<doc.vue> on openDoc', item)
		},

		updateModel () {
			// magic
			this.kind = this.$route.path.split('/')[1]

			this.$http
			.get(`/list/${this.kind}`)
			.then(response => {
				this.modelKey = Date.now()
				this.model = response.body.map(item => {
					return item._id
				})
			})
			.catch(err => {
				console.error(err)
			})

		},

		closeHandler () {
			this.$router.go(-1) //push('.')
		}
	}
}

</script>
