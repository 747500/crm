<template lang="pug">

	div(
		:id="model._id"
		:key="model._id"
		:class="[ 's-doc', model.kind, { 'clickable': $listeners.open } ]"
		v-on="$listeners.open ? { click: onClick } : {}"
	)

		div(
			v-for="(s) in kindSchema"
			:key="s.model"
			:class="s.model"
		)
			component(
				:is="s.component"
				:model="'contract' == s.model ? model : model[s.model]"
				:placeholder="s.placeholder"
				)/

</template>

<script>

import SPicture from './picture.vue'
import SPerson from './person.vue'
//import SProperty from './property.vue'
//import SContract from './contract.vue'

const KindSchema = {
	person: [
		{
			model: 'mainPicture',
			component: 'SPicture',
			placeholder: '👤',
		},
		{
			model: 'person',
			component: 'SPerson',
		},
	],
	property: [
		{
			model: 'mainPicture',
			component: 'SPicture',
		},
		{
			model: 'property',
			component: 'SProperty',
		},
		{
			model: 'owner',
			component: 'SPerson',
		},
	],
	contract: [
		{
			model: 'contract',
			component: 'SContract',
			icon: '📄'
		},
		{
			model: 'mainPicture',
			component: 'SPicture',
		},
	],
}

export default {

	name: 'doc',

	components: {
		SPicture,
		SPerson,
		//SProperty,
		//SContract,
	},

	props: {
		oid: String,
		schema: Object,
	},

	data () {
		return {
			model: {},
			options: this.$props.schema
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
		onClick (event) {
			event.preventDefault()
			//console.log('* <S/doc.vue> onClick', event)
			this.$emit('open', this.model)
		},
	}
}
</script>

<style>

.s-doc {
	display: flex;
	height: 6rem;
	overflow: hidden;
}

.s-doc.clickable {
	cursor: pointer;
}

.s-doc .mainPicture {
	flex: initial;
	width: 6rem;
	height: 6rem;
	overflow: hidden;
	border-right: 1px solid var(--border-color);
}

.s-doc .property {
	margin: 0 0.5rem;
	flex: 3;
}

.s-doc .owner {
	margin: 0 0.5rem;
	flex: 4;
}

.s-doc .person {
	margin: 0 0.5rem;
	flex: auto;
}

.s-doc .mainPicture img {
	object-fit: cover;
	width: 6rem;
	height: 6rem;
}

.s-doc .mainPicture .placeholder {
	line-height: 1.5em;
	font-size: 4rem;
	text-align: center;
	display: block;
}

.s-doc .mainPicture .placeholder:hover {
	text-decoration: none;
}

</style>
