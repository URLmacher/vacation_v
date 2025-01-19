<template>
  <Suspense>
    <Text3D
      :text="text"
      font="/fonts/pt_sans_regular.json"
      :position="position"
      :rotation="rotation"
      :scale="scale"
    >
      <TresMeshNormalMaterial />
    </Text3D>
  </Suspense>
</template>

<script setup lang="ts">
  import { Text3D } from '@tresjs/cientos';
  import { TAxis } from 'src/definitions';

  withDefaults(
    defineProps<{
      text: string;
      position?: TAxis;
      rotation?: TAxis;
      scale?: TAxis;
    }>(),
    {
      position: () => [0, 0, 0] as TAxis,
      rotation: () => [0, 0, 0] as TAxis,
      scale: () => [1, 1, 1] as TAxis
    }
  );
</script>
