
<template>
	<div>
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
			<pre>events: {{ events }}</pre>
		</div>
	</div>
</template>

<script>

	import moment from 'moment'

	export default {
		data () {
			return  {
				focus: '',
		        events: []
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
			this.focus = moment().format('YYYY-MM')
			this.updateModel()
		},
		methods: {
			loadEvents (yearmonth) {
				this.updateModel()
			},
			updateModel () {
				console.log("<calendar.vue> updateModel")
				this.$http.get(
					'/person/events',
					{
						params: {
							yearmonth: this.focus
						}
					}
				).then((response) => {
					this.events = response.data
				}).catch((err) => {
					console.error(err)
				})
			}
		}
	};

</script>
