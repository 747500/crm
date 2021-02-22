<template>
	<div class="m-person">

		<div class="names">
			{{ person.lastName }}
			{{ person.firstName }}
			{{ person.middleName }}
		</div>

		<ul class="contacts">
			<li v-for="c in person.contact" :key="c._id">
				{{ c.data }}
				<span v-if="c.description">({{ c.description }})</span>
			</li>
		</ul>
	</div>
</template>

<script>

	const schema = {
		person: {
			template: 'MPerson'
		}
	}

	import oidImage from '../oidImage.vue'

	export default {
		name: 'MPerson',

		components: {
		},

		props: {
			model: [ Object, String ],
		},

		data () {
			return {
				key: null,
				person: {},
			}
		},

		mounted () {

			//console.log('<M/person.vue> mounted', this.$props)

			if ('string' === typeof this.$props.model) {

				this.$http.get(`/doc/${this.$props.model}`)
				.then(response => {
					console.log(response)
					this.person = response.body.person

					//this.key = '' + this.person._id + '-' + this.person.mtime.getTime()
				})
				.catch(console.error)

			}

			if ('object' === typeof this.$props.model) {
				this.person = this.$props.model
			}

		},

		computed: {
		},

	}

</script>
