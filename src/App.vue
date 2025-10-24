<script setup>
import Navbar from './components/Navbar.vue';
import { RouterView } from 'vue-router';

</script>

<template>
  <header>
    <Navbar />
  </header>
  <main>
    <RouterView />
  </main>
  <footer class="text-secondary text-end p-2">
    <small>Anime/Manga list supplied by <a class="text-secondary"
        href="https://myanimelist.net">MyAnimeList.net</a></small>
  </footer>
</template>

<style lang="scss"></style>
