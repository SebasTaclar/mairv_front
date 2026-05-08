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
        <RouterLink to="/" class="nav-link" :class="{ active: isCurrentRoute('/') }" @click="closeMobileMenu">Inicio
        </RouterLink>
        <div class="nav-item dropdown" @mouseenter="isNosotrosOpen = true" @mouseleave="isNosotrosOpen = false">
          <a class="nav-link dropdown-toggle" href="#" @click.prevent="toggleNosotros">Nosotros</a>
          <div class="dropdown-menu" :class="{ open: isNosotrosOpen }">
            <RouterLink :to="{ path: '/about', hash: '#pst' }" class="dropdown-item" @click="closeMobileMenu">Pst
            </RouterLink>
            <a href="#stories" class="dropdown-item" @click.prevent="scrollToStories">Historia</a>
            <RouterLink :to="{ path: '/about', hash: '#mision' }" class="dropdown-item" @click="closeMobileMenu">Misión
              / Visión</RouterLink>
          </div>
        </div>

        <!-- Calendario Dropdown (unificada) -->
        <div class="nav-item dropdown" @mouseenter="isCalendarOpen = true" @mouseleave="isCalendarOpen = false">
          <a class="nav-link dropdown-toggle" href="#" @click.prevent="toggleCalendar">Calendario</a>
          <div class="dropdown-menu" :class="{ open: isCalendarOpen }">
            <a href="#recientes" class="dropdown-item" @click.prevent="scrollToRecientes">Eventos</a>
            <RouterLink to="/calendar" class="dropdown-item" @click="isCalendarOpen = false; closeMobileMenu()">
              Calendario Completo</RouterLink>
          </div>
        </div>

        <a href="#help" class="nav-link" @click.prevent="scrollToHelp">Ministerios</a>
        <a href="#contact" class="nav-link" :class="{ active: isContactVisible }"
          @click.prevent="scrollToContact">Conectar</a>
      </div>

      <!-- Controles de usuario -->
      <div class="nav-controls desktop-nav">
        <form class="header-search" @submit.prevent="handleSearch" role="search">
          <div class="search-input-wrapper header">
            <svg class="header-search-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path fill="currentColor"
                d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm8.707 17.293-4.387-4.387a9 9 0 1 0-1.414 1.414l4.387 4.387a1 1 0 0 0 1.414-1.414z" />
            </svg>

            <input class="header-search-input" type="search" v-model="searchTerm" placeholder="Buscar..."
              aria-label="Buscar" />
          </div>
        </form>

        <RouterLink v-if="!isLoggedIn" class="btn access-btn" to="/login">Acceder</RouterLink>
        <RouterLink v-if="isLoggedIn && isAdmin" class="btn admin-btn" to="/admin/products">⚙️ Panel Admin</RouterLink>
        <RouterLink v-if="isLoggedIn" @click="logout" class="btn logout-btn" to="/">Cerrar sesión</RouterLink>
        <div v-if="isLoggedIn" class="user-greeting">
          <span class="user-name-line">{{ usernameFirstLine }}</span>
          <span v-if="usernameSecondLine" class="user-name-line user-name-surname">{{ usernameSecondLine }}</span>
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
          <form class="mobile-search" @submit.prevent="handleSearch" role="search">
            <div class="search-input-wrapper mobile">
              <svg class="header-search-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path fill="currentColor"
                  d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm8.707 17.293-4.387-4.387a9 9 0 1 0-1.414 1.414l4.387 4.387a1 1 0 0 0 1.414-1.414z" />
              </svg>

              <input class="header-search-input mobile" type="search" v-model="searchTerm" placeholder="Buscar..."
                aria-label="Buscar" />
            </div>
          </form>
          <div class="mobile-nav-links">
            <RouterLink to="/" class="mobile-link" :class="{ active: isCurrentRoute('/') }" @click="closeMobileMenu">
              Inicio</RouterLink>
            <button class="mobile-link mobile-nosotros-toggle" @click="isNosotrosOpen = !isNosotrosOpen">
              Nosotros <span class="mobile-nosotros-chevron" :class="{ open: isNosotrosOpen }">▾</span>
            </button>
            <div v-if="isNosotrosOpen" class="mobile-nosotros-items">
              <RouterLink :to="{ path: '/about', hash: '#pst' }" class="mobile-link mobile-sub"
                @click="closeMobileMenu">Pst</RouterLink>
              <a href="#stories" class="mobile-link mobile-sub" @click.prevent="scrollToStories">Historia</a>
              <RouterLink :to="{ path: '/about', hash: '#mision' }" class="mobile-link mobile-sub"
                @click="closeMobileMenu">Misión / Visión</RouterLink>
            </div>

            <button class="mobile-link mobile-calendar-toggle" @click="isCalendarOpen = !isCalendarOpen">
              Calendario<span class="mobile-calendar-chevron" :class="{ open: isCalendarOpen }">▾</span>
            </button>
            <div v-if="isCalendarOpen" class="mobile-calendar-items">
              <a href="#recientes" class="mobile-link mobile-sub" @click.prevent="scrollToRecientes">Eventos
                Recientes</a>
              <a href="#proximos" class="mobile-link mobile-sub" @click.prevent="scrollToProximos">Eventos Próximos</a>
              <RouterLink to="/calendar" class="mobile-link mobile-sub" @click="closeMobileMenu">Calendario Completo
              </RouterLink>
            </div>

            <a href="#help" class="mobile-link" @click.prevent="scrollToHelp">Ministerios</a>
            <a href="#contact" class="mobile-link" :class="{ active: isContactVisible }"
              @click.prevent="scrollToContact">Conectar</a>

          </div>

          <div class="mobile-controls">
            <RouterLink v-if="!isLoggedIn" class="mobile-btn access-btn" to="/login" @click="closeMobileMenu">
              Acceder
            </RouterLink>
            <div v-if="isLoggedIn" class="mobile-user-greeting">
              <span class="mobile-greeting-text">Hola,</span>
              <span class="user-name-line">{{ username }}</span>
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
const isNosotrosOpen = ref(false);
const isCalendarOpen = ref(false);

// Router hooks
const currentRoute = useRoute();

// Verificar si el usuario es administrador
const isAdmin = computed(() => authService.isAdmin());

const usernameParts = computed(() => {
  const fullName = username.value.trim();
  if (!fullName) return { firstLine: '', secondLine: '' };

  const parts = fullName.split(/\s+/);
  if (parts.length === 1) {
    return { firstLine: parts[0], secondLine: '' };
  }

  return {
    firstLine: parts[0],
    secondLine: parts.slice(1).join(' ')
  };
});

const usernameFirstLine = computed(() => usernameParts.value.firstLine);
const usernameSecondLine = computed(() => usernameParts.value.secondLine);

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
  isNosotrosOpen.value = false;
  isCalendarOpen.value = false;
};

const toggleNosotros = (e?: Event) => {
  if (e && e.preventDefault) e.preventDefault();
  isNosotrosOpen.value = !isNosotrosOpen.value;
};

const toggleCalendar = (e?: Event) => {
  if (e && e.preventDefault) e.preventDefault();
  isCalendarOpen.value = !isCalendarOpen.value;
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
  const el = document.querySelector('.recent-events-section') as HTMLElement | null;
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
    const el = document.querySelector('.recent-events-section') as HTMLElement | null;
    if (el) {
      (el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      console.warn('Events section not found');
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

const scrollToRecientes = async () => {
  closeMobileMenu();
  const scrollNow = () => {
    const el = document.querySelector('.recent-events-section') as HTMLElement | null;
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  if (currentRoute.path !== '/') {
    await router.push('/');
    setTimeout(() => scrollNow(), 120);
  } else {
    scrollNow();
  }
};

const scrollToProximos = async () => {
  closeMobileMenu();
  const scrollNow = () => {
    const el = document.querySelector('.recent-events-section') as HTMLElement | null;
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  if (currentRoute.path !== '/') {
    await router.push('/');
    setTimeout(() => scrollNow(), 120);
  } else {
    scrollNow();
  }
};

const scrollToHelp = async () => {
  closeMobileMenu();
  const scrollNow = () => {
    const el = document.querySelector('.help-section') as HTMLElement | null;
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  if (currentRoute.path !== '/') {
    await router.push('/');
    setTimeout(() => scrollNow(), 120);
  } else {
    scrollNow();
  }
};

const scrollToStories = async () => {
  closeMobileMenu();
  const scrollNow = () => {
    const el = document.querySelector('.stories-section') as HTMLElement | null;
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  if (currentRoute.path !== '/') {
    await router.push('/');
    setTimeout(() => scrollNow(), 120);
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

const searchTerm = ref('');

/**
 * Buscar en la página actual: encuentra el primer elemento con texto coincidente,
 * hace scroll y aplica un resaltado temporal.
 */
function performInPageSearch(term: string) {
  if (!term) return
  const q = term.trim().toLowerCase()
  if (!q) return

  // Selectores que contienen contenido legible en la página
  const selectors = 'h1,h2,h3,h4,h5,p,li,span,a,button,td,th,figcaption'
  const els = Array.from(document.querySelectorAll(selectors)) as HTMLElement[]
  let found: HTMLElement | null = null
  for (const el of els) {
    const text = (el.textContent || '').trim().toLowerCase()
    if (text && text.includes(q)) { found = el; break }
  }

  // Intento secundario: buscar coincidencias en atributos alt/title
  if (!found) {
    const attrEls = Array.from(document.querySelectorAll('[alt],[title]')) as HTMLElement[]
    for (const el of attrEls) {
      const alt = (el.getAttribute('alt') || '') + ' ' + (el.getAttribute('title') || '')
      if (alt.toLowerCase().includes(q)) { found = el; break }
    }
  }

  if (found) {
    try {
      found.scrollIntoView({ behavior: 'smooth', block: 'center' })
    } catch (e) { }
    const prevBg = found.style.backgroundColor
    const prevOutline = found.style.outline
    found.style.transition = 'background-color 0.35s ease, outline 0.35s ease'
    found.style.backgroundColor = 'rgba(250,204,21,0.22)'
    found.style.outline = '3px solid rgba(250,204,21,0.22)'
    setTimeout(() => {
      found && (found.style.backgroundColor = prevBg || '')
      found && (found.style.outline = prevOutline || '')
    }, 3000)
  }
}

const handleSearch = async (e?: Event) => {
  if (e) e.preventDefault()
  const term = searchTerm.value.trim()
  if (!term) return

  // Emit evento global para que componentes puedan reaccionar
  window.dispatchEvent(new CustomEvent('global-search', { detail: { term } }))

  // Si no estamos en la home, navegar y luego ejecutar búsqueda en la página destino
  if (route.path !== '/') {
    await router.push({ path: '/', query: { q: term } })
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('global-search', { detail: { term } }))
      performInPageSearch(term)
    }, 250)
  } else {
    // Reemplazar query para el home y ejecutar búsqueda inmediatamente con pequeña demora
    router.replace({ path: '/', query: { q: term } })
    setTimeout(() => performInPageSearch(term), 180)
  }
}

onMounted(() => {
  checkAuthStatus();
  // header transparency on scroll
  const handleScroll = () => {
    isAtTop.value = window.scrollY <= 10;
  };
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
  // expose for cleanup in onUnmounted
  ; (window as any).__app_handleHeaderScroll = handleScroll;
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
  background: linear-gradient(180deg, #22265D 0%, #0b2545 100%);
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
  padding: 0 clamp(20px, 5vw, 40px);
  box-shadow: 0 2px 24px rgba(34, 211, 238, 0.15), 0 1px 3px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(34, 211, 238, 0.2);
  transition: background 0.28s ease, box-shadow 0.28s ease, border-bottom 0.28s ease, backdrop-filter 0.28s ease, padding 0.28s ease;
  gap: 15px;
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
  width: 63px;
  height: 63px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
  border: 2px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 6px 20px rgba(255, 255, 255, 0.06), 0 0 20px rgba(255, 255, 255, 0.04);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.site-logo:hover {
  transform: scale(1.06);
  box-shadow: 0 10px 30px rgba(255, 255, 255, 0.12), 0 0 30px rgba(255, 255, 255, 0.06);
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
  gap: 15px;
}

.nav-menu.desktop-nav {
  position: absolute;
  left: 35%;
  top: 50%;
  transform: translate(-50%, -50%);
  flex-shrink: 0;
}

.nav-link {
  color: rgb(255, 255, 255);
  text-decoration: none;
  font-weight: 600;
  font-size: 17px;
  padding: 10px 8px;
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
  border: 1px solid rgba(255, 255, 255, 0.12);
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
  gap: 10px;
  margin-left: auto;
  flex-shrink: 0;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.btn {
  padding: 10px 16px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 13px;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  white-space: nowrap;
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
  font-size: 13px;
  padding: 8px 10px;
  background: rgba(34, 211, 238, 0.15);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(34, 211, 238, 0.3);
  letter-spacing: 0.3px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  line-height: 1.05;
  min-width: auto;
  white-space: nowrap;
  flex-shrink: 0;
}

.user-name-line {
  display: block;
  text-align: center;
  white-space: nowrap;
}

.user-name-surname {
  font-weight: 800;
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
  top: 60px;
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
  background: #22265D;
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
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 6px;
  line-height: 1.2;
}

.mobile-greeting-text {
  font-size: 0.92rem;
  opacity: 0.9;
}

/* Responsive */
@media (max-width: 768px) {
  .navbar {
    height: 70px;
    padding: 0 15px;
    gap: 10px;
  }

  /* En móviles, evitar que el navbar sea transparente al inicio */
  .navbar.transparent{
    background: linear-gradient(180deg, #22265D 0%, #0b2545 100%) !important;
    box-shadow: 0 2px 24px rgba(34, 211, 238, 0.15), 0 1px 3px rgba(0, 0, 0, 0.3) !important;
    border-bottom: 1px solid rgba(34, 211, 238, 0.2) !important;
    backdrop-filter: blur(20px) !important;
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
    padding: 0 12px;
    gap: 8px;
  }

  .brand-container {
    gap: 8px;
  }

  .site-logo {
    width: 50px;
    height: 50px;
  }

  /* En móviles pequeños, mantener fondo del navbar aunque tenga la clase 'transparent' */
  .navbar.transparent{
    background: linear-gradient(180deg, #22265D 0%, #0b2545 100%) !important;
    box-shadow: 0 2px 24px rgba(34, 211, 238, 0.15), 0 1px 3px rgba(0, 0, 0, 0.3) !important;
    border-bottom: 1px solid rgba(34, 211, 238, 0.2) !important;
    backdrop-filter: blur(20px) !important;
  }

  .site-logo {
    width: 44px;
    height: 44px;
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

/* Header y mobile search */
.header-search {
  display: inline-flex;
  align-items: center;
  margin-right: 0;
  flex-shrink: 0;
}

.header-search .search-input-wrapper.header {
  position: relative;
  width: 200px;
}

.header-search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #ffffff;
  pointer-events: none;
  z-index: 1;
}

.header-search-input {
  width: 100%;
  padding: 8px 12px 8px 34px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.39);
  color: var(--white);
  font-size: 14px;
  border: none;
  outline: none;
}

.header-search-input::placeholder {
  color: rgba(255, 255, 255, 0.986);
}

.header-search-input:focus {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.18);
  box-shadow: 0 0 0 6px rgba(34, 211, 238, 0.06);
}

.mobile-search {
  display: none;
  margin-bottom: 10px;
}

.mobile-search .search-input-wrapper.mobile {
  position: relative;
  width: 100%;
}

.mobile-search .header-search-input.mobile {
  padding: 10px 14px 10px 36px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
  color: var(--white);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

@media (max-width: 768px) {
  .header-search {
    display: none;
  }

  .header-search .search-input-wrapper.header {
    width: 140px;
  }

  .header-search-input {
    font-size: 13px;
    padding: 7px 10px 7px 32px;
  }

  .mobile-search {
    display: block;
  }
}

/* Dropdown 'Nosotros' styles */
.nav-item.dropdown {
  position: relative;
}

/* Crear zona invisible para mantener hover */
.nav-item.dropdown::after {
  content: '';
  position: absolute;
  top: calc(100% + 2px);
  left: -10px;
  right: -10px;
  height: 15px;
  pointer-events: auto;
  z-index: 1001;
}

.dropdown-toggle {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%);
  min-width: 200px;
  border-radius: 8px;
  padding: 8px 0;
  display: none;
  box-shadow: 0 8px 30px rgba(2, 6, 23, 0.45);
  z-index: 1002;
  pointer-events: auto;
}

.nav-item.dropdown:hover .dropdown-menu,
.dropdown-menu.open {
  display: block;
}

.dropdown-item {
  display: block;
  padding: 10px 16px;
  color: #ffffff;
  text-decoration: none;
  font-weight: 700;
}

.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.06);
}

/* Dark gradient for dropdown (ensures contrast on light pages) */
.dropdown-menu {
  background: linear-gradient(180deg, #0b2545 0%, #22265D 100%);
}

/* When navbar is transparent (over light backgrounds) keep links light for consistency */
.navbar.transparent .nav-link,
.navbar.transparent .dropdown-toggle {
  color: #ffffff !important;
}

.navbar.transparent .nav-link:hover {
  background-color: rgba(255, 255, 255, 0.06);
  color: #ffffff !important;
}

/* Mobile 'Nosotros' submenu */
.mobile-nosotros-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mobile-nosotros-items .mobile-sub {
  padding-left: 18px;
  width: 100%;
}

.mobile-nosotros-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mobile-nosotros-chevron {
  transition: transform 0.2s ease;
}

.mobile-nosotros-chevron.open {
  transform: rotate(180deg);
}

/* Mobile 'Calendario' submenu */
.mobile-calendar-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mobile-calendar-items .mobile-sub {
  padding-left: 18px;
  width: 100%;
}

.mobile-calendar-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mobile-calendar-chevron {
  transition: transform 0.2s ease;
}

.mobile-calendar-chevron.open {
  transform: rotate(180deg);
}

</style>
