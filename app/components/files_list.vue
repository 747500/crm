
<template>

	<div class="files-list" style="max-height: calc(100vh - 15em); overflow: auto;">


		<div v-for="(file) in files.slice().reverse()"
			:key="file.key"
			:class="{ busy: true == file.busy, avatar: file._id === $props.avatar }"
			class="item"
			>
			<div class="content">
				<div class="img">
					<iimg :src="file.blob"/>
					<div class="lamp">💡</div>
				</div>

				<div class="text">
					<!--
					<div class="oid">{{ file._id }}</div>
					<div style="width: 95%; overflow: hidden;">{{ file.name }}</div>
					<div>{{ new Date(file.lastModified).toLocaleString() }}</div>
					<div>{{ file.size }}</div>
					-->
					<inplaceTextEdit
						@savetext="() => saveText({ oid: file._id, caption: file.caption })"
						v-model="file.caption"
						label="🖉" />
				</div>
			</div>

			<div class="toolbar">
				<div class="tools">
					<aConfirm
						class="btn btn-outline-danger btn-sm"
						message="Отмена"
						:onconfirm="() => { removeFile(file) }">️ 🗑 </aConfirm>
					<button
						class="btn btn-dark btn-sm"
						:disabled="file._id === $props.avatar"
						@click.prevent="() => $emit('setMain', file._id)">
						{{ file._id === $props.avatar ? 'Главная' : 'Сделать главной' }}
					</button>
				</div>
			</div>
		</div>
	</div>


</template>

<style>

.item .content .img {
	position: relative;
}

.item .content .img .lamp {
	position: absolute;
	line-height: 2em;
	bottom: 0px;
	right: 0px;
	display: none;
	width: 2em;
	height: 2em;
	text-align: center;
	text-shadow: 1px 0px 3px #fff, -1px 0px 3px #fff, 0px 1px 3px #fff, 0px -1px 3px #fff;
}

.item.avatar .content .img .lamp {
	display: block;
}

.busy {
	outline: 1px dotted red;
}

</style>
<script>

import iimg from './iimg.vue'
import inplaceTextEdit from './inplaceTextEdit.vue'
import aConfirm from './aConfirm.vue'

export default {
	name: 'filesList',
	components: {
		iimg,
		inplaceTextEdit,
		aConfirm,
	},
	model: {
		prop: 'oid',
	},
	props: {
		oid: [ String, undefined ],
		avatar: String,
	},
	data () {
		return {
			files: [] //this.$props.files.map(oid => { oid: oid })
		}
	},
	methods: {

		saveText (file) {

			this.$http.post(
				`f/${file.oid}`,
				{
					caption: file.caption
				},
				{
					headers: {
						'Content-Type': 'application/json'
					}
				}
			).then(result => {
				console.log('saveCaption http result', result)

			}).catch(console.error)


		},
		removeFile (file) {

			file.busy = true

			this.$http.delete(`f/${file._id}`)
			.then(() => {

				this.files = this.files.filter(item => {
					return file._id !== item._id
				})

			})
			.catch(console.error)
			.finally(() => {
				file.busy = false
			})

		}
	},
	mounted () {

	},
	created () {

		const docId = this.$props.oid

		//console.log('<file_list.vue> created', docId)

		if (!docId) {
			return
		}

		return this.$http
			.get(`doc/${docId}/files`)
			.then(response => {

				//console.log('<files_list> created:', response)

				this.files = response.body.map(oid => {
					return {
						_id: oid,
						key: oid
					}
				})

				this.files.map(file => {

					if (file.blob) {
						return file
					}

					return this.$http.get(`f/${file._id}/t`, {
						responseType: 'blob'
					})
					.then(response => {

						var filename = response.headers.get('content-disposition') || ''
						filename = decodeURIComponent(
							filename.replace(
								/^[a-z]+;filename=/,
								''
							)
						)

						var caption = response.headers.get('x-meta-caption') || ''

						file.blob = response.body
						file.key += '+'
						file.size = response.body.size
						file.type = response.headers.get('content-type')
						file.lastModified = new Date(response.headers.get('last-modified'))
						file.name = decodeURIComponent(filename || 'blob')
						file.caption = decodeURIComponent(caption)

					})
					.catch(err => {
						console.error(err)
					})
				})
			})
	}
}

</script>
