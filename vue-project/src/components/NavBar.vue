<template>
  <nav class="navbar">
    <div class="container">
      <div class="nav-content">
        <div class="logo">📚 Library</div>
        
        <div class="nav-links">
          <router-link to="/books">All Books</router-link>

          <template v-if="authStore.isAuthenticated">
            <router-link to="/my-books">
              My Books
              <span v-if="booksCount > 0" class="badge">{{ booksCount }}</span>
            </router-link>
            <router-link v-if="authStore.isAdmin" to="/admin">Admin</router-link>

            <div class="user-section" ref="userSectionRef">
              <button class="user-toggle" @click="showDropdown = !showDropdown">
                {{ authStore.user?.information.firstName }} ▾
              </button>
              <div v-if="showDropdown" class="user-dropdown">
                <div class="dropdown-header">
                  <span class="user-name">{{ authStore.user?.information.firstName }} {{ authStore.user?.information.lastName }}</span>
                  <span class="user-email">{{ authStore.user?.credentials.email }}</span>
                  <span class="user-role">{{ authStore.isAdmin ? 'Admin' : 'User' }}</span>
                </div>
                <div class="dropdown-stats">
                  <span>{{ authStore.user?.ownedBooks?.length ?? 0 }} books owned</span>
                </div>
                <button @click="handleLogout" class="logout-btn">Logout</button>
              </div>
            </div>
          </template>

          <template v-else>
            <router-link to="/login">Sign In</router-link>
            <router-link to="/register">Sign Up</router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const showDropdown = ref(false)
const userSectionRef = ref<HTMLElement | null>(null)

const booksCount = computed(() => authStore.user?.ownedBooks?.length ?? 0)

const onClickOutside = (e: MouseEvent) => {
  if (userSectionRef.value && !userSectionRef.value.contains(e.target as Node)) {
    showDropdown.value = false
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))

watch(() => route.path, () => { showDropdown.value = false })

const handleLogout = () => {
  showDropdown.value = false
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  background-color: var(--color-bg-secondary);
  border-bottom: 2px solid var(--color-border);
  padding: 15px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: var(--color-accent);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 30px;
}

.nav-links a {
  font-weight: 500;
  transition: color 0.3s;
}

.nav-links a.router-link-active {
  color: var(--color-accent);
}

.badge {
  display: inline-block;
  background-color: var(--color-accent);
  color: var(--color-bg-primary);
  font-size: 11px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 10px;
  margin-left: 4px;
  vertical-align: middle;
}

.user-section {
  position: relative;
  padding-left: 20px;
  border-left: 2px solid var(--color-border);
}

.user-toggle {
  padding: 8px 14px;
  font-size: 14px;
  background-color: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
}

.user-toggle:hover {
  border-color: var(--color-accent);
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 15px;
  min-width: 220px;
  z-index: 200;
}

.dropdown-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--color-border);
}

.user-name {
  font-weight: 600;
  color: var(--color-text-primary);
}

.user-email {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.user-role {
  font-size: 12px;
  color: var(--color-accent);
  font-weight: 500;
}

.dropdown-stats {
  padding: 10px 0;
  font-size: 13px;
  color: var(--color-text-secondary);
  border-bottom: 1px solid var(--color-border);
}

.logout-btn {
  width: 100%;
  margin-top: 10px;
  padding: 8px 16px;
  font-size: 14px;
}

@media (max-width: 768px) {
  .nav-content {
    flex-direction: column;
    gap: 12px;
  }

  .nav-links {
    gap: 15px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .user-section {
    padding-left: 0;
    border-left: none;
  }

  .logo {
    font-size: 20px;
  }
}
</style>