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
    
    if (authStore.user?.favoriteBooks) {
      favoriteIds.value = authStore.user.favoriteBooks
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
      
      if (updatedUser.favoriteBooks) {
        favoriteIds.value = updatedUser.favoriteBooks
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
