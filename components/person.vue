

<template id="person">
	<div>
		<div>Person list</div>
		<ul>
			<li
				v-for="p in person"
				v-bind:class="{ 'strike': !p.status }"
				v-bind:key="p.id">
				<div>{{ p.lastName }}</div>
				<div>{{ p.firstName }}</div>
			</li>
		</ul>

	</div>
</template>

<script>

export default {
	template: 'person',
	data: function () {
		return  {
			person: [
				{
					id: 1,
					firstName: 'Иван',
					lastName: 'Петров',
					status: true
				}
			]
		}
	},
};

</script>
