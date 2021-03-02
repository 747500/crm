<template lang="pug">

	div

		List(
			:key="modelKey"
			class="list"
			v-model="model"
			v-slot:default="props"
			@create="createDoc"
			@open="openDoc"
			@edit="editDoc"
			@remove="removeDoc"
		)
			MDoc(:oid="props.item._id" :key="props.item.key")

		router-view(:key="$route.fullPath" @update="updateDoc")/

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
	},

	data () {
		return  {
			model: [],
			modelKey: null,
		}
	},

	on: {
		listChange (event) {
			console.log('<DocList.vue> on listChange', event)
		},
	},

	beforeRouteEnter (to, from, next) {
		next(vm => {
			vm.updateModel(to, from)
		})
	},

	/*
	beforeRouteUpdate (to, from, next) {
		next()
	},
	*/

	created () {
		// this.kind = this.$route.path.split('/')[1]
	},

	methods: {

		updateDoc(doc) {
			console.log('<DocList.vue> on updateDoc', doc)
			var flag = true
			this.model.forEach(item => {
				if (item._id === doc._id) {
					const ts = new Date(doc.mtime).getTime()
					const key = `${doc._id}-${ts}`
					flag = false
					item.key = key
				}
			})

			if (flag) {
				this.updateModel()
			}
		},

		createDoc() {
			const kind = this.$route.meta.kind
			console.log('<DocList.vue> on createDoc')
			this.$router.push({
				path: `${kind}/new`,
				props: {
					model: kind
				}
			})
		},

		editDoc(item) {
			const kind = this.$route.meta.kind
			// console.log('<DocList.vue> on editDoc', item)

			this.$router.push({
				path: `${kind}/${item._id}`
			})
		},

		removeDoc(item) {
			console.log('<DocList.vue> on removeDoc', item)
		},

		openDoc (item) {
			console.log('<DocList.vue> on openDoc', item)
		},

		updateModel () {
			const kind = this.$route.meta.kind

			this.$http
			.get(`/list/${kind}`)
			.then(response => {
				this.modelKey = Date.now()
				this.model = response.body.map(item => {
					const ts = new Date(item.mtime).getTime()
					return {
						_id: item._id,
						key: `${item._id}-${ts}`,
					}
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
