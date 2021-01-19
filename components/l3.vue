
<template>
	<div>
		<raw-view>{{ $data }}</raw-view>
		<hr>
		<input type="text" v-model="message" @keyup.13.prevent="onClick" />

		<form action="">
			<button type="button" @click.prevent="onClick">пынь</button>
		</form>
	</div>
</template>


<script>

	export default {
		data: function () {
			return {
				message: 'Hello dear'
			}
		},
		methods: {
			onClick: function (event) {
				console.log(this.message, event.target.innerText);
			}
		}
	};

</script>
