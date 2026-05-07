<template>
  <main class="home-main">
    <!-- Efectos visuales removidos: nieve y partículas -->

    <section class="section">
      <MainBanner @showRules="openRulesModal" />
    </section>

    <section class="section">
      <HelpSection />
    </section>

    <section class="section">
      <StoriesSection />
    </section>

    <!-- Eventos Recientes y Próximos -->
    <section class="section">
      <RecentEventsSection />
    </section>

    <section class="section">
      <EventCard />
    </section>

    <section class="section">
      <MessageCard />
    </section>

    <!-- LiveNowStrip removed per request -->


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
import './styles/Home.css'
import { ref, defineAsyncComponent } from 'vue'
import MainBanner from '@/components/MainBanner.vue';
import HelpSection from '@/components/HelpSection.vue';
import StoriesSection from '@/components/StoriesSection.vue';
import RecentEventsSection from '@/components/RecentEventsSection.vue';
// import EventCard from '@/components/EventCard.vue';
// import MessageCard from '@/components/MessageCard.vue';

// Carga diferida (code splitting) de secciones pesadas
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
