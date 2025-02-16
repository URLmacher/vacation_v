<template>
  <q-page>
    <TresCanvas clear-color="#82DBC5" window-size preset="realistic">
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
          :days-clicked-on="daysClickedOn"
          @click:day="handleDayClick"
        />
      </template>
    </TresCanvas>
  </q-page>
</template>

<script setup lang="ts">
  import { OrbitControls } from '@tresjs/cientos';
  import { TresCanvas } from '@tresjs/core';
  import CalendarGrid from 'src/components/CalendarGrid.vue';
  import SceneLighting from 'src/components/SceneLighting.vue';
  import { DATES } from 'src/data';
  import { ICalendarDisplay } from 'src/definitions';
  import {
    isDateSelected,
    isEveryVacationDayOfMonthSelected,
    isVacationDay
  } from 'src/utils/date.utils';
  import { computed, onMounted, ref } from 'vue';

  const daysClickedOn = ref<ICalendarDisplay[]>([]);
  const currentMonth = ref<number | null>(null);

  const handleDayClick = (day: ICalendarDisplay): void => {
    if (
      !day.date ||
      !isVacationDay(day.date) ||
      isDateSelected(day.date, daysClickedOn.value)
    ) {
      return;
    }

    daysClickedOn.value = [...daysClickedOn.value, day];

    if (
      currentMonth.value &&
      isEveryVacationDayOfMonthSelected(currentMonth.value, daysClickedOn.value)
    ) {
      switchMonth();
    }
  };

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
