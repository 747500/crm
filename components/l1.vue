
<template>
	<div>
		<raw-view>{{ $data }}</raw-view>
		<hr>

		<h1>{{ message }}</h1>

		<input type="text" v-model="message" />
	</div>
</template>


<script>

	export default {
		data: function () {
			return  {
				message: "Yo!"
			}
		},
	};

</script>
