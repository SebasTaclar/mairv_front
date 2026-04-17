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

<style scoped>
.games-container {
 min-height: 100vh;
 background: linear-gradient(135deg, #000000 0%, #1a1a2e 100%);
 padding: 100px 20px 40px;
}

.games-header {
 text-align: center;
 margin-bottom: 60px;
 animation: fadeInDown 0.6s ease;
}

.games-header h1 {
 font-size: clamp(32px, 5vw, 48px);
 color: #ffffff;
 margin: 0 0 10px 0;
 font-weight: 900;
 letter-spacing: 1px;
}

.subtitle {
 font-size: 18px;
 color: rgba(255, 255, 255, 0.7);
 margin: 0;
}

.games-grid {
 display: grid;
 grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
 gap: 30px;
 max-width: 1400px;
 margin: 0 auto;
}

.game-card {
    background: linear-gradient(135deg, rgba(var(--brand-blue-rgb), 0.08) 0%, rgba(var(--brand-blue-rgb), 0.03) 100%);
    border: 2px solid rgba(var(--brand-blue-rgb), 0.25);
    border-radius: 20px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    animation: slideUp 0.6s ease;
}

.game-card:hover {
    transform: translateY(-10px);
    border-color: rgba(var(--brand-blue-rgb), 0.6);
    background: linear-gradient(135deg, rgba(var(--brand-blue-rgb), 0.12) 0%, rgba(var(--brand-blue-rgb), 0.06) 100%);
    box-shadow: 0 15px 40px rgba(var(--brand-blue-rgb), 0.18);
}

.game-card-inner {
 padding: 30px;
 display: flex;
 flex-direction: column;
 height: 100%;
 gap: 15px;
}

.game-icon {
 font-size: 48px;
 text-align: center;
}

.game-card h3 {
 margin: 10px 0 0 0;
 color: #ffffff;
 font-size: 22px;
 font-weight: 700;
}

.game-description {
 color: rgba(255, 255, 255, 0.7);
 margin: 0;
 font-size: 14px;
 flex-grow: 1;
}

.game-stats {
 display: flex;
 gap: 10px;
 font-size: 13px;
 color: rgba(255, 255, 255, 0.6);
}

.stat {
    background: rgba(var(--brand-blue-rgb), 0.08);
    padding: 5px 10px;
    border-radius: 6px;
    border: 1px solid rgba(var(--brand-blue-rgb), 0.18);
}

.play-btn {
    background: var(--primary-gradient);
    color: var(--white);
    border: none;
    border-radius: 10px;
    padding: 12px 24px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.play-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 20px var(--primary-color-alpha-40);
}

/* Modal Styles */
.game-modal {
 position: fixed;
 top: 0;
 left: 0;
 width: 100%;
 height: 100%;
 background: rgba(0, 0, 0, 0.8);
 display: flex;
 align-items: center;
 justify-content: center;
 z-index: 2000;
 padding: 20px;
 animation: fadeIn 0.3s ease;
 backdrop-filter: blur(5px);
}

.modal-content {
    background: linear-gradient(135deg, #1a1a2e 0%, #000000 100%);
    border: 2px solid rgba(var(--brand-blue-rgb), 0.4);
    border-radius: 20px;
    max-width: 700px;
    width: 100%;
    max-height: 80vh;
    overflow-y: auto;
    position: relative;
    padding: 40px;
    animation: slideUp 0.3s ease;
}

.close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    background: rgba(var(--brand-blue-rgb), 0.2);
    border: 1px solid rgba(var(--brand-blue-rgb), 0.4);
    border-radius: 50%;
    font-size: 24px;
    color: var(--brand-blue);
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
}

.close-btn:hover {
    background: rgba(var(--brand-blue-rgb), 0.3);
    transform: rotate(90deg);
}

.game-modal-header {
 display: flex;
 align-items: center;
 gap: 20px;
 margin-bottom: 30px;
}

.modal-icon {
 font-size: 48px;
}

.game-modal-header h2 {
 margin: 0;
 color: #ffffff;
 font-size: 32px;
 font-weight: 900;
}

.game-placeholder {
    background: rgba(var(--brand-blue-rgb), 0.05);
    border: 1px solid rgba(var(--brand-blue-rgb), 0.3);
    border-radius: 15px;
    padding: 30px;
}

.game-placeholder p {
 color: rgba(255, 255, 255, 0.8);
 margin: 10px 0;
}

.game-content {
 margin-top: 20px;
 min-height: 300px;
 display: flex;
 align-items: center;
 justify-content: center;
}

.placeholder-message {
    text-align: center;
    font-size: 32px;
    color: rgba(var(--brand-blue-rgb), 0.6);
    font-weight: 600;
}

@keyframes fadeInDown {
 from {
  opacity: 0;
  transform: translateY(-20px);
 }

 to {
  opacity: 1;
  transform: translateY(0);
 }
}

@keyframes slideUp {
 from {
  opacity: 0;
  transform: translateY(20px);
 }

 to {
  opacity: 1;
  transform: translateY(0);
 }
}

@keyframes fadeIn {
 from {
  opacity: 0;
 }

 to {
  opacity: 1;
 }
}

@media (max-width: 768px) {
 .games-container {
  padding: 90px 15px 30px;
 }

 .games-grid {
  grid-template-columns: 1fr;
  gap: 20px;
 }

 .games-header h1 {
  font-size: 28px;
 }

 .modal-content {
  padding: 20px;
  border-radius: 15px;
 }

 .game-modal-header {
  flex-direction: column;
  text-align: center;
 }

 .game-modal-header h2 {
  font-size: 24px;
 }
}
</style>
