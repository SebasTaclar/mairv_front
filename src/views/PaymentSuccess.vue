<template>
  <div class="payment-success">
    <div class="container">
      <div class="success-icon">✅</div>
      <h1>¡Pago Exitoso!</h1>
      <p>Tu pago se ha procesado correctamente. Tus números han sido reservados.</p>
      <div class="actions">
        <button @click="goHome" class="btn-primary">Volver al inicio</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import './styles/PaymentSuccess.css'
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>



