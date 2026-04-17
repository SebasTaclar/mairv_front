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
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" fill="currentColor"/>
              </svg>
              <div class="address-text">Cra 20a # 99 - 10 <br>Bogotá, Colombia</div>
            </div>
          </div>

          <div class="schedules-block">
            <div class="label">Horarios</div>
            <div class="meta-row">
                <svg class="info-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16.93V20h-2v-1.07A8.003 8.003 0 0 1 4.07 13H6v-2H4.07A8.003 8.003 0 0 1 11 4.07V6h2V4.07A8.003 8.003 0 0 1 19.93 11H18v2h1.93A8.003 8.003 0 0 1 13 18.93z" fill="currentColor"/>
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
            <a class="social-icon-link instagram" href="https://www.instagram.com/mairestaurandovidas/" target="_blank" rel="noopener" aria-label="Instagram" role="listitem">
              <img class="social-icon-img" src="https://cdn.simpleicons.org/instagram/ffffff" alt="Instagram" width="24" height="24"/>
            </a>
            <a class="social-icon-link facebook" href="https://www.facebook.com/MAIRestaurandoVidas/?locale=es_LA" target="_blank" rel="noopener" aria-label="Facebook" role="listitem">
              <img class="social-icon-img" src="https://cdn.simpleicons.org/facebook/ffffff" alt="Facebook" width="24" height="24"/>
            </a>
            <a class="social-icon-link youtube" href="https://www.youtube.com/@MAIRestaurandoVidas" target="_blank" rel="noopener" aria-label="YouTube" role="listitem">
              <img class="social-icon-img" src="https://cdn.simpleicons.org/youtube/ffffff" alt="YouTube" width="24" height="24"/>
            </a>
            <a class="social-icon-link tiktok" href="https://www.tiktok.com/@mai.restaurandovidas" target="_blank" rel="noopener" aria-label="TikTok" role="listitem">
              <img class="social-icon-img" src="https://cdn.simpleicons.org/tiktok/ffffff" alt="TikTok" width="24" height="24"/>
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
  } catch (e) {}
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

<style scoped>
/* Footer cósmico con fondo ajustado a la paleta de marca */
.footer-cosmic{
  background: #333333;
  color: var(--text-primary);
  padding: 28px 0 18px 0;
  position: relative;
  box-shadow: 0 -4px 30px rgba(0,0,0,0.35) inset;
}

.footer-main{
  max-width: 1200px;
  margin: 0 auto;
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap: 28px;
  padding: 8px 20px;
}

.footer-left{ flex:1; display:flex; gap:28px; align-items:flex-start; }
.address-block, .schedules-block { display:flex; flex-direction:column; gap:6px; }
.label{ color: #DCF4FF; font-weight:700; letter-spacing:0.6px; font-size:1.09rem; }
.address-text, .schedules div { color: var(--text-secondary); font-weight:600; }
.meta-row { display:flex; align-items:flex-start; gap:10px; }
.info-icon { width:23px; height:23px; flex-shrink:0; color: #DCF4FF; }
.info-icon path { fill: currentColor; }
.address-text { line-height:1.3; }

.footer-center{ display:none; }

.footer-right{ flex:1; display:flex; flex-direction:column; align-items:flex-end; gap:8px; }
.social-username{ color: #DCF4FF; font-weight:700; margin-bottom:6px;font-size: 18px; }
.social-username--mobile { display: none; }
.social-icons{ display:flex; gap:5px; align-items:center; }
.social-icon-link{
  display:inline-flex; align-items:center; justify-content:center; width:40px; height:40px; border-radius:10px; background: rgba(255,255,255,0.03); color:var(--text-primary); transition: all .18s; box-shadow: 0 6px 18px rgba(0,0,0,0.35);
}
.social-icon-link:hover{ transform: translateY(-4px); background: linear-gradient(135deg,var(--brand-yellow), #f0c36a); color:#fff; box-shadow: 0 12px 36px rgba(255,193,7,0.12); }
.social-icon{ width:28px; height:28px; display:inline-block; color: currentColor; }
.social-icon img, .social-icon-img { width:25px; height:25px; display:block; filter: brightness(0) invert(1); }

/* WhatsApp: keep green CTA */
.social-icons a.whatsapp{
  background: #25D366;
  border-color: #25D366;
  border-radius: 50%;
  width:36px;
  height:36px;
}
.social-icons a.whatsapp .social-icon{
  color: #ffffff;
}
.social-icons a.whatsapp:hover{
  background:#20b858;
  box-shadow: 0 10px 30px rgba(37,211,102,0.22);
  transform: translateY(-6px) scale(1.04);
}

/* Instagram: gradient circular y icono blanco */
.social-icons a.instagram{
  background: linear-gradient(45deg,#F58529 0%,#DD2A7B 40%,#8134AF 70%,#515BD4 100%);
  border-color: transparent;
  border-radius: 50%;
  width:46px;
  height:46px;
}
.social-icons a.instagram .social-icon{
  color: #ffffff !important;
}
.social-icons a.instagram:hover{
  box-shadow: 0 10px 30px rgba(221,42,123,0.18);
  transform: translateY(-6px) scale(1.04);
}

.footer-bottom{ margin-top:18px; padding-top:12px; }
.footer-bottom .divider{ height:1px; background: linear-gradient(90deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02)); max-width:1200px; margin:0 auto 12px auto; border-radius:2px; }
.footer-bottom p{ margin:0; color: rgba(255,255,255,0.72); font-size:0.95rem; text-align:center; }

@media (max-width:768px){
  .footer-main{ flex-direction:column; gap:14px; align-items:center; padding:14px 20px; }
  .footer-left{ width:100%; justify-content:center; align-items:center; text-align:center; }
  .footer-right{ width:100%; align-items:center; }
  .social-username{ margin-bottom:4px; }
}

/* Remove unwanted dark border / blur when hovering or focusing the footer */
.footer-cosmic,
.footer-cosmic * {
  box-shadow: none !important;
  outline: none !important;
  border: none !important;
  filter: none !important;
  -webkit-backdrop-filter: none !important;
  backdrop-filter: none !important;
}
.footer-cosmic:hover,
.footer-cosmic:focus {
  box-shadow: none !important;
  outline: none !important;
  border: none !important;
  filter: none !important;
  -webkit-backdrop-filter: none !important;
  backdrop-filter: none !important;
}

/* Extra overrides: eliminar pseudo-elementos y cualquier gradiente/imagen residual */
.footer-cosmic::before,
.footer-cosmic::after,
.footer-cosmic *::before,
.footer-cosmic *::after {
  display: none !important;
  content: none !important;
  box-shadow: none !important;
  filter: none !important;
  background: none !important;
}

/* Asegurar que el contenedor principal no tenga borde ni sombra */
.footer-main,
.footer-main * {
  box-shadow: none !important;
  border: none !important;
  background: none !important;
}

/* Mobile-specific fixes (placed after broad overrides to ensure precedence) */
@media (max-width: 768px) {
  .footer-main { padding: 12px 16px !important; }

  /* Apilar los bloques de la izquierda y centrar su contenido */

  /* Dirección y horarios en una sola fila en móvil (después del @) */
  .footer-left {
    display: flex !important;
    flex-direction: row !important;
    gap: 12px !important;
    align-items: center !important;
    text-align: left !important;
    justify-content: center !important;
    width: 100% !important;
  }

  .footer-left .meta-row {
    justify-content: flex-start !important;
    align-items: center !important;
    gap: 8px !important;
  }

  .address-block, .schedules-block {
    flex: 1 1 45% !important;
    max-width: 45% !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: flex-start !important;
    text-align: left !important;
  }

  .label { font-size: 1rem !important; }
  .address-text, .schedules div { font-size: 0.92rem !important; }

  /* Mostrar la copia móvil del username y ocultar la original dentro de footer-right */
  .social-username { display: none !important; }
  .social-username--mobile { display: block !important; color: #DCF4FF; font-weight:700; margin-bottom:6px; font-size: 18px; text-align: center; }

  /* Social icons: tamaño y restauración de fondo/sombra (contrarresta los overrides globales) */
  .social-icons { gap: 10px !important; }
  .social-icon-link {
    width: 40px !important;
    height: 40px !important;
    border-radius: 10px !important;
    background: rgba(255,255,255,0.03) !important;
    box-shadow: 0 6px 18px rgba(0,0,0,0.12) !important;
    transform: none !important;
  }
  .social-icons a.instagram { width: 44px !important; height: 44px !important; border-radius: 50% !important; }
  .social-icon-img { width: 20px !important; height: 20px !important; }

  .social-username { font-size: 16px !important; white-space: nowrap;  text-overflow: ellipsis; max-width: 180px; }

  .footer-bottom .divider { margin: 0 16px; max-width: calc(100% - 32px) !important; }
  .footer-bottom p { font-size: 0.9rem !important; padding: 0 10px !important; }
}

/* Pequeñas adaptaciones para pantallas muy pequeñas */
@media (max-width: 420px) {
  .social-icon-link { width: 36px !important; height: 36px !important; }
  .social-icons a.instagram { width: 40px !important; height: 40px !important; }
}

</style>
