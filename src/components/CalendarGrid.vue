<template>
  <FloatingText
    :text="monthLabel"
    :position="[0, 11.5, 0]"
    :size="0.8"
    :surface="ESurfaceType.OTHER"
    :visible="true"
  />
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
        <CalendarDay :day="day" ref="calendarDayRefs" />
      </TresGroup>
    </TresGroup>
  </TresGroup>
</template>

<script setup lang="ts">
  import { TresInstance } from '@tresjs/core/types.js';
  import { format } from 'date-fns';
  import CalendarDay from 'src/components/CalendarDay.vue';
  import FloatingText from 'src/components/FloatingText.vue';
  import { ESurfaceType, ICalendarDisplay, TAxis } from 'src/definitions';
  import {
    getDatesOfMonthFilled,
    getNameOfMonth,
    isDateSelected,
    isHolidayOrWeekend,
    isVacationDay
  } from 'src/utils/date.utils';
  import { computed, reactive, ref, shallowRef, toRefs, watch } from 'vue';

  const props = defineProps<{
    month: number;
    daysConfirmed: ICalendarDisplay[];
  }>();
  const { month, daysConfirmed } = toRefs(props);

  const grid = reactive({ cols: 7, gutter: 2.2, rows: 6 });
  const calendarDisplay = ref<ICalendarDisplay[][]>([]);
  const groupRef = shallowRef<TresInstance>();
  const calendarDayRefs = shallowRef<
    InstanceType<typeof CalendarDay>[] | undefined
  >();

  const computePosition = (col: number, row: number): TAxis => {
    const centerX = ((grid.cols - 1) * grid.gutter) / 2;
    const centerZ = ((grid.rows - 1) * grid.gutter) / 2;

    // Flip the Z position to make sure the first row is at the front
    return [col * grid.gutter - centerX, 0, -(row * grid.gutter - centerZ)];
  };

  const getBoxColor = (date: Date | null): string => {
    if (!date) return '#ffffff';
    if (isDateSelected(date, daysConfirmed.value)) return '#ffffff';
    if (isVacationDay(date)) return '#3af9d9';
    if (isHolidayOrWeekend(date)) return '#556270';
    return '#eff69c';
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
          isSelected: !!date && isDateSelected(date, daysConfirmed.value),
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

  const show = async (): Promise<void> => {
    if (!calendarDayRefs.value) return;
    await Promise.all(calendarDayRefs.value?.map((cD) => cD.show()));
  };

  const hide = async (): Promise<void> => {
    if (!calendarDayRefs.value) return;
    await Promise.all(calendarDayRefs.value?.map((cD) => cD.hide()));
  };

  watch([month, daysConfirmed], updateCalendarDisplay, { immediate: true });

  defineExpose({
    hide,
    show
  });
</script>
