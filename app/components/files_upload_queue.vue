
<template>

	<div v-if="queue.length > 0" class="queue list" style="margin: 1em;">
		<div class="item" v-for="(task, n) in queue" :key="task.key">
			<div class="img">
				<iimg :src="task.file" />
			</div>
			<div class="text">
				<div>{{ task.file.name }}</div>
				<div>{{ task.file.size }}</div>
				<div v-if="task.file_id">{{ task.file_id }}</div>
				<div v-if="task.p">{{ task.p }}</div>
				<div><input type="text" v-model="task.caption"/></div>
				<div class="tools">
					<a href="" @click.prevent="() => { removeEl(n) }">Убрать...</a>
				</div>
			</div>
		</div>
	</div>

</template>

<script>

import iimg from './iimg.vue'

export default {
	name: 'fileUploadQueue',
	components: {
		iimg
	},
	model: {
		prop: 'queue',
		event: 'done'
	},
	props: {
		queue: Array
	},
	data () {
		return {

		}
	},
	methods: {
		removeEl (n) {
			this.$emit('removeEl', n)
		}

	}
}

</script>
