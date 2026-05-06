<template>
  <footer class="modern-footer footer-cosmic">
    <div class="footer-top">
      <div class="footer-main">
        <!-- Izquierda: dirección y horarios -->
        <div class="footer-left">
          <div class="address-block">
            <div class="label">Dirección</div>
            <div class="meta-row">
              <svg class="info-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path
                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"
                  fill="currentColor" />
              </svg>
              <div class="address-text">Cra 20a # 99 - 10 <br>Bogotá, Colombia</div>
            </div>
          </div>

          <div class="schedules-block">
            <div class="label">Horarios</div>
            <div class="meta-row">
              <svg class="info-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16.93V20h-2v-1.07A8.003 8.003 0 0 1 4.07 13H6v-2H4.07A8.003 8.003 0 0 1 11 4.07V6h2V4.07A8.003 8.003 0 0 1 19.93 11H18v2h1.93A8.003 8.003 0 0 1 13 18.93z"
                  fill="currentColor" />
              </svg>
              <div class="schedules">
                <div>Domingos: <br>9:00 AM y 11:00 AM</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Derecha: usuario y redes sociales -->
        <div class="footer-right">
          <div class="social-username">@mairestaurandovidas</div>
          <!-- Copia móvil del username: se muestra sólo en pantallas pequeñas y queda encima de las redes -->
          <div class="social-username social-username--mobile">@mairestaurandovidas</div>
          <div class="social-icons" role="list">
            <a class="social-icon-link instagram" href="https://www.instagram.com/mairestaurandovidas/" target="_blank"
              rel="noopener" aria-label="Instagram" role="listitem">
              <img class="social-icon-img" src="https://cdn.simpleicons.org/instagram/ffffff" alt="Instagram" width="24"
                height="24" />
            </a>
            <a class="social-icon-link facebook" href="https://www.facebook.com/MAIRestaurandoVidas/?locale=es_LA"
              target="_blank" rel="noopener" aria-label="Facebook" role="listitem">
              <img class="social-icon-img" src="https://cdn.simpleicons.org/facebook/ffffff" alt="Facebook" width="24"
                height="24" />
            </a>
            <a class="social-icon-link youtube" href="https://www.youtube.com/@MAIRestaurandoVidas" target="_blank"
              rel="noopener" aria-label="YouTube" role="listitem">
              <img class="social-icon-img" src="https://cdn.simpleicons.org/youtube/ffffff" alt="YouTube" width="24"
                height="24" />
            </a>
            <a class="social-icon-link tiktok" href="https://www.tiktok.com/@mai.restaurandovidas" target="_blank"
              rel="noopener" aria-label="TikTok" role="listitem">
              <img class="social-icon-img" src="https://cdn.simpleicons.org/tiktok/ffffff" alt="TikTok" width="24"
                height="24" />
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="divider" aria-hidden="true"></div>
      <p class="copyright">© 2026 Mai Restaurando Vidas. Todos los derechos reservados | Desarrollado por DataOr</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import './styles/Footer_.css'
import { ref, onMounted, onUnmounted } from 'vue';

const slidesCount = ref<number>(1);
const activeIndex = ref<number>(0);

const onBannerUpdate = (ev: Event) => {
  const detail = (ev as CustomEvent).detail;
  if (!detail) return;
  if (typeof detail.length === 'number') slidesCount.value = Math.max(1, detail.length);
  if (typeof detail.current === 'number') activeIndex.value = detail.current;
};

const goTo = (index: number) => {
  // pedir al banner principal que vaya a la slide
  try {
    window.dispatchEvent(new CustomEvent('footer:goTo', { detail: index }));
  } catch (e) { }
  activeIndex.value = index;
};

onMounted(() => {
  window.addEventListener('banner:update', onBannerUpdate as EventListener);
  // solicitar estado inicial al banner (si ya está montado debería emitir 'banner:update' por sí mismo)
  // en caso contrario, el banner envía su estado cuando se monte.
});

onUnmounted(() => {
  window.removeEventListener('banner:update', onBannerUpdate as EventListener);
});
</script>



