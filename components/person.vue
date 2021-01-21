

<template>
	<div>
		<ul>
			<li
				v-for="p in person"
				v-bind:class="{ 'strike': !p.status }"
				v-bind:key="p.id">
				<div>{{ p.lastName }}</div>
				<div>{{ p.firstName }}</div>
				<router-link :to="{ name: 'person_edit', params: { id: p.id }}">тык</router-link>
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
	created () {
		setTimeout(() => {

			this.person.push({
				id: 1,
				firstName: 'Иван',
				lastName: 'Петров',
				status: true
			})

		}, 250);
	}
};

</script>
