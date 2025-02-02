<template>
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
</template>

<script setup lang="ts"></script>
