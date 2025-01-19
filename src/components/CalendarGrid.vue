<template>
  <FloatingText
    text="TresJS"
    :position="[0, 7, 0]"
  />
  <TresGroup name="calendar-grid" :rotation="[-Math.PI / 2, 0, 0]">
    <TresGroup v-for="row in grid.rows" :key="`row-${row}`">
      <TresGroup v-for="col in grid.cols" :key="`col-${col}-${row}`">
        <TresMesh :position="computePosition(col, row)">
          <TresBoxGeometry />
          <TresMeshBasicMaterial color="#3e2917" />
          <FloatingText
            text="Test"
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
  import { computed, reactive } from 'vue';
  import FloatingText from 'src/components/FloatingText.vue';

  const grid = reactive({ cols: 7, gutter: 2.2, rows: 6 });

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
</script>
