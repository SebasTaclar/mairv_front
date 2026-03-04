<template>
  <!-- WhatsApp flotante a la izquierda -->
  <div class="floating-whatsapp">
    <a
      :href="whatsappLink"
      target="_blank"
      rel="noopener"
      class="social-btn whatsapp"
    >
      <img
        src="https://cdn-icons-png.flaticon.com/512/733/733585.png"
        alt="WhatsApp"
        class="social-icon"
      >
      <span class="social-tooltip left">WhatsApp</span>
    </a>
  </div>

  <!-- Redes sociales flotantes a la derecha -->
  <div class="floating-social">
    <a
      href="https://www.facebook.com/danirodriguez.col"
      target="_blank"
      rel="noopener"
      class="social-btn facebook"
    >
      <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
      <span class="social-tooltip">Facebook</span>
    </a>

    <a
      href="https://www.instagram.com/soydanirodriguezz/"
      target="_blank"
      rel="noopener"
      class="social-btn instagram"
    >
      <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
      <span class="social-tooltip">Instagram</span>
    </a>

    <a
      href="https://www.tiktok.com/@soydanirodriguezz"
      target="_blank"
      rel="noopener"
      class="social-btn tiktok"
    >
      <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
      </svg>
      <span class="social-tooltip">TikTok</span>
    </a>
  </div>
</template>

<script setup lang="ts">
// Número en formato internacional (sin '+')
const rawNumber = '573209860099'
// Normaliza a solo dígitos
const whatsappNumber = rawNumber.replace(/[^\d]/g, '')

// Validación mínima: debe empezar por 57 y tener al menos 12 dígitos (57 + 10)
const isValidWhatsAppNumber = /^57\d{10}$/.test(whatsappNumber)

const defaultMessage = 'Hola! Me interesa un producto de SOYDANI. ¿Me pueden brindar más información?'
// Endpoint alternativo más tolerante que wa.me
const whatsappLink = isValidWhatsAppNumber
  ? `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(defaultMessage)}`
  : '#'


defineOptions({ name: 'SocialFloating' })
</script>

<style scoped>
/* === WHATSAPP FLOTANTE IZQUIERDA === */
.floating-whatsapp {
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 1000;
}

.floating-whatsapp .social-btn.whatsapp {
  background: #25d366;
  border: 2px solid #25d366;
  opacity: 1 !important;
  box-shadow: 0 8px 24px rgba(37, 211, 102, 0.4);
}

.floating-whatsapp .social-btn.whatsapp:hover {
  background: #20b858;
  border-color: #20b858;
  box-shadow: 0 12px 35px rgba(37, 211, 102, 0.6);
  transform: scale(1.15);
}

.floating-whatsapp .social-icon {
  opacity: 1 !important;
  filter: none !important;
}

/* === REDES SOCIALES FLOTANTES DERECHA === */
.floating-social {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  z-index: 1000;
}

.social-btn {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.05);
  opacity: 0.15;
}

.social-btn:hover {
  opacity: 1 !important;
  transform: scale(1.2) rotate(5deg);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4);
}

/* Facebook */
.social-btn.facebook:hover {
  background: #1877F2;
  border-color: #1877F2;
  box-shadow: 0 12px 35px rgba(24, 119, 242, 0.6);
}

.social-btn.facebook .social-icon {
  color: rgba(255, 255, 255, 0.5);
}

.social-btn.facebook:hover .social-icon {
  color: #ffffff;
}

/* Instagram */
.social-btn.instagram:hover {
  background: linear-gradient(45deg, #F58529, #DD2A7B, #8134AF, #515BD4);
  border-color: #E4405F;
  box-shadow: 0 12px 35px rgba(228, 64, 95, 0.6);
}

.social-btn.instagram .social-icon {
  color: rgba(255, 255, 255, 0.5);
}

.social-btn.instagram:hover .social-icon {
  color: #ffffff;
}

/* TikTok */
.social-btn.tiktok:hover {
  background: #000000;
  border-color: #00f2ea;
  box-shadow: 0 12px 35px rgba(0, 242, 234, 0.6);
}

.social-btn.tiktok .social-icon {
  color: rgba(255, 255, 255, 0.5);
}

.social-btn.tiktok:hover .social-icon {
  color: #00f2ea;
}

.social-icon {
  width: 32px;
  height: 32px;
  transition: all 0.4s ease;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.social-btn:hover .social-icon {
  transform: scale(1.1);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

/* Tooltips */
.social-tooltip {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  pointer-events: none;
}

/* Tooltip para redes sociales (derecha) */
.floating-social .social-tooltip {
  right: 70px;
}

.floating-social .social-tooltip::after {
  content: '';
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  border: 6px solid transparent;
  border-left-color: rgba(0, 0, 0, 0.9);
}

/* Tooltip para WhatsApp (izquierda) */
.floating-whatsapp .social-tooltip.left {
  left: 70px;
}

.floating-whatsapp .social-tooltip.left::after {
  content: '';
  position: absolute;
  right: 100%;
  left: auto;
  top: 50%;
  transform: translateY(-50%);
  border: 6px solid transparent;
  border-right-color: rgba(0, 0, 0, 0.9);
  border-left-color: transparent;
}

.social-btn:hover .social-tooltip {
  opacity: 1;
  visibility: visible;
}

.floating-social .social-btn:hover .social-tooltip {
  transform: translateY(-50%) translateX(-5px);
}

.floating-whatsapp .social-btn:hover .social-tooltip {
  transform: translateY(-50%) translateX(5px);
}

/* Animaciones de entrada */
.floating-social .social-btn {
  animation: slideInRight 0.6s ease;
  animation-fill-mode: both;
}

.floating-whatsapp .social-btn {
  animation: slideInLeft 0.6s ease;
  animation-fill-mode: both;
}

.social-btn:nth-child(1) {
  animation-delay: 0.1s;
}

.social-btn:nth-child(2) {
  animation-delay: 0.2s;
}

.social-btn:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes slideInRight {
  from {
    transform: translateX(100px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Efecto de pulso sutil en WhatsApp */
@keyframes pulse {
  0%, 100% {
    box-shadow: 0 8px 24px rgba(37, 211, 102, 0.4);
  }
  50% {
    box-shadow: 0 8px 30px rgba(37, 211, 102, 0.6);
  }
}

.floating-whatsapp .social-btn.whatsapp {
  animation: slideInLeft 0.6s ease, pulse 2s ease-in-out infinite;
}

/* Responsivo */
@media (max-width: 768px) {
  .floating-social,
  .floating-whatsapp {
    bottom: 15px;
  }

  .floating-social {
    right: 15px;
    gap: 12px;
  }

  .floating-whatsapp {
    left: 15px;
  }

  .social-btn {
    width: 52px;
    height: 52px;
  }

  .social-icon {
    width: 28px;
    height: 28px;
  }

  .social-tooltip {
    font-size: 12px;
    padding: 6px 10px;
  }

  .floating-social .social-tooltip {
    right: 62px;
  }

  .floating-whatsapp .social-tooltip.left {
    left: 62px;
  }
}

@media (max-width: 480px) {
  .floating-social,
  .floating-whatsapp {
    bottom: 10px;
  }

  .floating-social {
    right: 10px;
    gap: 10px;
  }

  .floating-whatsapp {
    left: 10px;
  }

  .social-btn {
    width: 48px;
    height: 48px;
  }

  .social-icon {
    width: 26px;
    height: 26px;
  }
}
</style>
