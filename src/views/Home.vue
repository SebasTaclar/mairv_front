<template>
  <main class="home-main">
    <!-- Efecto de nieve navideña -->
    <div class="snowflakes" aria-hidden="true">
      <div class="snowflake" v-for="n in 50" :key="n">❅</div>
    </div>

    <!-- Partículas tecnológicas flotantes -->
    <div class="tech-particles" aria-hidden="true">
      <div class="particle" v-for="n in 20" :key="n"></div>
    </div>

    <section class="section">
      <MainBanner @showRules="openRulesModal" />
    </section>
    <section class="section">
      <ProductShowcase />
    </section>

    <section class="section">
      <ProductStore />
    </section>

    <section class="section">
      <ContactSection />
    </section>


    <section class="section offset">
      <Footer_ />
    </section>

    <!-- Enlace flotante para prueba de sincronización -->
    <!-- <router-link to="/test-sync" class="test-sync-link">
      🧪 Probar Sincronización
    </router-link> -->

    <!-- Modal de reglas -->

  </main>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'
import MainBanner from '@/components/MainBanner.vue';

// Carga diferida (code splitting) de secciones pesadas
const ProductShowcase = defineAsyncComponent(() => import('@/components/ProductShowcase.vue'))
const ProductStore = defineAsyncComponent(() => import('@/components/ProductStore.vue'))
const ContactSection = defineAsyncComponent(() => import('@/components/ContactSection.vue'))
const Footer_ = defineAsyncComponent(() => import('@/components/Footer_.vue'))

// Estado del modal de reglas
const showRulesModal = ref(false)

const openRulesModal = () => {
  showRulesModal.value = true
}

const closeRulesModal = () => {
  showRulesModal.value = false
}

defineOptions({
  name: 'HomeView',
});

// Expose variables to template
defineExpose({
  showRulesModal,
  openRulesModal,
  closeRulesModal
});

</script>

<style scoped>
/* === EFECTOS VISUALES === */

/* Animación de nieve cayendo */
@keyframes snowfall {
  0% {
    top: -10%;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    top: 100%;
    opacity: 0;
  }
}

/* Movimiento horizontal de nieve */
@keyframes sway {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(100px);
  }
}

/* Partículas tecnológicas flotantes */
@keyframes float-particle {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg);
    opacity: 0.2;
  }
  25% {
    opacity: 0.5;
  }
  50% {
    transform: translateY(-200px) translateX(50px) rotate(180deg);
    opacity: 0.8;
  }
  75% {
    opacity: 0.5;
  }
  100% {
    transform: translateY(-400px) translateX(-50px) rotate(360deg);
    opacity: 0;
  }
}

/* Resplandor rojo pulsante */
@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(220, 38, 38, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(220, 38, 38, 0.6);
  }
}

.home-main {
  padding-top: 60px;
  background: linear-gradient(180deg, #000000 0%, #0a0a0a 50%, #000000 100%);
  color: var(--white);
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  overflow-y: auto;
  box-sizing: border-box;
  position: relative;
  min-height: 100vh;
}

/* === EFECTO DE NIEVE === */
.snowflakes {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 100;
  overflow: hidden;
}

.snowflake {
  position: absolute;
  top: -10%;
  color: #fff;
  font-size: 1em;
  user-select: none;
  animation: snowfall linear infinite, sway ease-in-out infinite;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
}

.snowflake:nth-child(1n) { left: 1%; animation-duration: 12s, 3s; animation-delay: 0s, 0s; font-size: 0.8em; }
.snowflake:nth-child(2n) { left: 10%; animation-duration: 15s, 4s; animation-delay: 1s, 0.5s; font-size: 1.2em; }
.snowflake:nth-child(3n) { left: 20%; animation-duration: 18s, 5s; animation-delay: 2s, 1s; font-size: 1em; }
.snowflake:nth-child(4n) { left: 30%; animation-duration: 14s, 3.5s; animation-delay: 3s, 1.5s; font-size: 1.5em; }
.snowflake:nth-child(5n) { left: 40%; animation-duration: 16s, 4.5s; animation-delay: 1.5s, 0s; font-size: 0.9em; }
.snowflake:nth-child(6n) { left: 50%; animation-duration: 13s, 3s; animation-delay: 2.5s, 0.5s; font-size: 1.3em; }
.snowflake:nth-child(7n) { left: 60%; animation-duration: 17s, 5s; animation-delay: 0.5s, 1s; font-size: 1.1em; }
.snowflake:nth-child(8n) { left: 70%; animation-duration: 19s, 4s; animation-delay: 3.5s, 1.5s; font-size: 0.8em; }
.snowflake:nth-child(9n) { left: 80%; animation-duration: 14s, 3.5s; animation-delay: 1s, 0s; font-size: 1.4em; }
.snowflake:nth-child(10n) { left: 90%; animation-duration: 16s, 4.5s; animation-delay: 2s, 0.5s; font-size: 1em; }
.snowflake:nth-child(11n) { left: 5%; animation-duration: 15s, 3s; animation-delay: 0.5s, 1s; font-size: 1.2em; }
.snowflake:nth-child(12n) { left: 15%; animation-duration: 17s, 4s; animation-delay: 2.5s, 1.5s; font-size: 0.9em; }
.snowflake:nth-child(13n) { left: 25%; animation-duration: 13s, 5s; animation-delay: 1.5s, 0s; font-size: 1.1em; }

/* === PARTÍCULAS TECNOLÓGICAS === */
.tech-particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 50;
  overflow: hidden;
}

.particle {
  position: absolute;
  bottom: -20px;
  width: 4px;
  height: 4px;
  background: linear-gradient(135deg, #DC2626, #EF4444);
  border-radius: 50%;
  animation: float-particle linear infinite;
  box-shadow:
    0 0 10px rgba(220, 38, 38, 0.5),
    0 0 20px rgba(220, 38, 38, 0.3),
    0 0 30px rgba(220, 38, 38, 0.2);
}

.particle:nth-child(1) { left: 5%; animation-duration: 8s; animation-delay: 0s; width: 6px; height: 6px; }
.particle:nth-child(2) { left: 15%; animation-duration: 10s; animation-delay: 1s; width: 4px; height: 4px; }
.particle:nth-child(3) { left: 25%; animation-duration: 12s; animation-delay: 2s; width: 5px; height: 5px; }
.particle:nth-child(4) { left: 35%; animation-duration: 9s; animation-delay: 0.5s; width: 7px; height: 7px; }
.particle:nth-child(5) { left: 45%; animation-duration: 11s; animation-delay: 1.5s; width: 4px; height: 4px; }
.particle:nth-child(6) { left: 55%; animation-duration: 13s; animation-delay: 2.5s; width: 6px; height: 6px; }
.particle:nth-child(7) { left: 65%; animation-duration: 10s; animation-delay: 0.8s; width: 5px; height: 5px; }
.particle:nth-child(8) { left: 75%; animation-duration: 12s; animation-delay: 1.8s; width: 4px; height: 4px; }
.particle:nth-child(9) { left: 85%; animation-duration: 9s; animation-delay: 2.8s; width: 6px; height: 6px; }
.particle:nth-child(10) { left: 95%; animation-duration: 11s; animation-delay: 0.3s; width: 5px; height: 5px; }
.particle:nth-child(11) { left: 10%; animation-duration: 14s; animation-delay: 1.2s; width: 4px; height: 4px; }
.particle:nth-child(12) { left: 20%; animation-duration: 8s; animation-delay: 2.2s; width: 7px; height: 7px; }
.particle:nth-child(13) { left: 30%; animation-duration: 10s; animation-delay: 0.7s; width: 5px; height: 5px; }
.particle:nth-child(14) { left: 40%; animation-duration: 13s; animation-delay: 1.7s; width: 6px; height: 6px; }
.particle:nth-child(15) { left: 50%; animation-duration: 9s; animation-delay: 2.7s; width: 4px; height: 4px; }
.particle:nth-child(16) { left: 60%; animation-duration: 11s; animation-delay: 0.4s; width: 5px; height: 5px; }
.particle:nth-child(17) { left: 70%; animation-duration: 12s; animation-delay: 1.4s; width: 6px; height: 6px; }
.particle:nth-child(18) { left: 80%; animation-duration: 10s; animation-delay: 2.4s; width: 4px; height: 4px; }
.particle:nth-child(19) { left: 90%; animation-duration: 14s; animation-delay: 0.6s; width: 7px; height: 7px; }
.particle:nth-child(20) { left: 12%; animation-duration: 9s; animation-delay: 1.6s; width: 5px; height: 5px; }

.section {
  padding: 0.1px 0 0 0;
  border-bottom: 1px solid rgba(220, 38, 38, 0.1);
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  position: relative;
  z-index: 10;
}

.section:last-child {
  border-bottom: none;
}

/* Resplandor en hover */
.section:hover {
  animation: glow 2s ease-in-out infinite;
}

/* Responsive: reducir efectos en móviles */
@media (max-width: 768px) {
  .snowflake:nth-child(n+20) {
    display: none;
  }

  .particle:nth-child(n+10) {
    display: none;
  }
}


/* Enlace flotante para prueba de sincronización */
.test-sync-link {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  padding: 12px 20px;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  z-index: 1000;
  transition: all 0.3s ease;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.test-sync-link:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.3);
  background: linear-gradient(45deg, #764ba2, #667eea);
}
</style>
