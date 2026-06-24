<template>
  <div class="overlay" :class="{ active: show }">
    <div class="modal">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({ show: Boolean })
</script>
