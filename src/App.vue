<template>
  <div class="container">
    <header>
      <h1>CRYPTOGRAM</h1>
      <p>暗号解読ゲーム - 名言に隠された文字を解き明かせ</p>
    </header>

    <StatusBar :stage="game.stage.value" :lives="game.lives.value" :score="game.score.value" />
    <ProgressBar :progress="game.progress.value" />

    <PuzzleArea
      :words="game.getWords()"
      :filled-cells="game.filledCells"
      :selected-cell="game.selectedCell.value"
      :selected-num="game.selectedNum.value"
      :author="game.currentQuote.value?.author ?? ''"
      @select-cell="onSelectCell"
    />

    <HintSection :mappings="game.knownMappings.value" />

    <GameKeyboard
      :target-num="game.selectedNum.value"
      :wrong-guesses="game.wrongGuesses"
      @guess="onGuess"
    />
  </div>

  <!-- Start Screen -->
  <GameModal :show="game.screen.value === 'start'">
    <h2 class="success-color">CRYPTOGRAM</h2>
    <p style="color:#888; margin-bottom:20px;">暗号解読ゲーム</p>
    <ul class="rules">
      <li>英語の名言が暗号化されています。各アルファベットは数字に置き換えられています。</li>
      <li>ステージ開始時にいくつかの数字→文字の対応表がヒントとして表示されます。</li>
      <li>マスをタップして選択し、正しいアルファベットを入力してください。1マスずつ埋めていきます。</li>
      <li>ライフは各ステージ <strong style="color:#ff4444;">3つ</strong> です。0になるとゲームオーバー。</li>
      <li>全てのマスを埋めるとステージクリアです！</li>
    </ul>
    <button class="modal-btn" @click="game.start()">START GAME</button>
  </GameModal>

  <!-- Stage Clear -->
  <GameModal :show="game.screen.value === 'clear'">
    <h2 class="success-color">STAGE CLEAR!</h2>
    <div class="quote-reveal">"{{ game.currentQuote.value?.text }}"</div>
    <div class="quote-author">— {{ game.currentQuote.value?.author }}</div>
    <div class="stats">
      残りライフボーナス: +{{ game.lives.value * 20 }}  |  合計スコア: {{ game.score.value }}
    </div>
    <button class="modal-btn" @click="game.nextStage()">NEXT STAGE</button>
  </GameModal>

  <!-- Game Over -->
  <GameModal :show="game.screen.value === 'gameover'">
    <h2 class="fail-color">GAME OVER</h2>
    <div class="quote-reveal">"{{ game.currentQuote.value?.text }}"</div>
    <div class="quote-author">— {{ game.currentQuote.value?.author }}</div>
    <div class="stats">
      ステージ {{ game.stage.value }} で終了  |  最終スコア: {{ game.score.value }}
    </div>
    <button class="modal-btn" @click="game.restart()">RETRY</button>
  </GameModal>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useGame } from './composables/useGame.js'
import { useHaptics, initHaptics } from './composables/useHaptics.js'
import StatusBar from './components/StatusBar.vue'
import ProgressBar from './components/ProgressBar.vue'
import PuzzleArea from './components/PuzzleArea.vue'
import HintSection from './components/HintSection.vue'
import GameKeyboard from './components/GameKeyboard.vue'
import GameModal from './components/GameModal.vue'

const game = useGame()
const haptics = useHaptics()

onMounted(() => { initHaptics() })

function onSelectCell(idx) {
  haptics.light()
  game.selectCellAt(idx)
}

function onGuess(letter) {
  const result = game.guess(letter)
  if (result === 'correct') haptics.medium()
  else if (result === 'wrong') haptics.error()
  else if (result === 'win') haptics.success()
  else if (result === 'dead') haptics.error()
}

function onKeyDown(e) {
  if (game.screen.value !== 'playing') return
  const key = e.key.toLowerCase()
  if (/^[a-z]$/.test(key)) onGuess(key)
}

onMounted(() => document.addEventListener('keydown', onKeyDown))
onUnmounted(() => document.removeEventListener('keydown', onKeyDown))
</script>
