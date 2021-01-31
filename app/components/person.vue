
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

		<div class="person-data">
			<router-view key="person-data"></router-view>
		</div>

	</div>
</template>

<style>

.person {
	display: flex;
	margin: 0;
	padding: 0;
}

.person-data {
	flex: 20;
	border: left 1px solid gray;
}

.person-list {
	flex: 10;
}

.person-list ul {
	border-left : 1px solid gray;
	margin-top: 0;
	margin-bottom: 0;
	padding-top: 0.33em;
	padding-bottom: 0.33em;
}

.person-list li {
	padding-top: .33em;
	padding-bottom: .33em;
}

.person-list li.create {
	list-style-type: circle;
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
		mounted () {
		},
		methods: {
			updateModel () {
				this.$http.get('/person/list').then((response) => {
					this.person = Object.assign({}, this.person, response.body)
				}).catch((err) => {
					console.error(err)
				})
			}
		}
	};

</script>
