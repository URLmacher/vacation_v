<template>
  <TresCanvas window-size>
    <Suspense>
      <SandyBeach />
    </Suspense>
    <template v-for="month of months" :key="month">
      <CalendarGrid
        ref="calendarGridRef"
        v-if="month === currentMonth"
        :month="month"
        :days-confirmed="daysConfirmed"
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
        <ShootyGun ref="shootyGunRef" @hit:target="handleDayClick" />
      </Suspense>
    </fpsControls>
  </TresCanvas>
</template>

<script setup lang="ts">
  import { fpsControls } from '@jaimebboyjt/tres-fps-controls';
  import { useProgress } from '@tresjs/cientos';
  import { TresCanvas } from '@tresjs/core';
  import CalendarGrid from 'src/components/CalendarGrid.vue';
  import SandyBeach from 'src/components/SandyBeach.vue';
  import ShootyGun from 'src/components/ShootyGun.vue';
  import { DATES } from 'src/data';
  import { ICalendarDisplay } from 'src/definitions';
  import {
    areAllVacationDaysSelected,
    isDateSelected,
    isEveryVacationDayOfMonthSelected,
    isVacationDay
  } from 'src/utils/date.utils';
  import {
    computed,
    defineExpose,
    onMounted,
    ref,
    shallowRef,
    useTemplateRef,
    watch
  } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  const { resolve } = useRouter();
  const { query } = useRoute();

  const emit = defineEmits<{
    'update:loading': [boolean];
  }>();

  defineProps<{
    gameStarted: boolean;
  }>();

  const shootyGunRef = useTemplateRef('shootyGunRef');
  const calendarGridRef = shallowRef<
    InstanceType<typeof CalendarGrid>[] | undefined
  >();

  const daysConfirmed = ref<ICalendarDisplay[]>([]);
  const currentMonth = ref<number | null>(null);
  const currentRound = ref<number>(1);
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
      isDateSelected(day.date, daysConfirmed.value)
    ) {
      return;
    }

    daysConfirmed.value = [...daysConfirmed.value, day];

    if (areAllVacationDaysSelected(daysConfirmed.value)) {
      endGame();
      return;
    }

    if (
      currentMonth.value &&
      isEveryVacationDayOfMonthSelected(currentMonth.value, daysConfirmed.value)
    ) {
      switchMonth();
    }
  };

  const months = computed<number[]>(() => {
    const uniqueMonths = new Set(
      DATES.map((dateStr) => {
        const date = new Date(dateStr);
        const month = date.getUTCMonth() + 1;
        return month;
      })
    );
    return Array.from(uniqueMonths);
  });

  const switchMonth = async (): Promise<void> => {
    if (!months.value.length) return;
    const currentIndex =
      currentMonth.value !== null
        ? months.value.indexOf(currentMonth.value) + 1
        : 0;

    shootyGunRef.value?.removeBulletHoles();

    await calendarGridRef.value?.[0]?.hide();
    currentMonth.value = months.value[currentIndex] ?? null;
    await calendarGridRef.value?.[0]?.show();
  };

  const handleControlLock = (): void => {
    shootyGunRef.value?.showGun();
  };

  const startAudio = async (): Promise<void> => {
    backgroundSound.volume = 0.2;
    await backgroundSound.play();
  };

  const startGame = (): void => {
    startAudio();
  };

  const endGame = (): void => {
    window.location.href = `${window.location.origin}${
      resolve({
        name: 'home',
        query: { currentRound: ++currentRound.value }
      }).href
    }`;
    window.location.reload();
  };

  onMounted(() => {
    currentRound.value = parseInt(`${query?.currentRound}`) || 1;
    switchMonth();
  });

  defineExpose({
    startGame
  });

  const { hasFinishLoading } = await useProgress();
  const updateLoading = (): void => {
    emit('update:loading', !hasFinishLoading.value);
  };
  watch(hasFinishLoading, updateLoading, { immediate: true });
</script>
