<template>
	<div>
		<span>select owner</span>
		<input type="button" @click="openFind" value="Find" />
		<div>
			<!-- input type="text" v-model="$props.ownerId"/ -->
			<input type="text" :value="getOwnerId"/>
		</div>
		<!-- pre>{{ ownerId }}</pre -->
	</div>
</template>

<script>
export default {

	name: 'SelectOwner',

	//model: {
	//	prop: 'ownerId'
	//},

	props: {
		ownerId: String
	},

	data () {
		return {
			model: 'initial'
		}
	},

	created () {

		this.model = this.$props.ownerId

		console.log('<SelectOwner.vue> created', this)
	},

	computed: {
		getOwnerId () {
			return this.$props.ownerId
		}
	},
	methods: {
		openFind () {

			console.log('<SelectOwner.vue> openFind', this)

		}
	}

}
</script>
