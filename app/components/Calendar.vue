<template>
    <div class="calendar">
        <div class="page" :key="now">
            <div class="header">

                <div class="day" v-for="day in weekdays" :key="day">
                    {{ day }}
                </div>

            </div>
            <div class="week" v-for="(week) in page" :key="week.start">

                <div v-for="d in week.days"
                    :key="week.start + ' ' + d.num"
                    :class="['day', { 'holiday': d.holiday }, { 'disabled': d.disabled }, { 'selected': d.selected } ]"
                    @click="() => onDayClick(d)"
                    >

                    <div class="num">
                        {{ d.num }}
                    </div>
                    <div class="events">
                        {{ d.events.birthday ? '🎁' : '' }}
                    </div>

                </div>

            </div>
        </div>
    </div>
</template>

<script>

    import moment_orig from 'moment'
    moment_orig()

    import moment from 'moment-business-days'

    moment.locale('ru_RU')

    export default {

        name: 'Calendar',

        components: {
        },

		props: {
			now: String,
            events: Object,
		},

        data () {
            return {
                weekdays: moment.weekdaysShort(true),
                currentDay: {},
            }
        },

        methods: {

            onDayClick (day) {
                if (this.$listeners.click) {
                    this.currentDay.selected = false
                    day.selected = true
                    this.currentDay = day
                    this.$emit('click', day.full)
                }
            }
        },

        computed: {

            page () {

                const page = []

                const start = moment(this.$props.now)
                        .date(1) // first day of month
                        .weekday(0) // first day of week

                const month = moment(this.$props.now).month()

                var current = moment(start)

                do {

                    let week = {
                        start: current.format('YYYY-MM-DD'),
                        days: [],
                    }

                    for (let d = 0; d < 7; d ++, current.add(1, 'day')) {

                        const day = {
                            num: current.date(),
							full: current.format('YYYY-MM-DD'),
                            disabled: current.month() !== month,
                            holiday: !current.isBusinessDay() || current.isHoliday(),
                            events: {
                            }
                        }

                        /*
                        console.log(day.full, this.$props.now)
                        if (day.full === this.$props.now) {
                            day.selected = true
                            this.currentDay = day
                        }
                        */

                        if ('object' === typeof this.$props.events) {
                            const evList = []
                            const ev = this.$props.events[day.full]

                            if (ev) {
                                day.events[ev.type] = true
                            }

                            // console.log('* <Calendar.vue>', day)
                        }


                        week.days.push(day)
                    }

                    page.push(week)

                } while (current.month() === month)

                return page

            }
        },

        created () {

        },

    }

</script>

<style>

.calendar > .page {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    max-width: 50em;
}

.calendar > .page > .header {
    flex: 1;
    display: flex;
    align-items: stretch;
}


.calendar > .page > .header > .day {
    flex: 1;
    line-height: 1.5em;
    height: 2em;
    text-align: center;
}

.calendar > .page > .week {
    flex: 1;
    display: flex;
    align-items: stretch;
}

.calendar > .page > .week > .day {
    flex: 1;
    line-height: 1.5em;
    height: 3.5em;
    border: 1px solid #ddd;
    margin: 1px;
    padding: 0.25em;
    cursor: pointer;
}

.calendar > .page > .week > .day:hover {
    background-color: var(--hover-color);
}

.calendar > .page > .week > .day.selected {
    outline: 1px solid var(--border-color);
}

.calendar > .page > .week > .day > .num {
    text-align: right;
}

.calendar > .page > .week > .day.disabled > .num {
    color: #ddd;
}

.calendar > .page > .week > .day.holiday {
    border-color: #fbb;
}

.calendar > .page > .week > .day.holiday.disabled {
    border-color: #ecc;
}

.calendar > .page > .week > .day.holiday.disabled > .num {
    color: #fbb;
}

.calendar > .page > .week > .day.holiday > .num{
    color: red;
}


</style>
