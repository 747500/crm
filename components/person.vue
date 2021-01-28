
<template>
	<div class="person">

		<div class="person-list">
			<ul>
				<li class="create">
					<router-link :to="{ name: 'person_edit', params: { id: 'new' }}">
						<div>Новая запись</div>
					</router-link>
				</li>
				<li
					v-for="p in person"
					v-bind:class="{ 'strike': p.status }"
					v-bind:key="p._id">
					<router-link :to="{ name: 'person_edit', params: { id: p._id }}">
						<div>{{ p.lastName }} {{ p.firstName }} {{ p.middleName }}</div>
					</router-link>
				</li>
			</ul>
		</div>

		<div class="person-edit">
			<router-view></router-view>
		</div>

	</div>
</template>

<style>

.person {
	display: flex;
	border: 1px solid gray;
	margin: 0;
	padding: 0;
}

.person-list {
	flex: 10;
	border: 1px dotted gray;
}

.person-edit {
	flex: 20;
	padding: 1em;
	border: 1px dotted gray;
}

</style>

<script>

	export default {
		data () {
			return  {
				person: [
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
				this.$http.get('/person/list').then((response) => {
					this.person = Object.assign({}, response.body)
				}).catch((err) => {
					console.error(err)
				})
			}
		}
	};

</script>
