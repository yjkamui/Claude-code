import { ref, reactive, computed } from 'vue'
import { QUOTES } from '../data/quotes.js'

export function useGame() {
  const stage = ref(1)
  const score = ref(0)
  const lives = ref(3)
  const screen = ref('start')
  const usedQuoteIndices = ref([])
  const currentQuote = ref(null)
  const cells = ref([])
  const filledCells = reactive(new Set())
  const hintNumbers = reactive(new Set())
  const letterToNumber = ref({})
  const numberToLetter = ref({})
  const selectedCell = ref(null)
  const wrongGuesses = reactive(new Set())

  const selectedNum = computed(() => {
    if (selectedCell.value === null) return null
    const cell = cells.value[selectedCell.value]
    return cell?.num ?? null
  })

  const totalLetterCells = computed(() =>
    cells.value.filter(c => c.isLetter).length
  )

  const filledCount = computed(() => filledCells.size)

  const progress = computed(() =>
    totalLetterCells.value > 0 ? (filledCount.value / totalLetterCells.value) * 100 : 0
  )

  const knownMappings = computed(() => {
    const nums = new Set([...hintNumbers])
    filledCells.forEach(idx => {
      const cell = cells.value[idx]
      if (cell) nums.add(cell.num)
    })
    return [...nums].sort((a, b) => a - b).map(num => ({
      num,
      letter: numberToLetter.value[num],
      isHint: hintNumbers.has(num),
    }))
  })

  const letterStates = computed(() => {
    const states = {}
    const letterCounts = {}
    const letterFilled = {}
    cells.value.forEach(c => {
      if (!c.isLetter) return
      if (!letterCounts[c.char]) { letterCounts[c.char] = 0; letterFilled[c.char] = 0 }
      letterCounts[c.char]++
      if (filledCells.has(c.index)) letterFilled[c.char]++
    })
    for (const letter of 'abcdefghijklmnopqrstuvwxyz') {
      if (letterFilled[letter] > 0 && letterFilled[letter] >= letterCounts[letter]) {
        states[letter] = 'complete'
      } else if (letterFilled[letter] > 0) {
        states[letter] = 'known'
      } else if (wrongGuesses.has(letter)) {
        states[letter] = 'wrong'
      } else {
        states[letter] = 'default'
      }
    }
    return states
  })

  function createCipher(text) {
    const letters = [...new Set(text.split('').filter(c => /[a-z]/.test(c)))]
    const numbers = Array.from({ length: 26 }, (_, i) => i + 1)
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]]
    }
    const l2n = {}
    const n2l = {}
    letters.forEach((letter, idx) => {
      l2n[letter] = numbers[idx]
      n2l[numbers[idx]] = letter
    })
    letterToNumber.value = l2n
    numberToLetter.value = n2l
    return letters
  }

  function buildCells(text) {
    const result = []
    for (let i = 0; i < text.length; i++) {
      const char = text[i]
      if (/[a-z]/.test(char)) {
        result.push({ index: i, char, num: letterToNumber.value[char], isLetter: true })
      } else {
        result.push({ index: i, char, num: null, isLetter: false })
      }
    }
    cells.value = result
  }

  function selectHints(uniqueLetters) {
    hintNumbers.clear()
    const count = uniqueLetters.length <= 8 ? 4 : 5
    const shuffled = [...uniqueLetters].sort(() => Math.random() - 0.5)
    shuffled.slice(0, Math.min(count, shuffled.length)).forEach(letter => {
      hintNumbers.add(letterToNumber.value[letter])
    })
  }

  function setupStage() {
    lives.value = 3
    wrongGuesses.clear()
    filledCells.clear()
    selectedCell.value = null

    let quoteIndex
    const available = QUOTES.map((_, i) => i).filter(i => !usedQuoteIndices.value.includes(i))
    if (available.length === 0) {
      usedQuoteIndices.value = []
      quoteIndex = Math.floor(Math.random() * QUOTES.length)
    } else {
      quoteIndex = available[Math.floor(Math.random() * available.length)]
    }
    usedQuoteIndices.value.push(quoteIndex)
    currentQuote.value = QUOTES[quoteIndex]

    const text = currentQuote.value.text.toLowerCase()
    const uniqueLetters = createCipher(text)
    buildCells(text)
    selectHints(uniqueLetters)
    cells.value.forEach(c => {
      if (c.isLetter && hintNumbers.has(c.num)) filledCells.add(c.index)
    })
    selectFirstUnfilled()
    screen.value = 'playing'
  }

  function start() {
    stage.value = 1
    score.value = 0
    usedQuoteIndices.value = []
    setupStage()
  }

  function restart() {
    start()
  }

  function nextStage() {
    stage.value++
    setupStage()
  }

  function selectCellAt(idx) {
    selectedCell.value = idx
  }

  function selectFirstUnfilled() {
    for (let i = 0; i < cells.value.length; i++) {
      if (cells.value[i].isLetter && !filledCells.has(i)) {
        selectedCell.value = i
        return
      }
    }
  }

  function selectNextUnfilled() {
    const start = selectedCell.value !== null ? selectedCell.value + 1 : 0
    for (let i = start; i < cells.value.length; i++) {
      if (cells.value[i].isLetter && !filledCells.has(i)) {
        selectedCell.value = i
        return
      }
    }
    for (let i = 0; i < start; i++) {
      if (cells.value[i].isLetter && !filledCells.has(i)) {
        selectedCell.value = i
        return
      }
    }
  }

  function checkWin() {
    return cells.value.every(c => !c.isLetter || filledCells.has(c.index))
  }

  function guess(letter) {
    if (selectedCell.value === null) return 'none'
    const cell = cells.value[selectedCell.value]
    if (!cell || !cell.isLetter) return 'none'

    if (letter === cell.char) {
      filledCells.add(selectedCell.value)
      score.value += 10

      if (checkWin()) {
        const bonus = lives.value * 20
        score.value += bonus
        screen.value = 'clear'
        return 'win'
      }
      selectNextUnfilled()
      return 'correct'
    } else {
      lives.value--
      wrongGuesses.add(letter)
      if (lives.value <= 0) {
        screen.value = 'gameover'
        return 'dead'
      }
      return 'wrong'
    }
  }

  const HINT_COST = 50

  const canUseExtraHint = computed(() => {
    if (score.value < HINT_COST) return false
    const knownNums = new Set([...hintNumbers])
    filledCells.forEach(idx => {
      const cell = cells.value[idx]
      if (cell) knownNums.add(cell.num)
    })
    return cells.value.some(c => c.isLetter && !knownNums.has(c.num))
  })

  function useExtraHint() {
    if (!canUseExtraHint.value) return false
    const knownNums = new Set([...hintNumbers])
    filledCells.forEach(idx => {
      const cell = cells.value[idx]
      if (cell) knownNums.add(cell.num)
    })
    const unknownNums = [...new Set(
      cells.value.filter(c => c.isLetter && !knownNums.has(c.num)).map(c => c.num)
    )]
    if (unknownNums.length === 0) return false
    const newNum = unknownNums[Math.floor(Math.random() * unknownNums.length)]
    hintNumbers.add(newNum)
    cells.value.forEach(c => {
      if (c.isLetter && c.num === newNum) filledCells.add(c.index)
    })
    score.value -= HINT_COST
    if (checkWin()) {
      const bonus = lives.value * 20
      score.value += bonus
      screen.value = 'clear'
    }
    return true
  }

  function getWords() {
    if (!currentQuote.value) return []
    const text = currentQuote.value.text.toLowerCase()
    const words = text.split(' ')
    const result = []
    let globalIdx = 0

    for (const word of words) {
      const wordCells = []
      for (const char of word) {
        wordCells.push({ ...cells.value[globalIdx], globalIdx })
        globalIdx++
      }
      result.push(wordCells)
      globalIdx++
    }
    return result
  }

  return {
    stage, score, lives, screen,
    currentQuote, cells, filledCells, hintNumbers,
    selectedCell, selectedNum, wrongGuesses,
    totalLetterCells, filledCount, progress, knownMappings, letterStates,
    canUseExtraHint, HINT_COST,
    start, restart, nextStage,
    selectCellAt, guess, useExtraHint, getWords,
  }
}
