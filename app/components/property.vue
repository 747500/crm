
<template>
	<div class="property">

		<div class="create">
			<router-link :to="{ name: 'property_edit', params: { id: 'new' }}">
				<div>Новый объект</div>
			</router-link>
		</div>

		<div class="list">
			<div
			 	:class="[ p.extendedView ? 'active' : '', 'item' ]"
				v-for="p in list"
				:key="p._id">
				<div class="info">

					<div class="owner">
						<div v-if="p.ownerId">
							<div>
							{{ p.ownerId.lastName }}
							{{ p.ownerId.firstName }}
							{{ p.ownerId.middleName }}
							</div>
							<div v-for="c in p.ownerId.contact" :key="c._id">
								{{ c.data }}
								<span v-if="c.description">({{ c.description }})</span>
							</div>
						</div>
					</div>

					<div class="property">
						<div class="address">{{ p.address }}</div>
						<div class="price">{{ p.price | currency('₽', 0) }}</div>
					</div>

					<div class="controls">
						<div class="btn-group-vertical btn-group-sm" role="group" aria-label="">

							<router-link
								:to="{ name: 'property_edit', params: { id: p._id }}"
								custom
								v-slot="{ navigate }"
								class="btn btn-outline-secondary"
								>
								<button	@click="navigate" role="link">
									🖉
								</button>
							</router-link>

							<button
								@click.prevent="() => $emit('switchView', p)"
								class="btn btn-outline-secondary">
								👁
							</button>

						</div>
					</div>

				</div>
				<div class="internal"><pre>{{ p }}</pre></div>
			</div>
		</div>

	</div>
</template>

<style>

.property .list .item {
	margin-top: 1em;
	border-top: 1px solid #ddd;
}

.property .list .item > div {
	margin: 0.33em 0;
}

.property .list .item .header {
}

.property .list .item .info {
	display: flex;
}

.property .list .item .property {
	flex: 1;
}

.property .list .item .owner {
	flex: 1;
}

.property .list .item .controls {
	flex: initial;
}

.property .list .item .internal {
	display: none;
}

.property .list .item.active .internal {
	display: block;
}

/*
.property-list ul {
	margin-top: 0;
	margin-bottom: 0;
	padding-top: 0.33em;
	padding-bottom: 0.33em;
}

.property-list li {
	padding-top: .33em;
	padding-bottom: .33em;
}

.property-list li.create {
	list-style-type: circle;
}
*/
</style>

<script>

	export default {
		name: 'property',
		model: {
			prop: 'list',
			//event: 'switchView'
		},
		props: {
			list: Array
		},
		methods: {
			/*
			switchView (item) {
				item.extendedView = !item.extendedView
				console.log(item.extendedView)
			}
			*/
		}
	};

</script>
