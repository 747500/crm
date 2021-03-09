
<template lang="pug">

	div(class="events")
		div(class="content")

			div(class="events-calendar")

				div(class="toolbar mb-3")
					button(
						class="btn btn-outline-secondary"
						@click="prevMonth"
					)
						| <<

					FormulateInput(
						class="selector mx-3"
						inputClass="form-control"
						type="month"
						name="sample"
						v-model="focus"
						@input="loadEvents"
					)/

					button(
						class="btn btn-outline-secondary"
						@click="nextMonth"
					)
						| >>

				Calendar(
					:now="focus"
					:events="calendarEvents"
					@click="onCalendarClick"
				)/

			div(class="events-list")

				div(class="date") {{ calendarCurrent }}

				ul
					li(v-for="(item, n) in eventsList" :key="item._id")

						SEvent(
							:oid="item._id"
							:type="item.type"
							:title="item.title"
							@click="onEventClick"
						)/

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

			prevMonth () {
				this.focus = moment(this.focus)
						.subtract(1, 'months')
						.format('YYYY-MM')
			},

			nextMonth () {
				this.focus = moment(this.focus)
						.add(1, 'months')
						.format('YYYY-MM')
			},

			onEventClick (oid) {
				console.log('<Events.vue> onEventClick', oid)
			},

			loadEvents (yearmonth) {
				this.updateModel()
			},

			updateModel () {
				//console.log("<calendar.vue> updateModel")

				this.$http.get(
					'doc/events/person',
					{
						params: {
							yearmonth: this.focus
						}
					}
				).then((response) => {

					this.events = response.data.reduce(
						(result, v) => {

							if ('object' !== typeof result[v.eventAt]) {
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

.events .toolbar {
	display: flex;
}

.events .toolbar > .selector {
	flex: auto;
}

.events .toolbar > button {
	flex: initial;
}

.events .content {
	display: flex;
	margin-top: 1em;
}

.events .content > div {
	flex: 1;
}

/*
.events .content .events-calendar {
}
*/


.events .content .events-calendar .selector {
	height: 2em;
}

.events .content .events-list {
	overflow-x: hidden;
}

.events .content .events-list .date {
	line-height: 2em;
	padding-left: 1em;
}

.events .content .events-list > ul {
	list-style: none;
	margin: 0;
	padding: 0;
	padding-left: 1em;
}

.events .content .events-list > ul > li {
	margin: 0;
	padding: 0;
	list-style: none;
}

</style>
