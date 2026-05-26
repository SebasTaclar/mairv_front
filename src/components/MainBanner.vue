<template>
  <section class="hero-carousel" ref="heroSectionRef">
    <!-- Carrusel de Imágenes -->
    <div class="carousel-container">
      <div v-for="(slide, index) in slides" :key="index" class="carousel-slide"
        :class="{ 'active': currentSlide === index }">
        <img :src="slide.image" :alt="slide.title" />
        <div class="slide-overlay"></div>
      </div>
    </div>

    <!-- Hero content (título + CTAs) alineado a la izquierda -->
    <div class="hero-content">
      <h3 class="banner-topline">MAI Restaurando Vidas</h3>
      <h1 class="hero-title">UN LUGAR DONDE<br/>LA VERDAD CAMBIARÁ</h1>
      <div class="hero-handwritten">Tu Realidad</div>

      <!-- CTA VISÍTANOS -->
      <div class="explore-button-container">
        <button class="visit-btn" type="button" @click="visit">
          <span class="visit-text">VISÍTANOS</span>
          <span class="visit-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 1 1 18 0z" />
              <circle cx="12" cy="10" r="2" />
            </svg>
          </span>
        </button>
      </div>
    </div>

    <!-- Flecha para ir a la siguiente sección -->
    <button class="scroll-next-btn" type="button" aria-label="Ir a la siguiente sección" @click="scrollToNextSection">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.6"
        stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>

    <!-- Navegación -->
    <div class="carousel-navigation">
      <div class="nav-dots">
        <button v-for="(_, index) in slides" :key="index" @click="goToSlideWrapped(index)"
          :class="['nav-dot', { 'active': currentSlide === index }]">
        </button>
      </div>
      <div class="nav-arrows">
        <button @click="previousSlideWrapped" class="nav-arrow prev">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <button @click="nextSlideWrapped" class="nav-arrow next">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Indicador de Progreso -->
    <div class="progress-indicator">
      <div class="progress-bar" :style="{ width: progressWidth + '%' }"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import './styles/MainBanner.css'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import router from '@/router'

// Tipos
interface ProductSlide {
  image: string
  category: string
  title: string
  description: string
  features: string[]
  id: string
}

// Estado del carrusel
const currentSlide = ref(0)
const autoPlayInterval = ref<ReturnType<typeof setInterval> | null>(null)
const isPlaying = ref(true)
const heroSectionRef = ref<HTMLElement | null>(null)

// Datos de categorías SOYDANI
const slides = ref<ProductSlide[]>([
   {
    id: 'banner_facebook_1',
    image: 'https://scontent-bog2-2.xx.fbcdn.net/v/t51.82787-15/627267971_18450337594096993_322642957206204506_n.jpg?stp=dst-jpegr_tt6&_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeECqXLO2CNs6VU3476pttB3LPrxMwekU-ks-vEzB6RT6dO80ljPFoUNdURwk417RmU&_nc_ohc=FR3rnOOrxKQQ7kNvwG6zGmN&_nc_oc=AdrsB_Juyko65rBwolP6e5AxNJ0jVKsHr_jIeRckqN8Uopob6oz0pEkdNp7OC8qNqmU&_nc_zt=23&se=-1&_nc_ht=scontent-bog2-2.xx&_nc_gid=AEgaKFQV2uTRiKya0Peq3Q&_nc_ss=7b2a8&oh=00_Af68MMO_BD59il_eJFEW5v9kdKIWJCf46Ci6ewjeUZ7Bdw&oe=6A1AA0F6',
    category: 'Principal',
    title: 'Banner adicional',
    description: '',
    features: []
  },
  {
    id: 'banner_external',
    image: 'https://csalazar.org/wp-content/uploads/2021/08/0206d-asistir-iglesia.jpg',
    category: 'Principal',
    title: 'Bienvenido a nuestra tienda',
    description: '',
    features: []
  }

])

// Computed
const progressWidth = computed(() => {
  return ((currentSlide.value + 1) / slides.value.length) * 100
})

// Funciones de navegación
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length
  resetAutoPlay()
}

const previousSlide = () => {
  currentSlide.value = currentSlide.value === 0
    ? slides.value.length - 1
    : currentSlide.value - 1
  resetAutoPlay()
}

const goToSlide = (index: number) => {
  currentSlide.value = index
  resetAutoPlay()
}

// Broadcast estado del carrusel para sincronizar con footer u otros componentes
const broadcastBannerState = () => {
  try {
    window.dispatchEvent(new CustomEvent('banner:update', {
      detail: { current: currentSlide.value, length: slides.value.length }
    }))
  } catch (e) {
    // ignore in non-browser env
  }
}

// Llamar broadcast al cambiar slides manualmente
const _wrapChange = (fn: () => void) => {
  fn()
  broadcastBannerState()
}

// envolver funciones de navegación con broadcast
const nextSlideWrapped = () => _wrapChange(nextSlide)
const previousSlideWrapped = () => _wrapChange(previousSlide)
const goToSlideWrapped = (index: number) => _wrapChange(() => goToSlide(index))

// Auto-play
const startAutoPlay = () => {
  if (!isPlaying.value) return
  autoPlayInterval.value = setInterval(() => {
    nextSlide()
    broadcastBannerState()
  }, 2000) // Cambia cada 2 segundos
}

const stopAutoPlay = () => {
  if (autoPlayInterval.value) {
    clearInterval(autoPlayInterval.value)
    autoPlayInterval.value = null
  }
}

const resetAutoPlay = () => {
  stopAutoPlay()
  setTimeout(() => {
    startAutoPlay()
  }, 1000) // Pausa 1 segundo antes de reanudar
}

// Escuchar comandos desde el footer (ej. cambiar slide)
const onFooterGoTo = (ev: Event) => {
  const detail = (ev as CustomEvent).detail
  const index = typeof detail === 'number' ? detail : detail?.index
  if (typeof index === 'number') {
    goToSlide(index)
    broadcastBannerState()
  }
}

// Funciones de producto
const exploreProduct = (slide: ProductSlide) => {
  // Scroll hacia la sección ProductShowcase
  const productShowcaseElement = document.querySelector('.apple-products-showcase');
  if (productShowcaseElement) {
    productShowcaseElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
  console.log('Navegando hacia ProductShowcase desde:', slide.title)
}

const visit = () => {
  const footerEl = document.querySelector('.footer-cosmic') as HTMLElement | null
  if (footerEl && typeof footerEl.scrollIntoView === 'function') {
    footerEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return
  }

  const contactEl = document.querySelector('.contact-section') as HTMLElement | null
  if (contactEl && typeof contactEl.scrollIntoView === 'function') {
    contactEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return
  }

  if (router) router.push('/contact').catch(() => { })
}

const viewLive = () => {
  try {
    window.open('/live', '_blank')
  } catch (e) {
    console.log('Abrir en vivo', e)
  }
}

const scrollToNextSection = () => {
  const heroEl = heroSectionRef.value
  if (!heroEl) return

  let next = heroEl.nextElementSibling as HTMLElement | null
  while (next && next.tagName === 'SCRIPT') {
    next = next.nextElementSibling as HTMLElement | null
  }

  if (next && typeof next.scrollIntoView === 'function') {
    next.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return
  }

  const fallback = document.querySelector('.help-section, .stories-section, .contact-section') as HTMLElement | null
  if (fallback && typeof fallback.scrollIntoView === 'function') {
    fallback.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// Métodos públicos para control externo
const pauseCarousel = () => {
  isPlaying.value = false
  stopAutoPlay()
}

const resumeCarousel = () => {
  isPlaying.value = true
  startAutoPlay()
}

// Lifecycle
onMounted(() => {
  startAutoPlay()
  // Enviar estado inicial
  broadcastBannerState()
  // Listener para controlar el carrusel desde el footer
  window.addEventListener('footer:goTo', onFooterGoTo as EventListener)
})

onUnmounted(() => {
  stopAutoPlay()
  window.removeEventListener('footer:goTo', onFooterGoTo as EventListener)
})

// Exposer métodos para uso externo
defineExpose({
  nextSlide,
  previousSlide,
  goToSlide,
  pauseCarousel,
  resumeCarousel,
  addSlide: (slide: ProductSlide) => {
    slides.value.push(slide)
  }
})

// También publicar cambios cuando se cambie manualmente
// (invocado desde funciones que ya llaman resetAutoPlay)
// Llamamos broadcastBannerState dentro de next/prev/goToSlide mediante los puntos arriba.
</script>





