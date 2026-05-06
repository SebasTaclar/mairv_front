<template>
  <section class="contact-section">
    <div class="contact-container">
      <div class="contact-grid">
        <div class="contact-item">
          <div class="icon-wrap" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 21s-6.716-4.35-9.192-7.09C-0.109 10.74 1.63 5.6 6.12 4.16 8.28 3.43 10.08 4.02 11.06 5.04c.98-1.02 2.77-1.61 4.94-0.88 4.49 1.44 6.23 6.58 3.31 9.75C18.716 16.65 12 21 12 21z"/>
            </svg>
          </div>
          <h3 class="contact-title">Conócenos</h3>
          <p class="contact-text">Conoce más de Nuestra Iglesia, joven y apasionada por Jesús.</p>
        </div>

        <div class="contact-item">
          <div class="icon-wrap" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v6l4 2" />
            </svg>
          </div>
          <h3 class="contact-title">Horarios</h3>
          <p class="contact-text">Domingos 9:00 AM & 11:00 AM<br/>Planifica tu Visita →</p>
        </div>

        <div class="contact-item">
          <div class="icon-wrap" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1118 0z" />
              <circle cx="12" cy="10" r="2" />
            </svg>
          </div>
          <h3 class="contact-title">Ubicación</h3>
          <p class="contact-text">Cra 20a #99-10, Bogotá, Colombia</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import './styles/ContactSection.css'
defineOptions({
  name: 'ContactSection'
})
</script>



