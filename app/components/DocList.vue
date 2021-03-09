<template lang="pug">

	div(:class="[ 'docs', $route.meta.kind ]")
		div(class="toolbar py-3")
			//btn-group-sm
			div(class="btn-group" role="group" aria-label="")
				button(@mouseup="createDoc" class="btn btn-primary")
					| +

		List(
			:key="modelKey"
			class="list list-unstyled"
			v-model="model"
			v-slot:default="props"
			@open="editDoc"
		)
			MDoc(:oid="props.item._id" :key="props.item.key")

		router-view(:key="$route.fullPath" @update="updateDoc")/

</template>

<style>

.m-doc {
	cursor: pointer;
}

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
			var flag = true

			//console.log('* <DocList.vue> on updateDoc', doc)

			this.model.forEach(item => {
				if (item._id === doc._id) {
					const ts = new Date(doc.mtime).getTime()
					const key = `${doc._id}-${ts}`
					flag = false
					item.key = key
					//console.log('* <DocList.vue>', item.key, '>', key)
				}
			})

			if (flag) {
				this.updateModel()
			}
		},

		createDoc() {
			const kind = this.$route.meta.kind
			//console.log('<DocList.vue> on createDoc')
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

		updateModel () {
			const kind = this.$route.meta.kind

			this.$http
			.get(`doc/list/${kind}`)
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
