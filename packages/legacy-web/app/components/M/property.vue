<template lang="pug">

	bsCard(
		v-if="model"
		v-on="$listeners"
		class="m-property"
	)
		bsCardHeader {{ model.property.address }}

		div(class="row g-0")
			div(class="col-md-3")
				bsCardImage(class="m-picture")
					oidImage(:oid="model.mainPicture")/

			div(class="col-md-9")
				bsCardBody
					div
						| {{ model.property.price | currency('₽', 2) }}

					SPerson(:model="model.owner")/
</template>

<script>

import bsCard from '../bs/Card.vue'
import bsCardHeader from '../bs/CardHeader.vue'
import bsCardImage from '../bs/CardImage.vue'
import bsCardBody from '../bs/CardBody.vue'

import oidImage from '../oidImage.vue'

import SPerson from '../S/person.vue'

export default {

	name: 'MProperty',

	components: {
			oidImage,
			bsCardBody,
			bsCardImage,
			bsCardHeader,
			bsCard,
			SPerson,
	},

	props: {
		model: Object,
	},

}

</script>
