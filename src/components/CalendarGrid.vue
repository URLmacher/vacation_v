<template>
  <FloatingText :text="monthLabel" :position="[0, 7, 0]" />
  <TresGroup name="calendar-grid" :rotation="[-Math.PI / 2, 0, 0]">
    <TresGroup
      v-for="(week, weekIndex) in calendarDisplay"
      :key="`week-${weekIndex}`"
    >
      <TresGroup
        v-for="(day, dayIndex) in week"
        :key="`day-${dayIndex}-${weekIndex}`"
      >
        <TresMesh :position="day.position" :scale="[1.5, 0.5, 1.5]">
          <TresBoxGeometry />
          <TresMeshBasicMaterial
            :color="day.color"
            roughness="0.8"
            metalness="0.2"
            :opacity="day.date ? 1 : 0"
            :transparent="true"
          />
          <FloatingText
            :text="day.dateLabel"
            :position="[0, -0.5, 0]"
            :rotation="[1.5, 0, 0]"
            :scale="[0.5, 0.5, 0.5]"
          />
        </TresMesh>
      </TresGroup>
    </TresGroup>
  </TresGroup>
</template>

<script setup lang="ts">
  import { format, isToday, isWeekend } from 'date-fns';
  import FloatingText from 'src/components/FloatingText.vue';
  import { getDatesOfMonth, getNameOfMonth } from 'src/utils/date.utils';
  import { computed, reactive, ref, toRefs, watch } from 'vue';

  interface ICalendarDisplay {
    date: Date | null;
    dateLabel: string;
    position: [x: number, z: number, y: number];
    color: string;
  }

  const props = defineProps<{ month: number }>();
  const { month } = toRefs(props);

  const grid = reactive({ cols: 7, gutter: 2.2, rows: 6 });
  const calendarDisplay = ref<ICalendarDisplay[][]>([]);

  const computePosition = (
    col: number,
    row: number
  ): [x: number, z: number, y: number] => {
    const centerX = ((grid.cols - 1) * grid.gutter) / 2;
    const centerZ = ((grid.rows - 1) * grid.gutter) / 2;

    // Flip the Z position to make sure the first row is at the front
    return [col * grid.gutter - centerX, 0, -(row * grid.gutter - centerZ)];
  };

  const getBoxColor = (date: Date | null): string => {
    if (!date) return '#fff';
    if (isWeekend(date)) return '#FFA07A';
    if (isToday(date)) return '#90EE90';
    return '#FFD700';
  };

  const updateCalendarDisplay = (): void => {
    const datesOfMonth = getDatesOfMonth(month.value, grid.cols * grid.rows);
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

  watch(month, updateCalendarDisplay, { immediate: true });
</script>
