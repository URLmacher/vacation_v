<template>
  <q-page>
    <TresCanvas
      clear-color="#82DBC5"
      window-size
      preset="realistic"
    >
      <TresPerspectiveCamera
        :position="[0, 4, 30]"
        :look-at="[0, 0, 0]"
        :fov="45"
      />
      <SceneLighting />
      <OrbitControls />
      <template v-for="month of months" :key="month">
        <CalendarGrid
          v-if="month === currentMonth"
          :month="month"
          @click:day="switchMonth()"
        />
      </template>
    </TresCanvas>
  </q-page>
</template>

<script setup lang="ts">
  import { TresCanvas } from '@tresjs/core';
  import { OrbitControls } from '@tresjs/cientos';
  import CalendarGrid from 'src/components/CalendarGrid.vue';
  import SceneLighting from 'src/components/SceneLighting.vue';
  import { DATES } from 'src/data';
  import { computed, ref, onMounted } from 'vue';

  const currentMonth = ref<number | null>(null);

  const months = computed<number[]>(() =>
    DATES.reduce<number[]>((acc, dateStr) => {
      const date = new Date(dateStr);
      const month = date.getUTCMonth();
      if (!acc.includes(month)) {
        acc.push(month);
      }

      return acc;
    }, [])
  );

  const switchMonth = (): void => {
    const firstMonth = months.value[0];
    if (firstMonth == null) return;
    const currentIndex = currentMonth.value
      ? months.value.indexOf(currentMonth.value)
      : 0;
    const nextIndex = (currentIndex + 1) % months.value.length;
    currentMonth.value = months.value?.[nextIndex] ?? null;
  };

  onMounted(switchMonth);
</script>
