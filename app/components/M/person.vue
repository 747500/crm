<template>
	<div class="m-person">
		<div class="names">
		{{ person.lastName }}
		{{ person.firstName }}
		{{ person.middleName }}
		</div>
		<div class="contacts">
			<div v-for="c in person.contact" :key="c._id">
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
		person: Object
	}
}

</script>

<style>
.m-person {
	display: flex;
}

.m-person .names {
	flex: 1;
}

.m-person .contacts {
	flex: 1;
}

</style>
