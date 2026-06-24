<template>
  <div class="puzzle-area">
    <div class="puzzle-words">
      <span v-for="(word, wi) in words" :key="wi" class="word-group">
        <span
          v-for="cell in word"
          :key="cell.globalIdx"
          class="puzzle-char"
          :class="cellClass(cell)"
          @click="onCellClick(cell)"
        >
          <template v-if="cell.isLetter">
            <span class="number">{{ cell.num }}</span>
            <span class="letter-box">{{ filledCells.has(cell.globalIdx) ? cell.char : '' }}</span>
          </template>
          <template v-else>
            <span class="number"></span>
            <span class="letter-box">{{ cell.char }}</span>
          </template>
        </span>
      </span>
    </div>
    <div class="author-line">— {{ author }}</div>
  </div>
</template>

<script setup>
const props = defineProps({
  words: Array,
  filledCells: Set,
  selectedCell: Number,
  selectedNum: Number,
  author: String,
})

const emit = defineEmits(['select-cell'])

function cellClass(cell) {
  if (!cell.isLetter) return 'punctuation'
  const filled = props.filledCells.has(cell.globalIdx)
  const selected = props.selectedCell === cell.globalIdx
  const sameNumber = props.selectedNum !== null && cell.num === props.selectedNum && !filled && !selected
  return {
    revealed: filled,
    selected,
    'same-number': sameNumber,
  }
}

function onCellClick(cell) {
  if (cell.isLetter && !props.filledCells.has(cell.globalIdx)) {
    emit('select-cell', cell.globalIdx)
  }
}
</script>
