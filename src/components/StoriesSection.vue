<template>
  <section class="stories-section section" aria-labelledby="stories-heading">
    <div class="container">
      <p class="kicker">TRANSFORMANDO VIDAS</p>
      <h2 id="estamos-title" class="title">HISTORIAS DE BENDICIÓN</h2>

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
                <div class="story-cta">{{ story.cta }}</div>
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

type StoryCard = {
  title: string
  href: string
  mediaType: 'image' | 'video'
  mediaSrc: string
  alt: string
  cta: string
  description?: string
}

const stories: StoryCard[] = [
  {
    title: 'Testimonio - Blog',
    href: 'https://res.cloudinary.com/dvu7fperb/image/upload/v1778073286/testimonios_m33dsm.jpg',
    mediaType: 'image',
    mediaSrc: 'https://res.cloudinary.com/dvu7fperb/image/upload/v1778073286/testimonios_m33dsm.jpg',
    alt: 'Laptop con artículo de testimonio',
    cta: 'Leer más'
  },
  {
    title: 'Testimonio - Video',
    href: 'https://www.youtube.com/watch?v=pVkNYW2f3TU',
    mediaType: 'video',
    mediaSrc: 'https://www.youtube.com/embed/pVkNYW2f3TU',
    alt: 'Testimonio en video',
    cta: 'Ver más'
  },
  {
    title: 'Somos Iglesia',
    href: 'https://www.youtube.com/watch?v=DcDH7TiNIq8',
    mediaType: 'video',
    mediaSrc: 'https://www.youtube.com/embed/DcDH7TiNIq8?si=eF9Lh4exgpihCjwm',
    alt: 'Somos Iglesia',
    cta: 'Ver Galeria',
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

<style scoped>
.stories-section {
  padding-top: 6rem;
  padding-bottom: 6rem;
  background: linear-gradient(180deg, #f5f5f5 0%, #EBEBEB 100%);
  color: #333333;
  overflow-x: hidden;
}

.container {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 16px;
}

.stories-title {
  text-align: center;
  font-size: clamp(2.2rem, 4vw, 3.2rem);
  color: #22265D;
  font-weight: 900;
  margin: 0 0 0.8rem 0;
  letter-spacing: -0.5px;
}

.stories-subtitle {
  text-align: center;
  color: #FFC107;
  margin-bottom: 3.5rem;
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.stories-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 9.2rem;
  align-items: stretch;
}

.stories-carousel {
  position: relative;
}

.story-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
  height: 100%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.story-card {
  background: #ffffff;
  border-radius: 18px;
  padding: 0;
  overflow: hidden;
  border: 2px solid transparent;
  box-shadow: 0 8px 32px rgba(34, 38, 93, 0.1);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  color: #333333;
  position: relative;
  height: 100%;
}

.story-card-link:hover .story-card {
  transform: translateY(-16px);
  box-shadow: 0 32px 64px rgba(34, 38, 93, 0.2);
}

.story-media {
  width: 100%;
  height: 185px;
  overflow: hidden;
  position: relative;
  background: linear-gradient(135deg, #22265D 0%, #1b214f 100%);
  border-radius: 18px 18px 0 0;
}

.story-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.3) 100%);
  z-index: 2;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.story-card-link:hover .story-overlay {
  opacity: 1;
}

.story-media img,
.video-wrap {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.video-wrap {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.video-wrap iframe {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}

.story-card-link:hover .story-media img,
.story-card-link:hover .video-wrap {
  transform: scale(1.03);
}

.story-body {
  width: 100%;
  padding: 0.4rem 1rem 0.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.28rem;
}

.story-title {
  font-size: 1.45rem;
  color: #22265D;
  font-weight: 500;
  text-align: center;
  line-height: 1.22;
  letter-spacing: 0;
}

.story-text {
  color: #777777;
  line-height: 1.25;
  text-align: center;
  font-size: 0.84rem;
}

.story-cta {
  display: inline-block;
  color: #D9A313;
  border: none;
  padding: 0;
  font-weight: 600;
  font-size: 0.93rem;
  cursor: pointer;
  transition: opacity 0.2s ease;
  text-decoration: none;
  align-self: center;
  margin-top: 0.2rem;
}

.story-card-link:hover .story-cta {
  opacity: 0.86;
}

.carousel-arrow,
.carousel-dots {
  display: none;
}

@media (max-width: 900px) {
  .stories-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .story-media {
    height: 170px;
  }

  .stories-section {
    padding-top: 4rem;
    padding-bottom: 4rem;
  }

  .story-body {
    padding: 0.78rem 0.95rem 0.72rem;
  }

  .story-title {
    font-size: 1.75rem;
  }
}

.story-card .btn-secondary {
  position: absolute;
  left: 0rem;
  right: 0rem;
  bottom: 1px;
  /* mostrar 1px del borde inferior */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(90deg, #22265D 0%, #290f5a 100%);
  color: #ffffff;
  border: none;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.14);
  padding: 12px 20px;
  height: 30px;
  border-radius: 0 0 16px 16px;
  text-transform: none;
  font-weight: 800;
  font-size: 0.95rem;
  letter-spacing: 0.04em;
  transition: transform 0.12s ease, filter 0.12s ease;
  z-index: 3;
}

.kicker {
  color: #D9A313;
  font-weight: 400;
  margin-bottom: 8px;
  font-size: 1.4rem;
  line-height: 1.2rem;
  text-align: center;
}

.title {
  color: #1b2b64;
  font-size: clamp(2.1rem, 5vw, 2.8rem);
  margin: 0 0 36px 0;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-align: center;
}

@media (max-width: 900px) {
  .stories-grid {
    grid-template-columns: 1fr;
  }

  .story-media {
    height: 200px;
  }
}

@media (max-width: 768px) {
  .stories-section {
    padding-top: 4rem;
    padding-bottom: 4.5rem;
  }

  .stories-subtitle {
    margin-bottom: 2rem;
  }

  .stories-carousel {
    position: relative;
    padding: 0 1.9rem;
  }

  .stories-grid {
    display: flex;
    gap: 0;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    touch-action: pan-x;
    overscroll-behavior-x: contain;
    scrollbar-width: none;
  }

  .stories-grid::-webkit-scrollbar {
    display: none;
  }

  .story-card-link {
    flex: 0 0 100%;
    max-width: 100%;
    box-sizing: border-box;
    padding: 0 2px;
    scroll-snap-align: center;
    scroll-snap-stop: always;
  }

  .story-card {
    border-radius: 22px;
    box-shadow: 0 14px 40px rgba(34, 38, 93, 0.14);
    transform: translateZ(0);
    will-change: transform;
  }

  .story-card-link:hover .story-card {
    transform: none;
  }

  .story-media {
    height: 210px;
  }

  .story-body {
    padding: 0.95rem 0.95rem 1rem;
    gap: 0.45rem;
  }

  .story-title {
    font-size: 1.28rem;
  }

  .story-text {
    font-size: 0.85rem;
  }

  .story-cta {
    font-size: 0.88rem;
  }

  .carousel-arrow {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 42px;
    height: 42px;
    border: none;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.95);
    color: #22265D;
    box-shadow: 0 12px 30px rgba(34, 38, 93, 0.18);
    z-index: 3;
    cursor: pointer;
    transition: transform 0.25s ease, background 0.25s ease;
  }

  .carousel-arrow:hover {
    transform: translateY(-50%) scale(1.06);
    background: #ffffff;
  }

  .carousel-arrow--left {
    left: 0.1rem;
    top: 13rem;
  }

  .carousel-arrow--right {
    right: 0.1rem;
    top: 13rem;
  }


  .carousel-arrow span {
    font-size: 1.8rem;
    line-height: 1;
    margin-top: -2px;
  }

  .carousel-dots {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-top: 1rem;
  }

  .carousel-dot {
    width: 9px;
    height: 9px;
    border: none;
    border-radius: 999px;
    transition: width 0.25s ease, background 0.25s ease, transform 0.25s ease;
  }

  .carousel-dot.active {
    width: 28px;
    background: #FFC107;
    transform: scale(1.04);
  }
}

@media (max-width: 520px) {
  .stories-carousel {
    padding: 0 0.2rem;
  }

  .story-media {
    height: 190px;
  }

  .story-title {
    font-size: 1.15rem;
  }

  .carousel-arrow {
    width: 38px;
    height: 38px;
  }

  .carousel-arrow span {
    font-size: 1.55rem;
    font-size: 1.55rem;
  }
}
</style>
