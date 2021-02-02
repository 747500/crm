<template>
	<div class="person-edit">

		<header>
			<input
		        type="button"
		        label="&lt;&lt;"
		        class="button-close"
		        @click="closeHandler"
		    	/>
			<hr/>
		</header>

		<div class="person">
			<div class="edit-form">
				<personEditForm
					:oid="docId"
					/>
			</div>

			<div class="edit-upload">
				<span>Файлы:</span>

				<input
					ref="addFile"
					name="addFile"
					type="file"
					multiple
					@change="updateQueue"
					style="display: none;"
					:disabled="!docId"
					/>

				<button
					type="file"
					name="upload"
					multiple
					@click="(event) => this.$refs.addFile.click(event)"
					:disabled="!docId"
					>Выбрать</button>

				<button
					@click="upload"
					:disabled="!queue.length"
					>Загрузить</button>

				<fileUploadQueue
					class="queue list"
					v-if="queue.length > 0"
					:queue="queue"
					@removeEl="queueRemoveEl"
					/>

				<hr>
				<filesList
					class="files list"
					v-if="queue.length == 0"
					:oid="docId"
					/>

			</div>

		</div>
	</div>
</template>

<style>

img {
	display: block;
}

.person-edit {
	padding: 0.5em;
	border-left: 1px solid gray;
}

.person-edit .person {
	display: flex;
	margin: 0;
	padding: 0;
	width: 100%;
}

.person-edit .person > div {
	padding: 0.5em;
}

.person-edit .person .edit-form {
	flex: 10;
}

.person-edit .person .edit-upload {
	flex: 20;
}

.person .edit-upload {
	flex: 1;
}

.person-edit .list .item {
	padding: 0.25em;
	background-color: #eee;

	display: flex;
}

.person-edit .list .text {
	padding: 0.25em;
}

.person-edit .list .text > div {
	padding: 0.25em;
	flex: 1;
	font-size: smaller;
}

.person-edit .list .item img {
  object-fit: cover;
  width: 9em;
  height: 9em;
  border-radius: 1em;
  display: block;
}

</style>

<script>

	import personSchema from './person_edit_schema.mjs'
null
	import moment from 'moment'
	import async from 'async'

	import Vue from 'vue'

	import iimg from './iimg.vue'
	//Vue.component('iimg', iimg)

	import inplaceTextEdit from './inplaceTextEdit.vue'
	//Vue.component('inplaceTextEdit', inplaceTextEdit)

	import fileUploadQueue from './files_upload_queue.vue'
	import filesList from './files_list.vue'

	import personEditForm from './person_edit_form.vue'

	export default {
		name: 'personEdit',
		components: {
			iimg,
			inplaceTextEdit,
			personEditForm,
			fileUploadQueue,
			filesList
		},
		data () {
		    return {
				docId: null,
				queue: []
			}
		},
		params: {
			oid: {
				type: String,
				required: true
			}
		},
		computed: {
		},
		beforeRouteEnter (to, from, next) {
			next(vm => {
				vm.updateModel(vm)
			})
		},
		beforeRouteUpdate (to, from, next) {
			this.$nextTick(() => {
				this.updateModel(this)
			})
			next()
		},
		created () {
			console.log('<person_edit> created', this.$route.params.id)

			this.docId = this.$route.params.id;

			if ('new' === this.docId) {
				this.docId = null
			}

		},
		mounted () {

//			this.$nextTick(() => {
//			})

		},
		methods: {
			updateModel (vm) {
//				console.log('<person_edit> updateModel', this.$route.params.id)
			},
			closeHandler () {
				//this.$router.push({ name: 'person' })
				this.$router.push('.')
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

				input.value = null;

			},
			upload () {
				const queue = this.queue;
				const docId = this.docId;

				var q = async.queue((task, callback) => {

					if (!task) {
						callback();
						return;
					}

					console.log(task)

					this.$http.post(
						`/f/${docId}/upload/${task.file.name}`,
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
					console.log('queue is empty')
					this.queue = []
				})

				q.push(queue);

			},

			queueRemoveEl (n) {
				this.queue[n] = false;
				this.queue = this.queue.filter(v => { return v });
			},

		}
	}

</script>
