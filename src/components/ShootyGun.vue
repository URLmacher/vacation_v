<template>
  <Suspense>
    <GLTFModel
      path="/fake_doom_demo/doom_2016_pistol.glb"
      :scale="0.1"
      :position="gunPosition"
      :rotation="[0, -3, 0]"
    />
  </Suspense>
</template>

<script setup lang="ts">
  import { GLTFModel } from '@tresjs/cientos';
  import { ref } from 'vue';

  const gunPosition = ref([-1000, -1000, -1000]);

  const showGun = (): void => {
    gunPosition.value = [1, -1.75, -2];
  };

  defineExpose({
    showGun
  });
</script>
