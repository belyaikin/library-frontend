<template>
  <div class="book-detail-page">
    <router-link to="/books" class="back-link">&larr; Back to books</router-link>

    <div v-if="isLoading" class="loading">Loading...</div>

    <div v-else-if="error" class="error">{{ error }}</div>

    <div v-else-if="book" class="book-detail card">
      <div class="book-header">
        <div class="book-icon">📖</div>
        <div class="book-info">
          <h1>{{ book.title }}</h1>
          <p class="author" v-if="author">{{ author.firstName }} {{ author.lastName }}</p>
          <p class="year" v-if="book.yearPublished">Published: {{ book.yearPublished }}</p>
        </div>
      </div>

      <div class="book-actions" v-if="authStore.isAuthenticated">
        <div v-if="buySuccess" class="success">Purchased! You can now download this book.</div>
        <template v-else-if="!isOwned">
          <div v-if="confirmBuy" class="confirm-box">
            <p>Are you sure you want to buy this book?</p>
            <div class="confirm-buttons">
              <button @click="executeBuy" :disabled="buyLoading">
                {{ buyLoading ? 'Buying...' : 'Confirm' }}
              </button>
              <button @click="confirmBuy = false" class="cancel-btn">Cancel</button>
            </div>
          </div>
          <button v-else @click="confirmBuy = true">Buy Book</button>
        </template>
        <button v-else @click="handleDownload" class="download-btn">
          Download EPUB
        </button>
      </div>
      <div class="book-actions" v-else>
        <router-link to="/login">Sign in to buy this book</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { bookAPI } from '@/api'
import { useBooksStore } from '@/stores/books'
import { useAuthStore } from '@/stores/auth'
import type { Book, Author } from '@/types'

const route = useRoute()
const booksStore = useBooksStore()
const authStore = useAuthStore()

const book = ref<Book | null>(null)
const author = ref<Author | null>(null)
const isLoading = ref(true)
const error = ref('')
const buyLoading = ref(false)
const confirmBuy = ref(false)
const buySuccess = ref(false)

const isOwned = computed(() => {
  if (!book.value) return false
  return authStore.user?.ownedBooks?.includes(book.value._id) ?? false
})

onMounted(async () => {
  try {
    const id = route.params.id as string
    book.value = await bookAPI.getById(id)
    if (book.value.authorId) {
      author.value = await booksStore.getAuthorById(book.value.authorId)
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Book not found'
  } finally {
    isLoading.value = false
  }
})

const executeBuy = async () => {
  if (!book.value) return
  buyLoading.value = true
  const success = await booksStore.buyBook(book.value._id)
  if (success) {
    await authStore.loadUser()
    buySuccess.value = true
    confirmBuy.value = false
  }
  buyLoading.value = false
}

const handleDownload = async () => {
  if (!book.value) return
  await booksStore.downloadBook(book.value._id, book.value.title)
}
</script>

<style scoped>
.book-detail-page {
  padding: 30px 0;
}

.back-link {
  display: inline-block;
  margin-bottom: 20px;
  font-size: 16px;
}

.book-detail {
  max-width: 600px;
}

.book-header {
  display: flex;
  gap: 25px;
  align-items: flex-start;
}

.book-icon {
  font-size: 80px;
  flex-shrink: 0;
}

.book-info {
  flex: 1;
}

h1 {
  color: var(--color-accent);
  font-size: 28px;
  margin-bottom: 10px;
}

.author {
  color: var(--color-text-secondary);
  font-style: italic;
  font-size: 18px;
  margin-bottom: 8px;
}

.year {
  color: var(--color-text-secondary);
  font-size: 14px;
}

.book-actions {
  margin-top: 30px;
}

.book-actions button {
  padding: 14px 30px;
  font-size: 16px;
}

.confirm-box {
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 15px;
}

.confirm-box p {
  margin-bottom: 12px;
  color: var(--color-text-secondary);
}

.confirm-buttons {
  display: flex;
  gap: 10px;
}

.cancel-btn {
  background-color: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
}

.cancel-btn:hover {
  border-color: var(--color-text-secondary);
}

.download-btn {
  background-color: #00cc6e;
}

.loading, .error {
  text-align: center;
  padding: 40px;
  font-size: 18px;
}

.loading {
  color: var(--color-text-secondary);
}

@media (max-width: 768px) {
  .book-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .book-icon {
    font-size: 60px;
  }

  h1 {
    font-size: 22px;
  }
}
</style>
