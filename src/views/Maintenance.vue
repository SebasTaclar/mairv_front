<template>
  <div class="maintenance-container">
    <!-- Elementos decorativos de fondo -->
    <div class="decorative-elements">
      <div class="floating-circle circle-1"></div>
      <div class="floating-circle circle-2"></div>
      <div class="floating-circle circle-3"></div>
      <div class="gear-container">
        <div class="gear gear-1">⚙️</div>
        <div class="gear gear-2">⚙️</div>
        <div class="gear gear-3">⚙️</div>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="maintenance-content">
      <!-- Icono principal con animación -->
      <div class="maintenance-icon">
        <div class="icon-wrapper">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
          </svg>
          <div class="pulse-ring"></div>
          <div class="pulse-ring delayed"></div>
        </div>
      </div>

      <!-- Título principal -->
      <h1 class="maintenance-title">
        🔧 Sitio en <span class="highlight">Mantenimiento</span>
      </h1>

      <!-- Descripción -->
      <div class="maintenance-description">
        <p class="main-message">
          Estamos realizando mejoras importantes para brindarte una mejor experiencia.
        </p>
        <p class="sub-message">
          Nuestro equipo está trabajando para que todo esté perfecto muy pronto.
        </p>
      </div>

      <!-- Información de tiempo estimado -->
      <!-- <div class="time-info">
        <div class="time-card">
          <div class="time-icon">⏰</div>
          <div class="time-content">
            <div class="time-label">Tiempo estimado</div>
            <div class="time-value">{{ estimatedTime }}</div>
          </div>
        </div>
      </div> -->

      <!-- Barra de progreso animada
      <div class="progress-container">
        <div class="progress-label">
          <span>Progreso del mantenimiento</span>
          <span class="progress-percentage">{{ progressPercentage.toFixed(1) }}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
          <div class="progress-shimmer"></div>
        </div>
      </div> -->

      <!-- Información de contacto -->
      <div class="contact-info">
        <div class="contact-card">
          <div class="contact-icon">📞</div>
          <div class="contact-content">
            <div class="contact-label">¿Necesitas ayuda urgente?</div>
            <a href="tel:+573118715539" class="contact-link">
              Tel: +57 311 871 5539
            </a>
          </div>
        </div>
      </div>

      <!-- WhatsApp contacto -->
      <div class="whatsapp-contact">
        <div class="whatsapp-title">O escribenos directo al Whatsapp</div>
        <a href="https://wa.me/573118715539?text=Hola,%20necesito%20ayuda%20urgente%20con%20el%20sitio"
           class="whatsapp-btn"
           target="_blank"
           rel="noopener noreferrer">
          <div class="whatsapp-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.051 3.488"/>
            </svg>
          </div>
          <div class="whatsapp-content">
            <span class="whatsapp-text">WhatsApp</span>
            <span class="whatsapp-number">+57 311 871 5539</span>
          </div>
        </a>
      </div>

      <!-- Mensaje de agradecimiento -->
      <div class="thank-you">
        <div class="thank-you-icon">💙</div>
        <p>Gracias por tu paciencia y comprensión.</p>
      </div>
    </div>

    <!-- Footer con información adicional -->
    <div class="maintenance-footer">
      <p>&copy; {{ currentYear }} DigitalWallpapers. Todos los derechos reservados.</p>
      <!-- <p class="last-updated">Última actualización: {{ lastUpdated }}</p> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import './styles/Maintenance.css'
import { ref, onMounted, onUnmounted } from 'vue'

// Define component name to satisfy multi-word requirement
defineOptions({
  name: 'MaintenancePage'
})

// Estado reactivo
const estimatedTime = ref('2-4 horas')
const progressPercentage = ref(0)
const currentYear = new Date().getFullYear()

// Variables para animaciones
let progressInterval: ReturnType<typeof setInterval> | null = null

// Simular progreso del mantenimiento
const startProgressAnimation = () => {
  progressInterval = setInterval(() => {
    if (progressPercentage.value < 95) {
      const increment = Math.random() * 3 + 0.5
      progressPercentage.value = Math.min(95, progressPercentage.value + increment)

      // Actualizar tiempo estimado basado en progreso
      if (progressPercentage.value > 80) {
        estimatedTime.value = '30 minutos'
      } else if (progressPercentage.value > 60) {
        estimatedTime.value = '1 hora'
      } else if (progressPercentage.value > 40) {
        estimatedTime.value = '2 horas'
      } else if (progressPercentage.value > 20) {
        estimatedTime.value = '3 horas'
      }
    }
  }, 2000)
}

// Rotación de engranajes
const startGearAnimation = () => {
  const gears = document.querySelectorAll('.gear')
  gears.forEach((gear, index) => {
    const element = gear as HTMLElement
    let rotation = 0
    const speed = (index + 1) * 2

    const rotateGear = () => {
      rotation += speed
      element.style.transform = `rotate(${rotation}deg)`
    }

    setInterval(rotateGear, 100)
  })
}

onMounted(() => {
  // Iniciar animaciones
  startProgressAnimation()
  setTimeout(startGearAnimation, 500)

  // Progreso inicial aleatorio
  progressPercentage.value = Math.random() * 20 + 10
})

onUnmounted(() => {
  if (progressInterval) {
    clearInterval(progressInterval)
    progressInterval = null
  }
})
</script>



