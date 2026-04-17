<template>
  <section class="stories-section section" aria-labelledby="stories-heading">
    <div class="container">
      <h2 id="stories-heading" class="stories-title">Historias de bendición</h2>
      <p class="stories-subtitle">Transformando vidas</p>

      <div class="stories-grid">
        <!-- Card 1: Testimonio blog -->
        <article class="story-card" aria-labelledby="story-1-title">
          <div class="story-media">
            <img src="https://scontent-bog2-2.xx.fbcdn.net/v/t51.82787-15/627649950_18450337612096993_2188073663081051989_n.jpg?stp=dst-jpegr_tt6&_nc_cat=110&ccb=1-7&_nc_sid=13d280&_nc_ohc=AfqMzdoFbDoQ7kNvwFx4AJt&_nc_oc=AdoEZB7I-avRC7-I7EDEmAV8oqYsWM0bAphsPCZSdnLF1m2B2-GGohQrAug5DrMWrKc&_nc_zt=23&se=-1&_nc_ht=scontent-bog2-2.xx&_nc_gid=VeNfraP3HxxZM-iR9r-kAQ&_nc_ss=7a389&oh=00_Af1f1H7Mw5bsZQzXD5d12l2cmxsH07qFParFDdl8-xlrNg&oe=69E71ACF" alt="Laptop con artículo de testimonio" loading="lazy"/>
          </div>
          <div class="story-body">
            <h3 id="story-1-title" class="story-title">Testimonio - Blog</h3>
            <!-- <p class="story-text">Lee relatos escritos por miembros de nuestra comunidad sobre cómo Dios transformó sus vidas.</p> -->
            <!-- <a class="btn-secondary" href="/stories/blog">Leer testimonio</a> -->
          </div>
          <a class="btn-secondary" href="https://scontent-bog2-2.xx.fbcdn.net/v/t51.82787-15/627649950_18450337612096993_2188073663081051989_n.jpg?stp=dst-jpegr_tt6&_nc_cat=110&ccb=1-7&_nc_sid=13d280&_nc_ohc=AfqMzdoFbDoQ7kNvwFx4AJt&_nc_oc=AdoEZB7I-avRC7-I7EDEmAV8oqYsWM0bAphsPCZSdnLF1m2B2-GGohQrAug5DrMWrKc&_nc_zt=23&se=-1&_nc_ht=scontent-bog2-2.xx&_nc_gid=VeNfraP3HxxZM-iR9r-kAQ&_nc_ss=7a389&oh=00_Af1f1H7Mw5bsZQzXD5d12l2cmxsH07qFParFDdl8-xlrNg&oe=69E71ACF" target="_blank" rel="noopener">Ver más</a>
        </article>

        <!-- Card 2: Testimonio video -->
        <article class="story-card" aria-labelledby="story-2-title">
          <div class="story-media">
            <div class="video-wrap">
              <iframe
                src="https://www.youtube.com/embed/pVkNYW2f3TU"
                title="Testimonio - Video"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                loading="lazy"></iframe>
            </div>
          </div>
          <div class="story-body">
            <h3 id="story-2-title" class="story-title">Testimonio - Video</h3>
            <!-- <p class="story-text">Historias en video: relatos personales, emociones reales y esperanza vivida.</p> -->
            <!-- <a class="btn-secondary" href="/stories/videos">Ver video</a> -->
          </div>
          <a class="btn-secondary" href="https://www.youtube.com/watch?v=pVkNYW2f3TU" target="_blank" rel="noopener">Ver más</a>
        </article>

        <!-- Card 3: Comunidad -->
        <article class="story-card" aria-labelledby="story-3-title">
          <div class="story-media">
            <div class="video-wrap">
              <iframe width="560" height="315" src="https://www.youtube.com/embed/DcDH7TiNIq8?si=eF9Lh4exgpihCjwm" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </div>
          </div>
          <div class="story-body">
            <h3 id="story-3-title" class="story-title">Somos Iglesia</h3>
            <p class="story-text">Encuentra esperanza y comunidad</p>
            <!-- <a class="btn-secondary" href="/community">Conocer comunidad</a> -->
          </div>
          <a class="btn-secondary" href="https://www.youtube.com/watch?v=DcDH7TiNIq8" target="_blank" rel="noopener">Ver más</a>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Componente estático. Emitir eventos si se desea integrar con un CMS.
</script>

<style scoped>
.stories-section {
  padding: 4rem 0;
  background: linear-gradient(280deg, #97b3c0 0%, #CDE9F9 100%);
  color: var(--brand-dark);
}
.container { max-width: 1200px; margin: 0 auto; padding: 0 16px; }
.stories-title {
  text-align: center;
  font-size: clamp(2.6rem, 2.8vw, 2.2rem);
  color: #000000;
  font-weight: 700;
  margin: 0 0 0.4rem 0;
  letter-spacing: -0.4px;
}
.stories-subtitle {
  text-align: center;
  color: #353333;
  margin-bottom: 1.9rem;
  font-weight: 600;
  font-size: 1.3rem;
}
.stories-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.6rem;
  align-items: stretch;
}
.story-card {
  background: #EBEBEB;
  border-radius: 16px;
  padding: 0 1.4rem 72px; /* reservar espacio para botón */
  border: 1px solid rgba(var(--brand-blue-rgb), 0.08);
  box-shadow: 0 12px 30px rgba(var(--brand-blue-rgb), 0.06);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  transition: transform 0.32s cubic-bezier(.2,.9,.2,1), box-shadow 0.32s;
  color: var(--brand-dark);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  overflow: hidden; /* asegurar que la media no tape el borde superior */
  position: relative; /* para posicionar el botón dentro */
}
.story-card:hover { transform: translateY(-8px); box-shadow: 0 24px 50px rgba(var(--brand-blue-rgb), 0.12); }
.story-media { width: calc(100% + 2.8rem); margin-left: -1.4rem; height: 180px; overflow: hidden; position: relative; background: linear-gradient(135deg, rgba(var(--brand-blue-rgb), 0.04), var(--bg-tertiary)); border-top-left-radius: 16px; border-top-right-radius: 16px; }
.story-media img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.6s cubic-bezier(.2,.9,.2,1); border-top-left-radius: 16px; border-top-right-radius: 16px; }
.story-title.overlay { position: absolute; left: 1rem; top: 0.9rem; z-index: 3; color: #ffffff; background: rgba(0,0,0,0.28); padding: 6px 10px; border-radius: 8px; font-size: 1.05rem; font-weight: 800; }
.story-body { width: 100%; padding-top: 0rem; }
.story-card:hover .story-media img { transform: scale(1.05); }
.video-wrap { position: absolute; inset: 0; z-index: 1; }
.video-wrap iframe { width: 100%; height: 100%; border: 0; display: block; }
.story-title { font-size: 1.45rem; color: #000000; margin: 0; font-weight: 1000;text-align: center; }
.story-text { color: rgba(0,0,0,0.68); margin: 0; line-height: 1.5; text-align: center;}
.story-card .btn-secondary {
  position: absolute;
  left: 0rem;
  right: 0rem;
  bottom: 1px; /* mostrar 1px del borde inferior */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(90deg, #22265D 0%, #290f5a 100%);
  color: #ffffff;
  border: none;
  box-shadow: 0 10px 30px rgba(0,0,0,0.14);
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

@media (max-width: 900px) {
  .stories-grid { grid-template-columns: 1fr; }
  .story-media { height: 220px; }
}
</style>
