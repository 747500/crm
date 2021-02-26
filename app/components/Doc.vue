<template lang="pug">

	Modal(@close="closeEdit")

		template(v-slot:title)
			TabView(
				:schema="TabViewSchema"
				@tab="tab => { tabView = tab }"
			)/

		div(class="doc")
			component(
				v-if="tabView"
				:is="tabView.component"
				:model="model"
				:key="key"
				@update="onUpdate"
			)/

</template>

<script>

	import moment from 'moment'

	import Modal from './Modal.vue'
	import TabView from './TabView.vue'

	import DocEdit from './DocEdit.vue'
	import filesPanel from './files_panel.vue'
	import PersonSelect from './person_select.vue'

	export default {
		name: 'Doc',

		components: {
			Modal,
			TabView,
			DocEdit,
			filesPanel,
			PersonSelect
		},

		data () {
		    return {
				tabView: null,
				model: {},
				key: null,
			}
		},

		props: {
			kind: String
		},

		computed: {

			TabViewSchema () {

				return [

					{
						kind: '*',
						title: this.$route.meta.title,
						component: 'DocEdit',
					},
					{
						kind: [ 'property' ],
						title: 'Собственник',
						component: 'PersonSelect',
					},
					{
						kind: [ 'person', 'property', 'contract' ],
						title: 'Файлы',
						component: 'filesPanel',
					}

				].filter(item => {

					if ('*' === item.kind) {
						return true
					}

					if (this.model && this.model.kind) {
						return item.kind.includes(this.model.kind)
					}

					return false
				})
			},
		},

		mounted () {
			//console.log('<Doc.vue> mounted', this.$route.params, this.$props)

			if ('new' === this.$route.params.id) {
				this.model = {
					_id: null,
					kind: this.$route.meta.kind,
				}
				return
			}

			this.$http
			.get(`/doc/${this.$route.params.id}`)
			.then(response => this.setDocData(response.body))
			.catch(console.error)

		},

		created () {

		},

		methods: {

			setDocData (doc) {

				// FIXME - dirty schemaless hack
				if (doc.person && doc.person.birthDay) {
					doc.person.birthDay = moment(doc.person.birthDay).format('YYYY-MM-DD')
				}

				this.model = doc

				if (this.tabView.component === 'DocEdit') {
					this.key = `${doc._id}-${doc.mtime}`
				}

			},

			closeEdit () {
				//this.$router.push('.')
				this.$router.go(-1)
				this.$emit('updateDoc')
			},

			onUpdate (doc) {

				//console.log('<Doc.vue> onUpdate', doc)

				var ok

				if (doc._id) {
					ok = this.$http.post(`/doc/${doc._id}`, doc)
				}
				else {
					ok = this.$http.put('/doc', doc)
				}

				ok = ok.then(response => this.setDocData(response.body))
				.catch(err => console.error('<doc_edit_form> submitHandler', err))

				return ok

			}
		}
	}

</script>

<style>
</style>
