<template>
  <article class="ev-card">
    <div class="ev-media" :style="bgStyle">
      <div class="ev-date" v-if="date">{{ date }}</div>
    </div>
    <div class="ev-body">
      <h4 class="ev-title">{{ title }}</h4>
      <p class="ev-sub">{{ subtitle }}</p>
      <div class="ev-footer">
        <a v-if="ctaText" :href="ctaLink" class="ev-cta">{{ ctaText }} →</a>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  date: { type: String, default: '' },
  image: { type: String, default: '' },
  ctaText: { type: String, default: '' },
  ctaLink: { type: String, default: '#' }
})

const bgStyle = computed(() => {
  return {
    backgroundImage: props.image ? `linear-gradient(rgba(0,0,0,0.15), rgba(0,0,0,0.15)), url(${props.image})` : 'linear-gradient(135deg,#f1f5f9,#ffffff)',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }
})
</script>

<style scoped>
.ev-card { background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 6px 18px rgba(2,6,23,0.06); display:flex; flex-direction:column; height:100% }
.ev-media { height:150px; position:relative }
.ev-date { position:absolute; left:12px; top:12px; background:rgba(255,255,255,0.95); padding:6px 10px; border-radius:6px; font-weight:700; font-size:0.9rem }
.ev-body { padding:12px 14px; display:flex; flex-direction:column; justify-content:space-between; flex:1 }
.ev-title { margin:0 0 6px; font-size:1.05rem }
.ev-sub { margin:0 0 8px; color:#6b7280; font-size:0.95rem }
.ev-cta { color:#1e63d6; font-weight:600; text-decoration:none }
</style>
