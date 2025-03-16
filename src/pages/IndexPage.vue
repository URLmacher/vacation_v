<template>
  <q-page @click="startAudio">
    <TresCanvas window-size>
      <Suspense>
        <SandyBeach />
      </Suspense>
      <template v-for="month of months" :key="month">
        <CalendarGrid
          v-if="month === currentMonth"
          :month="month"
          :days-clicked-on="daysClickedOn"
        />
      </template>

      <TresPerspectiveCamera
        :position="[0, 0, 30]"
        :fov="45"
        :aspect="1"
        :near="0.1"
        :far="1000"
      />

      <fpsControls
        :moveSpeed="0.3"
        @isLock="handleControlLock"
        :controlsKeys="keyboardMap"
      >
        <Suspense>
          <ShootyGun ref="shootyGunRef" @hit:target="handleDayClick"/>
        </Suspense>
      </fpsControls>
    </TresCanvas>
    <button id="audioToggle">Audio</button>
  </q-page>
</template>

<script setup lang="ts">
  import { fpsControls } from '@jaimebboyjt/tres-fps-controls';
  import { TresCanvas } from '@tresjs/core';
  import CalendarGrid from 'src/components/CalendarGrid.vue';
  import SandyBeach from 'src/components/SandyBeach.vue';
  import ShootyGun from 'src/components/ShootyGun.vue';
  import { DATES } from 'src/data';
  import { ICalendarDisplay } from 'src/definitions';
  import {
    isDateSelected,
    isEveryVacationDayOfMonthSelected,
    isVacationDay
  } from 'src/utils/date.utils';
  import { computed, onMounted, ref, useTemplateRef } from 'vue';

  const shootyGunRef = useTemplateRef('shootyGunRef');
  const daysClickedOn = ref<ICalendarDisplay[]>([]);
  const currentMonth = ref<number | null>(null);
  const backgroundSound = new Audio('/sounds/beach.mp3');

  const keyboardMap = [
    {
      action: (): void => shootyGunRef.value?.handleShoot(),
      name: 'leftClick'
    },
    { key: 'q', name: 'run', speed: 0.5 },
    { key: 'e', name: 'creep' },
    {
      actions: [],
      name: 'actions'
    },
    { action: (): void => console.log('up'), name: 'wheelActionUp' },
    { action: (): void => console.log('down'), name: 'wheelActionDown' }
  ];

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
    shootyGunRef.value?.removeBulletHoles();
    currentMonth.value = months.value?.[nextIndex] ?? null;
  };

  const handleControlLock = (): void => {
    shootyGunRef.value?.showGun();
  };

  const startAudio = async (): Promise<void> => {
    backgroundSound.volume = 0.2;
    await backgroundSound.play();
  };

  onMounted(switchMonth);
</script>
