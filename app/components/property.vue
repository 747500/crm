
<template>
	<div class="property">

		<div class="property-list">
			<ul>
				<li class="create">
					<router-link :to="{ name: 'property_edit', params: { id: 'new' }}">
						<div>Новая запись</div>
					</router-link>
				</li>
				<li
					v-for="p in property"
					v-bind:class="{ 'strike': p.status }"
					v-bind:key="p._id">
					<router-link :to="{ name: 'property_edit', params: { id: p._id }}">
						<div>{{ p.address }}</div>
					</router-link>
				</li>
			</ul>
		</div>

		<div class="property-data">
			<router-view></router-view>
		</div>

	</div>
</template>

<style>

.property {
	display: flex;
	margin: 0;
	padding: 0;
}

.property-data {
	flex: 20;
	border: left 1px solid gray;
}

.property-list {
	flex: 10;
}

.property-list ul {
	border-left : 1px solid gray;
	margin-top: 0;
	margin-bottom: 0;
	padding-top: 0.33em;
	padding-bottom: 0.33em;
}

.property-list li {
	padding-top: .33em;
	padding-bottom: .33em;
}

.property-list li.create {
	list-style-type: circle;
}

</style>

<script>

	export default {
		data () {
			return  {
				property: [
				]
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
		},
		methods: {
			updateModel () {
				this.$http.get('/list/property').then((response) => {
					console.log(response.body)
					this.property = Object.assign({}, response.body)
				}).catch((err) => {
					console.error(err)
				})
			}
		}
	};

</script>
