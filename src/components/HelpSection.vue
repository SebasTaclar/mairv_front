<template>
  <section class="help-section section" aria-labelledby="help-heading">
    <div class="container">
      <h2 id="help-heading" class="help-title">Cómo podemos ayudarte</h2>

      <div class="help-grid">
        <div class="help-col help-col--left">
          <!-- Left: dos tarjetas -->
          <template v-if="!isMobile">
            <!-- Desktop / tablet: mantener las dos tarjetas apiladas -->
            <article class="story-card" aria-labelledby="help-1-title">
              <div class="story-media">
                <div class="video-wrap">
                  <iframe width="560" height="315" src="https://www.youtube.com/embed/7Q929bAo5fo?si=IFrvBX0uVC1rxkh_" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                </div>
              </div>
              <div class="story-body">
                <h3 id="help-1-title" class="story-title">Oración</h3>
              </div>
              <button type="button" class="btn-secondary" @click="openModal('video', 'https://www.youtube.com/embed/7Q929bAo5fo?si=IFrvBX0uVC1rxkh_')">Ver más</button>
            </article>

            <article class="story-card" aria-labelledby="help-2-title">
              <div class="story-media">
                <img src="https://www.biblia-es.org/wp-content/uploads/2024/04/Salmos-28-7-480x270.jpg?v=240327" alt="Devocionales" loading="lazy"/>
              </div>
              <div class="story-body">
                <h3 id="help-2-title" class="story-title">Devocionales</h3>
              </div>
              <button type="button" class="btn-secondary" @click="openModal('image', 'https://www.biblia-es.org/wp-content/uploads/2024/04/Salmos-28-7-480x270.jpg?v=240327', 'Devocionales')">Ver más</button>
            </article>
          </template>

          <!-- Móvil: carrusel de las tarjetas izquierdas (una tarjeta visible) -->
          <template v-else>
            <div class="left-carousel right-carousel">
              <div class="carousel-track" :style="{ transform: `translateX(-${activeLeft * 100}%)` }">
                <div v-for="item in leftNotes" :key="item.id" class="carousel-slide">
                  <article class="story-card" :aria-labelledby="`help-left-${item.id}-title`">
                    <div class="story-media">
                      <img v-if="item.type === 'image'" :src="item.img" :alt="item.alt || item.title" loading="lazy" />
                      <div v-else-if="item.type === 'video'" class="video-thumb-wrap" @click.prevent="openModal('video', item.video, item.title)" role="button" tabindex="0">
                        <img :src="item.thumb" :alt="item.alt || item.title" loading="lazy" />
                        <div class="play-overlay">▶</div>
                      </div>
                    </div>
                    <div class="story-body">
                      <h3 :id="`help-left-${item.id}-title`" class="story-title">{{ item.title }}</h3>
                    </div>
                    <button type="button" class="btn-secondary" @click="item.type === 'video' ? openModal('video', item.video, item.title) : openModal('image', item.img, item.title)">Ver más</button>
                  </article>
                </div>
              </div>
              <button class="carousel-arrow left" @click="prevLeft" aria-label="Anterior">‹</button>
              <button class="carousel-arrow right" @click="nextLeft" aria-label="Siguiente">›</button>
            </div>
          </template>
        </div>

        <div class="help-col help-col--center">
          <!-- Center: single prominent card -->
          <article class="story-card story-card--center" aria-labelledby="help-center-title">
            <div class="story-media">
              <img src="https://scontent-bog2-2.xx.fbcdn.net/v/t51.82787-15/559926535_18429619732096993_1970501678127810515_n.jpg?stp=dst-jpegr_tt6&_nc_cat=107&ccb=1-7&_nc_sid=13d280&_nc_ohc=vtIDwJieIMsQ7kNvwHtTzK1&_nc_oc=AdqqAy_tcs807_PVUtUmzNo1yGwG2K_3jOi7ZYM-tRCcgYp-dshicm3cxB-BmWRUM-s&_nc_zt=23&se=-1&_nc_ht=scontent-bog2-2.xx&_nc_gid=t_24J2SKcYQSTdqSi33ESw&_nc_ss=7a389&oh=00_Af2Cb-G4y8ufSY8JGB7GTzUEX0FsCc-e0YlzOUjIubZAfA&oe=69E73099" alt="Familia y comunidad" loading="lazy"/>
            </div>
            <div class="story-body">
              <h3 id="help-center-title" class="story-title">Se parte de Nuestra familia y Visión</h3>
              <div class="mini-list-wrap">
                <h4 class="mini-title">Ministerios</h4>
                <ul class="mini-list">
                  <li>Adoración</li>
                  <li>Ministerio</li>
                  <li>Comunión</li>
                  <li>Evangelismo</li>
                  <li>Discipulado</li>
                </ul>
              </div>
              <!-- <a class="btn-secondary" href="/join">Conocer más</a> -->
            </div>
              <button type="button" class="btn-secondary" @click="openModal('image', 'https://scontent-bog2-2.xx.fbcdn.net/v/t51.82787-15/559926535_18429619732096993_1970501678127810515_n.jpg?stp=dst-jpegr_tt6&_nc_cat=107&ccb=1-7&_nc_sid=13d280&_nc_ohc=vtIDwJieIMsQ7kNvwHtTzK1&_nc_oc=AdqqAy_tcs807_PVUtUmzNo1yGwG2K_3jOi7ZYM-tRCcgYp-dshicm3cxB-BmWRUM-s&_nc_zt=23&se=-1&_nc_ht=scontent-bog2-2.xx&_nc_gid=t_24J2SKcYQSTdqSi33ESw&_nc_ss=7a389&oh=00_Af2Cb-G4y8ufSY8JGB7GTzUEX0FsCc-e0YlzOUjIubZAfA&oe=69E73099', 'Familia y comunidad')">Ver más</button>
          </article>
        </div>

        <div class="help-col help-col--right">
          <!-- Right: grid 2x2 -->
          <h3 class="right-section-title">Notas de Servicio</h3>
          <div v-if="!isMobile" class="right-grid">
            <article v-for="item in notes" :key="item.id" class="story-card" :aria-labelledby="`help-${item.id}-title`">
              <div class="story-media">
                <img :src="item.img" :alt="item.alt || item.title" loading="lazy" />
              </div>
              <div class="story-body">
                <h3 :id="`help-${item.id}-title`" class="story-title">{{ item.title }}</h3>
              </div>
                <button type="button" class="btn-secondary" @click="openModal('image', item.img, item.title)">Ver más</button>
            </article>
          </div>

          <div v-else class="right-carousel">
            <div class="carousel-track" :style="{ transform: `translateX(-${activeNote * 100}%)` }">
              <div v-for="item in notes" :key="item.id" class="carousel-slide">
                <article class="story-card" :aria-labelledby="`help-${item.id}-title`">
                  <div class="story-media">
                    <img :src="item.img" :alt="item.alt || item.title" loading="lazy" />
                  </div>
                  <div class="story-body">
                    <h3 :id="`help-${item.id}-title`" class="story-title">{{ item.title }}</h3>
                  </div>
                    <button type="button" class="btn-secondary" @click="openModal('image', item.img, item.title)">Ver más</button>
                </article>
              </div>
            </div>
            <button class="carousel-arrow left" @click="prevNote" aria-label="Anterior">‹</button>
            <button class="carousel-arrow right" @click="nextNote" aria-label="Siguiente">›</button>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- Modal para imagen / video (teleported al body para evitar recortes) -->
  <teleport to="body" v-if="showModal">
    <div class="help-modal-overlay" @click="closeModal">
      <div class="help-modal-content" @click.stop>
        <button class="help-modal-close" @click="closeModal" aria-label="Cerrar modal">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m18 6-12 12"/><path d="m6 6 12 12"/></svg>
        </button>
        <div class="help-modal-body">
          <div v-if="modalType === 'image'" class="help-modal-image">
            <img :src="modalSrc" :alt="modalAlt" loading="lazy" />
          </div>
          <div v-else-if="modalType === 'video'" class="help-modal-video">
            <iframe :src="modalSrcWithAutoplay" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'

const showModal = ref(false)
const modalType = ref<'image' | 'video' | null>(null)
const modalSrc = ref('')
const modalAlt = ref('')
const previousScroll = ref(0)

const modalSrcWithAutoplay = computed(() => {
  if (modalType.value === 'video' && modalSrc.value) {
    return modalSrc.value.includes('autoplay=1')
      ? modalSrc.value
      : modalSrc.value + (modalSrc.value.includes('?') ? '&autoplay=1' : '?autoplay=1')
  }
  return modalSrc.value
})

function lockBodyScroll() {
  previousScroll.value = window.scrollY || document.documentElement.scrollTop || 0
  // fijar el body para bloquear scroll y evitar salto de contenido
  document.body.style.position = 'fixed'
  document.body.style.top = `-${previousScroll.value}px`
  document.body.style.left = '0'
  document.body.style.right = '0'
  document.body.style.width = '100%'
}

function restoreBodyScroll() {
  // restaurar estilos y reposicionar
  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.left = ''
  document.body.style.right = ''
  document.body.style.width = ''
  window.scrollTo(0, previousScroll.value)
  previousScroll.value = 0
}

function openModal(type: 'image' | 'video', src?: string | null, alt = '') {
  modalType.value = type
  modalSrc.value = src || ''
  modalAlt.value = alt
  showModal.value = true
  lockBodyScroll()
}

function closeModal() {
  showModal.value = false
  modalType.value = null
  modalSrc.value = ''
  modalAlt.value = ''
  restoreBodyScroll()
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') closeModal()
}



/* --- Carousel móvil para "Notas de Servicio" --- */
const notes = ref([
  {
    id: 3,
    img: 'https://scontent-bog2-1.xx.fbcdn.net/v/t51.82787-15/521546971_18418353190096993_5514607464573062666_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=13d280&_nc_eui2=AeFltnt2pqM7em-5DFJxmZ_IV_RwxvTJhZpX9HDG9MmFmiIK6cwdeGEdTWF-KQCqI0o&_nc_ohc=DOW5G46gPnwQ7kNvwEh0sM9&_nc_oc=AdoS4cPHa54Ir3LuuEar6gqske0nk0DQb5_NfrcDV5TTc4KBPPwVCamoAxsQzPq-U7A&_nc_zt=23&_nc_ht=scontent-bog2-1.xx&_nc_gid=DpvpkcW4z_dfDHdtXiYBLw&_nc_ss=7a3a8&oh=00_Af2hPA6O-Oe77Zo6ntefXk1YuHNyY7cHqXI5yAIJPCUAPA&oe=69E729FD',
    title: 'Mensaje del Día',
    alt: 'Notas de servicio'
  },
  {
    id: 4,
    img: 'https://scontent-bog2-1.xx.fbcdn.net/v/t39.30808-6/472554002_18389098057096993_7473348509516777309_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=13d280&_nc_eui2=AeFMywaVDxHsbHTv0uSzi3roRCi1Ums1BZFEKLVSazUFkRYBNZay36HgpHw-4D0hueI&_nc_ohc=QSeXap96eF0Q7kNvwFCgBy6&_nc_oc=AdqALM0yivselsVlDh5-RrdoBxyWc-tFrLPRnCcxbEj8dDiJueViDso3BeUFK8WO8MI&_nc_zt=23&_nc_ht=scontent-bog2-1.xx&_nc_gid=wm-kvBEFnd3rPbvU-MigjQ&_nc_ss=7a3a8&oh=00_Af3b6eurTn1b51CjX3Di7m7qGVc0fNw9OmQLmbQGfZctmQ&oe=69E71FCC',
    title: 'Anuncios y Actividades',
    alt: 'Eventos'
  },
  {
    id: 5,
    img: 'https://scontent-bog2-1.xx.fbcdn.net/v/t51.75761-15/475359834_18393262765096993_7937184517207560787_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=13d280&_nc_eui2=AeGBBjWj0IxtmTPzkVTIEbMAQjw2MDt0q7pCPDYwO3SrujwdKTR7dUQDbzscqOGN-tQ&_nc_ohc=jUVx5RV9mQUQ7kNvwFnmX1K&_nc_oc=Adq_grFO0rrcnKCSyrkw-w5HsM-TzMlUvinqXGxnr84rtioqhZoHDmq1XI4M8NPxgeI&_nc_zt=23&_nc_ht=scontent-bog2-1.xx&_nc_gid=FLKpJCoWihf-8l-pHitadQ&_nc_ss=7a3a8&oh=00_Af31xQ8iPESfD6Da_7L43IA5mC5lOM8tHTing-hG17zX6g&oe=69E752D9',
    title: 'Información General',
    alt: 'Testimonios'
  },
  {
    id: 6,
    img: 'https://scontent-bog2-1.xx.fbcdn.net/v/t39.30808-6/471715338_18389069830096993_3628986406837813469_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=13d280&_nc_eui2=AeH8sUNniR52RIJtnAceCdEUds3EBMb_vD92zcQExv-8PwN8hNC3wDaaDe_v9zvCV0U&_nc_ohc=Hid4jj-1YmwQ7kNvwH7m43R&_nc_oc=Adp83yh0JFEoP1leGErRAHi93qx-uqct71LBlyRb41I410TUztpNUlbIuuf6nY-ypdI&_nc_zt=23&_nc_ht=scontent-bog2-1.xx&_nc_gid=lp28_o6VAQm40djhM_WJew&_nc_ss=7a3a8&oh=00_Af1PVY5E5PuBHGqWpW0POXe4fuRZJTILTmP10THO_BIb-A&oe=69E7204C',
    title: 'Vida en Comunidad',
    alt: 'Contacto'
  }
])

/* Left column items (used by mobile carousel) */
const leftNotes = ref([
  {
    id: 1,
    type: 'video',
    thumb: 'https://i.ytimg.com/vi/7Q929bAo5fo/hqdefault.jpg',
    video: 'https://www.youtube.com/embed/7Q929bAo5fo?si=IFrvBX0uVC1rxkh_',
    title: 'Oración',
    alt: 'Oración'
  },
  {
    id: 2,
    type: 'image',
    img: 'https://www.biblia-es.org/wp-content/uploads/2024/04/Salmos-28-7-480x270.jpg?v=240327',
    title: 'Devocionales',
    alt: 'Devocionales'
  }
])

const isMobile = ref(false)
const activeNote = ref(0)
let carouselInterval: number | null = null
const AUTOPLAY_MS = 4000

/* Left carousel state */
const activeLeft = ref(0)
let leftCarouselInterval: number | null = null

function updateIsMobile() {
  isMobile.value = window.matchMedia('(max-width: 900px)').matches
}

function startCarousel() {
  stopCarousel()
  carouselInterval = window.setInterval(() => {
    activeNote.value = (activeNote.value + 1) % notes.value.length
  }, AUTOPLAY_MS)
}

function stopCarousel() {
  if (carouselInterval !== null) {
    clearInterval(carouselInterval)
    carouselInterval = null
  }
}

function prevNote() {
  activeNote.value = (activeNote.value - 1 + notes.value.length) % notes.value.length
  if (isMobile.value) { stopCarousel(); startCarousel(); }
}

function nextNote() {
  activeNote.value = (activeNote.value + 1) % notes.value.length
  if (isMobile.value) { stopCarousel(); startCarousel(); }
}

/* Left carousel controls */
function startLeftCarousel() {
  stopLeftCarousel()
  leftCarouselInterval = window.setInterval(() => {
    activeLeft.value = (activeLeft.value + 1) % leftNotes.value.length
  }, AUTOPLAY_MS)
}

function stopLeftCarousel() {
  if (leftCarouselInterval !== null) {
    clearInterval(leftCarouselInterval)
    leftCarouselInterval = null
  }
}

function prevLeft() {
  activeLeft.value = (activeLeft.value - 1 + leftNotes.value.length) % leftNotes.value.length
  if (isMobile.value) { stopLeftCarousel(); startLeftCarousel(); }
}

function nextLeft() {
  activeLeft.value = (activeLeft.value + 1) % leftNotes.value.length
  if (isMobile.value) { stopLeftCarousel(); startLeftCarousel(); }
}

watch(isMobile, (val) => {
  if (val) {
    startCarousel()
    startLeftCarousel()
  } else {
    stopCarousel()
    stopLeftCarousel()
    activeNote.value = 0
    activeLeft.value = 0
  }
})

// Integrar con el ciclo de vida: detectar resize y controlar autoplay
onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile)
  if (isMobile.value) {
    startCarousel()
    startLeftCarousel()
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('resize', updateIsMobile)
  stopCarousel()
  stopLeftCarousel()
  if (showModal.value) restoreBodyScroll()
})
</script>

<style scoped>
.help-section {
  padding: 4rem 0;
  background: linear-gradient(to bottom, #CDE9F9 0%, #a2bcca 100%);
}
.help-title {
  text-align: center;
  font-size: clamp(1.8rem, 2.8vw, 2.4rem);
  margin-bottom: 2rem;
  color: #000000;
  font-weight: 900;
}
.help-grid {
  display: grid;
  grid-template-columns: minmax(240px, 335px) minmax(350px, 280px) 1fr;
  gap: 0.8rem;
  align-items: stretch;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}
.help-card {
  background: var(--card-bg);
  border-radius: var(--border-radius-lg, 14px);
  padding: 1.4rem;
  border: 1px solid var(--border-primary);
  box-shadow: 0 10px 30px var(--shadow-medium);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
  transition: transform 0.24s ease, box-shadow 0.24s ease;
}
.help-card:hover { transform: translateY(-6px); box-shadow: 0 18px 40px var(--shadow-heavy); }
.help-card .media {
  width: 100%;
  height: 160px;
  overflow: hidden;
  border-radius: 10px;
  background: var(--bg-tertiary);
}
.help-card .media img { width: 100%; height: 100%; object-fit: cover; display: block; }
.card-title { font-size: 1.15rem; color: var(--text-primary); margin: 0; font-weight: 800; }
.card-text { color: var(--text-secondary); margin: 0 0 8px 0; line-height: 1.5; }
.ministries-list { list-style: none; padding: 0; margin: 0; display: grid; gap: 0.6rem; }
.ministries-list li { display:flex; align-items:center; gap:0.6rem; color:var(--text-secondary); font-weight:600; }
.li-icon { width:20px; height:20px; }
.icon-wrap { display:flex; justify-content:center; align-items:center; width:64px; height:64px; border-radius:12px; background: linear-gradient(135deg, rgba(34,211,238,0.06), rgba(6,182,212,0.03)); box-shadow: 0 6px 18px var(--shadow-light); margin-bottom:0.2rem; }
.btn-secondary { display:inline-flex; align-items:center; justify-content:center; gap:8px; margin-top: auto;}

.icon-wrap { background: linear-gradient(135deg, rgba(var(--brand-blue-rgb), 0.06), rgba(var(--brand-blue-rgb), 0.03)); color: var(--brand-yellow); }
.icon-wrap svg path { fill: currentColor; }
.ministries-list li svg { color: var(--brand-yellow); }
.li-icon { width:20px; height:20px; color: var(--brand-yellow); }

@media (max-width: 900px) {
  .help-grid { grid-template-columns: 1fr; }
  .help-card .media { height: 220px; }
}

/* Column helpers for new layout */
.help-col { display: flex; flex-direction: column; gap: 1rem; }
.help-col--left { align-items: center; margin-top: 50px;}
.help-col--center { display:flex; align-items:center;  }
.right-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }

.help-col--left .story-card {  width: 100%; }
.help-col--left .story-media { width: calc(100% + 2.8rem); margin-left: -1.4rem; }

/* Right column header + smaller titles for its cards */
.right-section-title { font-size: 1.5rem; font-weight: 800;  color: #000000;  text-align: center;}
.help-col--right .story-title { font-size: 1.05rem; }

/* Copiado: estilos de tarjetas similares a StoriesSection */
.story-card {
  background: #EBEBEB;
  border-radius: 16px;
  padding: 0 1.4rem 0;
  border: 1px solid rgba(var(--brand-blue-rgb), 0.08);
  box-shadow: 0 12px 30px rgba(var(--brand-blue-rgb), 0.06);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  transition: transform 0.32s cubic-bezier(.2,.9,.2,1), box-shadow 0.32s;
  color: var(--brand-dark);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  overflow: hidden; /* asegurar que la media no tape el borde superior */
  position: relative; /* necesario para botón absolute */
  padding-bottom: 72px; /* reservar espacio para el botón fijo */
}
.story-card:hover { transform: translateY(-8px); box-shadow: 0 24px 50px rgba(var(--brand-blue-rgb), 0.12); }
.story-media { width: calc(100% + 2.8rem); margin-left: -1.4rem; height: 180px; overflow: hidden; position: relative; background: linear-gradient(135deg, rgba(var(--brand-blue-rgb), 0.04), var(--bg-tertiary)); border-top-left-radius: 16px; border-top-right-radius: 16px; }
.story-media img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.6s cubic-bezier(.2,.9,.2,1); border-top-left-radius: 16px; border-top-right-radius: 16px; }
.story-body { width: 100%;  }
.story-card:hover .story-media img { transform: scale(1.05); }
.video-wrap { position: absolute; inset: 0; z-index: 1; }
.video-wrap iframe { width: 100%; height: 100%; border: 0; display: block; }
.story-title { font-size: 1.45rem; color: #000000; margin: 0; font-weight: 1000; text-align: center;}
.story-text { color: rgba(0,0,0,0.68); margin: 0; line-height: 1.5; }
.story-card .btn-secondary {
  position: absolute;
  left: 0rem;
  right: 0rem;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0px;
  background: linear-gradient(90deg, #22265D 0%, #290f5a 100%);
  color: #ffffff;
  border: none;
  box-shadow: 0 10px 30px rgba(0,0,0,0.14);
  padding: 12px 20px;
  height: 30px;
  border-radius: 0 0 12px 12px;
  text-transform: none; /* permitir minúsculas */
  font-weight: 800;
  font-size: 0.95rem;
  letter-spacing: 0.04em;
  transition: transform 0.12s ease, filter 0.12s ease;
  z-index: 3;
}
.story-card .btn-secondary::after { content: '→'; display:inline-block; margin-left:8px; font-size:1.1rem; transform:translateY(1px); }
.story-card .btn-secondary:hover { transform: translateY(-2px); filter: brightness(0.96); }

@media (max-width: 900px) {
  .story-card .btn-secondary {
    width: 100%;
    margin-left: 0;
    margin-bottom: 0;
    border-radius: 0 0 12px 12px;
    padding: 10px 16px;
    height: auto;
  }
}
.story-card--center {  text-align: center; max-width: 480px; width: 100%; margin-top: 50px; }

@media (max-width: 900px) {
  .right-grid { grid-template-columns: 1fr; }
  .story-media { height: 220px; }
}

/* Ajustes específicos para la tarjeta central: centrar imagen y lista a la izquierda */

.story-card--center .story-media {
  height: 220px;
  display: flex;
  align-items: center;
  position: relative;
}
.story-card--center .story-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  display: block;
  margin: 0;
}
.story-card--center .story-body {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  text-align: left; /* lista alineada a la izquierda */
  padding-top: 0.1rem;
}
.story-card--center .story-title { text-align: center; margin-bottom: 0.6rem; }
.story-card--center .mini-list-wrap { align-items:flex-start; text-align:left; margin:0; padding:0; padding-left: 10px;}

/* Modal específico para HelpSection */
.help-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.65);
  z-index: 2147483647 !important;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.help-modal-content {
  background: var(--bg-primary, #ffffff);
  z-index: 2147483648 !important;
  border-radius: 16px;
  max-width: 980px;
  width: 100%;
  max-height: 90vh;
  overflow: auto;
  position: relative;
  box-shadow: 0 30px 60px rgba(0,0,0,0.45);
  margin-top: 0;
}
.help-modal-body { padding: 18px; display:flex; align-items:center; justify-content:center; }
.help-modal-image img { width: 100%; height: auto; max-height: 80vh; object-fit: contain; border-radius: 12px; display:block; }
.help-modal-video iframe { width: 100%; height: 60vh; border: 0; border-radius: 10px; display:block; }
.help-modal-close { position: absolute; top: 12px; right: 12px; background: rgba(255,255,255,0.95); border: none; width: 40px; height: 40px; border-radius: 50%; display:flex; align-items:center; justify-content:center; cursor: pointer; box-shadow: 0 6px 18px rgba(0,0,0,0.12); }
.help-modal-close svg { display:block; }

@media (max-width: 900px) {
  .help-modal-content { border-radius: 12px; }
  .help-modal-video iframe { height: 50vh; }

  /* Carousel móvil: mostrar una tarjeta a la vez en la columna derecha */
  .right-carousel { position: relative; width: 100%; overflow: hidden; }
  .right-carousel .carousel-track { display: flex; transition: transform 0.45s ease; will-change: transform; width: 100%; }
  .right-carousel .carousel-slide { flex: 0 0 100%; max-width: 100%; box-sizing: border-box; padding: 0; }
  .right-carousel .story-card { width: 100%; margin-left: 0; }
  .right-carousel .story-media { width: 100%; margin-left: 0; height: 220px; }
  .carousel-arrow { position: absolute; top: 50%; transform: translateY(-50%); width: 44px; height: 44px; border-radius: 50%; background: rgba(0,0,0,0.48); color: #fff; border: none; display:flex; align-items:center; justify-content:center; z-index: 30; cursor: pointer; box-shadow: 0 6px 18px rgba(0,0,0,0.3); }
  .carousel-arrow.left { left: 8px; }
  .carousel-arrow.right { right: 8px; }
  .carousel-arrow:active { transform: translateY(-50%) scale(0.98); }

  /* Estilos para mini-thumb de video con overlay */
  .video-thumb-wrap { position: relative; width: 100%; height: 100%; cursor: pointer; display:flex; align-items:center; justify-content:center; }
  .video-thumb-wrap img { width: 100%; height: 100%; object-fit: cover; display:block; border-top-left-radius: 16px; border-top-right-radius: 16px; }
  .play-overlay { position: absolute; font-size: 1.5rem; color: rgba(255,255,255,0.98); background: rgba(0,0,0,0.36); width: 56px; height: 56px; border-radius: 50%; display:flex; align-items:center; justify-content:center; box-shadow: 0 6px 18px rgba(0,0,0,0.25); }

}

@media (max-width: 420px) {
  .carousel-arrow { width: 36px; height: 36px; }
  .carousel-arrow.left { left: 6px; }
  .carousel-arrow.right { right: 6px; }

  .story-card {padding: 0 0 80px 0 !important;}
  .story-media img {object-fit:initial; object-position: top center;}
}

/* Mejoras adicionales para vista móvil: evitar overflow, botones en flujo y márgenes */
@media (max-width: 900px) {
  /* Evitar scroll horizontal inesperado */
  .help-section { overflow-x: hidden; }

  /* Eliminar márgenes altos que rompen el flujo en móvil */
  .help-col--left { margin-top: 0 !important; padding-top: 12px; }

  /* Poner el botón dentro del flujo en móvil (no absolute) */
  .story-card { padding-bottom: 0 !important; }
  .story-card .btn-secondary {
    position: relative !important;
    left: auto !important;
    right: auto !important;
    bottom: auto !important;
    width: 100% !important;
    margin-top: 12px;
    z-index: 3;
  }

  /* Ajustes de la tarjeta central en móvil */
  .story-card--center { margin-top: 20px; }

  /* Asegurar que la media no provoque overflow */
  .story-media { width: 100%; margin-left: 0; }

  /* Flechas ligeramente separadas del borde para no tapar contenido */
  .carousel-arrow.left { left: 10px; }
  .carousel-arrow.right { right: 10px; }

  .story-card--center .story-body { padding: 0 12px; }
}

</style>


