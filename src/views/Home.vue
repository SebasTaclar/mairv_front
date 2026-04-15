<template>
  <main class="home-main">
    <!-- Efectos visuales removidos: nieve y partículas -->

    <section class="section">
      <MainBanner @showRules="openRulesModal" />
    </section>
    <section class="section">
      <ContactSection />
    </section>

    <section class="section">
      <EventCard />
    </section>

    <section class="section">
      <MessageCard/>
    </section>

    <section class="section">
      <LiveNowStrip />
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
import LiveNowStrip from '@/components/LiveNowStrip.vue';
import EventCard from '@/components/EventCard.vue';
import MessageCard from '@/components/MessageCard.vue';

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
/* === EFECTOS VISUALES (eliminadas nieve y partículas rojas) === */
/* Resplandor suave (neutral, no rojo) */
@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(96, 165, 250, 0.12);
  }
  50% {
    box-shadow: 0 0 40px rgba(96, 165, 250, 0.22);
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
/* Eliminadas las reglas de nieve y partículas rojas */

.section {
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
  /* Mantener efecto suave, sin pulso rojo */
  animation: glow 2s ease-in-out infinite;
}

/* Responsive: reducir efectos en móviles */
@media (max-width: 768px) {
  /* Efectos de nieve eliminados */

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
