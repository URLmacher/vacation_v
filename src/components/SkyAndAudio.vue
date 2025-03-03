<template>
  <GlobalAudio src="/fake_doom_demo/02. At Doom's Gate.mp3" />
</template>

<script setup lang="ts">
  import { useTresContext } from '@tresjs/core';
  import { onMounted } from 'vue';
  import { PMREMGenerator } from 'three';
  import { GlobalAudio } from '@tresjs/cientos';
  import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

  const { renderer, scene } = useTresContext();

  onMounted(() => {
    const loader = new RGBELoader();
    loader.load(
      '/fake_doom_demo/kloofendal_overcast_puresky_2k.hdr',
      (texture) => {
        const pmremGenerator = new PMREMGenerator(renderer.value);
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;

        scene.value.environment = envMap;
        scene.value.background = texture;

        texture.dispose();
        pmremGenerator.dispose();
      }
    );
  });
</script>
