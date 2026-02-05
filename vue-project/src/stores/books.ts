import { defineStore } from 'pinia';
import { ref } from 'vue';
import { bookAPI, authorAPI } from '@/api';
import type { Book, Author } from '@/types';

export const useBooksStore = defineStore('books', () => {
  const books = ref<Book[]>([]);
  const authors = ref<Map<string, Author>>(new Map());
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchAllBooks = async () => {
    try {
      isLoading.value = true;
      error.value = null;
      books.value = await bookAPI.getAll();
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load books';
      books.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  const fetchBooksByIds = async (ids: string[]) => {
    try {
      isLoading.value = true;
      error.value = null;
      const results = await Promise.all(
        ids.map(id => bookAPI.getById(id).catch(() => null))
      );
      books.value = results.filter((b): b is Book => b !== null);
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load books';
      books.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  const getAuthorById = async (authorId: string): Promise<Author | null> => {
    if (authors.value.has(authorId)) {
      return authors.value.get(authorId)!;
    }

    try {
      const author = await authorAPI.getById(authorId);
      authors.value.set(authorId, author);
      return author;
    } catch (err) {
      console.error('Error fetching author:', err);
      return null;
    }
  };

  const buyBook = async (bookId: string) => {
    try {
      isLoading.value = true;
      error.value = null;

      await bookAPI.buy(bookId);
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to purchase book';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const downloadBook = async (bookId: string, bookTitle: string) => {
    try {
      const blob = await bookAPI.downloadEpub(bookId);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${bookTitle}.epub`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to download book';
      return false;
    }
  };

  return {
    books,
    authors,
    isLoading,
    error,
    fetchAllBooks,
    fetchBooksByIds,
    getAuthorById,
    buyBook,
    downloadBook,
  };
});
