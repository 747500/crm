<template lang="pug">

	div(
		:id="model._id"
		:key="model._id"
		:class="[ 'm-doc', model.kind ]"
		v-on="$listeners.open ? { click: () => $emit('open', model._id) } : {}"
	)
		div(
			v-for="(s) in kindSchema"
			:key="s.model"
			:class="s.model"
		)
			// v-if="model[s.model]"
			component(
				:is="s.component"
				:model="'contract' == s.model ? model : model[s.model]"
				:placeholder="s.placeholder"
			)/

</template>

<script>

import MPicture from './picture.vue'
import MPerson from './person.vue'
import MProperty from './property.vue'
import MContract from './contract.vue'

const KindSchema = {
	person: [
		{
			model: 'mainPicture',
			component: 'MPicture',
			placeholder: '👤',
		},
		{
			model: 'person',
			component: 'MPerson',
		},
	],
	property: [
		{
			model: 'mainPicture',
			component: 'MPicture',
		},
		{
			model: 'property',
			component: 'MProperty',
		},
		{
			model: 'owner',
			component: 'MPerson',
		},
	],
	contract: [
		{
			model: 'contract',
			component: 'MContract',
			icon: '📄'
		}
	],
}

import async from 'async'

import Person from './person.vue'
import Property from './property.vue'
import Contract from './contract.vue'

export default {

	name: 'doc',

	components: {
		MPicture,
		MPerson,
		MProperty,
		MContract,
	},

	props: {
		oid: String
	},

	data () {
		return {
			model: {}
		}
	},

	created () {
		const docId = this.$props.oid

		if (!docId) {
			return
		}

		this.$http
		.get(`/doc/${docId}`)
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
		}
	},

	methods: {

	}
}
</script>

<style>

.m-doc {
	display: flex;
	height: 9rem;
	overflow: hidden;
}

.m-doc .mainPicture {
	flex: 0 0 9rem;
	width: 9rem;
	height: 9rem;
	overflow: hidden;
	border-right: 1px solid var(--border-color);
}

.m-doc .property {
	margin: 0 0.5rem;
	flex: 3;
}

.m-doc .owner {
	margin: 0 0.5rem;
	flex: 4;
}

.m-doc .person {
	margin: 0 0.5rem;
	flex: auto;
}

.m-doc .mainPicture img {
	object-fit: cover;
	width: 9rem;
	height: 9rem;
}

.m-doc .mainPicture .placeholder {
	line-height: 1.5em;
	font-size: 6rem;
	text-align: center;
	display: block;
}

.m-doc .m-person {
	display: flex;
}

.m-doc .m-person > * {
	flex: 1;
}

</style>
