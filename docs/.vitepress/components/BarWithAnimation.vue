<template>
  <BartenderBar
    class="bar-with-animation"
    name="bar-with-animation"
    position="right"
  >
    <div class="bar-with-animation__content">
      <h2>Bar with animation</h2>

      <VPButton type="submit" size="medium" text="Close it" v-bartender-close />
    </div>
  </BartenderBar>

  <VPButton
    type="submit"
    size="medium"
    text="Bar with animation"
    v-bartender-open="'bar-with-animation'"
  />
</template>

<script setup lang="ts">
import VPButton from 'vitepress/dist/client/theme-default/components/VPButton.vue'
</script>

<style lang="css">
@keyframes slide-in {
  0% {
    transform: translateX(800px) scale(0);
    transform-origin: -100% 50%;
    opacity: 0;
  }
  100% {
    transform: translateX(0) scale(1);
    transform-origin: -1800px 50%;
    opacity: 1;
  }
}

@keyframes slide-out {
  0% {
    transform: translateX(0) scale(1);
    transform-origin: -1800px 50%;
    opacity: 1;
  }
  100% {
    transform: translateX(1000px) scale(0);
    transform-origin: -100% 50%;
    opacity: 1;
  }
}

.bar-with-animation {
  --max-width: 500px;
  --transition-duration-enter: 600ms;
  --transition-duration-leave: 400ms;
  --animation-name-enter: slide-in;
  --animation-name-leave: slide-out;
}

.bar-with-animation__content {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  min-width: 100%;
  min-height: 100%;
  font-weight: bold;
}

.bar-with-animation__content h2 {
  font-size: 2.5em;
  line-height: 1.2;
  text-align: center;
  margin: 0 0 1em 0;
}
</style>
