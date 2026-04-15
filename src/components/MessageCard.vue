<template>
  <article class="msg-card">
    <div class="msg-media" :style="bgStyle">
      <div class="msg-duration" v-if="duration">{{ duration }}</div>
    </div>
    <div class="msg-body">
      <h4 class="msg-title">{{ title }}</h4>
      <p class="msg-sub">{{ subtitle }}</p>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  duration: { type: String, default: '' },
  image: { type: String, default: '' }
})

const bgStyle = computed(() => ({
  backgroundImage: props.image ? `linear-gradient(rgba(0,0,0,0.12), rgba(0,0,0,0.12)), url(${props.image})` : 'linear-gradient(135deg,#f8fafc,#fff)',
  backgroundSize: 'cover',
  backgroundPosition: 'center'
}))
</script>

<style scoped>
.msg-card { background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 6px 18px rgba(2,6,23,0.06); display:flex; flex-direction:column; height:100% }
.msg-media { height:140px; position:relative }
.msg-duration { position:absolute; right:10px; bottom:8px; background:rgba(0,0,0,0.7); color:#fff; padding:6px 8px; border-radius:4px; font-weight:600; font-size:0.85rem }
.msg-body { padding:12px 14px }
.msg-title { margin:0 0 6px; font-size:1.05rem }
.msg-sub { margin:0; color:#6b7280; font-size:0.95rem }
</style>
