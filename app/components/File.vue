<template lang="pug">

	div(class="file" :key="model.lastModified.toString()")
		div(class="content")
			div(class="img")
				iimg(:src="model.blob")/
				div(class="lamp") 💡

			div(class="text")

				// div(class="oid") {{ file._id }}
				// div(style="width: 95%; overflow: hidden;") {{ file.name }}
				// div {{ new Date(file.lastModified).toLocaleString() }}
				// div {{ file.size }}

				inplaceTextEdit(
					@savetext="text => $emit('caption', text)"
					v-model="model.caption"
					label="🖉"
				)/

		slot(name="toolbar")

</template>


<script>

import iimg from './iimg.vue'
import inplaceTextEdit from './inplaceTextEdit.vue'

export default {

	name: 'File',

	components: {
		iimg,
		inplaceTextEdit,
	},

	props: {
		model: Object,
	},

	created () {
		console.log('* File.vue created')
	},
}

</script>
