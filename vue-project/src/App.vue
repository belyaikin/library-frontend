<template>
  <div>
    <NavBar />
    <main class="container">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
</script>
