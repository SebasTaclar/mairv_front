<template>
  <section class="help-section section" aria-labelledby="help-heading">
    <div class="container">
      <h2 id="help-heading" class="help-title">Cómo podemos ayudarte</h2>

      <div class="help-grid">
        <!-- Card 1 -->
        <a href="#" @click.prevent="openModal('video', 'https://www.youtube.com/embed/7Q929bAo5fo?si=IFrvBX0uVC1rxkh_')"
          class="story-card-link">
          <article class="story-card" aria-labelledby="help-1-title">
            <div class="story-media">
              <div class="video-wrap">
                <iframe src="https://www.youtube.com/embed/7Q929bAo5fo?si=IFrvBX0uVC1rxkh_" title="Oración"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen></iframe>
              </div>
              <div class="story-overlay"></div>
            </div>
            <div class="story-body">
              <h3 id="help-1-title" class="story-title">Oración</h3>
              <div class="story-cta">Ver más →</div>
            </div>
          </article>
        </a>

        <!-- Card 2 -->
        <a href="#"
          @click.prevent="openModal('image', 'https://www.biblia-es.org/wp-content/uploads/2024/04/Salmos-28-7-480x270.jpg?v=240327', 'Devocionales')"
          class="story-card-link">
          <article class="story-card" aria-labelledby="help-2-title">
            <div class="story-media">
              <img src="https://www.biblia-es.org/wp-content/uploads/2024/04/Salmos-28-7-480x270.jpg?v=240327"
                alt="Devocionales" loading="lazy" />
              <div class="story-overlay"></div>
            </div>
            <div class="story-body">
              <h3 id="help-2-title" class="story-title">Devocionales</h3>
              <div class="story-cta">Ver más →</div>
            </div>
          </article>
        </a>

        <!-- Card 3 -->
        <a href="#"
          @click.prevent="openModal('image', 'https://res.cloudinary.com/dvu7fperb/image/upload/v1778073286/familiaycomunidad_zp0w4b.jpg', 'Familia y comunidad')"
          class="story-card-link">
          <article class="story-card" aria-labelledby="help-3-title">
            <div class="story-media">
              <img src="https://res.cloudinary.com/dvu7fperb/image/upload/v1778073286/familiaycomunidad_zp0w4b.jpg"
                alt="Familia y comunidad" loading="lazy" />
              <div class="story-overlay"></div>
            </div>
            <div class="story-body">
              <h3 id="help-3-title" class="story-title">Se parte de Nuestra familia</h3>
              <div class="story-cta">Ver más →</div>
            </div>
          </article>
        </a>

        <!-- Card 4 -->
        <a href="#"
          @click.prevent="openModal('image', 'https://res.cloudinary.com/dvu7fperb/image/upload/v1778073286/inforgeneral_opdleu.jpg', 'Mensaje del Día')"
          class="story-card-link">
          <article class="story-card" aria-labelledby="help-4-title">
            <div class="story-media">
              <img src="https://res.cloudinary.com/dvu7fperb/image/upload/v1778073286/inforgeneral_opdleu.jpg"
                alt="Mensaje del Día" loading="lazy" />
              <div class="story-overlay"></div>
            </div>
            <div class="story-body">
              <h3 id="help-4-title" class="story-title">Mensaje del Día</h3>
              <div class="story-cta">Ver más →</div>
            </div>
          </article>
        </a>

        <!-- Card 5 -->
        <a href="#"
          @click.prevent="openModal('image', 'https://res.cloudinary.com/dvu7fperb/image/upload/v1778073286/anunciosyactividades_micasr.jpg', 'Anuncios y Actividades')"
          class="story-card-link">
          <article class="story-card" aria-labelledby="help-5-title">
            <div class="story-media">
              <img src="https://res.cloudinary.com/dvu7fperb/image/upload/v1778073286/anunciosyactividades_micasr.jpg"
                alt="Anuncios y Actividades" loading="lazy" />
              <div class="story-overlay"></div>
            </div>
            <div class="story-body">
              <h3 id="help-5-title" class="story-title">Anuncios y Actividades</h3>
              <div class="story-cta">Ver más →</div>
            </div>
          </article>
        </a>

        <!-- Card 6 -->
        <a href="#"
          @click.prevent="openModal('image', 'https://res.cloudinary.com/dvu7fperb/image/upload/v1778073286/vidaencomunidad_gfr7ci.jpg', 'Vida en Comunidad')"
          class="story-card-link">
          <article class="story-card" aria-labelledby="help-6-title">
            <div class="story-media">
              <img src="https://res.cloudinary.com/dvu7fperb/image/upload/v1778073286/vidaencomunidad_gfr7ci.jpg"
                alt="Vida en Comunidad" loading="lazy" />
              <div class="story-overlay"></div>
            </div>
            <div class="story-body">
              <h3 id="help-6-title" class="story-title">Vida en Comunidad</h3>
              <div class="story-cta">Ver más →</div>
            </div>
          </article>
        </a>
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
import { ref, computed } from 'vue'
import './styles/HelpSection.css'

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
</script>
