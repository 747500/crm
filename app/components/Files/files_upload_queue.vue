
<template lang="pug">

	div
		input(
			ref="addFile"
			name="addFile"
			type="file"
			multiple
			@change="updateQueue"
			style="display: none;"
		)/

		div(
			class="btn-group btn-group-sm"
			role="group"
			aria-label="Toolbar"
		)
			bsButton(
				class="btn-secondary"
				type="file"
				name="upload"
				multiple
				@mouseup="event => this.$refs.addFile.click(event)"
			)
				| Выбрать

			bsButton(
				class="btn-primary"
				@mouseup="upload"
				:disabled="!queue.length"
			)
				| Загрузить

		div(v-if="queue.length > 0" class="list")
			div(class="item" v-for="(task, n) in queue" :key="task.key")
				div(class="img")
					iimg(:src="task.file")/

				div(class="text")
					div {{ task.file.name }}
					div {{ task.file.size }}
					div(v-if="task.file_id") {{ task.file_id }}
					div(v-if="task.p") {{ task.p }}
					div
						input(type="text" v-model="task.caption")/
					div(class="tools")
						a(href="" @click.prevent="() => { queueRemove(n) }")
							| Убрать...

</template>

<script>

import async from 'async'

import iimg from '../iimg.vue'
import bsButton from '../bs/Button.vue'

export default {
	name: 'filesUpload',
	components: {
		iimg,
		bsButton,
	},
	model: {
		prop: 'oid',
	},
	props: {
		oid: String,
	},
	data () {
		return {
			docId: null,
			queue: []
		}
	},

	created () {
		this.docId = this.$props.oid
	},

	methods: {
		queueRemove (n) {
			this.queue[n] = false;
			this.queue = this.queue.filter(v => { return v })

			if (0 === this.queue.length) {
				this.$emit('active', false)
			}

		},

		updateQueue (event) {
			const input = event.target
			const ts = Date.now().toString()
			for (let i = 0; i < input.files.length; i ++) {
				this.queue.push({
					key: ts + '_' + i,
					file: input.files[i],
					p: null
				});
			}

			this.$emit('active', true)

			input.value = null;
		},

		upload () {
			const queue = this.queue
			const docId = this.docId

			var q = async.queue((task, callback) => {

				if (!task) {
					callback();
					return;
				}

				this.$http.post(
					`f/${docId}/upload/${task.file.name}`,
					task.file,
					{
						headers: {
							'Last-Modified': task.file.lastModifiedDate.toString(),
							'X-Meta-Caption': encodeURIComponent(task.caption || ''),
							'X-Meta-Filename': encodeURIComponent(task.file.name),
							'X-Meta-Doc-Id': docId,
							'Content-Type': task.file.type
						},
						progress (e) {
							if (e.lengthComputable) {
								task.p = parseInt(e.loaded / e.total * 100, 10)
							}
						}
					}
				)
				.then(result => {
					callback()
				})
				.catch(console.error)

			}, 1);

			q.error((err, task) => {
				console.error(task, err);
			});

			q.drain(() => {
				// console.log('queue is empty')
				this.queue = []
				this.$emit('active', false)
			})

			q.push(queue);

		}

	}
}

</script>
