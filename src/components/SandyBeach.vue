<template>
  <BackgroundSky />
  <SceneLighting />
  <Ocean :position="[0, -10, 0]" :user-data="{ surface: ESurfaceType.WATER }" />
  <TresMesh
    :position="[0, -9.8, 0]"
    :rotation="[-Math.PI / 2, 0, 0]"
    :user-data="{ surface: ESurfaceType.SAND }"
  >
    <TresPlaneGeometry :args="[100, 100, 200, 200]" />
    <TresMeshStandardMaterial
      :user-data="{ surface: ESurfaceType.SAND }"
      color="#eff69c"
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
  import { ESurfaceType } from 'src/definitions';

  const [colorMap, displacementMap, normalMap, roughnessMap, aoMap] =
    await useTexture([
      '/textures/floor/Ground055L_1K-JPG_Color.jpg',
      '/textures/floor/Ground055L_1K-JPG_Displacement.jpg',
      '/textures/floor/Ground055L_1K-JPG_NormalGL.jpg',
      '/textures/floor/Ground055L_1K-JPG_Roughness.jpg',
      '/textures/floor/Ground055L_1K-JPG_AmbientOcclusion.jpg'
    ]);
</script>
