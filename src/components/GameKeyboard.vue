<template>
  <div class="input-section">
    <div class="input-prompt">
      数字 <span class="target-number">{{ targetNum ?? '?' }}</span> に対応するアルファベットは？
    </div>
    <div class="keyboard">
      <button
        v-for="letter in letters"
        :key="letter"
        class="key-btn"
        :class="{
          'used-wrong': letterStates[letter] === 'wrong',
          'key-known': letterStates[letter] === 'known',
          'key-complete': letterStates[letter] === 'complete',
        }"
        :disabled="letterStates[letter] === 'wrong' || letterStates[letter] === 'complete'"
        @click="$emit('guess', letter)"
      >
        {{ letter }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({ targetNum: Number, wrongGuesses: Set, letterStates: Object })
defineEmits(['guess'])

const letters = 'abcdefghijklmnopqrstuvwxyz'.split('')
</script>
