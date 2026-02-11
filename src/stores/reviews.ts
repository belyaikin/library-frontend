import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { reviewAPI } from '@/api'
import type { Review } from '@/types'

export const useReviewsStore = defineStore('reviews', () => {
  const reviews = ref<Review[]>([])
  const currentBookId = ref<string | null>(null)

  const loadReviews = async (bookId: string) => {
    currentBookId.value = bookId
    try {
      reviews.value = await reviewAPI.getByBook(bookId)
    } catch {
      reviews.value = []
    }
  }

  const addReview = async (data: { bookId: string; userId: string; userName: string; rating: number; text: string }) => {
    const review = await reviewAPI.create({
      bookId: data.bookId,
      rating: data.rating,
      text: data.text,
    })
    reviews.value.unshift(review)
  }

  const deleteReview = async (reviewId: string) => {
    await reviewAPI.delete(reviewId)
    reviews.value = reviews.value.filter(r => r.id !== reviewId)
  }

  const hasUserReviewed = (bookId: string, userId: string): boolean => {
    return reviews.value.some(r => r.bookId === bookId && r.userId === userId)
  }

  const getUserReview = (userId: string): Review | undefined => {
    return reviews.value.find(r => r.userId === userId)
  }

  const averageRating = computed((): number | null => {
    if (reviews.value.length === 0) return null
    const sum = reviews.value.reduce((acc, r) => acc + r.rating, 0)
    return Math.round((sum / reviews.value.length) * 10) / 10
  })

  return {
    reviews,
    currentBookId,
    loadReviews,
    addReview,
    deleteReview,
    hasUserReviewed,
    getUserReview,
    averageRating,
  }
})
