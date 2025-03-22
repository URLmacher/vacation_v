<template>
  <div class="aiming-reticle"></div>
</template>

<script setup lang="ts"></script>

<style scoped>
  .aiming-reticle {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 8px;
    height: 8px;
    background-color: white;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    opacity: 0.8;
    box-shadow: 0 0 4px rgba(255, 255, 255, 0.7);
  }
</style>
