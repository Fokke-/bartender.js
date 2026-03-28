<template>
  <BartenderBar
    class="centered-dialog"
    name="centered-dialog"
    position="center"
  >
    <div class="centered-dialog__content">
      <h2>Centered dialog</h2>

      <VPButton type="submit" size="medium" text="Close it" v-bartender-close />
    </div>
  </BartenderBar>

  <VPButton
    type="submit"
    size="medium"
    text="Centered dialog"
    v-bartender-open="'centered-dialog'"
  />
</template>

<script setup lang="ts">
import VPButton from 'vitepress/dist/client/theme-default/components/VPButton.vue'
</script>

<style lang="css">
.centered-dialog__content {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  min-width: 100%;
  min-height: 100%;
  font-weight: bold;
}

.centered-dialog__content h2 {
  font-size: 2.5em;
  line-height: 1.2;
  text-align: center;
  margin: 0 0 1em 0;
}
</style>
