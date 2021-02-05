
<template>
	<div class="contract">

		<div class="contract-list">
			<ul>
				<li class="create">
					<router-link :to="{ name: 'contract_edit', params: { id: 'new' }}">
						<div>Новая запись</div>
					</router-link>
				</li>
				<li
					v-for="p in list"
					v-bind:key="p._id">
					<router-link :to="{ name: 'contract_edit', params: { id: p._id }}">
						<div>{{ p.title }}</div>
					</router-link>
				</li>
			</ul>
		</div>

	</div>
</template>

<style>

.contract-list ul {
	margin-top: 0;
	margin-bottom: 0;
	padding-top: 0.33em;
	padding-bottom: 0.33em;
}

.contract-list li {
	padding-top: .33em;
	padding-bottom: .33em;
}

.contract-list li.create {
	list-style-type: circle;
}

</style>

<script>

	export default {
		name: 'contract',
		model: {
			prop: 'list'
		},
		props: {
			list: Array
		}
	};

</script>
