<template lang="pug">

	bsCard(
		v-if="model"
		v-on="$listeners"
		class="m-person"
	)
		bsCardHeader
				| {{ model.person.lastName }}
				| {{ model.person.firstName }}
				| {{ model.person.middleName }}

		div(class="row g-0")
			div(class="col-md-3")
				bsCardImage(class="m-picture")
					oidImage(:oid="model.mainPicture")/

			div(class="col-md-9")
				bsCardBody
					ul(class="contacts")
						li(v-for="c in model.person.contact" :key="c._id")
							span {{ c.data }}
							span(v-if="c.description") ({{ c.description }})
					div
						span {{ model.person.comments }}

</template>

<script>

	import bsCard from '../bs/Card.vue'
	import bsCardHeader from '../bs/CardHeader.vue'
	import bsCardImage from '../bs/CardImage.vue'
	import bsCardBody from '../bs/CardBody.vue'

	import oidImage from '../oidImage.vue'

	export default {

		name: 'MPerson',

		components: {
			oidImage,
			bsCardBody,
			bsCardImage,
			bsCardHeader,
			bsCard,
		},

		props: {
			model: Object,
		},

	}

</script>
