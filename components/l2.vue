
<style>
	.strike {
		text-decoration: line-through;
	}
</style>

<template id="l2">
	<div>
		<raw-view>{{ $data }}</raw-view>
		<hr>
		<ul>
			<li
				v-for="bear in bearsOrdered"
				v-bind:class="{ 'strike': bear.status }"
				v-bind:key="bear.name + bear.age">{{ bear.name }}, {{ bear.age }}</li>
		</ul>
	</div>
</template>

<script>

	export default {
		template: '#l2',
		data: function () {
			return {
				bears: [
					{
						name: 'Гризли',
						age: 10,
						status: false
					},
					{
						name: 'Бурый',
						age: 7,
						status: false
					},
					{
						name: 'Белый',
						age: 19,
						status: false
					},
					{
						name: 'Панда',
						age: 3,
						status: true
					}
				]
			}
		},
		computed: {
			bearsOrdered: function () {
				return _.orderBy(this.bears, 'age', 'name');
			}
		}
	};

</script>
