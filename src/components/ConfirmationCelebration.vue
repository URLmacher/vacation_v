<template>
  <div class="confirmation-celebration">
    <div class="confirmation-celebration__ribbon">
      {{ $t('allConfirmed') }}
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
  .confirmation-celebration {
    display: flex;
    justify-content: center;
  }

  .confirmation-celebration__ribbon {
    white-space: nowrap;
    font-size: 24px;
    font-weight: bold;
    color: var(--white-1);

    --s: 1.8em; /* the ribbon size */
    --d: 0.8em; /* the depth */
    --c: 0.8em; /* the cutout part */

    padding: 0 calc(var(--s) + 0.5em) var(--d);
    line-height: 1.8;
    background:
      conic-gradient(
          at left var(--s) bottom var(--d),
          #0000 25%,
          #0008 0 37.5%,
          #0004 0
        )
        0 /50% 100% no-repeat,
      conic-gradient(
          at right var(--s) bottom var(--d),
          #0004 62.5%,
          #0008 0 75%,
          #0000 0
        )
        100%/50% 100% no-repeat;
    clip-path: polygon(
      0 var(--d),
      var(--s) var(--d),
      var(--s) 0,
      calc(100% - var(--s)) 0,
      calc(100% - var(--s)) var(--d),
      100% var(--d),
      calc(100% - var(--c)) calc(50% + var(--d) / 2),
      100% 100%,
      calc(100% - var(--s) - var(--d)) 100%,
      calc(100% - var(--s) - var(--d)) calc(100% - var(--d)),
      calc(var(--s) + var(--d)) calc(100% - var(--d)),
      calc(var(--s) + var(--d)) 100%,
      0 100%,
      var(--c) calc(50% + var(--d) / 2)
    );
    background-color: var(--red-1); /* the main color */
    width: fit-content;
  }
</style>
