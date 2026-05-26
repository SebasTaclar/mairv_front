<template>
  <section class="ministries-section" aria-labelledby="ministries-title">
    <div class="container">
      <p class="eyebrow">Nuestro equipo, Nuestra familia</p>

      <div class="cards-row">
        <article v-for="card in cards" :key="card.key" class="ministry-card">
          <div class="media-wrap">
            <div class="media" :style="{ backgroundImage: `url(${card.img})` }" role="img" :aria-label="card.title"></div>
          </div>
          <div class="card-caption">{{ card.title }}</div>
        </article>
      </div>

      <p class="serve">Quiero servir</p>
      <div class="cta-wrap">
        <button class="cta">Encontrar mi lugar aquí</button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const cards = [
  { key: 'ministerio', title: 'Ministerio', img: 'https://res.cloudinary.com/dvu7fperb/image/upload/v1778073286/testimonios_m33dsm.jpg' },
  { key: 'adoracion', title: 'Adoración', img: 'https://res.cloudinary.com/dlwzazojt/image/upload/q_auto/f_auto/v1779766084/Screenshot_16_bnmtwe.jpg' },
  { key: 'comunion', title: 'Comunión', img: 'https://res.cloudinary.com/dlwzazojt/image/upload/q_auto/f_auto/v1779766084/Screenshot_18_qcemef.jpg' },
  { key: 'evangelismo', title: 'Evangelismo', img: 'https://res.cloudinary.com/dlwzazojt/image/upload/q_auto/f_auto/v1779766084/Screenshot_19_d3xp8l.jpg' },
  { key: 'discipulado', title: 'Discipulado', img: 'https://res.cloudinary.com/dlwzazojt/image/upload/q_auto/f_auto/v1779766084/Screenshot_17_tjbygo.jpg' }
]
</script>

<style scoped>
.ministries-section {
  position: relative;
  padding: 6.5rem 0 4.5rem;
  padding-bottom: 6.71rem;
  color: #22265D;
  background:
    linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.95)),
    url('https://res.cloudinary.com/dvu7fperb/image/upload/v1778073286/familiaycomunidad_zp0w4b.jpg') center/cover no-repeat;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.eyebrow {
  text-align: center;
  color: #22265D;
  font-weight: 500;
  margin: 0 0 0.5rem;
  font-size: clamp(1.15rem, 1.95vw, 1.55rem);
}

.title {
  text-align: center;
  font-size: clamp(1.9rem, 2.6vw, 2.5rem);
  font-weight: 500;
  color: #22265D;
  margin: 0 0 2rem;
}

.cards-row {
  display: grid;
  grid-template-columns: repeat(5, 220px);
  gap: 2.25rem;
  justify-content: center; /* center the whole grid */
  justify-items: center;
  align-items: start;
  margin: 0 auto 2.2rem;
  max-width: calc(220px * 5 + 2.25rem * 4); /* prevent stretching */
}

.ministry-card {
  width: 220px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 20px rgba(34,38,93,0.08);
  overflow: visible;
  padding-bottom: 1rem;
}

.media-wrap {
  padding: 0.9rem;
}

.media {
  width: 100%;
  height: 160px;
  border-radius: 10px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.card-caption {
  text-align: center;
  font-weight: 500;
  color: #22265D;
  font-size: 1.35rem;
}

.serve {
  text-align: center;
  color: #D9A313;
  margin: 0.6rem 0 0.6rem;
  font-weight: 500;
}

.cta-wrap { text-align:center }
.cta {
  background: #0f2b4a;
  color: white;
  border: 0;
  padding: 0.85rem 3.9rem;
  border-radius: 28px;
  font-weight: 500;
  cursor: pointer;
  font-size: large;
}

@media (max-width: 1100px) {
  .cards-row { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 700px) {
  .cards-row { grid-template-columns: repeat(2, 1fr); gap: 1rem }
  .ministry-card { width: 100%; }
}
@media (max-width: 420px) {
  .cards-row { grid-template-columns: 1fr }
}
</style>
