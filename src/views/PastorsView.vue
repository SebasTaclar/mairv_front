<template>
  <section class="pastors-section section" aria-labelledby="pastors-title">
    <div class="container">
      <h1 id="pastors-title" class="title">Nuestros Pastores</h1>

      <div class="subsection">
        <h2 class="subsection-title">Nuestros Pastores Fundadores</h2>
        <div class="cards-grid cards-grid--two">
          <article
            v-for="pastor in pastorsFundadores"
            :key="pastor.id"
            class="pastor-card"
            tabindex="0"
            role="button"
            @click="openModal(pastor)"
            @keydown.enter.prevent="openModal(pastor)"
          >
            <div class="card-image-wrap">
              <div class="card-image" :style="{ backgroundImage: `url(${pastor.photo})` }" :aria-label="`Foto de ${pastor.name}`" role="img"></div>
            </div>

            <div class="card-body">
              <p class="card-role">{{ pastor.role }}</p>
              <h2 class="card-name">{{ pastor.name }}</h2>
            </div>
          </article>
        </div>
      </div>

      <div class="subsection">
        <h2 class="subsection-title">Nuestros Pastores Administrativos</h2>
        <div class="cards-grid cards-grid--one">
          <article
            v-for="pastor in pastorsAdministrativos"
            :key="pastor.id"
            class="pastor-card"
            tabindex="0"
            role="button"
            @click="openModal(pastor)"
            @keydown.enter.prevent="openModal(pastor)"
          >
            <div class="card-image-wrap">
              <div class="card-image" :style="{ backgroundImage: `url(${pastor.photo})` }" :aria-label="`Foto de ${pastor.name}`" role="img"></div>
            </div>

            <div class="card-body">
              <p class="card-role">{{ pastor.role }}</p>
              <h2 class="card-name">{{ pastor.name }}</h2>
            </div>
          </article>
        </div>
      </div>
    </div>

    <div v-if="selectedPastor" class="modal-backdrop" @click.self="closeModal">
      <div class="modal" role="dialog" aria-modal="true" :aria-label="selectedPastor.name">
        <button class="modal-close" @click="closeModal" aria-label="Cerrar">✕</button>
        <div class="modal-body">
          <div class="modal-left">
            <div class="avatar-lg" :style="{ backgroundImage: `url(${selectedPastor.photo})` }"></div>
            <div class="contact">
              <a v-if="selectedPastor.email" :href="`mailto:${selectedPastor.email}`" class="contact-item">✉️ {{ selectedPastor.email }}</a>
              <a v-if="selectedPastor.phone" :href="`tel:${selectedPastor.phone}`" class="contact-item">📞 {{ selectedPastor.phone }}</a>
              <a v-if="selectedPastor.social" :href="selectedPastor.social" target="_blank" rel="noreferrer" class="contact-item">🔗 Sitio</a>
            </div>
          </div>

          <div class="modal-right">
            <h2 class="modal-name">{{ selectedPastor.name }}</h2>
            <div class="modal-role">{{ selectedPastor.role }}</div>
            <p class="modal-bio">{{ selectedPastor.bio }}</p>
            <div v-if="selectedPastor.focus" class="modal-section">
              <h3>Áreas de trabajo</h3>
              <p>{{ selectedPastor.focus }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

type Pastor = {
  id: string
  name: string
  role: string
  photo: string
  bio?: string
  email?: string
  phone?: string
  social?: string
  focus?: string
}

const selectedPastor = ref<Pastor | null>(null)

const pastors = [
  {
    id: 'p1',
    name: 'Apóstol Guillermo Puentes',
    role: 'Pastor Fundador',
    photo: 'https://scontent.fbog19-1.fna.fbcdn.net/v/t51.75761-15/499234730_18409466635096993_901778914946656855_n.jpg?stp=dst-jpegr_tt6&cstp=mx1440x1800&ctp=s1440x1800&_nc_cat=111&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeEZ-IirFIpxwYmLzX-bh2pOxeLm9rjW_CHF4ub2uNb8IfgqWHu8wbQewTOQvRcJWjo&_nc_ohc=bZ0vZ36mn2IQ7kNvwG11Euw&_nc_oc=AdqMQ58Kq5uhdDTyYcslAISP4yte_1M8CNsPlhNvJbJxZkAOSevmCSepSBCIYUN82ts&_nc_zt=23&se=-1&_nc_ht=scontent.fbog19-1.fna&_nc_gid=OH3RpnfaUADqIV9jH_HUNw&_nc_ss=7b2a8&oh=00_Af-cHsnlZyAuvb3Z9luyLRKMb0ySrtKogIhbqw398lZ8iA&oe=6A431C64',
    bio: 'Guillermo lidera la casa con una visión enfocada en el evangelio, el discipulado y el cuidado pastoral de toda la comunidad.',
    email: 'guillermo@mairv.org',
    phone: '+57-300-0000000',
    focus: 'Predicación, dirección espiritual y formación de líderes.'
  },
  {
    id: 'p2',
    name: 'Profeta Jeannette Camacho',
    role: 'Pastora Fundadora',
    photo: 'https://scontent.fbog19-1.fna.fbcdn.net/v/t51.75761-15/499585324_18409466623096993_5499295061207099992_n.jpg?stp=dst-jpegr_tt6&cstp=mx1440x1800&ctp=s1440x1800&_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGrCVXYGp32xjdQrpeXgCYLVYMMzRx5qTdVgwzNHHmpN4W93x0Sezxd09550wHNiBA&_nc_ohc=5pUrZuhYLWIQ7kNvwHDQhZN&_nc_oc=AdpeqMBwzDpTP1GmqcfWJeOEf84FzD9h0me172yZ6mmGDk0dfonS1kjYXjvykmtaRXI&_nc_zt=23&se=-1&_nc_ht=scontent.fbog19-1.fna&_nc_gid=GC-g8liQ63pf1BNNJESTvA&_nc_ss=7b2a8&oh=00_Af8WQr8TWVYiHL4LHQL-9i_hr3kwGlOZHwGyTc4r3RUX3Q&oe=6A42F960',
    bio: 'Jeannette sirve con una palabra cercana y compasiva, impulsando la restauración y la vida familiar en la iglesia.',
    email: 'jeannette@mairv.org',
    phone: '+57-310-0000000',
    social: 'https://instagram.com',
    focus: 'Acompañamiento, oración y ministerio a las familias.'
  },
  {
    id: 'p3',
    name: 'Pastor Sebastián Buitrago',
    role: 'Pastor Administrativo',
    photo: 'https://scontent.fbog19-1.fna.fbcdn.net/v/t51.82787-15/504047569_18415105114096993_8071677090345308012_n.jpg?stp=dst-jpegr_tt6&cstp=mx1440x1085&ctp=s1440x1085&_nc_cat=105&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeFuUi7OvdfufnqwEB4yL-UPj77AIyYwbQqPvsAjJjBtCglXf6iyx2iPLKTeNtjJA00&_nc_ohc=6MK9Bm93XLMQ7kNvwGxVwzm&_nc_oc=Adqb0V7YeS0j4a__LYws0hw6Z7ITNbb53NCRy5AutLyizw7Fyg0gK15kvMYbEqmodmE&_nc_zt=23&se=-1&_nc_ht=scontent.fbog19-1.fna&_nc_gid=wHywxpaTMkHxiWKSAjJurQ&_nc_ss=7b2a8&oh=00_Af8Kl2lIrEE5XHDEO2zC-XfjSaZnbnhJAn4gKeE8a5c1GA&oe=6A42E8F1',
    bio: 'Sebastián acompaña a la congregación con enseñanza bíblica, servicio y una visión práctica para crecer en comunidad.',
    email: 'sebastian@mairv.org',
    phone: '+57-320-0000000',
    focus: 'Enseñanza, servicio y acompañamiento pastoral.'
  }
] as const

const pastorsFundadores = computed(() => pastors.filter(p => p.role.includes('Fundador')))
const pastorsAdministrativos = computed(() => pastors.filter(p => p.role.includes('Administrativo')))

function openModal(p: Pastor) {
  selectedPastor.value = p
}

function closeModal() {
  selectedPastor.value = null
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && selectedPastor.value) closeModal()
}

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<style scoped>
.pastors-section {
  position: relative;
  min-height: 100vh;
  padding: 5.5rem 0 4.5rem;
  overflow: hidden;
  color: #22265D;
}

.pastors-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 15% 10%, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.14) 28%, transparent 42%),
    radial-gradient(circle at 82% 16%, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.1) 24%, transparent 42%),
    radial-gradient(circle at 18% 82%, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.08) 28%, transparent 44%),
    linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.94));
  pointer-events: none;
}

.container {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.eyebrow {
  margin: 0 0 0.5rem;
  text-align: center;
  font-size: clamp(1rem, 1.55vw, 1.15rem);
  font-weight: 600;
  color: #9c7a09;
}

.title {
  margin: 0 0 2.6rem;
  text-align: center;
  color: #22265D;
  font-size: clamp(2rem, 3vw, 2.3rem);
  font-weight: 500;
  letter-spacing: 0.01em;
  padding-top: 2rem;
}

.subsection {
  margin-bottom: 3rem;
}

.subsection-title {
  text-align: center;
  color: #22265D;
  font-size: clamp(1.4rem, 2.5vw, 1.8rem);
  font-weight: 500;
  margin-bottom: 2rem;
  padding-top: 1rem;
}

.cards-grid {
  display: grid;
  gap: clamp(1.5rem, 3vw, 40px);
  align-items: stretch;
}

.cards-grid--two {
  grid-template-columns: repeat(2, 1fr);
  max-width: 700px;
  margin: 0 auto;
}

.cards-grid--one {
  grid-template-columns: 1fr;
  max-width: 350px;
  margin: 0 auto;
}

.pastor-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 22px rgba(34, 38, 93, 0.14);
  overflow: hidden;
  cursor: pointer;
  transition: transform .2s ease, box-shadow .2s ease;
  outline: none;
}

.pastor-card:hover,
.pastor-card:focus-visible {
  transform: translateY(-6px);
  box-shadow: 0 16px 30px rgba(34, 38, 93, 0.18);
}

.card-image-wrap {
  background: radial-gradient(circle at 50% 28%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 38%, rgba(0,0,0,0.15) 100%), #2b2b2b;
}

.card-image {
  height: 238px;
  border-radius: 12px 12px 0 0;
  background-size: cover;
  background-repeat: no-repeat;
  width: 100%;
}

.card-body {
  background: #fff;
  padding: 0.45rem 0.7rem 0.5rem;
  text-align: center;
}

.card-role {
  margin: 0 0 0.35rem;
  color: #d9a313;
  font-size: 0.95rem;
  font-weight: 400;
}

.card-name {
  margin: 0;
  color: #22265D;
  font-size: clamp(1.55rem, 2vw, 1.55rem);
  line-height: 1.08;
  font-weight: 500;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 60;
  padding: 1rem;
}

.modal {
  background: linear-gradient(180deg, #081428, #0c2a50);
  border-radius: 16px;
  width: min(920px, 100%);
  max-height: 90vh;
  overflow: auto;
  padding: 1rem;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: transparent;
  border: 0;
  color: #cfe1ff;
  font-size: 1.1rem;
  cursor: pointer;
}

.modal-body {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.modal-left {
  width: 260px;
  text-align: center;
}

.avatar-lg {
  width: 180px;
  height: 180px;
  border-radius: 12px;
  background-size: cover;
  background-position: center;
  margin: 0 auto 0.5rem;
}

.contact {
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.contact-item {
  color: #bde0ff;
  text-decoration: none;
}

.modal-right {
  flex: 1;
}

.modal-name {
  margin: 0;
  font-size: 1.35rem;
  color: rgb(219, 200, 23);
}

.modal-role {
  color: #bcd3ee;
  font-weight: 700;
  margin-top: 0.25rem;
}

.modal-bio {
  margin-top: 0.75rem;
  color: #d7e9ff;
}

.modal-section {
  margin-top: 1rem;
  color: #cfe3ff;
}

.modal-section h3 {
  margin: 0 0 0.35rem;
  color: #9ec1ff;
}

@media (max-width: 980px) {
  .cards-grid--two {
    grid-template-columns: 1fr;
    max-width: 350px;
  }

  .cards-grid--one {
    max-width: 350px;
  }

  .card-image {
    height: 260px;
  }
}

@media (max-width: 640px) {
  .pastors-section {
    padding: 4.2rem 0 3.8rem;
  }

  .title {
    margin-bottom: 1.8rem;
  }

  .card-image-wrap {
    padding: 0.75rem 0.75rem 0;
  }

  .card-image {
    height: 220px;
  }

  .card-name {
    font-size: 1.55rem;
  }

  .modal-body {
    flex-direction: column;
  }

  .modal-left {
    width: 100%;
  }

  .avatar-lg {
    width: 140px;
    height: 140px;
  }
}
</style>
