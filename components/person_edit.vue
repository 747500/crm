
<template>
	<div class="">

		<div class="">
			<FormulateForm
				v-model="model"
				:schema="schema"
				@submit="submitHandler"
				@close="closeHandler"
				/>
		</div>

		<div class="">
			<input
				type="file"
				name="upload"
				multiple
				@change="updateQueue"
				>

			<button @click="upload">Загрузить</button>

			<div style="margin: 1em;">
				<div v-for="(task, n) in queue" :key="n">
					<div><iimg :src="task.file" /></div>
					<div>{{ task.file.name }}</div>
					<div>{{ task.file_id }}</div>
					<div>{{ task.p }}</div>
				</div>
			</div>
			<div style="margin: 1em;">
				<div v-for="(oid, n) in model.files" :key="n">
					<div><img class="uimg" :src="'/f/' + oid" /></div>
				</div>
			</div>
		</div>

	</div>
</template>

<style>

.uimg {
  object-fit: cover;
  width: 120px;
  height: 120px;
}

</style>

<script>

	import moment from 'moment'
	import async from 'async'

	import Vue from 'vue'

	import VueFormulate from '@braid/vue-formulate'
	Vue.use(VueFormulate)


	Vue.component('iimg', {
		name: 'iimg',
		render(createElement) {
			return createElement('img', {
				attrs: {
					src: URL.createObjectURL(this.$props.src),
					alt: this.$props.src.name,
					class: 'uimg'
				}
			});
		},
		props: {
	  	    src: {
	        	type: File,
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
					passport: ''
				},
				schema: [
					{
						name: '_id',
						type: 'text',
						label: 'ID',
						readonly: true
					},
					{
						name: 'lastName',
						type: 'text',
						label: 'Фамилия'
					},
					{
						name: 'firstName',
						type: 'text',
						label: 'Имя'
					},
					{
						name: 'middleName',
						type: 'text',
						label: 'Отчество'
					},
					{
						name: 'birthDay',
						type: 'date',
						label: 'Дата рождения'
					},
					{
						name: 'passport',
						type: 'textarea',
						label: 'Паспорт'
					},
					{
						name: 'close',
						type: 'button',
						label: 'Закрыть',
						'@click': 'close'
					},
					{
						name: 'submit',
						type: 'submit',
						label: 'Сохранить'
					}
				]
			}
		},
		computed: {
			person_id() {
				return this.$route.params.id
			}
		},
		beforeRouteEnter (to, from, next) {
			next(vm => {
				vm.updateModel()
			})
		},
		beforeRouteUpdate (to, from, next) {
			this.$nextTick(() => {
				this.updateModel()
			})
			next()
		},
		created () {
		},
		mounted () {
		},
		methods: {
			updateModel (vm) {
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
			upload () {
				const queue = this.queue;
				const personId = this.model._id;

				var q = async.queue((task, callback) => {
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
							queue.shift();
							this.model.files.push(xhr.response.file_id.file_id);
							task.file_id = xhr.response
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
