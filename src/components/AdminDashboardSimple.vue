<template>
  <div class="admin-dashboard">
    <!-- Header -->
    <div class="dashboard-header">
      <h1 class="dashboard-title">
        <span class="icon">📅</span>
        Gestión de Eventos - MAIRV
      </h1>
      <p class="dashboard-subtitle">Registra y administra los eventos del calendario</p>
    </div>

    <!-- Contenido de eventos -->
    <EventsTab />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useEvents } from '@/composables/useEvents'
import EventsTab from './AdminTabs/EventsTab.vue'

const { loadEvents } = useEvents()

// Lifecycle
onMounted(async () => {
  console.log('🔄 Cargando eventos...')
  await loadEvents()
  console.log('✅ Eventos cargados')
})
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4f8 0%, #e8f1f8 100%);
  padding: 80px 20px 40px;
  color: #1a2942;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 80px 30px 60px;
  background: linear-gradient(135deg, #45b7d1 0%, #3498db 100%);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(52, 152, 219, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.dashboard-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.dashboard-title .icon {
  font-size: 3rem;
}

.dashboard-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 15px 0 0;
}

@media (max-width: 768px) {
  .dashboard-title {
    font-size: 1.8rem;
  }

  .dashboard-header {
    padding: 25px 20px;
  }
}
</style>
