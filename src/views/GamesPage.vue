<template>
 <div class="games-container">
  <header class="games-header">
   <h1>🎮 Juegos</h1>
   <p class="subtitle">Por ahora tenemos disponible una sola experiencia</p>
  </header>

  <div class="games-grid single-game-grid">
   <RouterLink to="/impostor" class="game-card game-card-featured">
    <div class="game-card-inner">
     <div class="game-icon">🎭</div>
     <span class="game-badge">Disponible ahora</span>
     <h3>El Impostor</h3>
     <p class="game-description">
      Descubre quién es el impostor entre los jugadores y mantén el ritmo de la partida.
     </p>
     <div class="game-stats">
      <span class="stat">👥 3-25 jugadores</span>
      <span class="stat">📱 Ideal para celular</span>
     </div>
     <button class="play-btn" type="button">Jugar El Impostor</button>
    </div>
   </RouterLink>
  </div>
 </div>
</template>

<script setup lang="ts">
import './styles/GamesPage.css'
</script>
