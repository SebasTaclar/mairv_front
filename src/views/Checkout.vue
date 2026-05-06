<template>
  <div class="checkout-page">
    <div class="checkout-container">
      <!-- Header -->
      <div class="checkout-header">
        <button class="back-button" @click="goBack">
          <span class="icon">←</span>
          Volver a la tienda
        </button>
        <h1 class="checkout-title">Finalizar Pedido</h1>
      </div>

      <div class="checkout-content">
        <!-- Resumen del pedido (lado izquierdo) -->
        <div class="order-summary">
          <h2>Resumen del pedido</h2>

          <div class="cart-items">
            <div
              v-for="item in cartItems"
              :key="item.id"
              class="cart-item"
            >
              <img
                :src="item.image"
                :alt="item.name"
                class="item-image"
              >
              <div class="item-details">
                <h3>{{ item.name }}</h3>
                <p v-if="item.selectedColor" class="item-color">Color: {{ item.selectedColor }}</p>
                <p class="item-quantity">Cantidad: {{ item.quantity }}</p>
                <p class="item-price">${{ (item.price * item.quantity).toLocaleString() }}</p>
              </div>
            </div>

            <div v-if="cartItems.length === 0" class="empty-cart">
              <p>No hay productos en el carrito</p>
              <button @click="goBack" class="btn-primary">Ir a la tienda</button>
            </div>
          </div>

          <div v-if="cartItems.length > 0" class="order-total">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>${{ totalPrice.toLocaleString() }}</span>
            </div>
            <div class="total-row">
              <span>Envío:</span>
              <span>{{ deliveryMethod === 'delivery' ? '$15,000' : 'Gratis' }}</span>
            </div>
            <div class="total-row total-final">
              <span>Total:</span>
              <span>${{ finalTotal.toLocaleString() }}</span>
            </div>
          </div>

          <!-- Botón seguir comprando -->
          <div v-if="cartItems.length > 0" class="continue-shopping">
            <button @click="goToHome" class="btn-continue">
              ← Seguir comprando
            </button>
          </div>
        </div>

        <!-- Formulario de contacto y entrega (lado derecho) -->
        <div class="checkout-form">
          <!-- Sección de contacto -->
          <div class="form-section">
            <h2>Contacto</h2>
            <div class="form-group">
              <label for="name">Nombre completo *</label>
              <input
                id="name"
                v-model="formData.name"
                type="text"
                placeholder="Escribe Tu Nombre"
                :class="{ 'error': errors.name }"
                @input="clearError('name')"
              >
              <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
            </div>

            <div class="form-group">
              <label for="email">Correo electrónico *</label>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                placeholder="ejemplo@correo.com"
                :class="{ 'error': errors.email }"
                @input="clearError('email')"
              >
              <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="identificationNumber">Número de cédula *</label>
                <input
                  id="identificationNumber"
                  v-model="formData.identificationNumber"
                  type="text"
                  placeholder="Ejm: 1234567890"
                  :class="{ 'error': errors.identificationNumber }"
                  @input="clearError('identificationNumber')"
                >
                <span v-if="errors.identificationNumber" class="error-message">{{ errors.identificationNumber }}</span>
              </div>

              <div class="form-group">
                <label for="contactNumber">Teléfono *</label>
                <input
                  id="contactNumber"
                  v-model="formData.contactNumber"
                  type="tel"
                  placeholder="Ejm: 300 XXX XXXX"
                  :class="{ 'error': errors.contactNumber }"
                  @input="clearError('contactNumber')"
                >
                <span v-if="errors.contactNumber" class="error-message">{{ errors.contactNumber }}</span>
              </div>
            </div>

            <div class="instagram-link-container">
              <p class="instagram-text">
                <a href="https://www.instagram.com/appsstorepro" target="_blank" class="instagram-link" rel="noopener noreferrer">
                  📱 Síguenos en nuestro Instagram para estar atentos de más novedades
                </a>
              </p>
            </div>

            <div class="form-group checkbox">
              <label class="checkbox-label">
                <input
                  v-model="formData.acceptTerms"
                  type="checkbox"
                >
                <span>
                  He leído y acepto los
                  <router-link to="/terms-and-conditions" class="privacy-link" target="_blank">
                    términos y condiciones
                  </router-link>
                  <span class="required">*</span>
                </span>
              </label>
              <span v-if="errors.acceptTerms" class="error-message">{{ errors.acceptTerms }}</span>
            </div>
          </div>

          <!-- Sección de entrega -->
          <div class="form-section">
            <h2>Entrega</h2>

            <div class="delivery-options">
              <label class="delivery-option" :class="{ 'selected': deliveryMethod === 'delivery' }">
                <input
                  v-model="deliveryMethod"
                  type="radio"
                  value="delivery"
                  name="delivery"
                >
                <div class="option-content">
                  <div class="option-header">
                    <span class="option-icon">🚚</span>
                    <span class="option-title">Envío a domicilio</span>
                  </div>
                  <span class="option-price">$15,000</span>
                </div>
              </label>

              <label class="delivery-option" :class="{ 'selected': deliveryMethod === 'pickup' }">
                <input
                  v-model="deliveryMethod"
                  type="radio"
                  value="pickup"
                  name="delivery"
                >
                <div class="option-content">
                  <div class="option-header">
                    <span class="option-icon">🏪</span>
                    <span class="option-title">Recoger en tienda</span>
                  </div>
                  <span class="option-price">Gratis</span>
                </div>
              </label>
            </div>

            <!-- Dirección de envío (solo si es delivery) -->
            <transition name="fade">
              <div v-if="deliveryMethod === 'delivery'" class="address-section">
                <div class="form-group">
                  <label for="address">Dirección *</label>
                  <input
                    id="address"
                    v-model="formData.address"
                    type="text"
                    placeholder="Ejm: Calle 123 # XX-XX"
                    :class="{ 'error': errors.address }"
                    @input="clearError('address')"
                  >
                  <span v-if="errors.address" class="error-message">{{ errors.address }}</span>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="city">Ciudad *</label>
                    <input
                      id="city"
                      v-model="formData.city"
                      type="text"
                      placeholder="Escribe la ciudad de Destino"
                      :class="{ 'error': errors.city }"
                      @input="clearError('city')"
                    >
                    <span v-if="errors.city" class="error-message">{{ errors.city }}</span>
                  </div>

                  <div class="form-group">
                    <label for="phone">Teléfono *</label>
                    <input
                      id="phone"
                      v-model="formData.phone"
                      type="tel"
                      placeholder="Ejm: 300 XXX XXXX"
                      :class="{ 'error': errors.phone }"
                      @input="clearError('phone')"
                    >
                    <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
                  </div>
                </div>
              </div>
            </transition>

            <!-- Información de pickup (solo si es pickup) -->
            <transition name="fade">
              <div v-if="deliveryMethod === 'pickup'" class="pickup-info">
                <div class="info-card">
                  <h3>📍 Nuestra Ubicación</h3>
                  <p class="location-name"><strong>Centro comercial Unilago, Bogotá - Loc. 1-124</strong></p>
                  <p class="location-address">Cra. 15 # 78 - 33, Bogotá D.C.</p>

                  <h4>⏰ Horarios de Atención</h4>
                  <p>Lunes - Sábado: 9:30 AM - 7:00 PM</p>
                  <p>Domingos: Cada 15 Días</p>
                </div>
              </div>
            </transition>
          </div>

          <!-- Mensaje de error general -->
          <div v-if="errors.general" class="error-alert">
            <span>⚠️ {{ errors.general }}</span>
          </div>

          <!-- Botón de confirmar pedido -->
          <button
            v-if="cartItems.length > 0"
            class="btn-confirm"
            :disabled="isProcessing"
            @click="confirmOrder"
          >
            <span v-if="!isProcessing">Confirmar pedido - ${{ finalTotal.toLocaleString() }}</span>
            <span v-else>Procesando...</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import './styles/Checkout.css'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '@/composables/useCart'
import { paymentService } from '@/services/api/paymentService'
import type { CreateProductPaymentRequest } from '@/services/api/paymentService'

defineOptions({
  name: 'CheckoutView'
})

const router = useRouter()
const { cartItems, totalPrice, clearCart } = useCart()

// Estado del formulario
const formData = ref({
  name: '',
  email: '',
  identificationNumber: '',
  contactNumber: '',
  acceptTerms: false,
  address: '',
  city: '',
  phone: ''
})

const deliveryMethod = ref<'delivery' | 'pickup'>('delivery')
const isProcessing = ref(false)
const errors = ref<Record<string, string>>({})

// Función para verificar si el usuario ya aceptó los términos
const checkTermsAcceptance = () => {
  const termsAccepted = sessionStorage.getItem('termsAccepted')
  console.log('🔍 Verificando términos aceptados en sessionStorage:', termsAccepted)
  if (termsAccepted === 'true') {
    formData.value.acceptTerms = true
    console.log('✅ Términos marcados automáticamente')
  }
}

// Listener para cuando la ventana recupera el foco (usuario vuelve de otra pestaña)
const handleWindowFocus = () => {
  console.log('👀 Ventana recuperó el foco, verificando términos...')
  checkTermsAcceptance()
}

// Verificar al montar el componente
onMounted(() => {
  console.log('🏁 Componente Checkout montado')
  checkTermsAcceptance()

  // Agregar listener para cuando vuelve el foco a la ventana
  window.addEventListener('focus', handleWindowFocus)
})

// Limpiar el listener al desmontar
onUnmounted(() => {
  window.removeEventListener('focus', handleWindowFocus)
})

// Total final (incluye envío si aplica)
const finalTotal = computed(() => {
  const shipping = deliveryMethod.value === 'delivery' ? 15000 : 0
  return totalPrice.value + shipping
})

// Validación
const validateForm = (): boolean => {
  errors.value = {}

  if (!formData.value.name.trim()) {
    errors.value.name = 'El nombre es requerido'
  }

  if (!formData.value.email.trim()) {
    errors.value.email = 'El correo electrónico es requerido'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    errors.value.email = 'Correo electrónico inválido'
  }

  if (!formData.value.identificationNumber.trim()) {
    errors.value.identificationNumber = 'El número de cédula es requerido'
  }

  if (!formData.value.contactNumber.trim()) {
    errors.value.contactNumber = 'El teléfono es requerido'
  }

  if (deliveryMethod.value === 'delivery') {
    if (!formData.value.address.trim()) {
      errors.value.address = 'La dirección es requerida'
    }
    if (!formData.value.city.trim()) {
      errors.value.city = 'La ciudad es requerida'
    }
    if (!formData.value.phone.trim()) {
      errors.value.phone = 'El teléfono de entrega es requerido'
    }
  }

  if (!formData.value.acceptTerms) {
    errors.value.acceptTerms = 'Debes aceptar los términos y condiciones'
  }

  return Object.keys(errors.value).length === 0
}

const clearError = (field: string) => {
  delete errors.value[field]
}

const confirmOrder = async () => {
  console.log('🔵 Iniciando confirmOrder...')

  if (!validateForm()) {
    console.log('❌ Validación fallida')
    return
  }

  console.log('✅ Validación exitosa')
  isProcessing.value = true

  // Limpiar errores previos
  errors.value.general = ''

  try {
    // Verificar que haya items en el carrito
    if (cartItems.value.length === 0) {
      throw new Error('El carrito está vacío')
    }

    // Preparar los items del carrito para el backend
    const items = cartItems.value.map(item => {
      const productId = parseInt(item.id)

      // Validar que el ID sea un número válido
      if (isNaN(productId)) {
        console.error('❌ ID de producto inválido:', item.id)
        throw new Error(`ID de producto inválido: ${item.id}`)
      }

      const cartItem: {
        productId: number
        quantity: number
        selectedColor?: string
      } = {
        productId: productId,
        quantity: item.quantity
      }

      // Solo agregar selectedColor si existe
      if (item.selectedColor) {
        cartItem.selectedColor = item.selectedColor
      }

      return cartItem
    })

    console.log('📦 Items preparados:', items)
    console.log('📦 CartItems originales:', cartItems.value)

    // Preparar el request para el backend
    const paymentRequest: CreateProductPaymentRequest = {
      buyerEmail: formData.value.email,
      buyerName: formData.value.name,
      buyerIdentificationNumber: formData.value.identificationNumber,
      buyerContactNumber: formData.value.contactNumber,
      items: items
    }

    // Si es envío a domicilio, agregar dirección
    if (deliveryMethod.value === 'delivery') {
      paymentRequest.shippingAddress = `${formData.value.address}, ${formData.value.city}`
    }

    console.log('📤 Enviando request de pago:', paymentRequest)

    // Llamar al backend para crear el pago
    const response = await paymentService.createProductPayment(paymentRequest)

    console.log('📥 Respuesta completa del backend:', response)
    console.log('📥 response.success:', response.success)
    console.log('📥 response.data:', response.data)

    if (response.success && response.data) {
      // Redirigir a la URL de pago de Wompi
      const paymentUrl = response.data.payment.paymentUrl
      console.log('💳 URL de pago obtenida:', paymentUrl)
      console.log('💳 Tipo de paymentUrl:', typeof paymentUrl)
      console.log('💳 paymentUrl válida:', !!paymentUrl)

      if (!paymentUrl) {
        throw new Error('No se recibió URL de pago del servidor')
      }

      // Guardar info de la compra antes de redirigir
      sessionStorage.setItem('pendingPurchaseId', response.data.purchase.id.toString())
      console.log('💾 Purchase ID guardado:', response.data.purchase.id)

      // Limpiar carrito
      clearCart()
      console.log('🗑️ Carrito limpiado')

      // Redirigir a Wompi
      console.log('🚀 Redirigiendo a:', paymentUrl)
      window.location.href = paymentUrl
    } else {
      console.error('❌ Response no exitoso:', response)
      throw new Error(response.message || 'Error al crear el pago')
    }
  } catch (error: unknown) {
    console.error('❌ Error capturado en catch:', error)
    console.error('❌ Tipo de error:', typeof error)
    console.error('❌ Error completo:', JSON.stringify(error, null, 2))

    // Mostrar error al usuario
    let errorMessage = 'Hubo un problema al procesar tu pago. '

    if (error instanceof Error) {
      errorMessage = error.message
      console.error('❌ Error message:', error.message)
      console.error('❌ Error stack:', error.stack)
    }

    // Si es un error de axios/fetch
    if (typeof error === 'object' && error !== null) {
      const err = error as Record<string, unknown>
      if (err.response) {
        console.error('❌ Error response:', err.response)
        const response = err.response as Record<string, unknown>
        console.error('❌ Error response.data:', response.data)

        if (response.data && typeof response.data === 'object') {
          const data = response.data as Record<string, unknown>
          const backendMessage = (data.message as string) || (data.error as string)

          if (backendMessage) {
            // Si es error 500 del servidor
            if (response.status === 500) {
              errorMessage = '⚠️ Error en el servidor de pagos. Por favor contacta a soporte o intenta más tarde.'
            } else {
              errorMessage = backendMessage
            }
          }
        }
      }
    }

    errors.value.general = errorMessage
    console.error('❌ Error mostrado al usuario:', errorMessage)

    isProcessing.value = false
  }
}

const goBack = () => {
  router.push('/')
}

const goToHome = () => {
  router.push('/')
}
</script>



