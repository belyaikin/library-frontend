<template>
  <div class="not-found-page">
    <div class="not-found-card card">
      <h1>404</h1>
      <p>Page not found</p>
      <router-link to="/books">Go to All Books</router-link>
    </div>
  </div>
</template>

<style scoped>
.not-found-page {
  min-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.not-found-card {
  text-align: center;
  max-width: 400px;
  width: 100%;
}

h1 {
  font-size: 72px;
  color: var(--color-accent);
  margin-bottom: 10px;
}

p {
  color: var(--color-text-secondary);
  font-size: 20px;
  margin-bottom: 25px;
}
</style>
