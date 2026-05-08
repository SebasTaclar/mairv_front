<template>
  <section class="help-section section" aria-labelledby="help-heading">
    <div class="container">
      <h2 id="help-heading" class="help-title">Cómo podemos ayudarte</h2>

      <div class="help-carousel" ref="carouselRef">
        <button class="carousel-arrow carousel-arrow--left" type="button" aria-label="Anterior"
          @click="moveCarousel(-1)">
          <span aria-hidden="true">‹</span>
        </button>

        <div class="help-grid" ref="gridRef" @scroll.passive="handleCarouselScroll">
          <a v-for="(card, index) in cards" :key="card.title" href="#" class="story-card-link"
            @click.prevent="openModal(card.modalType, card.modalSrc, card.modalAlt)">
            <article class="story-card" :aria-labelledby="`help-${index + 1}-title`">
              <div class="story-media">
                <div v-if="card.mediaType === 'video'" class="video-wrap">
                  <iframe :src="card.mediaSrc" :title="card.title" frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen></iframe>
                </div>
                <img v-else :src="card.mediaSrc" :alt="card.alt" loading="lazy" />
                <div class="story-overlay"></div>
              </div>
              <div class="story-body">
                <h3 :id="`help-${index + 1}-title`" class="story-title">{{ card.title }}</h3>
                <div class="story-cta">Ver más →</div>
              </div>
            </article>
          </a>
        </div>

        <button class="carousel-arrow carousel-arrow--right" type="button" aria-label="Siguiente"
          @click="moveCarousel(1)">
          <span aria-hidden="true">›</span>
        </button>
      </div>

      <div class="carousel-dots" aria-label="Paginación del carrusel">
        <button v-for="(_, index) in cards" :key="`dot-${index}`" type="button" class="carousel-dot"
          :class="{ active: activeSlide === index }" :aria-label="`Ir a la card ${index + 1}`"
          @click="scrollToSlide(index, true)"></button>
      </div>
    </div>
  </section>

  <!-- Modal para imagen / video (teleported al body para evitar recortes) -->
  <teleport to="body" v-if="showModal">
    <div class="help-modal-overlay" @click="closeModal">
      <div class="help-modal-content" @click.stop>
        <button class="help-modal-close" @click="closeModal" aria-label="Cerrar modal">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m18 6-12 12" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
        <div class="help-modal-body">
          <div v-if="modalType === 'image'" class="help-modal-image">
            <img :src="modalSrc" :alt="modalAlt" loading="lazy" />
          </div>
          <div v-else-if="modalType === 'video'" class="help-modal-video">
            <iframe :src="modalSrcWithAutoplay" frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen></iframe>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import './styles/HelpSection.css'

type HelpCard = {
  title: string
  mediaType: 'image' | 'video'
  mediaSrc: string
  alt: string
  modalType: 'image' | 'video'
  modalSrc: string
  modalAlt: string
}

const cards: HelpCard[] = [
  {
    title: 'Oración',
    mediaType: 'video',
    mediaSrc: 'https://www.youtube.com/embed/7Q929bAo5fo?si=IFrvBX0uVC1rxkh_',
    alt: 'Oración',
    modalType: 'video',
    modalSrc: 'https://www.youtube.com/embed/7Q929bAo5fo?si=IFrvBX0uVC1rxkh_',
    modalAlt: 'Oración'
  },
  {
    title: 'Devocionales',
    mediaType: 'image',
    mediaSrc: 'https://www.biblia-es.org/wp-content/uploads/2024/04/Salmos-28-7-480x270.jpg?v=240327',
    alt: 'Devocionales',
    modalType: 'image',
    modalSrc: 'https://www.biblia-es.org/wp-content/uploads/2024/04/Salmos-28-7-480x270.jpg?v=240327',
    modalAlt: 'Devocionales'
  },
  {
    title: 'Se parte de Nuestra familia',
    mediaType: 'image',
    mediaSrc: 'https://res.cloudinary.com/dvu7fperb/image/upload/v1778073286/familiaycomunidad_zp0w4b.jpg',
    alt: 'Familia y comunidad',
    modalType: 'image',
    modalSrc: 'https://res.cloudinary.com/dvu7fperb/image/upload/v1778073286/familiaycomunidad_zp0w4b.jpg',
    modalAlt: 'Familia y comunidad'
  },
  {
    title: 'Mensaje del Día',
    mediaType: 'image',
    mediaSrc: 'https://res.cloudinary.com/dvu7fperb/image/upload/v1778073286/inforgeneral_opdleu.jpg',
    alt: 'Mensaje del Día',
    modalType: 'image',
    modalSrc: 'https://res.cloudinary.com/dvu7fperb/image/upload/v1778073286/inforgeneral_opdleu.jpg',
    modalAlt: 'Mensaje del Día'
  },
  {
    title: 'Anuncios y Actividades',
    mediaType: 'image',
    mediaSrc: 'https://res.cloudinary.com/dvu7fperb/image/upload/v1778073286/anunciosyactividades_micasr.jpg',
    alt: 'Anuncios y Actividades',
    modalType: 'image',
    modalSrc: 'https://res.cloudinary.com/dvu7fperb/image/upload/v1778073286/anunciosyactividades_micasr.jpg',
    modalAlt: 'Anuncios y Actividades'
  },
  {
    title: 'Vida en Comunidad',
    mediaType: 'image',
    mediaSrc: 'https://res.cloudinary.com/dvu7fperb/image/upload/v1778073286/vidaencomunidad_gfr7ci.jpg',
    alt: 'Vida en Comunidad',
    modalType: 'image',
    modalSrc: 'https://res.cloudinary.com/dvu7fperb/image/upload/v1778073286/vidaencomunidad_gfr7ci.jpg',
    modalAlt: 'Vida en Comunidad'
  }
]

const showModal = ref(false)
const modalType = ref<'image' | 'video' | null>(null)
const modalSrc = ref('')
const modalAlt = ref('')
const previousScroll = ref(0)
const activeSlide = ref(0)
const carouselRef = ref<HTMLElement | null>(null)
const gridRef = ref<HTMLElement | null>(null)
let autoplayTimer: number | null = null
let scrollRaf = 0

const mobileQuery = typeof window !== 'undefined' ? window.matchMedia('(max-width: 768px)') : null

function isMobileCarousel() {
  return mobileQuery?.matches ?? false
}

function stopAutoplay() {
  if (autoplayTimer !== null) {
    window.clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

function startAutoplay() {
  stopAutoplay()
  if (!isMobileCarousel() || cards.length < 2) return
  autoplayTimer = window.setInterval(() => {
    const nextIndex = (activeSlide.value + 1) % cards.length
    scrollToSlide(nextIndex, true)
  }, 4200)
}

function scrollToSlide(index: number, smooth: boolean) {
  const grid = gridRef.value
  if (!grid) return
  const normalizedIndex = (index + cards.length) % cards.length
  const width = grid.clientWidth
  grid.scrollTo({ left: width * normalizedIndex, behavior: smooth ? 'smooth' : 'auto' })
  activeSlide.value = normalizedIndex
}

function syncActiveSlide() {
  const grid = gridRef.value
  if (!grid || !isMobileCarousel()) return
  const width = grid.clientWidth || 1
  const nextIndex = Math.max(0, Math.min(cards.length - 1, Math.round(grid.scrollLeft / width)))
  activeSlide.value = nextIndex
}

function handleCarouselScroll() {
  if (!isMobileCarousel()) return
  if (scrollRaf) cancelAnimationFrame(scrollRaf)
  scrollRaf = requestAnimationFrame(() => {
    syncActiveSlide()
  })
}

function moveCarousel(direction: number) {
  const nextIndex = activeSlide.value + direction
  scrollToSlide(nextIndex, true)
  startAutoplay()
}

function handleResize() {
  if (!isMobileCarousel()) {
    stopAutoplay()
    activeSlide.value = 0
    return
  }
  startAutoplay()
  nextTick(() => scrollToSlide(activeSlide.value, false))
}

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
  document.body.style.position = 'fixed'
  document.body.style.top = `-${previousScroll.value}px`
  document.body.style.left = '0'
  document.body.style.right = '0'
  document.body.style.width = '100%'
}

function restoreBodyScroll() {
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

if (typeof document !== 'undefined') {
  document.addEventListener('keydown', handleKeyDown)
}

onMounted(() => {
  if (mobileQuery) {
    mobileQuery.addEventListener('change', handleResize)
  }
  handleResize()
  nextTick(() => syncActiveSlide())
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
  stopAutoplay()
  if (mobileQuery) {
    mobileQuery.removeEventListener('change', handleResize)
  }
  if (scrollRaf) {
    cancelAnimationFrame(scrollRaf)
    scrollRaf = 0
  }
})
</script>
