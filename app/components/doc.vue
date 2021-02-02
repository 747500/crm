<template>


	<div class="doc">

		<component class="doc-list" :is="kind" v-model="list"></component>

		<router-view class="doc-view" :key="$route.fullPath"></router-view>

	</div>

</template>

<style>

.doc {
	display: flex;
	margin: 0;
	padding: 0;
}

.doc-list {
	flex: 10;
}

.doc-view {
	flex: 20;
	border: left 1px solid gray;
}

</style>

<script>

import person from './person.vue'

export default {
	name: 'doc',

	components: {
		person
	},

	data () {
		return  {
			kind: null,
			list: []
		}
	},
	beforeRouteEnter (to, from, next) {
		next(vm => {
			vm.updateModel()
		})
	},
	beforeRouteUpdate (to, from, next) {
		this.$nextTick(() => {
			this.updateModel()
		})
		next()
	},

	created () {
		this.kind = this.$route.path.split('/')[1]
	},
	methods: {
		updateModel () {

			this.$http.get(`/list/${this.kind}`).then((response) => {
				console.log('<doc> response', response.body)
				this.list = response.body
			}).catch((err) => {
				console.error(err)
			})

		}
	}
}

</script>
