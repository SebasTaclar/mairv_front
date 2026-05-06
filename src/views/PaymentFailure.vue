<template>
  <div class="payment-failure">
    <div class="container">
      <div class="error-icon">❌</div>
      <h1>Pago Rechazado</h1>
      <p>Hubo un problema con tu pago. Por favor, intenta nuevamente o contacta soporte.</p>
      <div class="actions">
        <button @click="tryAgain" class="btn-primary">Intentar de nuevo</button>
        <button @click="goHome" class="btn-secondary">Volver al inicio</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import './styles/PaymentFailure.css'
import { useRouter } from 'vue-router'

const router = useRouter()

const tryAgain = () => {
  router.push('/#number-selection')
}

const goHome = () => {
  router.push('/')
}
</script>



