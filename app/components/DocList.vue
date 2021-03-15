<template lang="pug">

	div(:class="[ 'docs', $route.meta.kind ]")
		div(class="toolbar py-3")
			div(class="btn-group" role="group" aria-label="")
				button(@mouseup="createDoc" class="btn btn-primary")
					| +

		List(
			class="list list-unstyled"
			v-model="model"
			v-slot:default="props"
		)
			MDoc(
				:oid="props.item._id"
				:key="props.item.key"
				@open="editDoc"
				@mouseover="onMouseover"
				@mouseout="onMouseout"
			)

		router-view(:key="$route.fullPath" @update="updateModel")/

</template>

<style>

.docs {
	max-width: 800px;
}

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
		}
	},

	beforeRouteEnter (to, from, next) {
		next(vm => {
			vm.initModel(to, from)
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

		onMouseover (event) {
			event.target.classList.add('border-primary')
		},

		onMouseout (event) {
			event.target.classList.remove('border-primary')
		},

		itemKey (item) {
			const ts = new Date(item.mtime).getTime()
			return `${item._id}-${ts}`
		},

		updateModel(doc) {
			var flag = true

			//console.log('* <DocList.vue> on updateDoc', doc)

			this.model.forEach(item => {
				if (item._id === doc._id) {
					flag = false
					item.key = this.itemKey(doc)
				}
			})

			if (flag) { // append if not updated
				this.model.unshift({
					_id: doc._id,
					key: this.itemKey(doc),
				})
			}
		},

		createDoc() {
			this.$router.push({
				name: this.$route.meta.kind
			})
		},

		editDoc(item) {
			const kind = this.$route.meta.kind
			// console.log('<DocList.vue> on editDoc', item)

			this.$router.push({
				path: `${kind}/${item._id}`
			})
		},

		initModel () {
			const kind = this.$route.meta.kind

			this.$http
			.get(`doc/list/${kind}`)
			.then(response => {
				this.model = response.body.map(item => {
					return {
						_id: item._id,
						key: this.itemKey(item),
					}
				})
			})
			.catch(err => {
				console.error(err)
			})

		},

	}
}

</script>
