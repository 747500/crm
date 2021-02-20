<template>
	<div class="m-person">

		<div class="icon" v-if="options.icon">
			&#x1F464;
		</div>

		<div class="picture" v-if="options.image">
			<oidImage  v-if="model.mainPicture" :oid="model.mainPicture" />
		</div>

		<div class="names">
			{{ model.lastName }}
			{{ model.firstName }}
			{{ model.middleName }}
		</div>

		<div class="contacts">
			<div v-for="c in model.contact" :key="c._id">
				{{ c.data }}
				<span v-if="c.description">({{ c.description }})</span>
			</div>
		</div>
	</div>
</template>

<script>

	import oidImage from '../oidImage.vue'

	export default {
		name: 'MPerson',

		components: {
			oidImage
		},

		props: {
			model: Object,
			schema: Object,
		},

		data () {
			return {
				options: this.$props.schema
			}
		}
	}

</script>

<style>
.m-person {
	display: flex;
}

.m-person .icon {
	flex: 1;
}

.m-person .names {
	flex: 10;
}

.m-person .contacts {
	flex: 10;
}

.m-person .picture img {
	width: 9em;
	height: 9em;
	object-fit: cover;
}

</style>
