<script setup lang="ts">
import { computed, ref } from 'vue';
import moment from 'moment';

interface Day {
  num: number;
  full: string;
  disabled: boolean;
  holiday: boolean;
  selected?: boolean;
  events: Record<string, boolean>;
}
interface Week {
  start: string;
  days: Day[];
}

const props = defineProps<{
  now: string;
  events: Record<string, { type?: string }>;
}>();
const emit = defineEmits<{ (e: 'click', day: string): void }>();

// Дни недели (Пн-первый), не зависят от загрузки локали в Vite.
const weekdays = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

// Бизнес-день = Пн–Пт. Праздники — фиксированный набор (уточним позже).
const RU_HOLIDAYS = new Set([
  '01-01',
  '01-02',
  '01-03',
  '01-04',
  '01-05',
  '01-06',
  '01-07',
  '01-08',
  '02-23',
  '03-08',
  '05-01',
  '05-09',
  '06-12',
  '11-04',
]);

function isBusinessDay(m: moment.Moment): boolean {
  const d = m.day();
  return d >= 1 && d <= 5;
}
function isHoliday(m: moment.Moment): boolean {
  return !isBusinessDay(m) || RU_HOLIDAYS.has(m.format('MM-DD'));
}

const selected = ref<string>('');

function onDayClick(day: Day) {
  selected.value = day.full;
  emit('click', day.full);
}

const page = computed<Week[]>(() => {
  const result: Week[] = [];
  // Понедельник недели, содержащей 1-е число месяца (не зависит от локали).
  const start = moment(props.now).date(1);
  const dow = start.day(); // 0=Вс .. 6=Сб
  const offset = (dow + 6) % 7; // дней назад до понедельника
  start.subtract(offset, 'day');
  const month = moment(props.now).month();
  const current = moment(start);
  do {
    const week: Week = { start: current.format('YYYY-MM-DD'), days: [] };
    for (let d = 0; d < 7; d++, current.add(1, 'day')) {
      const day: Day = {
        num: current.date(),
        full: current.format('YYYY-MM-DD'),
        disabled: current.month() !== month,
        holiday: isHoliday(current),
        events: {},
      };
      if (typeof props.events === 'object') {
        const ev = props.events[day.full];
        if (ev) day.events[ev.type ?? ''] = true;
      }
      week.days.push(day);
    }
    result.push(week);
  } while (current.month() === month);
  return result;
});
</script>

<template>
  <div class="calendar">
    <div class="page" :key="now">
      <div class="header">
        <div class="day" v-for="day in weekdays" :key="day">{{ day }}</div>
      </div>

      <div class="week" v-for="week in page" :key="week.start">
        <div
          v-for="d in week.days"
          :key="week.start + ' ' + d.num"
          :class="[
            'day',
            { holiday: d.holiday },
            { disabled: d.disabled },
            { selected: d.full === selected },
          ]"
          @click="onDayClick(d)"
        >
          <div class="num">{{ d.num }}</div>
          <div class="events">{{ d.events.birthday ? '🎁' : '' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  margin: 0 3px;
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
  border-top: 2px solid #ddd;
  margin: 0 3px;
  padding: 0.25em;
  cursor: pointer;
}
.calendar > .page > .week > .day:hover {
  background-color: var(--hover-color, #ffffba);
}
.calendar > .page > .week > .day.selected {
  outline: 1px solid var(--border-color, #ccc);
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
.calendar > .page > .week > .day.holiday > .num {
  color: red;
}
</style>
