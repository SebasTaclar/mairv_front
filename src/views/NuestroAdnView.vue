<template>
  <section class="adn-section" aria-labelledby="adn-title">
    <div class="container">
      <h1 id="adn-title" class="title">NUESTRO ADN</h1>

      <div class="adn-grid">
        <div class="left">
          <h2 class="left-title">Detrás de escenas</h2>
          <p class="left-sub">Así se ve servir</p>
          <div class="left-photo" :style="{ backgroundImage: `url(${photos[0]})` }" role="img" aria-label="Detrás de escenas"></div>
        </div>

        <div class="mosaic">
          <div class="m1" :style="{ backgroundImage: `url(${photos[1]})` }" role="img"></div>
          <div class="m2" :style="{ backgroundImage: `url(${photos[2]})` }" role="img"></div>
          <div class="m3" :style="{ backgroundImage: `url(${photos[3]})` }" role="img"></div>
          <div class="m4" :style="{ backgroundImage: `url(${photos[4]})` }" role="img"></div>
          <div class="m5" :style="{ backgroundImage: `url(${photos[5]})` }" role="img"></div>
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
          <div class="thumb" :style="{ backgroundImage: `url(${v.thumb})` }" role="img" :aria-label="`Video ${v.key}`"></div>
          <button class="play-btn" @click="openVideo(v.url)" aria-label="Reproducir video">▶</button>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const photos = [
  'https://res.cloudinary.com/dvu7fperb/image/upload/v1778073286/escena1.jpg',
  'https://res.cloudinary.com/dvu7fperb/image/upload/v1778073286/escena2.jpg',
  'https://res.cloudinary.com/dvu7fperb/image/upload/v1778073286/escena3.jpg',
  'https://res.cloudinary.com/dvu7fperb/image/upload/v1778073286/escena4.jpg',
  'https://res.cloudinary.com/dvu7fperb/image/upload/v1778073286/escena5.jpg',
  'https://res.cloudinary.com/dvu7fperb/image/upload/v1778073286/escena6.jpg',
]

const videos = [
  { key: 'v1', thumb: 'https://res.cloudinary.com/dvu7fperb/image/upload/v1778073286/video1_thumb.jpg', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
  { key: 'v2', thumb: 'https://res.cloudinary.com/dvu7fperb/image/upload/v1778073286/video2_thumb.jpg', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
  { key: 'v3', thumb: 'https://res.cloudinary.com/dvu7fperb/image/upload/v1778073286/video3_thumb.jpg', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
]

function openVideo(url: string) {
  window.open(url, '_blank')
}
</script>

<style scoped>
.adn-section {
  padding: 4.5rem 0 5rem;
  color: #22265D;
  background: linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.95));
}
.container { max-width:1200px; margin:0 auto; padding:0 24px }
.title { text-align:center; font-size:2.4rem; font-weight:800; margin-bottom:2rem }
.adn-grid { display:grid; grid-template-columns: 360px 1fr; gap: 1.5rem; align-items:start }
.left { padding-right:1rem }
.left-title { font-size:1.6rem; margin:0 0 0.4rem }
.left-sub { margin:0 0 1rem; color:#6b7280 }
.left-photo { width:100%; height:260px; border-radius:8px; background-size:cover; background-position:center; box-shadow: 0 8px 20px rgba(34,38,93,0.08) }
.mosaic { display:grid; grid-template-columns: repeat(5, 1fr); grid-auto-rows: 120px; gap:0.9rem }
.mosaic > div { border-radius:6px; background-size:cover; background-position:center; box-shadow: 0 8px 20px rgba(34,38,93,0.08) }
.m1 { grid-column: 1 / span 2; grid-row: 1 / span 2 }
.m2 { grid-column: 3 / span 1; grid-row: 1 / span 2 }
.m3 { grid-column: 4 / span 1; grid-row: 1 / span 2 }
.m4 { grid-column: 5 / span 1; grid-row: 1 / span 1 }
.m5 { grid-column: 5 / span 1; grid-row: 2 / span 1 }

/* Historias Humanas */
.stories-section { padding: 3.2rem 0 4rem; background: linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95));}
.stories-section .container { max-width: 1100px; }
.stories-section .eyebrow { text-align:center; color: #22265D; font-weight:700; margin-bottom:0.25rem }
.stories-section .stories-title { text-align:center; font-size: clamp(1.7rem, 2.5vw, 2rem); color:#22265D; margin:0 0 1.25rem }
.videos-row { display:grid; grid-template-columns: repeat(3, 1fr); gap:1.6rem; align-items:center }
.video-card { position:relative; border-radius:12px; overflow:hidden; background:#000 }
.video-card .thumb { width:100%; padding-top:56%; background-size:cover; background-position:center }
.play-btn { position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); width:96px; height:96px; border-radius:50%; background:rgba(255,255,255,0.9); border: none; display:flex; align-items:center; justify-content:center; font-size:34px; cursor:pointer; box-shadow: 0 6px 18px rgba(2,6,23,0.4) }

@media (max-width: 900px) {
  .videos-row { grid-template-columns: 1fr }
}

@media (max-width: 900px) {
  .adn-grid { grid-template-columns: 1fr; }
  .mosaic { grid-template-columns: repeat(3, 1fr); grid-auto-rows: 120px }
  .m1 { grid-column: 1 / span 3; grid-row: 1 / span 1 }
  .m2, .m3, .m4, .m5 { grid-column: auto }
}

</style>
