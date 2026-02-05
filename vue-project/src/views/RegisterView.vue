<template>
  <div class="register-page">
    <div class="register-card card">
      <h1>Sign Up</h1>

      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label>First Name</label>
          <input v-model="firstName" type="text" required placeholder="John" />
        </div>

        <div class="form-group">
          <label>Last Name</label>
          <input v-model="lastName" type="text" required placeholder="Doe" />
        </div>

        <div class="form-group">
          <label>Email</label>
          <input v-model="email" type="email" required placeholder="example@email.com" />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input v-model="password" type="password" required placeholder="••••••••" />
        </div>

        <div class="error" v-if="authStore.error">{{ authStore.error }}</div>

        <button type="submit" :disabled="authStore.isLoading">
          {{ authStore.isLoading ? 'Loading...' : 'Sign Up' }}
        </button>
      </form>

      <p class="login-link">
        Already have an account? <router-link to="/login">Sign In</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')

const handleRegister = async () => {
  const success = await authStore.register({
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    password: password.value
  })
  
  if (success) {
    router.push('/books')
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.register-card {
  max-width: 450px;
  width: 100%;
}

h1 {
  color: var(--color-accent);
  margin-bottom: 30px;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

button[type="submit"] {
  width: 100%;
  padding: 14px;
  font-size: 16px;
  margin-top: 10px;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  color: var(--color-text-secondary);
}
</style>