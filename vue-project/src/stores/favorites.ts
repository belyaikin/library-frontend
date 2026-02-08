import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { favoritesAPI } from '@/api'

export const useFavoritesStore = defineStore('favorites', () => {
  const favoriteIds = ref<string[]>([])

  const loadFavorites = async () => {
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated || authStore.isGuest) {
      favoriteIds.value = []
      return
    }
    try {
      favoriteIds.value = await favoritesAPI.getAll()
    } catch {
      favoriteIds.value = []
    }
  }

  const isFavorite = (bookId: string): boolean => {
    return favoriteIds.value.includes(bookId)
  }

  const favoritesCount = computed(() => favoriteIds.value.length)

  const favoriteBookIds = computed(() => favoriteIds.value)

  const toggleFavorite = async (bookId: string) => {
    try {
      if (isFavorite(bookId)) {
        favoriteIds.value = await favoritesAPI.remove(bookId)
      } else {
        favoriteIds.value = await favoritesAPI.add(bookId)
      }
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
