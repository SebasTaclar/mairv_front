<template>
  <div class="admin-dashboard">
    <Spinner v-if="isLoading" />

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
import './styles/AdminDashboardSimple.css'
import { onMounted } from 'vue'
import { useEvents } from '@/composables/useEvents'
import Spinner from '@/components/Spinner.vue'
import EventsTab from './AdminTabs/EventsTab.vue'

const { loadEvents, isLoading } = useEvents()

// Lifecycle
onMounted(async () => {
  console.log('🔄 Cargando eventos...')
  await loadEvents()
  console.log('✅ Eventos cargados')
})
</script>
