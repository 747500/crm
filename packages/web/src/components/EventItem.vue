<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ oid: string; type?: string; title?: string }>();

const typeIcons: Record<string, string> = { birthday: '🎁', default: '💥' };
const Icon = computed(() => typeIcons[props.type ?? ''] ?? typeIcons.default);
</script>

<template>
  <div class="s-event">
    <router-link class="s-doc" :to="`/person/${oid}`">
      <span class="event-data">
        <span class="icon">{{ Icon }}</span>
        <span class="title">{{ title }}</span>
      </span>
    </router-link>
  </div>
</template>

<style scoped>
.s-event {
  position: relative;
}
.s-doc {
  display: block;
  width: calc(100% - 1em);
  border: 1px solid var(--border-color, #ccc);
  margin-bottom: 1em;
  margin-right: 1em;
  border-radius: 0.3em;
  padding: 0.5rem 0.75rem;
  text-decoration: none;
  color: inherit;
}
.s-doc:hover {
  background-color: var(--hover-color, #ffffba);
}
.event-data {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.event-data .icon {
  font-size: 1.2rem;
}
</style>
