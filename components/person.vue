
<template>
	<div>

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

		<div>
			<router-view></router-view>
		</div>

	</div>
</template>

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
				this.$http.get('/person').then((response) => {
					this.person = Object.assign({}, response.body)
				}).catch((err) => {
					console.error(err)
				})
			}
		}
	};

</script>
