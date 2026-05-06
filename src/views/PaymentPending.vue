<template>
  <div class="payment-pending">
    <div class="container">
      <div class="pending-icon">⏳</div>
      <h1>Pago Pendiente</h1>
      <p>Tu pago está siendo procesado. Te notificaremos cuando se complete la transacción.</p>
      <div class="info">
        <p><strong>¿Qué sigue?</strong></p>
        <ul>
          <li>Recibirás una notificación cuando se procese tu pago</li>
          <li>Tus números quedarán reservados temporalmente</li>
          <li>Puedes verificar el estado en tu correo electrónico</li>
        </ul>
      </div>
      <div class="actions">
        <button @click="goHome" class="btn-primary">Volver al inicio</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import './styles/PaymentPending.css'
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>



