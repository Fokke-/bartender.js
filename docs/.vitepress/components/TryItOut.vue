<template>
  <div class="try-it-out">
    <h2>Try it out!</h2>

    <div class="try-it-out__content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss">
.try-it-out {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  margin: 48px 0;
  padding: 48px 24px;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;

  h2 {
    margin: 0 0 1em 0;
    padding-top: 0;
    text-align: center;
    border: 0;
  }

  &__content {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }
}
</style>
