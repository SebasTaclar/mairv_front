<template>
  <section class="stories-section section" aria-labelledby="stories-heading">
    <div class="container">
      <h2 id="stories-heading" class="stories-title">Historias de bendición</h2>
      <p class="stories-subtitle">Transformando vidas</p>

      <div class="stories-grid">
        <!-- Card 1: Testimonio blog -->
        <a href="https://res.cloudinary.com/dvu7fperb/image/upload/v1778073286/testimonios_m33dsm.jpg" target="_blank"
          rel="noopener" class="story-card-link">
          <article class="story-card" aria-labelledby="story-1-title">
            <div class="story-media">
              <img src="https://res.cloudinary.com/dvu7fperb/image/upload/v1778073286/testimonios_m33dsm.jpg"
                alt="Laptop con artículo de testimonio" loading="lazy" />
              <div class="story-overlay"></div>
            </div>
            <div class="story-body">
              <h3 id="story-1-title" class="story-title">Testimonio - Blog</h3>
              <div class="story-cta">Ver más →</div>
            </div>
          </article>
        </a>

        <!-- Card 2: Testimonio video -->
        <a href="https://www.youtube.com/watch?v=pVkNYW2f3TU" target="_blank" rel="noopener" class="story-card-link">
          <article class="story-card" aria-labelledby="story-2-title">
            <div class="story-media">
              <div class="video-wrap">
                <iframe src="https://www.youtube.com/embed/pVkNYW2f3TU" title="Testimonio - Video" frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen loading="lazy"></iframe>
              </div>
              <div class="story-overlay"></div>
            </div>
            <div class="story-body">
              <h3 id="story-2-title" class="story-title">Testimonio - Video</h3>
              <div class="story-cta">Ver más →</div>
            </div>
          </article>
        </a>

        <!-- Card 3: Comunidad -->
        <a href="https://www.youtube.com/watch?v=DcDH7TiNIq8" target="_blank" rel="noopener" class="story-card-link">
          <article class="story-card" aria-labelledby="story-3-title">
            <div class="story-media">
              <div class="video-wrap">
                <iframe width="560" height="315" src="https://www.youtube.com/embed/DcDH7TiNIq8?si=eF9Lh4exgpihCjwm"
                  title="YouTube video player" frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
              </div>
              <div class="story-overlay"></div>
            </div>
            <div class="story-body">
              <h3 id="story-3-title" class="story-title">Somos Iglesia</h3>
              <p class="story-text">Encuentra esperanza y comunidad</p>
              <div class="story-cta">Ver más →</div>
            </div>
          </article>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import './styles/StoriesSection.css'
// Componente estático. Emitir eventos si se desea integrar con un CMS.
</script>



