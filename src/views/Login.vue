<template>
  <main class="login-main">
    <div class="login-container">
      <div class="login-header">
        <h1>Acceder</h1>
        <h2>Ingrese Usuario/Email y contraseña</h2>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="input-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" required @invalid="setCustomValidityMessage"
            @input="clearCustomValidityMessage" class="form-input" />
        </div>

        <div class="input-group">
          <label for="password">Contraseña</label>
          <input type="password" id="password" v-model="password" required @invalid="setCustomValidityMessage"
            @input="clearCustomValidityMessage" class="form-input" />
        </div>

        <button type="submit" :disabled="loading" class="btn-primary">
          {{ loading ? 'Accediendo...' : 'Acceder' }}
        </button>
      </form>
    </div>

    <Spinner v-if="loading" />
  </main>
</template>

<script setup lang="ts">
import './styles/Login.css'
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService, type LoginCredentials } from '@/services/api';
import Spinner from '@/components/Spinner.vue';

defineOptions({
  name: 'LoginView',
});

const email = ref('');
const password = ref('');
const loading = ref(false);
const router = useRouter();

const handleLogin = async () => {
  loading.value = true;
  try {
    const credentials: LoginCredentials = {
      email: email.value,
      password: password.value,
    };

    const response = await authService.login(credentials);

    if (response.success) {
      // Redirigir según el rol del usuario
      const userInfo = authService.getCurrentUser();

      if (userInfo?.role === 'admin') {
        router.push('/admin/products');
      } else {
        router.push('/');
      }
    } else {
      alert(response.message || 'Credenciales inválidas');
    }
  } catch (error: unknown) {
    console.error('Login error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error en el servidor. Intente nuevamente.';
    alert('Error en el login: ' + errorMessage);
  } finally {
    loading.value = false;
  }
};

const setCustomValidityMessage = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.validity.valid) {
    target.setCustomValidity('Este campo es obligatorio.');
  }
};

const clearCustomValidityMessage = (event: Event) => {
  const target = event.target as HTMLInputElement;
  target.setCustomValidity('');
};
</script>



