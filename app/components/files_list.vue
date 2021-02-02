
<template>

	<div>


		<div class="item" v-for="(file) in files.slice().reverse()" :key="file.key">

			<div class="img">
				<iimg :src="file.blob"/>
			</div>

			<div class="text">
				<div class="oid">{{ file._id }}</div>
				<div>{{ file.name }}</div>
				<div>{{ file.lastModified }}</div>
				<div>{{ file.size }}</div>

				<inplaceTextEdit
					@savetext="() => saveText({ oid: file._id, caption: file.caption })"
					v-model="file.caption"
					label="." />

				<div class="tools">
					<a href="" @click.prevent="() => removeFile(file._id)">Удалить</a>
				</div>

			</div>
		</div>
	</div>


</template>

<script>

import iimg from './iimg.vue'
import inplaceTextEdit from './inplaceTextEdit.vue'

export default {
	name: 'filesList',
	components: {
		iimg,
		inplaceTextEdit
	},
	model: {
		prop: 'oid'
	},
	props: {
		oid: [ String, undefined ]
	},
	data () {
		return {
			files: [] //this.$props.files.map(oid => { oid: oid })
		}
	},
	methods: {
		saveText (file) {

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
				console.log('saveCaption http result', result)

			}).catch(console.error)


		},
		removeFile (fileId) {
			const docId = this.$props.oid

			this.$http.delete(
				`/f/${fileId}`
			).then(result => {

				this.files = this.files.filter(file => {
					return file._id !== fileId
				})

			}).catch(console.error)

		}
	},
	mounted () {

	},
	created () {

		const docId = this.$props.oid

		console.log('<file_list> created', docId)

		if (!docId) {
			return
		}

		return this.$http
			.get(`/doc/${docId}/files`)
			.then(response => {
console.log('<files_list> created:', response)
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

					return this.$http.get('/f/' + file._id, {
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

						file.blob = response.body
						file.key += '+'
						file.size = response.body.size
						file.type = response.headers.get('content-type')
						file.lastModified = new Date(response.headers.get('last-modified'))
						file.name = decodeURIComponent(filename || 'blob')
						file.caption = decodeURIComponent(caption)

					}).catch(err => {
						console.error(err)
					})
				})
			})
	}
}

</script>
