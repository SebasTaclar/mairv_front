<template>
  <div class="impostor-container">
    <!-- Header -->
    <header class="impostor-header">
      <div class="header-top">
        <h1> El Impostor</h1>
        <p class="subtitle">Descubre quien es el impostor entre los jugadores</p>
        <button v-if="playerNames.length > 0 && currentStep !== 'playerCount' && currentStep !== 'playerNames'"
          @click="quickRestartGame" class="restart-btn">
          Reiniciar Juego
        </button>
      </div>
    </header>

    <!-- Player Count Selection -->
    <div v-if="currentStep === 'playerCount'" class="setup-screen">
      <div class="setup-card">
        <h2>Cuantos Jugadores?</h2>

        <div class="player-count-input">
          <label for="playerCount">Numero de Jugadores:</label>
          <div class="input-group">
            <button @click="decreasePlayerCount" class="btn-decrease">-</button>
            <input v-model.number="numPlayers" type="number" id="playerCount" min="3" max="25"
              @blur="validatePlayerCount" class="input-number" />
            <button @click="increasePlayerCount" class="btn-increase">+</button>
          </div>
          <p class="player-range">Minimo 3 - Maximo 25 jugadores</p>
        </div>

        <div class="player-preview">
          <p class="preview-text">Vas a tener <span class="highlight">{{ numPlayers }}</span> jugadores</p>
        </div>

        <button @click="goToNamesStep" class="btn-next" :disabled="numPlayers < 3 || numPlayers > 25">
          Siguiente
        </button>
      </div>
    </div>

    <!-- Player Names Input -->
    <div v-if="currentStep === 'playerNames'" class="setup-screen">
      <div class="names-card">
        <h2>Nombres de Jugadores</h2>

        <div class="all-names-inputs">
          <div v-for="(name, idx) in playerNames" :key="idx" class="single-name-input">
            <label>Jugador {{ idx + 1 }}:</label>
            <input v-model="playerNames[idx]" type="text" :placeholder="'Nombre del jugador ' + (idx + 1)"
              class="name-input" />
          </div>
        </div>

        <div class="player-management">
          <button @click="addPlayer" class="btn-decrease">
            + Agregar Jugador
          </button>
          <button @click="removePlayer" class="btn-decrease" :disabled="playerNames.length <= 3">
            - Remover Jugador
          </button>
        </div>

        <div class="button-group">
          <button @click="goBackToCount" class="btn-back">
            Atras
          </button>
          <button @click="goToSelectImpostors" class="btn-next" :disabled="!allNamesComplete">
            Siguiente
          </button>
        </div>
      </div>
    </div>

    <!-- Confirm Clear Names Popup -->
    <div v-if="showConfirmClearNames" class="popup-overlay">
      <div class="popup-dialog">
        <h2>Ojo!</h2>
        <p class="popup-message">Vas a borrar los nombres de los jugadores, estás seguro?</p>
        <div class="button-group">
          <button @click="cancelClearNames" class="btn-next">
            Cancelar
          </button>
          <button @click="confirmClearNames" class="btn-back">
            Sí, Borrar Nombres
          </button>
        </div>
      </div>
    </div> <!-- Select Number of Impostors -->
    <div v-if="currentStep === 'selectImpostors'" class="setup-screen">
      <div class="setup-card">
        <h2>Numero de Impostores</h2>

        <div class="impostor-count-input">
          <label for="impostorCount">Cuantos Impostores?</label>
          <div class="input-group">
            <button @click="decreaseImpostorCount" class="btn-decrease">-</button>
            <input v-model.number="numImpostors" type="number" id="impostorCount" min="1" :max="numPlayers - 2"
              @input="validateImpostorCount" class="input-number" />
            <button @click="increaseImpostorCount" class="btn-increase">+</button>
          </div>
          <p class="impostor-range">Minimo 1 - Maximo {{ numPlayers - 2 }} impostores</p>
        </div>

        <div class="impostor-preview">
          <p class="preview-text">Habra <span class="highlight">{{ numImpostors }}</span> impostor(es)</p>
        </div>

        <div class="hint-option">
          <p class="option-title">Modo de Juego:</p>
          <div class="hint-toggle">
            <label>
              <input type="radio" v-model="showHintsToImpostor" :value="true" />
              Con Pista
            </label>
            <label>
              <input type="radio" v-model="showHintsToImpostor" :value="false" />
              Sin Pista
            </label>
          </div>
        </div>

        <div class="button-group">
          <button @click="currentStep = 'playerNames'" class="btn-back">
            Atras
          </button>
          <button @click="goToSelectWord" class="btn-next">
            Siguiente
          </button>
        </div>
      </div>
    </div>

    <!-- Select or Write Word -->
    <div v-if="currentStep === 'selectWord'" class="setup-screen">
      <div class="setup-card">
        <h2>Palabra del Juego</h2>

        <div class="word-selection">
          <div class="word-option">
            <label>
              <input type="radio" v-model="wordMode" value="random" />
              Palabra Aleatoria
            </label>
          </div>
          <div class="word-option">
            <label>
              <input type="radio" v-model="wordMode" value="custom" />
              Escribir Palabra
            </label>
          </div>

          <div v-if="wordMode === 'custom'" class="custom-word-input">
            <input v-model="customWord" type="text" placeholder="Escribe la palabra para este juego" class="name-input"
              maxlength="50" />
            <div v-if="showHintsToImpostor" class="custom-hint-input">
              <label>Pista para los Impostores (opcional):</label>
              <input v-model="customHint" type="text" placeholder="Escribe la pista" class="name-input"
                maxlength="100" />
            </div>
          </div>

          <div v-if="wordMode === 'random'" class="word-categories">
            <p>Categoria (opcional):</p>

            <div class="biblical-section">
              <h3 class="section-title">?? Bíblica</h3>
              <div class="category-buttons">
                <button v-for="cat in categoryList.slice(0, 5)" :key="cat"
                  @click="selectedCategory = selectedCategory === cat ? null : cat"
                  :class="['category-btn', { active: selectedCategory === cat }]">
                  {{ cat }}
                </button>
              </div>
            </div>

            <div class="other-section">
              <h3 class="section-title">?? Otras</h3>
              <div class="category-buttons">
                <button v-for="cat in categoryList.slice(5)" :key="cat"
                  @click="selectedCategory = selectedCategory === cat ? null : cat"
                  :class="['category-btn', { active: selectedCategory === cat }]">
                  {{ cat }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="button-group">
          <button @click="currentStep = 'selectImpostors'" class="btn-back">
            Atras
          </button>
          <button @click="goToStartGame" class="btn-next" :disabled="!isWordValid">
            Siguiente
          </button>
        </div>
      </div>
    </div>

    <!-- Card Preview - Everyone sees their card -->
    <div v-if="currentStep === 'cardPreview'" class="gameplay-screen">
      <div class="game-header">
        <h2>Turno del Jugador {{ previewOrderIndex + 1 }} de {{ playerNames.length }}</h2>
        <p class="current-player-name">{{ playerNames[playerOrder[previewOrderIndex]] }}</p>
      </div>

      <div class="card-container">
        <div :class="['flip-card', { flipped: previewCardFlipped }]" @mousedown="previewCardFlipped = true"
          @mouseup="previewCardFlipped = false" @mouseleave="previewCardFlipped = false"
          @touchstart="previewCardFlipped = true" @touchend="previewCardFlipped = false">
          <div class="flip-card-inner">
            <div class="flip-card-front">
              <p>Presiona para ver</p>
            </div>
            <div :class="['flip-card-back', { impostor: impostorIndices.includes(playerOrder[previewOrderIndex]) }]">
              <template v-if="impostorIndices.includes(playerOrder[previewOrderIndex])">
                <p class="impostor-text">ERES EL IMPOSTOR</p>
                <p v-if="showHintsToImpostor && currentHint" class="impostor-hint">pista: {{ currentHint }}
                </p>
              </template>
              <p v-else class="word-text">{{ currentWord }}</p>
            </div>
          </div>
        </div>
      </div>

      <p class="card-hint">Mantén presionado para voltear la tarjeta</p>

      <div class="button-group">
        <button @click="nextCardPreview" class="btn-next">
          {{ previewOrderIndex === playerNames.length - 1 ? 'Continuar' : 'Siguiente Jugador' }}
        </button>
      </div>
    </div>

    <!-- Select Starting Player -->
    <div v-if="currentStep === 'startGame'" class="setup-screen">
      <div class="game-end-card">
        <h2>Comienza el Juego!</h2>
        <p class="end-message">El jugador que comienza es:</p>
        <div class="start-player-box">
          <p class="start-player-name">{{ playerNames[startingPlayerIndex] }}</p>
        </div>

        <div class="button-group">
          <button @click="selectNewStart" class="btn-back">
            Otro Jugador
          </button>
          <button @click="initializeGameplay" class="btn-next">
            Revelar Impostor
          </button>
        </div>
      </div>
    </div>

    <!-- Gameplay - Card Flipping -->
    <div v-if="currentStep === 'gameplay'" class="gameplay-screen">
      <div class="game-header">
        <h2>Turno del Jugador {{ currentOrderIndex + 1 }} de {{ playerNames.length }}</h2>
        <p class="current-player-name">{{ playerNames[currentPlayerIndex] }}</p>
      </div>

      <div class="card-container">
        <div :class="['flip-card', { flipped: cardFlipped }]" @mousedown="cardFlipped = true"
          @mouseup="cardFlipped = false" @mouseleave="cardFlipped = false" @touchstart="cardFlipped = true"
          @touchend="cardFlipped = false">
          <div class="flip-card-inner">
            <div class="flip-card-front">
              <p>Presiona para ver</p>
            </div>
            <div :class="['flip-card-back', { impostor: isCurrentPlayerImpostor }]">
              <template v-if="isCurrentPlayerImpostor">
                <p class="impostor-text">ERES EL IMPOSTOR</p>
                <p v-if="showHintsToImpostor && currentHint" class="impostor-hint">pista: {{ currentHint }}
                </p>
              </template>
              <p v-else class="word-text">{{ currentWord }}</p>
            </div>
          </div>
        </div>
      </div>

      <p class="card-hint">Mantén presionado para voltear la tarjeta</p>

      <div class="button-group">
        <button @click="previousPlayer" class="btn-back" :disabled="currentOrderIndex === 0">
          Anterior Jugador
        </button>
        <button @click="nextPlayer" class="btn-next">
          {{ currentOrderIndex === playerOrder.length - 1 ? 'Terminar Juego' : 'Siguiente Jugador' }}
        </button>
      </div>
    </div>

    <!-- Confirm End Game -->
    <div v-if="currentStep === 'confirmEnd'" class="setup-screen">
      <div class="game-end-card">
        <h2>Confirmar Terminar</h2>
        <p class="end-message">Estás seguro que deseas terminar el juego?</p>

        <div class="button-group">
          <button @click="currentStep = 'gameplay'" class="btn-back">
            Continuar Jugando
          </button>
          <button @click="goToGameEnd" class="btn-next">
            Sí, Terminar Juego
          </button>
        </div>
      </div>
    </div>

    <!-- Game End -->
    <div v-if="currentStep === 'gameEnd'" class="setup-screen">
      <div class="game-end-card">
        <h2>Juego Terminado!</h2>
        <p class="end-message">La palabra era: <span class="highlight">{{ currentWord }}</span></p>
        <div class="impostors-reveal">
          <h3>Los Impostores Eran:</h3>
          <ul>
            <li v-for="(idx) in impostorIndices" :key="idx">
              {{ playerNames[idx] }}
            </li>
          </ul>
        </div>
        <button @click="quickRestartGame" class="btn-next">
          Volver al Menu
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import './styles/ImpostorPage.css'
import { ref, computed, watch, onMounted } from 'vue'
import wordDictionary from '../data/impostor-words.json'

// Load configuration from localStorage
const loadGameConfig = () => {
  const saved = localStorage.getItem('impostorGameConfig')
  if (saved) {
    try {
      const config = JSON.parse(saved)
      numImpostors.value = config.numImpostors || 1
      showHintsToImpostor.value = config.showHintsToImpostor !== false
      wordMode.value = config.wordMode || 'random'
      selectedCategory.value = config.selectedCategory || null
    } catch (e) {
      console.error('Error loading game config:', e)
    }
  }
}

// Load full game state from localStorage
const loadGameState = () => {
  const saved = localStorage.getItem('impostorGameState')
  if (saved) {
    try {
      const state = JSON.parse(saved)
      // Solo restaurar si estaba en progreso (no en playerCount)
      if (state.currentStep && state.currentStep !== 'playerCount') {
        currentStep.value = state.currentStep
        numPlayers.value = state.numPlayers || 3
        playerNames.value = state.playerNames || []
        numImpostors.value = state.numImpostors || 1
        currentWord.value = state.currentWord || ''
        currentHint.value = state.currentHint || ''
        customWord.value = state.customWord || ''
        customHint.value = state.customHint || ''
        impostorIndices.value = state.impostorIndices || []
        startingPlayerIndex.value = state.startingPlayerIndex || 0
        playerOrder.value = state.playerOrder || []
        currentPlayerIndex.value = state.currentPlayerIndex || 0
        currentOrderIndex.value = state.currentOrderIndex || 0
        previewOrderIndex.value = state.previewOrderIndex || 0
      }
    } catch (e) {
      console.error('Error loading game state:', e)
    }
  }
}

// Save configuration to localStorage
const saveGameConfig = () => {
  const config = {
    numImpostors: numImpostors.value,
    showHintsToImpostor: showHintsToImpostor.value,
    wordMode: wordMode.value,
    selectedCategory: selectedCategory.value
  }
  localStorage.setItem('impostorGameConfig', JSON.stringify(config))
}

// Save full game state to localStorage
const saveGameState = () => {
  const state = {
    currentStep: currentStep.value,
    numPlayers: numPlayers.value,
    playerNames: playerNames.value,
    numImpostors: numImpostors.value,
    currentWord: currentWord.value,
    currentHint: currentHint.value,
    customWord: customWord.value,
    customHint: customHint.value,
    impostorIndices: impostorIndices.value,
    startingPlayerIndex: startingPlayerIndex.value,
    playerOrder: playerOrder.value,
    currentPlayerIndex: currentPlayerIndex.value,
    currentOrderIndex: currentOrderIndex.value,
    previewOrderIndex: previewOrderIndex.value
  }
  localStorage.setItem('impostorGameState', JSON.stringify(state))
}

// State
const currentStep = ref<'playerCount' | 'playerNames' | 'selectImpostors' | 'selectWord' | 'cardPreview' | 'startGame' | 'gameplay' | 'confirmEnd' | 'gameEnd'>('playerCount')
const numPlayers = ref(3)
const playerNames = ref<string[]>([])
const numImpostors = ref(1)
const currentPlayerIndex = ref(0)
const cardFlipped = ref(false)
const currentWord = ref('')
const currentHint = ref('')
const impostorIndices = ref<number[]>([])
const wordMode = ref<'random' | 'custom'>('random')
const customWord = ref('')
const customHint = ref('')
const selectedCategory = ref<string | null>(null)
const startingPlayerIndex = ref(0)
const playerOrder = ref<number[]>([])
const currentOrderIndex = ref(0)
const showConfirmClearNames = ref(false)
const previewCardFlipped = ref(false)
const previewOrderIndex = ref(0)
const showHintsToImpostor = ref(true)

// Get categories from word dictionary - ordered by biblical first, then others
const categoryList = computed(() => {
  const categories = Object.keys(wordDictionary) as Array<keyof typeof wordDictionary>
  const biblicalCategories = ['biblia', 'libros', 'personajes_biblicos', 'acontecimientos', 'dichos_o_refranes']
  const biblicalCats = categories.filter(cat => biblicalCategories.includes(cat as string))
  const otherCats = categories.filter(cat => !biblicalCategories.includes(cat as string))
  return [...biblicalCats, ...otherCats]
})

// Computed
const allNamesComplete = computed(() => {
  return playerNames.value.every(name => name.trim().length > 0)
})

const isCurrentPlayerImpostor = computed(() => {
  return impostorIndices.value.includes(currentPlayerIndex.value)
})

const isWordValid = computed(() => {
  if (wordMode.value === 'custom') {
    return customWord.value.trim().length > 0
  }
  return true
})

// Methods
const validatePlayerCount = () => {
  if (numPlayers.value < 3) numPlayers.value = 3
  if (numPlayers.value > 25) numPlayers.value = 25
}

const increasePlayerCount = () => {
  if (numPlayers.value < 25) {
    numPlayers.value++
  }
}

const decreasePlayerCount = () => {
  if (numPlayers.value > 3) {
    numPlayers.value--
  }
}

const goToNamesStep = () => {
  playerNames.value = Array(numPlayers.value).fill('')
  currentStep.value = 'playerNames'
}

const goBackToCount = () => {
  showConfirmClearNames.value = true
}

const confirmClearNames = () => {
  showConfirmClearNames.value = false
  currentStep.value = 'playerCount'
  playerNames.value = []
}

const cancelClearNames = () => {
  showConfirmClearNames.value = false
}

const addPlayer = () => {
  if (playerNames.value.length < 25) {
    playerNames.value.push('')
    numPlayers.value = playerNames.value.length
  }
}

const removePlayer = () => {
  if (playerNames.value.length > 3) {
    playerNames.value.pop()
    numPlayers.value = playerNames.value.length
  }
}

const goToSelectImpostors = () => {
  currentStep.value = 'selectImpostors'
}

const validateImpostorCount = () => {
  if (numImpostors.value < 1) numImpostors.value = 1
  if (numImpostors.value > numPlayers.value - 2) numImpostors.value = numPlayers.value - 2
}

const increaseImpostorCount = () => {
  if (numImpostors.value < numPlayers.value - 2) {
    numImpostors.value++
  }
}

const decreaseImpostorCount = () => {
  if (numImpostors.value > 1) {
    numImpostors.value--
  }
}

const goToSelectWord = () => {
  wordMode.value = 'random'
  customWord.value = ''
  customHint.value = ''
  selectedCategory.value = null
  currentStep.value = 'selectWord'
}

const selectWord = () => {
  if (wordMode.value === 'custom') {
    currentWord.value = customWord.value.trim()
    currentHint.value = customHint.value.trim()
  } else {
    // Select random word
    let categoriesToUse = categoryList.value
    if (selectedCategory.value) {
      categoriesToUse = [selectedCategory.value as keyof typeof wordDictionary]
    }

    const randomCategory = categoriesToUse[Math.floor(Math.random() * categoriesToUse.length)]
    const words = wordDictionary[randomCategory]
    const selectedWordObj = words[Math.floor(Math.random() * words.length)]

    // Extract word and hint from the object structure
    if (typeof selectedWordObj === 'string') {
      currentWord.value = selectedWordObj
      currentHint.value = ''
    } else {
      currentWord.value = selectedWordObj.word
      currentHint.value = selectedWordObj.hint
    }
  }
}

const goToStartGame = () => {
  selectWord()
  // Select random impostors para la preview
  const indices = Array.from({ length: numPlayers.value }, (_, i) => i)
  impostorIndices.value = []
  for (let i = 0; i < numImpostors.value; i++) {
    const randomIdx = Math.floor(Math.random() * indices.length)
    impostorIndices.value.push(indices[randomIdx])
    indices.splice(randomIdx, 1)
  }
  // Crear orden de jugadores
  playerOrder.value = []
  for (let i = 0; i < numPlayers.value; i++) {
    playerOrder.value.push(i)
  }
  previewOrderIndex.value = 0
  previewCardFlipped.value = false
  currentStep.value = 'cardPreview'
}

const nextCardPreview = () => {
  if (previewOrderIndex.value === playerOrder.value.length - 1) {
    // Todos los jugadores vieron - seleccionar quién comienza
    selectNewStart()
    currentStep.value = 'startGame'
  } else {
    previewOrderIndex.value++
    previewCardFlipped.value = false
  }
}

const selectNewStart = () => {
  startingPlayerIndex.value = Math.floor(Math.random() * numPlayers.value)
  // Crear orden de jugadores comenzando desde el jugador inicial
  playerOrder.value = []
  for (let i = 0; i < numPlayers.value; i++) {
    playerOrder.value.push((startingPlayerIndex.value + i) % numPlayers.value)
  }
  currentOrderIndex.value = 0
}

const initializeGameplay = () => {
  currentStep.value = 'gameEnd'
}

const nextPlayer = () => {
  if (currentOrderIndex.value === playerOrder.value.length - 1) {
    // Último jugador - confirmar terminar
    currentStep.value = 'confirmEnd'
  } else {
    // Siguiente jugador en el orden
    currentOrderIndex.value++
    currentPlayerIndex.value = playerOrder.value[currentOrderIndex.value]
    cardFlipped.value = false
  }
}

const previousPlayer = () => {
  if (currentOrderIndex.value > 0) {
    currentOrderIndex.value--
    currentPlayerIndex.value = playerOrder.value[currentOrderIndex.value]
    cardFlipped.value = false
  }
}

const goToGameEnd = () => {
  currentStep.value = 'gameEnd'
}

const quickRestartGame = () => {
  // Reinicia a pantalla de nombres pero mantiene los nombres de jugadores
  numImpostors.value = 1
  currentPlayerIndex.value = 0
  cardFlipped.value = false
  currentWord.value = ''
  currentHint.value = ''
  impostorIndices.value = []
  wordMode.value = 'random'
  customWord.value = ''
  customHint.value = ''
  selectedCategory.value = null
  startingPlayerIndex.value = 0
  playerOrder.value = []
  currentOrderIndex.value = 0
  previewCardFlipped.value = false
  previewOrderIndex.value = 0
  currentStep.value = 'playerNames'
}

// Load config on mount and setup auto-save watchers
onMounted(() => {
  loadGameConfig()
  loadGameState()
})

// Auto-save when important settings change
watch(() => numImpostors.value, saveGameConfig)
watch(() => showHintsToImpostor.value, saveGameConfig)
watch(() => wordMode.value, saveGameConfig)
watch(() => selectedCategory.value, saveGameConfig)

// Auto-save game state when major changes occur
watch(() => currentStep.value, saveGameState)
watch(() => playerNames.value, saveGameState, { deep: true })
watch(() => currentWord.value, saveGameState)
watch(() => currentHint.value, saveGameState)
watch(() => customWord.value, saveGameState)
watch(() => customHint.value, saveGameState)
watch(() => impostorIndices.value, saveGameState, { deep: true })
watch(() => playerOrder.value, saveGameState, { deep: true })
watch(() => currentPlayerIndex.value, saveGameState)
watch(() => currentOrderIndex.value, saveGameState)
watch(() => previewOrderIndex.value, saveGameState)
watch(() => startingPlayerIndex.value, saveGameState)
</script>



