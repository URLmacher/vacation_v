<template>
  <TresMesh
    :position="day.position"
    :scale="[1.5, 0.5, 1.5]"
    ref="meshRef"
    :user-data="day"
  >
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
      :position="[0, -0.9, 0]"
      :rotation="[1.5, 0, 0]"
      :size="0.3"
    />
  </TresMesh>
</template>

<script setup lang="ts">
  import { dispose } from '@tresjs/core';
  import { TresInstance } from '@tresjs/core/types.js';
  import FloatingText from 'src/components/FloatingText.vue';
  import { ICalendarDisplay } from 'src/definitions';
  import { onBeforeUnmount, shallowRef } from 'vue';

  defineProps<{ day: ICalendarDisplay }>();

  const meshRef = shallowRef<TresInstance>();

  onBeforeUnmount(() => {
    if (meshRef.value) {
      dispose(meshRef.value);
    }
  });
</script>
