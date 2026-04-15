<template>
  <header>
    <nav :class="['navbar', { 'transparent': isAtTop }]">
      <!-- Logo y marca -->
      <RouterLink class="link-navbar home" to="/" @click="closeMobileMenu">
        <div class="brand-container">
          <img src="/images/logo.jpg" alt="MAIRV" class="site-logo" />
          <!-- <div class="brand-info">
            <div class="brand-title"><span class="highlight">MAIRV</span></div>
            <div class="brand-tagline">MAI restaurando vidas</div>
          </div> -->
        </div>
      </RouterLink>

      <!-- Navegación principal (centrada) -->
      <div class="nav-menu desktop-nav">
        <RouterLink to="/" class="nav-link" :class="{ active: isCurrentRoute('/') }" @click="closeMobileMenu">Inicio</RouterLink>
        <RouterLink to="/about" class="nav-link" :class="{ active: isCurrentRoute('/about') }" @click="closeMobileMenu">Nosotros</RouterLink>
        <RouterLink to="/events" class="nav-link" :class="{ active: isCurrentRoute('/events') }" @click="closeMobileMenu">Eventos</RouterLink>
        <RouterLink to="/messages" class="nav-link" :class="{ active: isCurrentRoute('/messages') }" @click="closeMobileMenu">Mensajes</RouterLink>
              <a href="#contact" class="nav-link" :class="{ active: isContactVisible }" @click.prevent="scrollToContact">Conectar</a>
      </div>

      <!-- Controles de usuario -->
      <div class="nav-controls desktop-nav">
        <RouterLink class="btn live-btn" to="/live">+ Ver en Vivo</RouterLink>
        <RouterLink v-if="!isLoggedIn" class="btn access-btn" to="/login">Acceder</RouterLink>
        <RouterLink v-if="isLoggedIn && isAdmin" class="btn admin-btn" to="/admin/products">⚙️ Panel Admin</RouterLink>
        <RouterLink v-if="isLoggedIn" @click="logout" class="btn logout-btn" to="/">Cerrar sesión</RouterLink>
        <div v-if="isLoggedIn" class="user-greeting">
          <span>{{ username }}</span>
        </div>
      </div>

      <!-- Menu hamburguesa para mobile -->
      <button class="hamburger-menu" @click="toggleMobileMenu" :class="{ 'active': isMobileMenuOpen }">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <!-- Menu mobile desplegable -->
      <div class="mobile-menu" :class="{ 'active': isMobileMenuOpen }">
        <div class="mobile-menu-content">
          <div class="mobile-nav-links">
            <RouterLink to="/" class="mobile-link" :class="{ active: isCurrentRoute('/') }" @click="closeMobileMenu">Inicio</RouterLink>
            <RouterLink to="/about" class="mobile-link" :class="{ active: isCurrentRoute('/about') }" @click="closeMobileMenu">Nosotros</RouterLink>
            <RouterLink to="/events" class="mobile-link" :class="{ active: isCurrentRoute('/events') }" @click="closeMobileMenu">Eventos</RouterLink>
                  <a href="#contact" class="mobile-link" :class="{ active: isContactVisible }" @click.prevent="scrollToContact">Conectar</a>

          </div>

          <div class="mobile-controls">
            <RouterLink v-if="!isLoggedIn" class="mobile-btn access-btn" to="/login" @click="closeMobileMenu">
              Acceder
            </RouterLink>
            <div v-if="isLoggedIn" class="mobile-user-greeting">
              <span>Hola, {{ username }}</span>
            </div>
            <RouterLink v-if="isLoggedIn && isAdmin" class="mobile-btn admin-btn" to="/admin/products"
              @click="closeMobileMenu">
              ⚙️ Panel Admin
            </RouterLink>
            <button v-if="isLoggedIn" @click="handleMobileLogout" class="mobile-btn logout-btn">
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  </header>

  <RouterView />
</template>

<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router';
import { authService } from '@/services/api';
import { onMounted, ref, watch, computed, onUnmounted } from 'vue';
import router from './router';

const isLoggedIn = ref(false);
const username = ref('');
const isMobileMenuOpen = ref(false);
const isAtTop = ref(true);

// Router hooks
const currentRoute = useRoute();

// Verificar si el usuario es administrador
const isAdmin = computed(() => authService.isAdmin());

// Función para verificar la ruta actual
const isCurrentRoute = (path: string): boolean => {
  return currentRoute.path === path;
};

// Funciones para el menú hamburguesa
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

// Función para hacer scroll a la sección de productos
/* const scrollToProductStore = () => {
  const productStoreSection = document.querySelector('.product-store');
  if (productStoreSection) {
    productStoreSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}; */

// Función y observador para la sección de contacto
const isContactVisible = ref(false);
let contactObserver: IntersectionObserver | null = null;

const observeContact = () => {
  const el = document.querySelector('.contact-section') as HTMLElement | null;
  if (!el) return;
  if (contactObserver) contactObserver.disconnect();
  contactObserver = new IntersectionObserver((entries) => {
    isContactVisible.value = entries.some(e => e.isIntersecting);
  }, { threshold: 0.3 });
  contactObserver.observe(el);
};

const scrollToContact = async () => {
  closeMobileMenu();
  const scrollNow = () => {
    const el = document.querySelector('.contact-section') as HTMLElement | null;
    if (el) {
      (el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      console.warn('Contact section not found');
    }
  };
  if (currentRoute.path !== '/') {
    await router.push('/');
    // wait a bit for DOM to render
    setTimeout(() => { observeContact(); scrollNow(); }, 120);
  } else {
    scrollNow();
  }
};

const checkAuthStatus = () => {
  isLoggedIn.value = authService.isAuthenticated();
  if (isLoggedIn.value) {
    const currentUser = authService.getCurrentUser();
    username.value = currentUser?.name || '';
  } else {
    username.value = '';
  }
};

const logout = () => {
  authService.logout();
  isLoggedIn.value = false;
  username.value = '';
  // Usar replace para no dejar historial que permita volver a la página autenticada
  router.replace({ name: 'home' });
};

const handleMobileLogout = () => {
  closeMobileMenu();
  logout();
};

onMounted(() => {
  checkAuthStatus();
  // header transparency on scroll
  const handleScroll = () => {
    isAtTop.value = window.scrollY <= 10;
  };
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
  // expose for cleanup in onUnmounted
  ;(window as any).__app_handleHeaderScroll = handleScroll;
  // observe contact section visibility
  observeContact();
});

onUnmounted(() => {
  const fn = (window as any).__app_handleHeaderScroll;
  if (fn) window.removeEventListener('scroll', fn);
  if (contactObserver) { contactObserver.disconnect(); contactObserver = null; }
});

const route = useRoute();
watch(route, () => {
  checkAuthStatus();
});
</script>

<style scoped>
.navbar {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.9) 100%);
  margin: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  height: 75px;
  padding: 0 clamp(20px, 5vw, 60px);
  box-shadow: 0 2px 24px rgba(34, 211, 238, 0.15), 0 1px 3px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(34, 211, 238, 0.2);
  transition: background 0.28s ease, box-shadow 0.28s ease, border-bottom 0.28s ease, backdrop-filter 0.28s ease, padding 0.28s ease;
}

.navbar.transparent {
  background: transparent !important;
  box-shadow: none !important;
  border-bottom: none !important;
  backdrop-filter: none !important;
}

/* Logo y marca */
.brand-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Logo creativo */
.creative-logo {
  position: relative;
  width: 50px;
  height: 50px;
}

.site-logo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
  border: 2px solid rgba(255,255,255,0.18);
  box-shadow: 0 6px 20px rgba(255,255,255,0.06), 0 0 20px rgba(255,255,255,0.04);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.site-logo:hover {
  transform: scale(1.06);
  box-shadow: 0 10px 30px rgba(255,255,255,0.12), 0 0 30px rgba(255,255,255,0.06);
}

.logo-circle {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, var(--primary-red) 0%, #ffffff 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 6px 20px rgb(255, 255, 255),
    0 0 30px rgb(255, 255, 255),
    inset 0 2px 8px rgb(255, 255, 255);
  animation: logoFloat 4s ease-in-out infinite;
  transition: all 0.3s ease;
}

.logo-circle::before {
  content: '';
  position: absolute;
  inset: -3px;
  background: linear-gradient(135deg, var(--primary-red) 0%, #0891b2 100%);
  border-radius: 50%;
  z-index: 0;
}

.logo-circle::after {
  content: '';
  position: absolute;
  inset: 3px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(0, 0, 0, 0.9) 100%);
  border-radius: 50%;
  z-index: 1;
}

.logo-letter {
  position: relative;
  z-index: 2;
  font-weight: 900;
  font-size: 14px;
  color: var(--white);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5),
    0 0 20px rgba(255, 255, 255, 0.3);
  letter-spacing: -1px;
}

.logo-letter:first-child::after {
  content: '•';
  margin: 0 1px;
  font-size: 8px;
  opacity: 0.6;
}

.logo-glow {
  position: absolute;
  inset: -10px;
  background: radial-gradient(circle, rgba(34, 211, 238, 0.4) 0%, transparent 70%);
  border-radius: 50%;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}



.creative-logo:hover .logo-glow {
  opacity: 1;
}

@keyframes logoFloat {

  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }

  50% {
    transform: translateY(-4px) rotate(2deg);
  }
}



.brand-info {
  color: var(--white);
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.brand-title {
  font-size: 22px;
  font-weight: 900;
  line-height: 1;
  margin: 0;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

.brand-title .highlight {
  background: linear-gradient(135deg, var(--white) 0%, var(--primary-red) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background: transparent;
  transition: width 0.28s ease, background 0.18s ease;
  filter: drop-shadow(0 2px 8px rgba(34, 211, 238, 0.3));
}

.brand-tagline {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.brand-subtitle {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
  line-height: 1;
  margin: 0;
}

/* Navegación principal */
.nav-menu {
  display: flex;
  align-items: center;
  gap: 30px;
}

.nav-menu.desktop-nav {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.nav-link {
  color: rgb(255, 255, 255);
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
  padding: 10px 18px;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  letter-spacing: 0.3px;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background: var(--primary-red);
  transition: width 0.3s ease;
}

.nav-link:hover {
  color: var(--white);
  background-color: rgba(255, 255, 255, 0.06);
  transform: translateY(-2px);
}

.nav-link:hover::after {
  width: 70%;
  background: var(--white);
}



.share-btn {
  background: linear-gradient(135deg, #ffffff 0%, #ffffff 100%);
  color: #ffffff !important;
  font-weight: 600;
  box-shadow: 0 2px 10px rgba(34, 54, 238, 0.3);
}

/* Botón de ver en vivo (encabezado) */
.live-btn {
  background: rgba(207, 207, 207, 0.527);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.12);
  padding: 8px 14px;
  border-radius: 10px;
  font-weight: 800;
}

.live-btn:hover {
  background: rgba(173, 30, 30, 0.808);
  transform: translateY(-2px);
}

.share-btn:hover {
  background: linear-gradient(135deg, #ffffff 0%, #ffffff 100%);
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

/* Controles de usuario */
.nav-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.btn {
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.access-btn {
  background: #22265D;
  color: #ffffff;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.access-btn:hover {
  background: #22265D;
  transform: translateY(-3px);
}

.logout-btn {
  background: rgba(248, 113, 113, 0.1);
  color: #f87171;
  border: 1px solid rgba(248, 113, 113, 0.3);
}

.logout-btn:hover {
  background: rgba(248, 113, 113, 0.2);
  border-color: rgba(248, 113, 113, 0.5);
  transform: translateY(-1px);
}

.admin-btn {
  background: linear-gradient(135deg, var(--black) 0%, #1a1a1a 100%);
  color: var(--primary-red);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(34, 211, 238, 0.3);
  font-weight: 700;
}

.admin-btn:hover {
  background: linear-gradient(135deg, #1a1a1a 0%, var(--black) 100%);
  box-shadow: 0 6px 24px rgba(34, 211, 238, 0.4);
  transform: translateY(-3px);
  border-color: var(--primary-red);
}

.purchases-btn {
  background: var(--brand-accent-gradient);
  color: #ffffff;
  box-shadow: 0 2px 10px var(--brand-accent-glow);
}

.purchases-btn:hover {
  background: var(--brand-accent-gradient);
  filter: brightness(1.1);
  box-shadow: 0 4px 15px var(--brand-accent-glow);
  transform: translateY(-2px);
}

.user-greeting {
  color: var(--white);
  font-weight: 700;
  font-size: 14px;
  padding: 10px 16px;
  background: rgba(34, 211, 238, 0.15);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(34, 211, 238, 0.3);
  letter-spacing: 0.3px;
}

/* Menu hamburguesa */
.hamburger-menu {
  display: none;
  flex-direction: column;
  width: 30px;
  height: 30px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  justify-content: space-around;
  align-items: center;
  z-index: 1001;
}

.hamburger-menu span {
  display: block;
  height: 3px;
  width: 100%;
  background-color: var(--brand-primary-contrast);
  border-radius: 3px;
  transition: all 0.3s ease;
}

.hamburger-menu.active span:nth-child(1) {
  transform: rotate(45deg) translate(8px, 8px);
}

.hamburger-menu.active span:nth-child(2) {
  opacity: 0;
}

.hamburger-menu.active span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

/* Menu mobile */
.mobile-menu {
  display: none;
  position: fixed;
  top: 70px;
  left: 0;
  width: 100%;
  height: calc(100vh - 70px);
  background: var(--brand-gradient);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 999;
  overflow-y: auto;
}

.mobile-menu.active {
  transform: translateX(0);
}

.mobile-menu-content {
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.mobile-nav-links {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.mobile-link {
  color: #e2e8f0;
  text-decoration: none;
  padding: 15px 20px;
  font-size: 18px;
  font-weight: 500;
  border-radius: 12px;
  transition: all 0.3s ease;
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  transform: translateY(-2px);
}

.mobile-controls {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-btn {
  padding: 15px 20px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  text-align: center;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  width: 100%;
  font-family: inherit;
}

.mobile-btn.access-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

.mobile-btn.logout-btn {
  background: rgba(248, 113, 113, 0.1);
  color: #f87171;
  border: 1px solid rgba(248, 113, 113, 0.3);
}

.mobile-btn.admin-btn {
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  color: #ffffff;
  box-shadow: 0 4px 15px rgba(6, 182, 212, 0.3);
}

.mobile-btn.purchases-btn {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  color: #ffffff;
  box-shadow: 0 4px 15px rgba(96, 165, 250, 0.3);
}

.mobile-user-greeting {
  color: #e2e8f0;
  text-align: center;
  padding: 15px 20px;
  font-weight: 600;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

/* Responsive */
@media (max-width: 768px) {
  .navbar {
    height: 70px;
    padding: 0 20px;
  }

  .desktop-nav {
    display: none;
  }

  .hamburger-menu {
    display: flex;
  }

  .mobile-menu {
    display: block;
  }

  .brand-title {
    font-size: 18px;
  }

  .brand-logo {
    width: 42px;
    height: 42px;
  }

  .brand-subtitle {
    font-size: 11px;
  }

  .logo-circle {
    width: 45px;
    height: 45px;
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .navbar {
    padding: 0 15px;
  }

  .brand-container {
    gap: 10px;
  }

  .brand-title {
    font-size: 16px;
  }

  .brand-logo {
    width: 38px;
    height: 38px;
  }

  .logo-circle {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }
}

/* Quitar subrayado del link principal */
.link-navbar {
  text-decoration: none !important;
}

/* (WhatsApp FAB removed) */

/* Estilos para enlaces activos */
.nav-link.active,
.mobile-link.active {
  font-weight: 600;
  position: relative;
}



@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scaleX(0.5);
  }

  to {
    opacity: 1;
    transform: scaleX(1);
  }
}

.link-navbar:hover {
  text-decoration: none !important;
}
</style>
