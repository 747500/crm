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

			<div class="files">
				<personFiles
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

	import Vue from 'vue'

	//import iimg from './iimg.vue'
	//Vue.component('iimg', iimg)

	//import inplaceTextEdit from './inplaceTextEdit.vue'
	//Vue.component('inplaceTextEdit', inplaceTextEdit)

	import personEditForm from './person_edit_form.vue'
	import personFiles from './person_files.vue'

	export default {
		name: 'personEdit',
		components: {
			personEditForm,
			personFiles
		},
		data () {
		    return {
				docId: null
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
			}
		}
	}

</script>
