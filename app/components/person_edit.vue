
<template>
	<div class="person-edit">

		<header>
			<FormulateInput
		        type="button"
		        label="&lt;&lt;"
		        class="button-close"
		        @click="closeHandler"
		    	/>
			<hr/>
		</header>

		<div class="person">
			<div class="edit-form">
				<FormulateForm
					v-model="model"
					:schema="schema"
					@submit="submitHandler"
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
					:disabled="!model._id"
					/>

				<button
					type="file"
					name="upload"
					multiple
					@change="updateQueue"
					@click="selectFiles"
					:disabled="!model._id"
					>Выбрать</button>


				<button
					@click="upload"
					:disabled="!queue.length"
					>Загрузить</button>

				<div v-if="queue.length > 0" class="queue list" style="margin: 1em;">
					<div class="item" v-for="(task, n) in queue" :key="n">
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
								<a href="" @click.prevent="() => { queueRemove(n) }">Убрать...</a>
							</div>
						</div>
					</div>
				</div>

				<hr>

				<!-- filesList class="files list" style="margin: 1em;" v-model=""/ -->

				<div v-if="queue.length == 0" class="files list">


					<div class="item" v-for="(file, n) in files.slice().reverse()" :key="file.key">

						<div class="img">
							<iimg :src="file.blob"/>
						</div>

						<div class="text">
							<div class="oid">{{ file.oid }}</div>
							<div>{{ file.name }}</div>
							<div>{{ file.lastModified }}</div>
							<div>{{ file.size }}</div>

							<inplaceTextEdit
								@submit="() => saveCaption(file.oid)"
								v-model="file.caption"
								label="." />
							<div class="tools">
								<a href="" @click.prevent="() => { fileRemove(file.oid) }">Удалить</a>
							</div>

						</div>
					</div>
				</div>
			</div>

		</div>
	</div>
</template>

<style>

img {
	display: block;
}

.person-edit > header {
}

.person-edit .button-close {

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

.person-edit .queue {
}

.person .edit-upload {
	flex: 1;
}

.person-edit .list .item {
	padding: 0.25em;
	background-color: #eee;

	display: flex;
}

.person-edit .list .img {

}

.person-edit .list .text {
	padding: 0.25em;
}

.person-edit .list .text > div {
	padding: 0.25em;
	flex: 1;
	font-size: smaller;
}

.list .tools {
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

	import moment from 'moment'
	import async from 'async'

	import Vue from 'vue'

	import VueFormulate from '@braid/vue-formulate'
	Vue.use(VueFormulate)

	import iimg from './iimg.vue'
	Vue.component('iimg', iimg)

	import inplaceTextEdit from './inplaceTextEdit.vue'
	Vue.component('inplaceTextEdit', inplaceTextEdit)

	export default {
		components: {
		},
		data () {
		    return {
				queue: [],
				files: [],
				filesdb: {},
				model: {
					_id: null,
					lastName: '',
					firstName: '',
					middleName: '',
					birthDay: '',
					passport: '',
					files: []
				},
				schema: personSchema
			}
		},
		computed: {
			person_id() {
				return this.$route.params.id
			}
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
		},
		mounted () {
		},
		methods: {
			fileRemove (oid) {

				this.$http.delete(
					`/person/${this.model._id}/file/${oid}`
				).then(result => {

					this.model.files = this.model.files.filter(arg => {
						return arg !== oid
					})

					this.files = this.model.files.map((oid, n) => {
						return this.filesdb[oid]
					})

					delete this.filesdb[oid]

				})


			},
			saveCaption (oid) {
				const file = this.filesdb[oid]

				file.key += '.'

				this.$http.post(
					`/f/${file.oid}`,
					{
						caption: file.caption
					},
					{
						headers: {
							'Content-Type': 'application/json'
						}
					}
				).then(result => {
					//console.log('saveCaption', result)

				}).catch(console.error)

			},
			selectFiles (event) {
				this.$nextTick(() => {
					this.$refs.addFile.click(event);
				})
			},
			getFiles () {
				this.files = this.model.files.map((oid, n) => {
					return this.filesdb[oid]
				})
			},
			updateModel (vm) {
				// console.log('* updateModel', this, vm);
				const personId = this.$route.params.id;

				this.model = {
					_id: null,
					lastName: '',
					firstName: '',
					middleName: '',
					birthDay: '',
					passport: '',
					files: []
				}

				this.queue = []
				this.filesdb = {}
				this.files = []

				if ('new' === personId) {
					return
				}

				this.$http.get('/person/' + personId).then(response => {

					this.model = Object.assign({}, response.body)
					this.model.birthDay = moment(response.body.birthDay).format('YYYY-MM-DD')

					return this.model.files.map((oid, n) => {

							this.filesdb[oid] = {
								oid: oid,
								key: oid,
								docId: this.model._id,
								blob: null,
								caption: '',
								size: 0,
								lastModified: '',
								caption: ''
							}
						})

				}).then(() => {

					this.files = this.model.files.map((oid, n) => {
						return this.filesdb[oid]
					})


					return this.model.files.map((oid, n) => {
						return this.$http.get('/f/' + oid, {
							responseType: 'blob'
						}).then(response => {

							var filename = response.headers.get('content-disposition') || ''
							filename = decodeURIComponent(
								filename.replace(
									/^[a-z]+;filename=/,
									''
								)
							)

							var caption = response.headers.get('x-meta-caption') || ''


							this.filesdb[oid].blob = response.body

							//file.name = response.headers.get('content-disposition')
							this.filesdb[oid].key += '+'
							this.filesdb[oid].size = response.body.size
							this.filesdb[oid].type = response.headers.get('content-type')

							this.filesdb[oid].lastModified =
									new Date(response.headers.get('last-modified'))

							this.filesdb[oid].name =
									decodeURIComponent(filename)

							this.filesdb[oid].caption =
									decodeURIComponent(caption)

							//console.log(this.filesdb[oid])

							this.files = this.model.files.map((oid, n) => {
								return this.filesdb[oid]
							})


						}).catch(err => {
							console.error(err)
						})

					})

				}).then(list => {

					//this.$forceUpdate()

					return Promise.allSettled(list)

				}).then(list => {

				}).catch(err => {
						console.error(err)
				})
			},
			submitHandler (formData) {

				var method = this.model._id ? 'post' : 'put'

				this.$http[method]('/person', formData).then(response => {

					//this.$router.push({ name: 'person' })
					this.$router.push('.')

				}).catch((err) => {
					console.error('submitHandler', err)
				});

			},
			closeHandler () {
				//this.$router.push({ name: 'person' })
				this.$router.push('.')
			},
			updateQueue (event) {
				const input = event.target

				for (let i = 0; i < input.files.length; i ++) {
					this.queue.push({
						file: input.files[i],
						p: null
					});
				}

				input.value = null;

			},
			queueRemove (n) {
				const q = [];
				var oid, i, e;

				this.queue[n] = false;

				e = this.queue.length;
				for (i = 0; i < e; i ++) {
					oid = this.queue.shift();
					if (oid) {
						this.queue.push(oid);
					}
				}
			},
			upload () {
				const queue = this.queue;
				const personId = this.model._id;

				var q = async.queue((task, callback) => {

					if (!task) {
						callback();
						return;
					}

					const xhr = new XMLHttpRequest();

					xhr.open(
						'POST',
						'/person/' + personId + '/upload/' + task.file.name,
						true
					);

					xhr.setRequestHeader('Last-Modified', task.file.lastModifiedDate)
					xhr.setRequestHeader('X-Meta-Caption', encodeURIComponent(task.caption || ''))

					xhr.upload.onerror = err => {
						callback(err);
					};

					xhr.upload.onload =
					xhr.upload.onprogress =
						event => {
							task.p = parseInt(event.loaded / event.total * 100, 10);
						};

/*
					xhr.upload.onload = event => {
						task.p = parseInt(event.loaded / event.total * 100, 10);
					};
*/
					xhr.onreadystatechange = () => {
						if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
							//updateProgress();
							console.log(xhr.response)
							const res = JSON.parse(xhr.responseText)
							const oid = res.file_id

							queue.shift();

							const file = {
								name: task.file.name,
								oid: oid,
								key: oid,
								docId: this.model._id,
								lastModified: new Date(task.file.lastModifiedDate),
								size: task.file.size,
								caption: task.caption,
								blob: task.file
							}

							this.filesdb[oid] = file
							this.model.files.push(oid)
							this.files.push(file)

							task.file_id = oid
							task.p = ''

							callback();
						}
					}

					xhr.send(task.file);

				}, 1);

				q.error((err, task) => {
				    console.error(task, err);
				});

				q.drain(() => {
					console.log('queue is empty')
					this.queue = []
				})

				q.push(queue);

			}
		}
	}

</script>
