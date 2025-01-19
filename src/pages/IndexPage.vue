<template>
  <q-page>
    <TresCanvas clear-color="#82DBC5" window-size>
      <TresPerspectiveCamera
        :position="[0, 4, 30]"
        :look-at="[0, 0, 0]"
        :fov="45"
      />
      <TresAmbientLight color="#ffffff" />

      <TresPointLight
        color="#fff000"
        :intensity="5"
        :decay="0"
        :position="[0, 5, -20]"
      />
      <TresPointLight
        color="#79573e"
        :intensity="5"
        :decay="0"
        :position="[35, 5, 0]"
      />
      <TresPointLight
        color="#c27439"
        :intensity="5"
        :decay="0"
        :position="[-35, 5, 0]"
      />
      <TresPointLight
        color="#fff000"
        :intensity="5"
        :decay="0"
        :position="[0, 5, 20]"
      />

      <TresSpotLight
        color="#7bccd7"
        :decay="0"
        cast-shadow
        :shadow-mapSize-width="2048"
        :shadow-mapSize-height="2048"
        :position="[0, 25, 0]"
      />

      <TresRectAreaLight
        color="#341212"
        :decay="0"
        :width="1000"
        :height="1000"
        :position="[5, 20, 50]"
        :look-at="[0, 0, 0]"
      />
      <OrbitControls />
      <CalendarGrid :month="1" />
    </TresCanvas>
  </q-page>
</template>

<script setup lang="ts">
  import { TresCanvas } from '@tresjs/core';
  import { OrbitControls } from '@tresjs/cientos';
  import CalendarGrid from 'src/components/CalendarGrid.vue';
</script>
