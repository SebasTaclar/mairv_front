<template>
  <section class="estamos-section" aria-labelledby="estamos-title">
    <div class="container">
      <p class="kicker">¿CÓMO PODEMOS AYUDARTE?</p>
      <h2 id="estamos-title" class="title">ESTAMOS PARA TI</h2>

      <div class="carousel-shell">
        <button class="carousel-nav carousel-nav--left" type="button" aria-label="Anterior" @click="scrollCarousel(-1)">‹</button>

        <div ref="carouselRef" class="carousel-viewport" tabindex="0" aria-label="Carrusel de ayuda">
          <div class="cards">
            <article class="card" v-for="(card, idx) in cards" :key="idx">
              <div class="icon">
                    <div class="icon-circle">
                      <img :src="card.img" :alt="card.title" />
                    </div>
              </div>

              <h3 class="card-title">{{ card.title }}</h3>
              <p class="card-desc">{{ card.desc }}</p>
              <a :href="card.href" class="card-link">{{ card.linkText }} <span class="card-arrow" aria-hidden>→</span></a>
            </article>
          </div>
        </div>

        <button class="carousel-nav carousel-nav--right" type="button" aria-label="Siguiente" @click="scrollCarousel(1)">›</button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const carouselRef = ref<HTMLElement | null>(null)

const cards = [
  { title: 'ORACIÓN', desc: 'Estamos aquí para orar\ncontigo y por ti', linkText: 'Pedir oración', href: '#oracion', type: 'pray', img: 'https://res.cloudinary.com/dlwzazojt/image/upload/q_auto/f_auto/v1779766084/Screenshot_15_u3ugcc.jpg' },
  { title: 'SÉ PARTE DE\nNUESTRA FAMILIA', desc: 'Todos pertenecemos a un lugar, busquemos el tuyo', linkText: 'Ver ministerios', href: '#ministerios', type: 'people', img: 'https://res.cloudinary.com/dlwzazojt/image/upload/q_auto/f_auto/v1779766084/Screenshot_16_bnmtwe.jpg' },
  { title: 'RECURSOS', desc: 'Encuentra notas y\nanuncios importantes', linkText: 'Ver notas', href: '#recursos', type: 'notes', img: 'https://res.cloudinary.com/dlwzazojt/image/upload/q_auto/f_auto/v1779766084/Screenshot_17_tjbygo.jpg' },
  { title: 'VIDA EN\nCOMUNIDAD', desc: 'Conéctate y participa en la vida de la iglesia', linkText: 'Ver comunidad', href: '#comunidad', type: 'community', img: 'https://res.cloudinary.com/dlwzazojt/image/upload/q_auto/f_auto/v1779766084/Screenshot_18_qcemef.jpg' },
  { title: 'ANUNCIOS Y\nACTIVIDADES', desc: 'Entérate de los próximos eventos y novedades', linkText: 'Ver anuncios', href: '#anuncios', type: 'announcements', img: 'https://res.cloudinary.com/dlwzazojt/image/upload/q_auto/f_auto/v1779766084/Screenshot_19_d3xp8l.jpg' }
]

const scrollCarousel = (direction: number) => {
  const carousel = carouselRef.value
  if (!carousel) return

  const cardWidth = carousel.clientWidth / 3
  carousel.scrollBy({ left: direction * cardWidth, behavior: 'smooth' })
}
</script>

<style scoped>
.estamos-section{
  background: #f0f0f0; /* gris claro similar a la imagen */
  padding: 56px 20px;
}
.container{
  max-width: 1120px;
  margin: 0 auto;
  text-align: center;
  position: relative;
}
.carousel-shell{
  position: relative;
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr) 52px;
  align-items: center;
  gap: 12px;
}
.kicker{
  color: #D9A313;
  font-weight: 400;
  margin-bottom: 8px;
  font-size: 1.4rem;
  line-height: 1.2rem;
}
.title{
  color: #1b2b64;
  font-size: clamp(2.1rem, 5vw, 2.8rem);
  margin: 0 0 36px 0;
  font-weight: 500;
  letter-spacing: 0.04em;
}
.carousel-viewport{
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.carousel-viewport::-webkit-scrollbar{
  display: none;
}
.cards{
  display: flex;
  flex-wrap: nowrap;
  align-items: start;
}
.card{
  background: transparent;
  flex: 0 0 calc(100% / 3);
  padding: 16px 28px 24px;
  box-sizing: border-box;
}
.icon{
  width: 120px;
  height: 120px;
  margin: 0 auto 18px;
}
.icon-circle{ width:100%; height:100%; border-radius:50%; background:#1b2b64; display:flex; align-items:center; justify-content:center; }
.icon-circle img{ width:98%; height:93%; object-fit:contain; border-radius: 50%; }
.card-title{
  color: #1b2b64;
  font-weight:500;
  margin: 8px 0 8px;
  letter-spacing: 0.04em;
  font-size: clamp(1.2rem, 2.5vw, 1.4rem);
}
.card-desc{
  color:#333;
  font-size:15px;
  max-width: 220px;
  margin: 0 auto 32px;
  white-space: pre-line;
}
.card-link{
  color: #D9A313;
  font-weight:600;
  text-decoration: none;
}
.card-link .card-arrow{
  font-size: 1.5rem;
  margin-left: 6px;
  display: inline-block;
  line-height: 1;
}
.carousel-nav{
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: rgba(0,0,0,0.08);
  color: #ffffff;
  font-size: 56px;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.carousel-nav--left{
  justify-self: start;
}
.carousel-nav--right{
  justify-self: end;
}

@media (max-width: 900px){
  .carousel-shell{
    grid-template-columns: 44px minmax(0, 1fr) 44px;
  }
  .card{ flex-basis: 100%; }
  .icon{ width:96px; height:96px; }
  .title{ font-size:32px }
}
</style>
