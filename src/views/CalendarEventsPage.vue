<template>
 <main class="calendar-page">
  <section class="section">
   <CalendarSection />
  </section>

  <section class="section offset">
   <Footer_ />
  </section>
 </main>
</template>

<script setup lang="ts">
import CalendarSection from '@/components/CalendarSection.vue'
import { defineAsyncComponent } from 'vue'

const Footer_ = defineAsyncComponent(() => import('@/components/Footer_.vue'))

defineOptions({
 name: 'CalendarPage'
})
</script>

<style scoped>
.calendar-page {
 min-height: 100vh;
}
</style>
