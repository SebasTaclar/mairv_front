<template>
  <div class="confirmation-overlay" @click.self="handleOverlayClick">
    <div class="confirmation-modal">
      <div class="confirmation-icon">
        <div class="warning-icon">⚠️</div>
      </div>

      <h3>{{ title }}</h3>
      <p>{{ message }}</p>

      <div class="confirmation-actions">
        <button @click="handleCancel" class="btn btn-secondary">
          {{ cancelText }}
        </button>
        <button @click="handleConfirm" class="btn btn-warning">
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import './styles/ConfirmationModal.css'
interface Props {
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Confirmar acción',
  message: '¿Estás seguro de que deseas continuar?',
  confirmText: 'Confirmar',
  cancelText: 'Cancelar'
})

const emit = defineEmits(['confirm', 'cancel'])

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}

const handleOverlayClick = () => {
  emit('cancel')
}
</script>



