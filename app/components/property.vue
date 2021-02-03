
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
					v-for="p in list"
					v-bind:key="p._id">
					<router-link :to="{ name: 'property_edit', params: { id: p._id }}">
						<div>{{ p.address }}</div>
					</router-link>
				</li>
			</ul>
		</div>

	</div>
</template>

<style>

.property-list ul {
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
		name: 'property',
		model: {
			prop: 'list'
		},
		props: {
			list: Array
		}
	};

</script>
