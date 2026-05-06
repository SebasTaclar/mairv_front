<template>
 <div class="games-container">
  <header class="games-header">
   <h1>🎮 Centro de Juegos</h1>
   <p class="subtitle">Diviértete con nuestros juegos interactivos</p>
  </header>

  <div class="games-grid">
   <div v-for="game in games" :key="game.id" class="game-card" @click="playGame(game.id)">
    <div class="game-card-inner">
     <div class="game-icon">{{ game.icon }}</div>
     <h3>{{ game.title }}</h3>
     <p class="game-description">{{ game.description }}</p>
     <div class="game-stats">
      <span class="stat">⭐ {{ game.rating }}/5</span>
      <span class="stat">👥 {{ game.players }} jugadores</span>
     </div>
     <button class="play-btn">Jugar Ahora</button>
    </div>
   </div>
  </div>

  <!-- Modal para juego seleccionado -->
  <div v-if="selectedGame" class="game-modal" @click="closeGame">
   <div class="modal-content" @click.stop>
    <button class="close-btn" @click="closeGame">✕</button>
    <div class="game-modal-header">
     <span class="modal-icon">{{ selectedGame.icon }}</span>
     <h2>{{ selectedGame.title }}</h2>
    </div>
    <div class="game-placeholder">
     <p>Juego: {{ selectedGame.title }}</p>
     <p>{{ selectedGame.description }}</p>
     <div class="game-content">
      <!-- Aquí irá el contenido del juego -->
      <div class="placeholder-message">
       🎮 Contenido del juego en desarrollo
      </div>
     </div>
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import './styles/GamesPage.css'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

interface Game {
 id: string
 title: string
 description: string
 icon: string
 rating: number
 players: number
}

const router = useRouter()

const games = ref<Game[]>([
 {
  id: '1',
  title: 'Palabras Cruzadas',
  description: 'Desafía tu conocimiento con palabras cruzadas interactivas',
  icon: '📝',
  rating: 4.8,
  players: 1250
 },
 {
  id: '2',
  title: 'Quiz Master',
  description: 'Prueba tus conocimientos en diferentes categorías',
  icon: '🧠',
  rating: 4.6,
  players: 2100
 },
 {
  id: '3',
  title: 'Memoria',
  description: 'Mejora tu memoria con este clásico juego de parejas',
  icon: '🎯',
  rating: 4.7,
  players: 1890
 },
 {
  id: '4',
  title: 'Rompecabezas',
  description: 'Resuelve increíbles rompecabezas',
  icon: '🧩',
  rating: 4.9,
  players: 3200
 },
 {
  id: '5',
  title: 'Trivia',
  description: 'Demuestra tu ingenio en trivias emocionantes',
  icon: '💡',
  rating: 4.5,
  players: 2500
 },
 {
  id: '6',
  title: 'Carrera Rápida',
  description: 'Compite contra reloj en desafíos veloces',
  icon: '⚡',
  rating: 4.4,
  players: 1600
 },
 {
  id: '7',
  title: 'El Impostor',
  description: 'Descubre quién es el impostor entre los jugadores',
  icon: '🎭',
  rating: 4.9,
  players: 3400
 }
])

const selectedGame = ref<Game | null>(null)

const playGame = (gameId: string) => {
 // Si es El Impostor, navegar directamente
 if (gameId === '7') {
  router.push('/impostor')
  return
 }

 const game = games.value.find(g => g.id === gameId)
 if (game) {
  selectedGame.value = game
 }
}

const closeGame = () => {
 selectedGame.value = null
}
</script>



