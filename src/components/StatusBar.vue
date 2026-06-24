<template>
  <div class="status-bar">
    <div class="stage-info">STAGE {{ stage }}</div>
    <div class="lives">
      <span v-for="i in 3" :key="i">
        <span v-if="i <= lives">❤️</span>
        <span v-else class="lost">🖤</span>
      </span>
    </div>
    <div class="score-info">SCORE: {{ score }}</div>
  </div>
</template>

<script setup>
defineProps({ stage: Number, lives: Number, score: Number })
</script>
