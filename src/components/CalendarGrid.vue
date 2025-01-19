<template>
  <FloatingText text="TresJS" :position="[0, 7, 0]" />
  <TresGroup name="calendar-grid" :rotation="[-Math.PI / 2, 0, 0]">
    <TresGroup v-for="row in grid.rows" :key="`row-${row}`">
      <TresGroup v-for="col in grid.cols" :key="`col-${col}-${row}`">
        <TresMesh :position="computePosition(col, row)">
          <TresBoxGeometry />
          <TresMeshBasicMaterial color="#3e2917" />
          <!-- TODO: is rendered backwards somehow -->
          <FloatingText
            :text="getDateLabel(col, row)"
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
  import { format } from 'date-fns';
import FloatingText from 'src/components/FloatingText.vue';
import { getDatesOfMonth } from 'src/utils/date.utils';
import { computed, reactive, ref, toRefs, watch } from 'vue';

  const props = defineProps<{ month: number }>();
  const { month } = toRefs(props);

  const grid = reactive({ cols: 7, gutter: 2.2, rows: 6 });
  const datesOfMonth = ref<(Date | null)[]>([]);

  const gridOffset = computed<{ x: number; z: number }>(() => {
    const x = ((grid.cols - 1) * grid.gutter) / 2;
    const z = ((grid.rows - 1) * grid.gutter) / 2;

    return { x, z };
  });

  const computePosition = (
    col: number,
    row: number
  ): [x: number, z: number, y: number] => [
    (col - 1) * grid.gutter - gridOffset.value.x,
    0,
    (row - 1) * grid.gutter - gridOffset.value.z
  ];

  const getDateLabel = (col: number, row: number): string => {
    const index = (row - 1) * grid.cols + (col - 1);
    const date = datesOfMonth.value[index];
    console.log(date);
    return date ? format(date, 'd') : '';
  };

  watch(
    month,
    () => {
      datesOfMonth.value = getDatesOfMonth(month.value, grid.cols * grid.rows);
      console.log(datesOfMonth.value);
    },
    { immediate: true }
  );
</script>
