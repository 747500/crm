
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

				<div class="queue list" style="margin: 1em;">
					<div class="item" v-for="(task, n) in queue" :key="n">
						<div class="img">
							<iimg :src="task.file" />
						</div>
						<div class="text">
							<div>{{ task.file.name }}</div>
							<div>{{ task.file.size }}</div>
							<div v-if="task.file_id">{{ task.file_id }}</div>
							<div v-if="task.p">{{ task.p }}</div>
							<div class="tools">
								<a href="" @click.prevent="() => { queueRemove(n) }">Убрать...</a>
							</div>
						</div>
					</div>
				</div>

				<hr>

				<div class="files list" style="margin: 1em;">
					<fileInfo
						class="item"
						v-for="(oid, n) in (model.files || []).slice().reverse()"
						:src="'/f/' + oid"
						:key="oid"
						/>
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

	import iimg from './iimg.vue'

	import VueFormulate from '@braid/vue-formulate'
	Vue.use(VueFormulate)

	Vue.component('iimg', iimg)

	Vue.component('fileInfo', {
		name: 'fileInfo',
		render(createElement) {

			const img = createElement('iimg');

			const itemImg = createElement('div',
				{
					attrs: {
						class: 'img',
					}
				},
				[
					img
				]
			);

			const caption = createElement('div',
				{
					attrs: {
						class: 'caption'
					}
				}
			);

			const filename = createElement('div',
				{
					attrs: {
						class: 'filename'
					}
				}
			);

			const size = createElement('div',
				{
					attrs: {
						class: 'size'
					}
				}
			);

			const itemText = createElement('div',
				{
					attrs: {
						class: 'text'
					}
				},
				[
					filename,
					size,
					caption
				]
			);

			const item = createElement('div', [
				itemImg,
				itemText
			]);

			var xhr = new XMLHttpRequest();

			xhr.responseType = 'blob';
			xhr.open('get', this.$props.src, true);

			//xhr.onerror(err => {
			//	console.error(err);
			//});

        	xhr.onreadystatechange = e => {
				if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
					const contentType = xhr.getResponseHeader('content-type');
					const fileName = xhr.getResponseHeader('content-disposition').split(';')[1];

	                img.elm.src = URL.createObjectURL(xhr.response);
					img.elm.alt = fileName;
	                img.elm.onload = () => {
	                    URL.revokeObjectURL(img.elm.src);
	                }
					filename.elm.innerText = decodeURIComponent(fileName.slice(9));
					size.elm.innerText = xhr.response.size;
					caption.elm.innerText = '-';
	            }
	        };

	        xhr.send();

			return item;
		},
		props: {
	  	    src: {
	        	type: String,
				required: true,
	  	    },
  		}
	})

	export default {
		components: {
		},
		data () {
		    return {
				queue: [],
				model: {
					_id: null,
					lastName: '',
					firstName: '',
					middleName: '',
					birthDay: '',
					passport: '',
					files: []
				},
				files: [],
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
			selectFiles (event) {
				this.$nextTick(() => {
					this.$refs.addFile.click(event);
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
					passport: ''
				}

				if ('new' !== personId) {
					this.$http.get('/person/' + personId).then(response => {
						this.model = Object.assign({}, response.body)
						this.model.birthDay = moment(response.body.birthDay).format('YYYY-MM-DD')
					}).catch((e) => {
						console.error(e)
					});
				}

			},
			submitHandler(formData) {

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
							const file_id = res.file_id

							queue.shift();

							this.model.files.push(file_id)
							task.file_id = file_id
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
