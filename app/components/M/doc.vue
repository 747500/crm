<template lang="pug">

	component(
		:is="kindSchema"
		:model="model"
		:id="model._id"
		:class="[ 'm-doc', model.kind, 'mb-3' ]"
		@click="() => $emit('open', model)"
		v-on="$listeners"
	)/

</template>

<script>

import bsCard from '../bs/Card.vue'
import bsCardHeader from '../bs/CardHeader.vue'

import MPerson from './person.vue'
import MProperty from './property.vue'
import MContract from './contract.vue'


const KindSchema = {
	person: 'MPerson',
	property: 'MProperty',
	contract: 'MContract',
}

export default {

	name: 'doc',

	components: {
		bsCard,
		bsCardHeader,
		MPerson,
		MProperty,
		MContract,
	},

	props: {
		oid: String
	},

	data () {
		return {
			model: {},
		}
	},

	created () {

		const docId = this.$props.oid

		if (!docId) {
			return
		}

		this.$http
		.get(`doc/${docId}`)
		.then(response => {
			//console.log(response.body)
			this.model = response.body
		})
		.catch(console.error)

	},

	computed: {
		kindSchema () {
			//console.log('kindSchema', KindSchema[this.model.kind])
			return KindSchema[this.model.kind]
		},
	},

	methods: {

	}
}
</script>

<style>

.m-doc * {
     pointer-events: none;
}

/*
.m-doc {
	display: flex;
	height: 9rem;
	overflow: hidden;
}
*/

/*
.m-doc .mainPicture {
	flex: 0 0 9rem;
	width: 9rem;
	height: 9rem;
	overflow: hidden;
	border-right: 1px solid var(--border-color);
}
*/


/*** Square magic begin ***/
.m-doc .m-picture {
	width: 100%;
	position: relative;
	overflow: hidden;
	padding-bottom: 100%;
}

.m-doc .m-picture > * {
	object-fit: cover;
	width: 100%;
	height: 100%;
	position: absolute;
}
/*** Square magic end ***/


</style>
