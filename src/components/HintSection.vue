<template>
  <div class="hint-section">
    <div class="hint-header">
      <h3>REVEALED HINTS</h3>
      <button
        class="extra-hint-btn"
        :disabled="!canUseExtraHint"
        @click="$emit('use-extra-hint')"
      >
        + HINT (-{{ hintCost }}pt)
      </button>
    </div>
    <div class="hint-pairs">
      <span v-for="m in mappings" :key="m.num" class="hint-pair">
        <span class="hint-num">{{ m.num }}</span>
        <span class="hint-arrow">→</span>
        <span class="hint-letter" :style="{ color: m.isHint ? '#ffaa00' : '#00ff88' }">
          {{ m.letter.toUpperCase() }}
        </span>
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({ mappings: Array, canUseExtraHint: Boolean, hintCost: Number })
defineEmits(['use-extra-hint'])
</script>
