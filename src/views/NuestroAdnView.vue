<template>
  <section class="adn-section" aria-labelledby="adn-title">
    <div class="container">
      <h1 id="adn-title" class="title">NUESTRO ADN</h1>

      <div class="adn-grid">
        <div class="left">
          <h2 class="left-title">Detrás de escenas</h2>
          <p class="left-sub">Así se ve servir</p>
          <div class="left-photo" :style="{ backgroundImage: 'url(https://res.cloudinary.com/dlwzazojt/image/upload/q_auto/f_auto/v1779912065/Fiesta_de_ni%C3%B1os_vtnkqr.jpg)' }" role="img" aria-label="Detrás de escenas"></div>
        </div>

        <div class="mosaic">
          <div class="m1" :style="{ backgroundImage: `url(https://res.cloudinary.com/dlwzazojt/image/upload/q_auto/f_auto/v1779912065/Ofrenda_r6nwtj.jpg)` }" role="img"></div>
          <div class="m1b" :style="{ backgroundImage: `url(https://res.cloudinary.com/dlwzazojt/image/upload/q_auto/f_auto/v1779912064/Cena_del_Se%C3%B1or_orfpek.jpg)` }" role="img" aria-label="Cena del Señor"></div>
          <div class="m2" :style="{ backgroundImage: `url(https://res.cloudinary.com/dlwzazojt/image/upload/q_auto/f_auto/v1779912064/Primicias_Danza_Col_scp8vf.jpg)` }" role="img"></div>
          <div class="m3" :style="{ backgroundImage: `url(https://res.cloudinary.com/dlwzazojt/image/upload/q_auto/f_auto/v1779912064/Circle_Shot_gbjzm0.jpg)` }" role="img"></div>
          <div class="m4" :style="{ backgroundImage: `url(https://res.cloudinary.com/dlwzazojt/image/upload/q_auto/f_auto/v1779912064/Selfie_Time_jt06mv.jpg)` }" role="img"></div>
          <div class="m5" :style="{ backgroundImage: `url(https://res.cloudinary.com/dlwzazojt/image/upload/q_auto/f_auto/v1779912064/Pastor_y_Lore_zqiv8e.jpg)` }" role="img"></div>
        </div>
      </div>
    </div>
  </section>

  <section class="stories-section">
    <div class="container">
      <p class="eyebrow">2. Historias Humanas</p>
      <h3 class="stories-title">¿Por qué servimos?</h3>

      <div class="videos-row">
        <article v-for="v in videos" :key="v.key" class="video-card">
          <video
            class="video-player"
            :src="v.url"
            controls
            preload="metadata"
            playsinline
            :aria-label="`Video ${v.key}`"
          ></video>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const videos = [
  {
    key: 'v1',
    thumb: 'https://res.cloudinary.com/dlwzazojt/image/upload/q_auto/f_auto/v1779912065/Fiesta_de_ni%C3%B1os_vtnkqr.jpg',
    url: 'https://res.cloudinary.com/dlwzazojt/video/upload/q_auto/f_auto/v1779913306/WhatsApp_Video_2026-05-26_at_1.14.38_PM_online-video-cutter.com_2_s7gwj2.mp4'
  },
  {
    key: 'v2',
    thumb: 'https://res.cloudinary.com/dlwzazojt/image/upload/q_auto/f_auto/v1779912064/Primicias_Danza_Col_scp8vf.jpg',
    url: 'https://res.cloudinary.com/dlwzazojt/video/upload/q_auto/f_auto/v1779913306/WhatsApp_Video_2026-05-26_at_1.14.38_PM_online-video-cutter.com_chh9an.mp4'
  },
  {
    key: 'v3',
    thumb: 'https://res.cloudinary.com/dlwzazojt/image/upload/q_auto/f_auto/v1779912064/Circle_Shot_gbjzm0.jpg',
    url: 'https://res.cloudinary.com/dlwzazojt/video/upload/q_auto/f_auto/v1779913305/WhatsApp_Video_2026-05-26_at_1.14.38_PM_online-video-cutter.com_1_dov1z2.mp4'
  }
]

// NOTE: videos now play inline via <video> elements
</script>

<style scoped>
.adn-section {
  padding: 4.5rem 0 5rem;
  padding-bottom: 0.5rem;
  color: #22265D;
  /* Fondo sólido para evitar franjas negras del background global */
  background-color: var(--bg-secondary, #ffffff);
  /* Gradiente opaco encima del fondo */
  background-image: linear-gradient(180deg, rgba(255,255,255,1), rgba(255,255,255,1));
  background-repeat: no-repeat;
  min-height: 70vh;
}
.container { max-width:1200px; margin:0 auto; padding:24px 24px }
.title { text-align:center; font-size:2.4rem; font-weight:800; margin-bottom:2rem }
.adn-grid { display:grid; grid-template-columns: 360px 1fr; gap: 0.7rem; align-items:start }
.left-title { font-size:1.6rem; margin:0 0 0.4rem }
.left-sub { margin:0 0 1rem; color:#6b7280 }
.left-photo { width:100%; height:175px; border-radius:8px; background-size:cover; background-position:center; box-shadow: 0 8px 20px rgba(34,38,93,0.08) }
.mosaic { display:grid; grid-template-columns: repeat(5, 1fr); grid-auto-rows: 120px; gap:0.7rem }
.mosaic > div {  background-size:cover; background-position:center; box-shadow: 0 8px 20px rgba(34,38,93,0.08) }
.m1 { grid-column: 1 / span 2; grid-row: 0 / span 2 }
.m2 { grid-column: 3 / span 1; grid-row: 1 / span 2 }
.m3 { grid-column: 4 / span 1; grid-row: 1 / span 2 }
.m4 { grid-column: 5 / span 1; grid-row: 1 / span 1 }
.m5 { grid-column: 5 / span 1; grid-row: 2 / span 1 }

.m1b { grid-column: 1 / span 2; grid-row: 2 / span 1 }

/* Historias Humanas */
.stories-section {  padding: 3.2rem 0 4rem; background-color: var(--bg-secondary, #ffffff); background-image: linear-gradient(180deg, rgba(255,255,255,1), rgba(255,255,255,1)); background-repeat: no-repeat; min-height: 100vh; }
.stories-section .container { max-width: 1100px; }
.stories-section .eyebrow { text-align:center; color: #22265D; font-weight:700; margin-bottom:0.25rem }
.stories-section .stories-title { text-align:center; font-size: clamp(1.7rem, 2.5vw, 2rem); color:#22265D; margin:0 0 1.25rem }
.videos-row { display:grid; grid-template-columns: repeat(3, 1fr); gap:1.6rem; align-items:center }
.video-card { position:relative; border-radius:12px; overflow:hidden; background: var(--bg-secondary, #ffffff); }
.video-card .video-player { width:100%; height:100%; aspect-ratio:16/9; display:block; object-fit:cover; border:0; background: transparent }

@media (max-width: 900px) {
  .videos-row { grid-template-columns: 1fr }
}

@media (max-width: 900px) {
  .adn-grid { grid-template-columns: 1fr; }
  .mosaic { grid-template-columns: repeat(3, 1fr); grid-auto-rows: 120px }
  .m1 { grid-column: 1 / span 3; grid-row: 1 / span 1 }
  .m1b { grid-column: 1 / span 3 }
  .m2, .m3, .m4, .m5 { grid-column: auto }
}

@media (max-width: 640px) {
  .adn-section {
    padding: 2.25rem 0 0.75rem;
    min-height: auto;
  }

  .container {
    padding: 66px 14px;
  }

  .title {
    font-size: 1.75rem;
    margin-bottom: 1.25rem;
  }

  .adn-grid {
    gap: 1rem;
  }

  .left-title {
    font-size: 1.2rem;
    text-align: center;
  }

  .left-sub {
    text-align: center;
    margin-bottom: 0.85rem;
  }

  .left-photo {
    height: 210px;
  }

  .mosaic {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 105px;
    gap: 0.55rem;
  }

  .mosaic > div {
    border-radius: 10px;
  }

  .m1,
  .m1b,
  .m2,
  .m3,
  .m4,
  .m5 {
    grid-column: auto;
    grid-row: auto;
  }

  .m1,
  .m1b {
    grid-column: 1 / span 2;
  }

  .m1 {
    height: 150px;
  }

  .m1b {
    height: 150px;
  }

  .m2,
  .m3,
  .m4,
  .m5 {
    height: 105px;
  }

  .stories-section {
    padding: 2.25rem 0 2.5rem;
    min-height: auto;
  }

  .stories-section .stories-title {
    font-size: 1.45rem;
    margin-bottom: 1rem;
  }

  .videos-row {
    gap: 1rem;
  }

  .video-card {
    border-radius: 14px;
  }
}

@media (max-width: 420px) {
  .container {
    padding: 14px 12px;
  }

  .title {
    font-size: 1.55rem;
  }

  .left-photo {
    height: 185px;
  }

  .mosaic {
    grid-auto-rows: 92px;
  }

  .m1,
  .m1b {
    height: 138px;
  }

  .m2,
  .m3,
  .m4,
  .m5 {
    height: 92px;
  }

  .stories-section {
    padding-top: 2rem;
  }
}

</style>
