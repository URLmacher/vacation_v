<template>
  <Suspense>
    <Text3D
      ref="componentRef"
      :text="text"
      font="/fonts/Chakra Petch_Regular.json"
      :position="position"
      :rotation="rotation"
      :size="size"
      :user-data="{ surface }"
      :visible="visible"
    >
      <TresMeshStandardMaterial color="#951c95" />
    </Text3D>
  </Suspense>
</template>

<script setup lang="ts">
  import { Text3D } from '@tresjs/cientos';
  import { dispose } from '@tresjs/core';
  import { TresInstance } from '@tresjs/core/types.js';
  import { ESurfaceType, TAxis } from 'src/definitions';
  import { onBeforeUnmount, shallowRef, toRefs } from 'vue';

  const props = withDefaults(
    defineProps<{
      text: string;
      position?: TAxis;
      rotation?: TAxis;
      size: number;
      surface?: ESurfaceType;
      visible?: boolean;
    }>(),
    {
      position: () => [0, 0, 0] as TAxis,
      rotation: () => [0, 0, 0] as TAxis
    }
  );
  const { text } = toRefs(props);

  const componentRef = shallowRef<TresInstance>();

  onBeforeUnmount(() => {
    if (componentRef.value) {
      dispose(componentRef.value.instance);
    }
  });
</script>
