
<template id="l1">
	<div>
		<raw-view>{{ $data }}</raw-view>
		<hr>

		<h1>{{ message }}</h1>

		<input type="text" v-model="message" />
	</div>
</template>


<script>

	export default {
		template: '#l1',
		data: function () {
			return  {
				message: "Yo!"
			}
		},
	};

</script>
