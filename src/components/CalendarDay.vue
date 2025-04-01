<template>
  <TresMesh
    :position="day.position"
    :scale="scale"
    ref="meshRef"
    :visible="!!day.date"
    :user-data="{
      day: day,
      surface: day.isVacationDay ? ESurfaceType.TARGET : ESurfaceType.NON_TARGET
    }"
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
      :surface="
        day.isVacationDay ? ESurfaceType.TARGET : ESurfaceType.NON_TARGET
      "
      :text="day.dateLabel"
      :position="[0, -0.9, 0]"
      :rotation="[1.5, 0, 0]"
      :size="0.3"
      :visible="!!day.date"
    />
  </TresMesh>
</template>

<script setup lang="ts">
  import { dispose, useLoop } from '@tresjs/core';
  import { TresInstance } from '@tresjs/core/types.js';
  import FloatingText from 'src/components/FloatingText.vue';
  import { ESurfaceType, ICalendarDisplay, TAxis } from 'src/definitions';
  import { lerp } from 'three/src/math/MathUtils.js';
  import { onBeforeUnmount, ref, shallowRef } from 'vue';

  defineProps<{ day: ICalendarDisplay }>();

  const meshRef = shallowRef<TresInstance>();

  const targetScale = ref<TAxis>([1.5, 0.5, 1.5]);
  const scale = ref<TAxis>([0.1, 0.1, 0.1]);
  const animationSpeed = 10.0;
  let resolveAnimation: (() => void) | null = null;

  const { onBeforeRender } = useLoop();

  onBeforeRender(({ delta }) => {
    if (!meshRef.value) return;

    let allClose = true;

    scale.value = scale.value.map((s, i) => {
      const newValue = lerp(
        s,
        targetScale.value[i] ?? 0,
        delta * animationSpeed
      );
      if (Math.abs(newValue - (targetScale.value[i] ?? 0)) > 0.01) {
        allClose = false;
      }
      return newValue;
    }) as TAxis;

    if (allClose && resolveAnimation) {
      resolveAnimation();
      resolveAnimation = null;
    }
  });

  const animateToScale = (newScale: TAxis): Promise<void> => {
    targetScale.value = newScale;
    return new Promise((resolve) => {
      resolveAnimation = resolve;
    });
  };

  const show = async (): Promise<void> => animateToScale([1.5, 0.5, 1.5]);
  const hide = async (): Promise<void> => animateToScale([0.1, 0.1, 0.1]);

  onBeforeUnmount(() => {
    if (meshRef.value) {
      dispose(meshRef.value);
    }
  });

  defineExpose({
    hide,
    show
  });
</script>
