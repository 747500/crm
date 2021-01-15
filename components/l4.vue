
<template id="l4">
	<div>
		<raw-view>{{ $data }}</raw-view>
		<hr>
		<form>
			<span>{{ count }} / 30</span><br>
			<textarea v-model="text"></textarea><br>
			<button v-if="count <= 30" type="button">тыдыщщ</button>
		</form>
	</div>
</template>

<script>

	export default {
		template: '#l4',
		data: function () {
			return  {
				text: ''
			}
		},
		computed: {
			count: function () {
				return this.text.length;
			}
		}
	};

</script>
