<template>
  <footer class="modern-footer footer-cosmic">
    <div class="footer-main">
      <!-- Izquierda: dirección -->
      <div class="footer-left">
        <div class="address">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
          </svg>
          <span>Cra 20a # 99-10, Bogotá, Colombia</span>
        </div>
      </div>



      <!-- Derecha: redes sociales -->
      <div class="footer-right">
        <div class="social-icons">
          <a class="social-icon-link whatsapp" href="https://wa.me/573209860099" target="_blank" rel="noopener" aria-label="WhatsApp">
            <i class="social-icon fab fa-whatsapp" aria-hidden="true"></i>
          </a>
          <a class="social-icon-link" href="https://www.facebook.com/MAIRestaurandoVidas/?locale=es_LA" target="_blank" rel="noopener" aria-label="Facebook">
            <i class="social-icon fab fa-facebook-f" aria-hidden="true"></i>
          </a>
          <a class="social-icon-link tiktok" href="https://www.tiktok.com/@mai.restaurandovidas" target="_blank" rel="noopener" aria-label="TikTok">
            <i class="social-icon fab fa-tiktok" aria-hidden="true"></i>
          </a>
          <a class="social-icon-link" href="https://www.youtube.com/@MAIRestaurandoVidas" target="_blank" rel="noopener" aria-label="YouTube">
            <i class="social-icon fab fa-youtube" aria-hidden="true"></i>
          </a>
          <a class="social-icon-link instagram" href="https://www.instagram.com/mairestaurandovidas/" target="_blank" rel="noopener" aria-label="Instagram">
            <i class="social-icon fab fa-instagram" aria-hidden="true"></i>
          </a>
        </div>
      </div>
    </div>

    <!-- Barra inferior -->
    <!-- <div class="footer-bottom">
      <div class="footer-container">
        <p class="copyright">&copy; 2025 MAIRV. Todos los derechos reservados.</p>
        <p class="made-with">Creado por DataOr</p>
      </div>
    </div> -->
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
/* Footer cósmico con fondo imagen */
.footer-cosmic{
  background:rgb(34, 35, 43);
  color: #fff;
  padding: 0 0 8px 0;
  position: relative;
}

.footer-main{
  max-width: 1400px;
  margin: 0 auto;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 20px;
  padding: 8px 20px;
  height: 64px;
}

.footer-left{ flex:1; display:flex; align-items:center; }
.address{ display:flex; align-items:center; gap:10px; color: rgba(255,255,255,0.95); font-weight:600; }
.address svg{ width:18px; height:18px; color:#fff; opacity:0.95; }

.footer-center{ flex:0 0 auto; display:flex; align-items:center; justify-content:center; gap:12px; }
.dots{ display:flex; gap:14px; align-items:center; }
.dots button{ width:12px; height:12px; border-radius:50%; background: rgba(255,255,255,0.35); border:none; cursor:pointer; transition: all .18s; }
.dots button:hover{ transform: scale(1.1); }
.dots button.active{
  width:14px;
  height:14px;
  background: #fff;
 }

.footer-right{ flex:1; display:flex; align-items:center; justify-content:flex-end; gap:12px; }
.social-icons a{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  width:36px;
  height:36px;
  border-radius:8px;
  background: rgba(255,255,255,0.06);
  color:#fff;
  transition: transform .18s;
}
.social-icons a:hover{ transform: translateY(-4px); background: rgba(255,255,255,0.12); }

/* Ajuste tamaño de SVG dentro de footer social icons */
.social-icons .social-icon{ font-size:18px; width:auto; height:auto; display:inline-block; color: #df0e0e !important; opacity: 1 !important; line-height:1; font-family: "Font Awesome 6 Brands", "Font Awesome 6 Free", sans-serif; }

/* WhatsApp: circular verde con icono blanco */
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
  width:36px;
  height:36px;
}
.social-icons a.instagram .social-icon{
  color: #ffffff !important;
}
.social-icons a.instagram:hover{
  box-shadow: 0 10px 30px rgba(221,42,123,0.18);
  transform: translateY(-6px) scale(1.04);
}

.footer-bottom{ padding:10px 0; text-align:center; background: linear-gradient(180deg, rgba(0,0,0,0.12), transparent); margin-top:6px; }
.footer-bottom .footer-container{ max-width:1400px; margin:0 auto; padding:0 20px; display:flex; justify-content:space-between; align-items:center; gap:12px; }
.footer-bottom p{ margin:0; color: rgba(255,255,255,0.75); font-size:0.9rem; }

@media (max-width:768px){
  .footer-main{ flex-direction:column; height:auto; padding:16px; }
  .carousel-preview img{ width:180px; height:56px; }
  .footer-bottom .footer-container{ flex-direction:column; gap:6px; padding:12px 0; }
  .footer-left, .footer-right{ width:100%; justify-content:center; }
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
</style>
