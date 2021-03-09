<template lang="pug">

	div(class="file" :key="model.mtime.toString()")
		div(class="content")
			div(class="img")
				oidImage(
					v-if="'image' === type0"
					:oid="model._id"
				)/
				svg(
					v-else
					viewBox="0 0 270 270"
					preserveAspectRatio="xMidYMid meet"
				)
					text(x="12" y="90" style="font-size: 90px;") {{ type0 }}
					text(x="12" y="180" style="font-size: 90px;") {{ type1 }}

				div(class="lamp") 💡

			div(class="text")
				inplaceTextEdit(
					@savetext="text => $emit('caption', text)"
					v-model="model.caption"
					label="🖉"
				)/

</template>


<script>

import oidImage from '../oidImage.vue'
import inplaceTextEdit from '../inplaceTextEdit.vue'

export default {

	name: 'FileItem',

	components: {
		oidImage,
		inplaceTextEdit,
	},

	props: {
		model: Object,
	},

	data () {
		return {
			type0: '',
			type1: '',
		}
	},

	created () {

		if (this.$props.model.contentType) {
			[ this.type0, this.type1 ] = this.$props.model.contentType.split('/')
		}

		//console.log('* File.vue created', this.type0, this.type1, this.$props)

	},
}

</script>
