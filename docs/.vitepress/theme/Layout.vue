<template>
  <Layout>
    <template #sidebar-nav-after>
      <iframe
        src="https://github.com/sponsors/Fokke-/button"
        title="Sponsor Fokke-"
        height="32"
        width="114"
        loading="lazy"
        style="border: 0"
      ></iframe>
    </template>
  </Layout>
</template>

<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'

const { Layout } = DefaultTheme
</script>
