<template>
  <div class="books-page">
    <h1>All Books</h1>

    <div class="search-bar">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by title or author..."
      />
    </div>

    <div v-if="booksStore.isLoading" class="loading">Loading...</div>

    <div v-else-if="booksStore.error" class="error">{{ booksStore.error }}</div>

    <div v-else-if="booksStore.books.length === 0" class="empty">
      No books available yet
    </div>

    <template v-else>
      <div v-if="filteredBooks.length === 0" class="empty">
        No books match your search
      </div>

      <div v-else class="books-grid">
        <BookCard
          v-for="book in filteredBooks"
          :key="book._id"
          :book="book"
          :is-owned="isBookOwned(book._id)"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useBooksStore } from '@/stores/books'
import { useAuthStore } from '@/stores/auth'
import BookCard from '@/components/BookCard.vue'

const booksStore = useBooksStore()
const authStore = useAuthStore()
const searchQuery = ref('')

const filteredBooks = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) return booksStore.books
  return booksStore.books.filter(book => {
    if (book.title.toLowerCase().includes(query)) return true
    const author = booksStore.authors.get(book.authorId)
    if (author) {
      const fullName = `${author.firstName} ${author.lastName}`.toLowerCase()
      if (fullName.includes(query)) return true
    }
    return false
  })
})

const isBookOwned = (bookId: string): boolean => {
  return authStore.user?.ownedBooks?.includes(bookId) ?? false
}

onMounted(() => {
  booksStore.fetchAllBooks()
})
</script>

<style scoped>
.books-page {
  padding: 30px 0;
}

h1 {
  color: var(--color-accent);
  margin-bottom: 20px;
  font-size: 28px;
}

.search-bar {
  margin-bottom: 25px;
  max-width: 400px;
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
</style>
