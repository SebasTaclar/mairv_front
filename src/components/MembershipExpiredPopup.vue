<template>
  <div v-if="isVisible" class="popup-overlay">
    <div class="popup-content">
      <div class="expired-icon">
        ⚠️
      </div>

      <h2>Membresía Vencida</h2>

      <p class="expired-message">
        Su membresía ha vencido. Por favor, realice el pago lo más pronto posible para continuar usando el sistema.
      </p>

      <div class="countdown-container">
        <div class="countdown-text">
          Este mensaje se cerrará automáticamente en:
        </div>
        <div class="countdown-timer">
          {{ countdown }}s
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import './styles/MembershipExpiredPopup.css'
import { ref, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['close'])

const isVisible = ref(true)
const countdown = ref(5)
let countdownInterval: number | null = null

const closePopup = () => {
  isVisible.value = false
  if (countdownInterval) {
    clearInterval(countdownInterval)
    countdownInterval = null
  }
  emit('close')
}

const startCountdown = () => {
  countdownInterval = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      closePopup()
    }
  }, 1000)
}

onMounted(() => {
  startCountdown()
})

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})
</script>



