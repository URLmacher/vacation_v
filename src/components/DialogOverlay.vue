<template>
  <q-dialog
    v-model="dialogVisible"
    @hide="emit('hide')"
    class="dialog-overlay"
    persistent
  >
    <q-card class="dialog-overlay__card">
      <h1 class="dialog-overlay__title">
        {{ $t('vacationRequest', { year: YEAR }) }}
      </h1>
      <img
        src="public/textures/palm-leaf.png"
        alt=""
        class="dialog-overlay__img"
      />
      <q-btn class="dialog-overlay__btn" @click="hideDialog">{{
        $t('confirmNow')
      }}</q-btn>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  import { YEAR } from 'src/data/index';
  import { ref } from 'vue';

  const emit = defineEmits<{
    hide: [];
  }>();
  const dialogVisible = ref<boolean>(true);

  const showDialog = (): void => {
    dialogVisible.value = true;
  };

  const hideDialog = (): void => {
    dialogVisible.value = false;
  };

  defineExpose({
    showDialog
  });
</script>

<style scoped lang="scss">
  .dialog-overlay {
    position: relative;

    &__title {
      color: var(--violet-7);
      font-weight: bold;
      text-align: right;
      text-shadow:
        0px 0px 0 var(--violet-0),
        1px 1px 0 var(--violet-1),
        2px 2px 0 var(--violet-2),
        3px 3px 0 var(--violet-3),
        4px 4px 0 var(--violet-4),
        5px 5px 0 var(--violet-5),
        6px 6px 0 var(--violet-6),
        7px 7px 6px var(--shadow-7),
        7px 7px 1px var(--shadow-8),
        0px 0px 6px var(--shadow-9);
    }

    &__img {
      position: absolute;
      top: 50%;
      left: 0;
      width: 100px;
      height: 100px;
      opacity: 0.5;
      transform: translateY(-50%) rotate(45deg);
    }

    &__btn {
      font-size: 1.4rem;
      font-weight: bold;
      color: var(--violet-7);
      background-color: var(--turquoise-1);
      padding: 10px 20px;
      margin-top: 20px;
    }

    &__card {
      overflow: hidden;
      padding: 24px;
      background-color: var(--yellow-1);
      height: 60vh;
      max-height: 260px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      box-shadow:
        var(--white-1) 0 -1px 4px,
        var(--yellow-1) 0 -2px 10px,
        var(--orange-1) 0 -10px 20px,
        var(--red-1) 0 -18px 40px,
        0px 5px 15px 5px rgba(0, 0, 0, 0),
        0px -5px 15px 5px rgba(0, 0, 0, 0),
        5px 0px 15px 5px rgba(0, 0, 0, 0),
        -5px 0px 15px 5px rgba(0, 0, 0, 0);

      &::before {
        content: '';
        position: absolute;
        top: 30%;
        right: 24px;

        --d: 15px; /* control the depth */
        padding: 10px;
        width: 200px;
        height: 20px;
        box-sizing: border-box;
        border: solid #0000;
        border-width: 0 var(--d) var(--d) 0;
        clip-path: polygon(
          0 0,
          calc(100% - var(--d)) 0,
          100% var(--d),
          100% 100%,
          var(--d) 100%,
          0 calc(100% - var(--d))
        );
        background: conic-gradient(
            at calc(100% - var(--d)) calc(100% - var(--d)),
            #0004 37.5%,
            #0008 0 75%,
            #0000 0
          )
          border-box var(--turquoise-1); /* the color */
      }
    }
  }

  :global(.q-dialog__backdrop) {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background: var(--brown-1);
    mix-blend-mode: multiply;
  }
  :global(.q-dialog__backdrop::after) {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(20deg, var(--violet-1), transparent),
      url(public/textures/noise.svg);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    filter: contrast(170%) brightness(1000%);
    mix-blend-mode: multiply;
  }
  :global(.q-dialog__backdrop::before) {
    content: '';
    position: absolute;
    opacity: 0.1;
    top: 0px;
    right: 0px;
    --s: 180px; /* control the size of the grid */
    --n: 4; /* control the granularity */
    --t: 2px; /* the thickness */
    --g: 10px; /* the gap between dashes */

    --c: var(--white-2) 25%, #0000 0;
    background:
      conic-gradient(at var(--g) var(--t), var(--c))
        calc((var(--s) / var(--n) - var(--g) + var(--t)) / 2) 0 /
        calc(var(--s) / var(--n)) var(--s),
      conic-gradient(from 180deg at var(--t) var(--g), var(--c)) 0
        calc((var(--s) / var(--n) - var(--g) + var(--t)) / 2) / var(--s)
        calc(var(--s) / var(--n));
    /* you probably don't need to set any size in your case */
    width: calc(round(down, 100%, var(--s)) + var(--t));
    height: calc(4 * var(--s) + var(--t));
  }
</style>
