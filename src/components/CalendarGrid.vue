<template>
  <FloatingText :text="monthLabel" :position="[0, 11.5, 0]" :size="0.8" />
  <TresGroup
    name="calendar-grid"
    :position="[0, 4, 0]"
    :rotation="[-Math.PI / 2, 0, 0]"
    ref="groupRef"
  >
    <TresGroup
      v-for="(week, weekIndex) in calendarDisplay"
      :key="`week-${weekIndex}`"
    >
      <TresGroup
        v-for="(day, dayIndex) in week"
        :key="`day-${dayIndex}-${weekIndex}`"
      >
        <CalendarDay :day="day" />
      </TresGroup>
    </TresGroup>
  </TresGroup>
</template>

<script setup lang="ts">
  import { TresInstance } from '@tresjs/core/types.js';
  import { format, isToday, isWeekend } from 'date-fns';
  import CalendarDay from 'src/components/CalendarDay.vue';
  import FloatingText from 'src/components/FloatingText.vue';
  import { ICalendarDisplay, TAxis } from 'src/definitions';
  import {
    getDatesOfMonthFilled,
    getNameOfMonth,
    isDateSelected,
    isVacationDay
  } from 'src/utils/date.utils';
  import { computed, reactive, ref, shallowRef, toRefs, watch } from 'vue';

  const props = defineProps<{
    month: number;
    daysClickedOn: ICalendarDisplay[];
  }>();
  const { month, daysClickedOn } = toRefs(props);

  const grid = reactive({ cols: 7, gutter: 2.2, rows: 6 });
  const calendarDisplay = ref<ICalendarDisplay[][]>([]);
  const groupRef = shallowRef<TresInstance>();

  const computePosition = (col: number, row: number): TAxis => {
    const centerX = ((grid.cols - 1) * grid.gutter) / 2;
    const centerZ = ((grid.rows - 1) * grid.gutter) / 2;

    // Flip the Z position to make sure the first row is at the front
    return [col * grid.gutter - centerX, 0, -(row * grid.gutter - centerZ)];
  };

  const getBoxColor = (date: Date | null): string => {
    if (!date) return '#fff';
    if (isDateSelected(date, daysClickedOn.value)) return '#00A36C';
    if (isVacationDay(date)) return '#00FFFF';
    if (isWeekend(date)) return '#FFA07A';
    if (isToday(date)) return '#90EE90';
    return '#FFD700';
  };

  const updateCalendarDisplay = async (): Promise<void> => {
    const datesOfMonth = getDatesOfMonthFilled(
      month.value,
      grid.cols * grid.rows
    );
    const display: ICalendarDisplay[][] = [];

    for (let i = 0; i < grid.rows; i++) {
      const row: ICalendarDisplay[] = [];

      for (let j = 0; j < grid.cols; j++) {
        const index = i * grid.cols + j;
        const date = datesOfMonth[index] ?? null;

        row.push({
          color: getBoxColor(date),
          date: date,
          dateLabel: date ? format(date, 'd') : '',
          isVacationDay: !!date && isVacationDay(date),
          position: computePosition(j, i)
        });
      }

      display.push(row);
    }
    calendarDisplay.value = display;
  };

  const monthLabel = computed<string>(() => {
    return getNameOfMonth(month.value);
  });

  watch([month, daysClickedOn], updateCalendarDisplay, { immediate: true });
</script>
