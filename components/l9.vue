
<template>
	<div>
		<raw-view>{{ $data }}</raw-view>
		<hr>
		<input type="text" v-model="message" @keyup.enter="saveMessage" />
		<div>
			<pre><slot></slot></pre>
		</div>

	</div>
</template>


<script>

	export default {
		data: function () {
			return {
				message: ''
			}
		},
		methods: {
			saveMessage: function (event) {
				this.$emit('message-saved', this.message);
				this.message = '';
			}
		}
	};

</script>
