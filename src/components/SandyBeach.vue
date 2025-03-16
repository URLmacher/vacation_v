<template>
  <BackgroundSky />
  <SceneLighting />
  <Ocean :position="[0, -10, 0]" />
  <TresMesh :position="[0, -10, 0]" :rotation="[-Math.PI / 2, 0, 0]">
    <TresPlaneGeometry :args="[100, 100, 200, 200]" />
    <TresMeshStandardMaterial
      color="yellow"
      :map="colorMap"
      :displacementMap="displacementMap"
      :normalMap="normalMap"
      :roughnessMap="roughnessMap"
      :aoMap="aoMap"
      :displacementScale="1.4"
    />
  </TresMesh>
</template>

<script setup lang="ts">
  import { Ocean } from '@tresjs/cientos';
  import { useTexture } from '@tresjs/core';
  import BackgroundSky from 'src/components/BackgroundSky.vue';
  import SceneLighting from 'src/components/SceneLighting.vue';

  const [colorMap, displacementMap, normalMap, roughnessMap, aoMap] =
    await useTexture([
      '/textures/floor/Ground055L_1K-JPG_Color.jpg',
      '/textures/floor/Ground055L_1K-JPG_Displacement.jpg',
      '/textures/floor/Ground055L_1K-JPG_NormalGL.jpg',
      '/textures/floor/Ground055L_1K-JPG_Roughness.jpg',
      '/textures/floor/Ground055L_1K-JPG_AmbientOcclusion.jpg'
    ]);
</script>
