<template>
  <section class="mission-section section" aria-labelledby="mission-title">
    <div class="container">
      <p class="eyebrow">El Propósito que nos guía</p>
      <h1 id="mission-title" class="title visually-hidden">Misión y Visión</h1>

      <div class="cards-row">
        <article class="purpose-card">
          <h2 class="card-title">MISIÓN</h2>
          <p class="card-text">
            Atraer a las personas a Jesús, discipularlas y formarlas,
            descubriendo sus dones para la edificación del cuerpo de Cristo.
          </p>
        </article>

        <article class="purpose-card">
          <h2 class="card-title">VISIÓN</h2>
          <p class="card-text">
            Establecer el evangelio del reino, rescatando al perdido con el poder del espíritu santo,
            vemos una iglesia con personas nacidas de nuevo, restauradas, prosperadas e integradas
            a la familia de Dios.
          </p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped>
.mission-section {
  position: relative;
  min-height: 100vh;
  padding: 5.5rem 0 4.5rem;
  overflow: hidden;
  color: #22265D;
}

.mission-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 18% 12%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.1) 28%, transparent 42%),
    radial-gradient(circle at 80% 18%, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.08) 24%, transparent 40%),
    radial-gradient(circle at 10% 82%, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.08) 28%, transparent 44%),
    linear-gradient(180deg, rgba(255,255,255,0.86), rgba(255,255,255,0.9));
  pointer-events: none;
}

.container {
  position: relative;
  z-index: 1;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
}

.eyebrow {
  margin: 0 0 2.6rem;
  text-align: center;
  font-size: clamp(1.55rem, 2.2vw, 2rem);
  font-weight: 600;
  color: #22265D;
  letter-spacing: 0.01em;
}

.cards-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 4rem;
  align-items: stretch;
  justify-content: center;
}

.purpose-card {
  background: rgba(255, 255, 255, 0.97);
  border: 4px solid #D9A313;
  border-radius: 18px;
  min-height: 305px;
  padding: 2.7rem 2.3rem 2.1rem;
  box-shadow: 0 10px 22px rgba(34, 38, 93, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
}

.card-title {
  margin: 0 0 2.3rem;
  color: #22265D;
  font-size: clamp(1.9rem, 2.7vw, 2.35rem);
  font-weight: 800;
  letter-spacing: 0.02em;
}

.card-text {
  margin: 0;
  color: #22265D;
  font-size: clamp(1.02rem, 1.55vw, 1.15rem);
  line-height: 1.35;
  font-weight: 600;
  max-width: 28ch;
  text-align: justify;
  text-align-last: center;
}

.visually-hidden {
  position: absolute !important;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 920px) {
  .mission-section {
    padding-top: 4.5rem;
  }

  .cards-row {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .purpose-card {
    min-height: 0;
    padding: 2.2rem 1.6rem 1.8rem;
  }

  .card-text {
    max-width: 34ch;
  }
}

@media (max-width: 560px) {
  .mission-section {
    padding: 4rem 0 3.5rem;
  }

  .eyebrow {
    margin-bottom: 1.8rem;
    font-size: 1.25rem;
  }

  .purpose-card {
    border-width: 3px;
    border-radius: 16px;
    padding: 1.9rem 1.3rem 1.5rem;
  }

  .card-title {
    margin-bottom: 1.4rem;
    font-size: 1.6rem;
  }

  .card-text {
    font-size: 0.98rem;
    line-height: 1.32;
  }
}
</style>
