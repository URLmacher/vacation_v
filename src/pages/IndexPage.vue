<template>
  <q-page :class="{ invisible: !gameStarted }">
    <Suspense>
      <VacationGame
        :game-started="gameStarted"
        ref="vacationGameRef"
        @update:loading="loading = $event"
      />
    </Suspense>
    <template v-if="gameStarted">
      <button class="hidden" id="audioToggle"></button>
      <AimingReticle />
    </template>

    <DialogOverlay
      @hide="startGame()"
      :current-round="currentRound"
      :loading="loading"
    />
  </q-page>
</template>

<script setup lang="ts">
  import AimingReticle from 'src/components/AimingReticle.vue';
  import DialogOverlay from 'src/components/DialogOverlay.vue';
  import VacationGame from 'src/components/VacationGame.vue';
  import { onMounted, ref, useTemplateRef } from 'vue';
  import { useRoute } from 'vue-router';

  const { query } = useRoute();

  const vacationGameRef = useTemplateRef('vacationGameRef');
  const currentRound = ref<number>(1);
  const gameStarted = ref<boolean>(false);
  const loading = ref<boolean>(true);

  const startGame = (): void => {
    gameStarted.value = true;
    vacationGameRef.value?.startGame();
  };

  onMounted(() => {
    currentRound.value = parseInt(`${query?.currentRound}`) || 1;
  });
</script>
