<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import moment from 'moment';

import { api } from '../api';
import Calendar from '../components/Calendar.vue';
import EventItem from '../components/EventItem.vue';

interface EventEntry {
  type: string;
  list: Array<{ title: string; _id: string }>;
}

const focus = ref(moment().format('YYYY-MM'));
const calendarCurrent = ref(moment().format('YYYY-MM-DD'));
const events = ref<Record<string, EventEntry>>({});
const calendarEvents = ref<Record<string, { type: string; count: number }>>(
  {},
);
const error = ref('');

function prevMonth() {
  focus.value = moment(focus.value).subtract(1, 'months').format('YYYY-MM');
  loadEvents();
}
function nextMonth() {
  focus.value = moment(focus.value).add(1, 'months').format('YYYY-MM');
  loadEvents();
}
function onCalendarClick(day: string) {
  calendarCurrent.value = day;
}

async function loadEvents() {
  error.value = '';
  try {
    const data = await api.docEvents('person', focus.value);

    const evMap: Record<string, EventEntry> = {};
    const calMap: Record<string, { type: string; count: number }> = {};
    for (const v of data) {
      if (typeof evMap[v.eventAt] !== 'object') {
        evMap[v.eventAt] = { type: 'birthday', list: [] };
      }
      evMap[v.eventAt].list.push({ title: v.eventTitle, _id: v.subjectId });

      if (typeof calMap[v.eventAt] !== 'object') {
        calMap[v.eventAt] = { type: 'birthday', count: 0 };
      }
      calMap[v.eventAt].count++;
    }
    events.value = evMap;
    calendarEvents.value = calMap;
  } catch (e) {
    error.value = String(e);
  }
}

const eventsList = computed(() => {
  const ev = events.value[calendarCurrent.value];
  if (ev)
    return ev.list.map((item) => ({
      type: ev.type,
      title: item.title,
      _id: item._id,
    }));
  return [];
});

onMounted(loadEvents);
</script>

<template>
  <div class="events">
    <div class="content">
      <div class="events-calendar">
        <div class="toolbar mb-3">
          <button class="btn btn-outline-secondary" @click="prevMonth">
            &lt;&lt;
          </button>
          <input
            class="selector mx-3 form-control"
            type="month"
            v-model="focus"
            @change="loadEvents"
          />
          <button class="btn btn-outline-secondary" @click="nextMonth">
            &gt;&gt;
          </button>
        </div>
        <Calendar
          :now="focus"
          :events="calendarEvents"
          @click="onCalendarClick"
        />
      </div>

      <div class="events-list">
        <div class="date">{{ calendarCurrent }}</div>
        <p v-if="error" class="error">{{ error }}</p>
        <ul>
          <li v-for="item in eventsList" :key="item._id">
            <EventItem
              :oid="item._id"
              :type="item.type"
              :title="item.title"
            />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
.error {
  color: #b00;
}
</style>
