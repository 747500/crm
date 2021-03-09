<template lang="pug">

	div(
		:id="model._id"
		:class="[ 'm-doc', model.kind, 'card', 'mb-3' ]"
		v-on="$listeners.open ? { click: () => $emit('open', model._id) } : {}"
		@mouseover="onMouseover"
		@mouseout="onMouseout"
	)
		div(class="card-header") Header

		div(class="row g-0")
			component(
				v-for="(s) in kindSchema"
				:key="s.model"
				:class="s.class"
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
import SPerson from '../S/person.vue'

const KindSchema = {
	person: [
		{
			model: 'mainPicture',
			component: 'MPicture',
			class: 'col-md-3',
		},
		{
			model: 'person',
			component: 'MPerson',
			class: 'col-md-9',
		},
	],
	property: [
		{
			model: 'mainPicture',
			component: 'MPicture',
			class: 'col-md-3',
		},
		{
			model: 'property',
			component: 'MProperty',
			class: 'col-md-4',
		},
		{
			model: 'owner',
			component: 'SPerson',
			class: 'col-md-5',
		},
	],
	contract: [
		{
			model: 'contract',
			component: 'MContract',
			icon: '📄',
			class: 'col-md-12',
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
		SPerson,
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
		}
	},

	methods: {

		onMouseover (event) {
			event.target.classList.add('border-primary')
		},

		onMouseout (event) {
			event.target.classList.remove('border-primary')
		},
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
