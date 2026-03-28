<template>
  <BartenderBar
    class="basic-left-aligned-bar"
    name="basic-left-aligned"
    position="left"
  >
    <div class="basic-left-aligned-bar__content">
      <h2>Basic left-aligned bar</h2>

      <VPButton type="submit" size="medium" text="Close it" v-bartender-close />
    </div>
  </BartenderBar>

  <VPButton
    type="submit"
    size="medium"
    text="Basic left-aligned bar"
    v-bartender-open="'basic-left-aligned'"
  />
</template>

<script setup lang="ts">
import VPButton from 'vitepress/dist/client/theme-default/components/VPButton.vue'
</script>

<style lang="css">
.basic-left-aligned-bar__content {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  min-width: 100%;
  min-height: 100%;
  font-weight: bold;
}

.basic-left-aligned-bar__content h2 {
  font-size: 2.5em;
  line-height: 1.2;
  text-align: center;
  margin: 0 0 1em 0;
}
</style>
