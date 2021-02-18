<template>
	<div class="m-person">

		<div class="icon" v-if="$props.icon">
			&#x1F464;
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

export default {
	name: 'MPerson',
	props: {
		model: Object,
		icon: Boolean,
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

</style>
