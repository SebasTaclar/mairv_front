<template>
  <section class="stories-section section" aria-labelledby="stories-heading">
    <div class="container">
      <h2 id="stories-heading" class="stories-title">Historias de bendición</h2>
      <p class="stories-subtitle">Transformando vidas</p>

      <div class="stories-carousel" ref="carouselRef">
        <button class="carousel-arrow carousel-arrow--left" type="button" aria-label="Anterior"
          @click="moveCarousel(-1)">
          <span aria-hidden="true">‹</span>
        </button>

        <div class="stories-grid" ref="gridRef" @scroll.passive="handleCarouselScroll">
          <a v-for="(story, index) in stories" :key="story.title" :href="story.href" target="_blank" rel="noopener"
            class="story-card-link">
            <article class="story-card" :aria-labelledby="`story-${index + 1}-title`">
              <div class="story-media">
                <div v-if="story.mediaType === 'video'" class="video-wrap">
                  <iframe :src="story.mediaSrc" :title="story.title" frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen loading="lazy"></iframe>
                </div>
                <img v-else :src="story.mediaSrc" :alt="story.alt" loading="lazy" />
                <div class="story-overlay"></div>
              </div>
              <div class="story-body">
                <h3 :id="`story-${index + 1}-title`" class="story-title">{{ story.title }}</h3>
                <p v-if="story.description" class="story-text">{{ story.description }}</p>
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

      <div class="carousel-dots" aria-label="Paginación de historias">
        <button v-for="(_, index) in stories" :key="`story-dot-${index}`" type="button" class="carousel-dot"
          :class="{ active: activeSlide === index }" :aria-label="`Ir a la historia ${index + 1}`"
          @click="scrollToSlide(index, true)"></button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import './styles/StoriesSection.css'

type StoryCard = {
  title: string
  href: string
  mediaType: 'image' | 'video'
  mediaSrc: string
  alt: string
  description?: string
}

const stories: StoryCard[] = [
  {
    title: 'Testimonio - Blog',
    href: 'https://res.cloudinary.com/dvu7fperb/image/upload/v1778073286/testimonios_m33dsm.jpg',
    mediaType: 'image',
    mediaSrc: 'https://res.cloudinary.com/dvu7fperb/image/upload/v1778073286/testimonios_m33dsm.jpg',
    alt: 'Laptop con artículo de testimonio'
  },
  {
    title: 'Testimonio - Video',
    href: 'https://www.youtube.com/watch?v=pVkNYW2f3TU',
    mediaType: 'video',
    mediaSrc: 'https://www.youtube.com/embed/pVkNYW2f3TU',
    alt: 'Testimonio en video'
  },
  {
    title: 'Somos Iglesia',
    href: 'https://www.youtube.com/watch?v=DcDH7TiNIq8',
    mediaType: 'video',
    mediaSrc: 'https://www.youtube.com/embed/DcDH7TiNIq8?si=eF9Lh4exgpihCjwm',
    alt: 'Somos Iglesia',
    description: 'Encuentra esperanza y comunidad'
  }
]

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

function scrollToSlide(index: number, smooth: boolean) {
  const grid = gridRef.value
  if (!grid) return
  const normalizedIndex = (index + stories.length) % stories.length
  const width = grid.clientWidth
  grid.scrollTo({ left: width * normalizedIndex, behavior: smooth ? 'smooth' : 'auto' })
  activeSlide.value = normalizedIndex
}

function syncActiveSlide() {
  const grid = gridRef.value
  if (!grid || !isMobileCarousel()) return
  const width = grid.clientWidth || 1
  activeSlide.value = Math.max(0, Math.min(stories.length - 1, Math.round(grid.scrollLeft / width)))
}

function startAutoplay() {
  stopAutoplay()
  if (!isMobileCarousel() || stories.length < 2) return
  autoplayTimer = window.setInterval(() => {
    scrollToSlide(activeSlide.value + 1, true)
  }, 4300)
}

function handleCarouselScroll() {
  if (!isMobileCarousel()) return
  if (scrollRaf) cancelAnimationFrame(scrollRaf)
  scrollRaf = requestAnimationFrame(() => syncActiveSlide())
}

function moveCarousel(direction: number) {
  scrollToSlide(activeSlide.value + direction, true)
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

onMounted(() => {
  if (mobileQuery) {
    mobileQuery.addEventListener('change', handleResize)
  }
  handleResize()
  nextTick(() => syncActiveSlide())
})

onUnmounted(() => {
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



