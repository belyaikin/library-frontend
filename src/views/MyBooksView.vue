<template>
  <div class="my-books-page">
    <h1>My Books</h1>

    <div v-if="booksStore.isLoading" class="loading">Loading...</div>

    <div v-else-if="booksStore.error" class="error">{{ booksStore.error }}</div>

    <div v-else-if="booksStore.books.length === 0" class="empty">
      You don't have any books yet.
      <router-link to="/books">Browse catalog</router-link>
    </div>

    <div v-else class="books-grid">
      <BookCard
        v-for="book in booksStore.books"
        :key="book._id"
        :book="book"
        :is-owned="true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useBooksStore } from '@/stores/books'
import { useAuthStore } from '@/stores/auth'
import BookCard from '@/components/BookCard.vue'

const booksStore = useBooksStore()
const authStore = useAuthStore()

const loadOwnedBooks = () => {
  const ownedIds = authStore.user?.ownedBooks ?? []
  if (ownedIds.length > 0) {
    booksStore.fetchBooksByIds(ownedIds)
  } else {
    booksStore.books = []
  }
}

onMounted(() => {
  loadOwnedBooks()
})

watch(() => authStore.user?.ownedBooks, () => {
  loadOwnedBooks()
})
</script>

<style scoped>
.my-books-page {
  padding: 30px 0;
}

h1 {
  color: var(--color-accent);
  margin-bottom: 30px;
  font-size: 28px;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.loading {
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 18px;
  padding: 40px;
}

.empty {
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 18px;
  padding: 40px;
}

.empty a {
  display: block;
  margin-top: 15px;
}
</style>
