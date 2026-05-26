<template>
  <footer id="footer" class="footer-ref" aria-label="Pie de pagina">
    <div class="footer-stripe" aria-hidden="true"></div>
    <div class="footer-wrap">
      <div class="footer-brand">
        <img src="/images/logo.png" alt="MAI Restaurando Vidas" class="brand-logo" />
      </div>

      <div class="footer-social">
        <p class="social-title">SÍGUENOS</p>
        <div class="social-icons" role="list">
          <a class="social-icon" href="https://www.instagram.com/mairestaurandovidas/" target="_blank" rel="noopener" aria-label="Instagram" role="listitem">
            <img src="https://cdn.simpleicons.org/instagram/22265D" alt="Instagram" width="25" height="25" />
          </a>
          <a class="social-icon" href="https://www.facebook.com/MAIRestaurandoVidas/?locale=es_LA" target="_blank" rel="noopener" aria-label="Facebook" role="listitem">
            <img src="https://cdn.simpleicons.org/facebook/ffffff" alt="Facebook" width="21" height="21" />
          </a>
          <a class="social-icon" href="https://www.tiktok.com/@mai.restaurandovidas" target="_blank" rel="noopener" aria-label="TikTok" role="listitem">
            <img src="https://cdn.simpleicons.org/tiktok/ffffff" alt="TikTok" width="21" height="21" />
          </a>
          <a class="social-icon" href="https://www.youtube.com/@MAIRestaurandoVidas" target="_blank" rel="noopener" aria-label="YouTube" role="listitem">
            <img src="https://cdn.simpleicons.org/youtube/ffffff" alt="YouTube" width="21" height="21" />
          </a>
        </div>
        <p class="social-handle">@MAIRestaurandoVidas</p>
      </div>

      <div class="footer-verse">
        <p class="verse-text">Al que cree, todo le es posible</p>
        <p class="verse-ref">Marcos 9:23</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-ref {
  background: #ebebeb;
  padding: 0 22px 14px;
  border-top: 1px solid rgba(34, 38, 93, 0.08);
}

.footer-stripe {
  width: 100%;
  height: 18px;
  background: #22265d;
  margin: 0 0 16px;
}

.footer-wrap {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  column-gap: 18px;
}

.footer-brand {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.brand-logo {
  width: clamp(110px, 11.5vw, 150px);
  height: auto;
  display: block;
  filter: brightness(0) saturate(100%) invert(16%) sepia(22%) saturate(1825%) hue-rotate(199deg) brightness(93%) contrast(96%);
}

.footer-social {
  text-align: center;
}

.social-title {
  margin: 0;
  color: #22265d;
  font-size: clamp(1.45rem, 1.95vw, 1.5rem);
  line-height: 1;
  font-weight: 500;
  letter-spacing: 0.02em;
}

.social-icons {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  gap: 16px;
}

.social-icon {
  width: 41px;
  height: 41px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  background: #22265d;
}

.social-icon:first-child {
  background: transparent;
  border: 2px solid #22265d;
}

.social-icon img {
  display: block;
}

.social-handle {
  margin: 8px 0 0;
  color: #22265d;
  font-size: clamp(1.05rem, 1.75vw, 1.45rem);
  font-weight: 600;
  letter-spacing: 0.02em;
}

.footer-verse {
  text-align: center;
  justify-self: end;
}

.verse-text {
  margin: 0;
  color: #22265d;
  font-size: clamp(1.1rem, 1.75vw, 1.25rem);
  font-weight: 500;
  letter-spacing: 0.01em;
}

.verse-ref {
  margin: 2px 0 0;
  color: #d9a313;
  font-size: clamp(1.05rem, 1.65vw, 1.15rem);
  font-weight: 500;
}

@media (max-width: 920px) {
  .footer-wrap {
    grid-template-columns: 1fr;
    row-gap: 16px;
    text-align: center;
  }

  .footer-brand,
  .footer-verse {
    justify-content: center;
    justify-self: center;
  }

  .social-icons {
    gap: 12px;
  }
}
</style>



