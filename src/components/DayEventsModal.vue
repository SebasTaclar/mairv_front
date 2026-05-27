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
 background: linear-gradient(180deg, #071427 0%, #0b1d36 100%);
 border-radius: 10px;
 box-shadow: 0 20px 60px rgba(2, 6, 23, 0.6);
 border: 1px solid rgba(255, 255, 255, 0.04);
 color: #e6eefc;
}

/* Mobile modal improvements */
@media (max-width: 600px) {
  .day-events-card {
    width: 100%;
    max-width: 100%;
    height: 100vh;
    max-height: 100vh;
    border-radius: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .day-events-header {
    padding: 12px 14px;
    position: sticky;
    top: 0;
    z-index: 6;
  }

  .day-events-list {
    padding: 8px 12px;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    flex: 1 1 auto;
  }

  .day-event-item {
    padding: 14px;
    gap: 12px;
  }

  .event-name {
    font-size: 1rem;
    color: #0b2545;
  }

  .event-short {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    color: #444;
  }

  .close-btn {
    font-size: 16px;
    padding: 8px 12px;
  }
}

.day-events-header {
 display: flex;
 align-items: center;
 justify-content: space-between;
 padding: 16px 20px;
 border-bottom: 1px solid rgba(255, 255, 255, 0.06);
 background: linear-gradient(90deg, #0b2545, #071427);
 color: #e6eefc;
 border-top-left-radius: 10px;
 border-top-right-radius: 10px;
}

.day-events-header h3 {
 margin: 0;
 color: #e6eefc;
 font-size: 1.1rem;
 font-weight: 800;
}

.close-btn {
 background: rgba(255, 255, 255, 0.03);
 border: 1px solid rgba(255, 255, 255, 0.04);
 color: #e6eefc;
 font-size: 18px;
 cursor: pointer;
 padding: 6px 10px;
 border-radius: 6px;
 transition: background 0.2s ease;
}

.close-btn:hover {
 background: rgba(255, 255, 255, 0.06);
}

.day-events-list {
 padding: 12px 16px;
}

.day-events-list {
 padding: 12px 16px;
}

.day-event-item {
 display: flex;
 align-items: center;
 justify-content: space-between;
 padding: 12px;
 border-radius: 8px;
 cursor: pointer;
 transition: background .14s ease, transform .12s ease;
 background: rgba(255, 255, 255, 0.02);
 border: 1px solid rgba(255, 255, 255, 0.02);
 margin-bottom: 8px;
}

.day-event-item:hover {
 background: rgba(255, 255, 255, 0.05);
 transform: translateY(-2px);
}

.day-event-item .left {
 flex: 1;
}

.event-name {
 font-weight: 800;
 font-size: 1.05rem;
 color: #e6eefc;
 margin-bottom: 4px;
}

.event-meta {
 font-size: 13px;
 color: #bcd3ee;
 margin-bottom: 6px;
}

.meta-time,
.meta-loc {
 font-weight: 700;
 color: #dfeefe;
}

.meta-sep {
 margin: 0 6px;
 color: #7b94b3;
}

.event-short {
 font-size: 13px;
 color: #c9dbf4;
 margin: 0;
 display: -webkit-box;
 -webkit-line-clamp: 3;
 -webkit-box-orient: vertical;
 overflow: hidden;
}

.day-event-item .right {
 display: flex;
 flex-direction: column;
 align-items: flex-end;
 gap: 8px;
 margin-left: 12px;
}

.badge {
 padding: 6px 10px;
 border-radius: 999px;
 color: #ffffff;
 font-size: 12px;
 font-weight: 700;
}

.attach-count {
 font-size: 13px;
 color: #bcd3ee;
}

.empty {
 padding: 20px;
 color: #9fb4d6;
 text-align: center;
}

.event-meta {
 font-size: 13px;
 color: #666;
 margin-top: 6px
}

.event-short {
 font-size: 13px;
 color: #f7f4f4;
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
 color: #bcd3ee;
}

.meta-time,
.meta-loc {
 font-weight: 700;
 color: #dfeefe;
}

.meta-sep {
 margin: 0 6px;
 color: #7b94b3;
}

.empty {
 padding: 20px;
 color: #9fb4d6;
 text-align: center;
}

/* Mobile modal improvements */
@media (max-width: 600px) {
  .day-events-card {
    width: 100%;
    max-width: 100%;
    height: 100vh;
    max-height: 100vh;
    border-radius: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .day-events-header {
    padding: 12px 14px;
    position: sticky;
    top: 0;
    z-index: 6;
  }

  .day-events-list {
    padding: 8px 12px;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    flex: 1 1 auto;
  }

  .day-event-item {
    padding: 14px;
  }

  .event-name {
    font-size: 1rem;
  }

  .event-short {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .close-btn {
    font-size: 16px;
    padding: 8px 12px;
  }
}
</style>
