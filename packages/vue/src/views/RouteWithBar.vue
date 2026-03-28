<template>
  <p>The selected route has Bartender bar defined in view.</p>
  <button v-bartender-toggle="'wunderBar'">Open it</button>

  <BartenderBar name="wunderBar">
    <template #default="{ close }">
      <div class="block">
        <p>Wunderbar!</p>
        <button @click="close">Close</button>
      </div>
    </template>
  </BartenderBar>
</template>

<script lang="ts" setup>
import BartenderBar from '../lib/components/BartenderBar.vue'
</script>
