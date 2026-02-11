import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { favoritesAPI } from '@/api'
import type { User } from '@/types'

export const useFavoritesStore = defineStore('favorites', () => {
  const favoriteIds = ref<string[]>([])

  const loadFavorites = async () => {
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated || authStore.isGuest) {
      favoriteIds.value = []
      return
    }
    // Load favorites from current user if available
    if (authStore.user?.ownedBooks) {
      favoriteIds.value = authStore.user.ownedBooks
    }
  }

  const isFavorite = (bookId: string): boolean => {
    return favoriteIds.value.includes(bookId)
  }

  const favoritesCount = computed(() => favoriteIds.value.length)

  const favoriteBookIds = computed(() => favoriteIds.value)

  const toggleFavorite = async (bookId: string) => {
    const authStore = useAuthStore()
    try {
      let updatedUser: User
      if (isFavorite(bookId)) {
        updatedUser = await favoritesAPI.remove(bookId)
      } else {
        updatedUser = await favoritesAPI.add(bookId)
      }
      // Update both the favorites store and auth store
      if (updatedUser.ownedBooks) {
        favoriteIds.value = updatedUser.ownedBooks
      }
      authStore.user = updatedUser
    } catch {
      // silently fail
    }
  }

  const clearFavorites = () => {
    favoriteIds.value = []
  }

  return {
    favorites: favoriteIds,
    favoritesCount,
    favoriteBookIds,
    loadFavorites,
    isFavorite,
    toggleFavorite,
    clearFavorites,
  }
})
