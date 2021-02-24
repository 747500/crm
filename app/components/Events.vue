
<template>
	<div class="events">
		<div>
			<!--
			<FormulateInput
			  type="date"
			  name="sample"
			  label="Дата"
			  placeholder="Sample date placeholder"
			  help="Sample date help text"
			  validation="required|after:2019-01-01"
			  min="2018-12-01"
			  max="2021-01-01"
			  error-behavior="live"
			/>
			-->
			<FormulateInput
			  type="month"
			  name="sample"
			  label="Дата"
			  v-model="focus"
			  @input="loadEvents"
			/>
		</div>
		<div>
			<pre>focus: {{ focus }}</pre>
		</div>

		<div class="content">

			<Calendar
				:now="focus"
				:events="calendarEvents"
				@click="onCalendarClick"
				/>

			<div class="active-events">
				<div>{{ calendarCurrent }}</div>

				<ul>
					<li v-for="(item, n) in eventsList" :key="item._id">

						<SEvent
							:oid="item._id"
							:type="item.type"
							:title="item.title"
							@click="onEventClick"/>

					</li>
				</ul>

			</div>
		</div>

	</div>
</template>

<script>

	import moment from 'moment'

	import Calendar from './Calendar.vue'
	import SEvent from './S/event.vue'

	export default {

		name: 'Events',

		components: {
			Calendar,
			SEvent,
		},

		data () {
			return  {
				focus: '',
		        events: [],
				calendarEvents: {},
				calendarCurrent: null,
			}
		},

		/*
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
		*/

		created () {
			this.calendarCurrent = moment().format('YYYY-MM-DD')
			this.focus = moment().format('YYYY-MM')
			this.updateModel()
		},

		methods: {

			onEventClick (oid) {
				console.log('<Events.vue> onEventClick', oid)
			},

			loadEvents (yearmonth) {
				this.updateModel()
			},

			updateModel () {
				//console.log("<calendar.vue> updateModel")

				this.$http.get(
					'/person/events',
					{
						params: {
							yearmonth: this.focus
						}
					}
				).then((response) => {

					this.events = response.data.reduce(
						(result, v) => {

							if ('array' !== typeof result[v.eventAt]) {
								result[v.eventAt] = {
									type: 'birthday',
									list: []
								}
							}

							result[v.eventAt].list.push({
								title: v.eventTitle,
								_id: v.subjectId
							})

							return result
						},
						{}
					)

					this.calendarEvents = response.data.reduce(
						(result, v) => {

							if ('array' !== typeof result[v.eventAt]) {
								result[v.eventAt] = {
									type: 'birthday',
									count: 0,
								}

								result[v.eventAt].count ++
							}

							return result
						},
						{}
					)

				}).catch((err) => {
					console.error(err)
				})
			},

			onCalendarClick (day) {
				this.calendarCurrent = day
			}
		},

		computed: {
			eventsList () {
				const events = this.events[this.calendarCurrent]

				if (events) {
					return events.list.map(item => {
						return {
							type: events.type,
							title: item.title,
							_id: item._id,
						}
					})
				}

				return []
			}
		},
	}

</script>

<style>

.events .content {
	display: flex;
}

.events .content .calendar {
	flex: 1;
}


.events .content .active-events {
	flex: 1;
	overflow-x: hidden;
}

.active-events > ul {
	list-style: none;
	margin: 0;
	padding: 0;
}

.active-events > ul > li {
	padding-left: 1em;
	list-style: none;
}

</style>
