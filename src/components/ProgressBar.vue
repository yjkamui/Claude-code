<template>
  <div class="progress-bar">
    <div class="progress-fill" :style="{ width: progress + '%' }"></div>
  </div>
</template>

<script setup>
defineProps({ progress: Number })
</script>
