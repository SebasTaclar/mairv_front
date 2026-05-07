<template>
 <teleport to="body">
  <div class="day-events-overlay" @click.self="close">
   <div class="day-events-card">
    <header class="day-events-header">
     <h3>{{ title }}</h3>
     <button class="close-btn" @click="close">✕</button>
    </header>

    <div class="day-events-list">
     <div v-if="events.length === 0" class="empty">No hay eventos para este día.</div>
     <div v-for="event in events" :key="event.id" class="day-event-item" @click="openEvent(event)">
      <div class="left">
       <div class="event-name">{{ event.name }}</div>
       <div class="event-meta"> <span class="meta-time">⏰ {{ event.startTime || '-' }}</span> <span
         class="meta-sep">•</span> <span class="meta-loc">📍 {{ event.location || 'Sin ubicación' }}</span></div>
       <p v-if="event.description" class="event-short">{{ event.description }}</p>
      </div>
      <div class="right">
       <span class="badge" :style="{ backgroundColor: getCategoryColor(event.category) }">{{
        getCategoryLabel(event.category) }}</span>
       <div v-if="event.attachments?.length" class="attach-count">📎 {{ event.attachments.length }}</div>
      </div>
     </div>
    </div>
   </div>
  </div>
 </teleport>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'
import type { CalendarEvent } from '@/types/EventType'

const props = defineProps<{ events: CalendarEvent[], title: string }>()
const emit = defineEmits<{
 (e: 'open', event: CalendarEvent): void
 (e: 'close'): void
}>()

const close = () => emit('close')
const openEvent = (event: CalendarEvent) => emit('open', event)

const getCategoryColor = (category?: string) => {
 const colors: Record<string, string> = {
  'evento': '#FF6B6B',
  'reunion': '#4ECDC4',
  'actividad': '#45B7D1',
  'otro': '#95A5A6'
 }
 return colors[category || 'otro']
}

const getCategoryLabel = (category?: string) => {
 const labels: Record<string, string> = {
  'evento': 'Evento',
  'reunion': 'Reunión',
  'actividad': 'Actividad',
  'otro': 'Otro'
 }
 return labels[category || 'otro']
}
</script>

<style scoped>
.day-events-overlay {
 position: fixed;
 inset: 0;
 background: rgba(0, 0, 0, 0.45);
 display: flex;
 align-items: center;
 justify-content: center;
 z-index: 2000;
}

.day-events-card {
 width: min(720px, 95%);
 max-height: 80vh;
 overflow: auto;
 background: #fff;
 border-radius: 10px;
 box-shadow: 0 20px 60px rgba(2, 6, 23, 0.5);
}

.day-events-header {
 display: flex;
 align-items: center;
 justify-content: space-between;
 padding: 16px 20px;
 border-bottom: 1px solid #eee;
 background: linear-gradient(90deg, #22265D, #0b2545);
 color: #fff;
 border-top-left-radius: 10px;
 border-top-right-radius: 10px;
}

.close-btn {
 background: transparent;
 border: none;
 color: #fff;
 font-size: 18px;
 cursor: pointer;
}

.day-events-list {
 padding: 12px 16px
}

.day-event-item {
 display: flex;
 align-items: center;
 justify-content: space-between;
 padding: 12px;
 border-radius: 8px;
 cursor: pointer;
 transition: background .14s ease, transform .12s ease;
}

.day-event-item:hover {
 background: #f6f8ff;
 transform: translateY(-2px)
}

.event-name {
 font-weight: 800;
 font-size: 1.05rem;
 color: #0b2545
}

.event-meta {
 font-size: 13px;
 color: #666;
 margin-top: 6px
}

.event-short {
 font-size: 13px;
 color: #444;
 margin-top: 6px
}

.badge {
 padding: 6px 10px;
 border-radius: 999px;
 color: #fff;
 font-size: 12px
}

.attach-count {
 margin-top: 8px;
 font-size: 13px;
 color: #444
}

.meta-time,
.meta-loc {
 font-weight: 700;
 color: #333
}

.meta-sep {
 margin: 0 6px;
 color: #999
}

.empty {
 padding: 20px;
 color: #666;
 text-align: center
}
</style>
