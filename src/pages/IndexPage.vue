<template>
  <q-page>
    <TresCanvas clear-color="#82DBC5" window-size>
      <TresPerspectiveCamera :position="[3, 3, 3]" :look-at="[0, 0, 0]" />
      <TresMesh>
        <TresTorusGeometry :args="[1, 0.5, 16, 32]" />
        <TresMeshBasicMaterial color="orange" />
      </TresMesh>
      <TresAmbientLight :intensity="1" />
    </TresCanvas>
  </q-page>
</template>

<script setup lang="ts">
  import { TresCanvas } from '@tresjs/core';
</script>
