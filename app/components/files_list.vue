
<template>

	<div>
		<div class="item" v-for="(file, n) in files" :key="file.oid">

			<div class="img">
				<iimg :src="file.blob"/>
			</div>

			<div class="text">
				{{ file.oid }}
			</div>
		</div>
	</div>

</template>

<script>

export default {


}

</script>
