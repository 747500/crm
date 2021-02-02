
<template>
	<div class="person-list">
		<ul>
			<li class="create">
				<router-link :to="{ name: 'person_edit', params: { id: 'new' }}">
					<div>Новая запись</div>
				</router-link>
			</li>
			<li
				v-for="p in list"
				v-bind:class="{ 'strike': p.status }"
				v-bind:key="p._id">
				<router-link :to="{ name: 'person_edit', params: { id: p._id}}">
					<div>{{ p.lastName }} {{ p.firstName }} {{ p.middleName }}</div>
				</router-link>
			</li>
		</ul>
	</div>
</template>

<style>

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
		name: 'person',
		model: {
			prop: 'list'
		},
		props: {
			list: Array
		}
	};

</script>
