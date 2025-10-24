<script setup>
import { AppState } from '@/AppState.js';
import AnimeDbCard from '@/components/AnimeDbCard.vue';
import { animeService } from '@/services/AnimeService.js';
import { logger } from '@/utils/Logger.js';
import { Pop } from '@/utils/Pop.js';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const animes = computed(() => AppState.animes)

const searchTerm = ref('')
const router = useRouter()
const route = useRoute()

watch(route, () => {
  if (route.query?.q) {
    getAnime('', { ...route.query, limit: 20 })
  } else {
    getAnime('ranking', { rating_type: 'tv', limit: 20 })
  }
  searchTerm.value = route.query.q?.toString()
}, { immediate: true })


async function getAnime(uri, query) {
  try {
    await animeService.getAnime(uri, query)
  } catch (error) {
    logger.error(error)
    Pop.error(error, 'Could Not Fetch Anime')
  }
}

async function searchAnime() {
  try {
    if (searchTerm.value == '') {
      return router.push('')
    }
    router.push('?q=' + searchTerm.value.replaceAll(' ', '+'))
  }
  catch (error) {
    logger.error(error)
    Pop.error(error);
  }
}
</script>


<template>
  <div class="container">
    <h1 class="f-bitcount text-white">Anime Database</h1>
    <section class="row my-3 justify-content-center">
      <div class="col-md-6 d-flex align-items-center">
        <span class="mx-2">Search</span>
        <form @submit.prevent="searchAnime" class="input-group">
          <input v-model="searchTerm" class="form-control bg-dark" type="text" name="anime-search">
          <button class="btn btn-pink px-4"><i class="mdi mdi-magnify"></i></button>
        </form>
      </div>
    </section>
    <section class="anime-grid">
      <TransitionGroup name="list">
        <AnimeDbCard v-for="anime in animes" :key="`anime-db-${anime.id}`" :anime />
      </TransitionGroup>
    </section>
  </div>
</template>


<style lang="scss" scoped>
.anime-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-auto-rows: 325px;
  gap: 10px;
}

.list-enter-active {
  transition: all 0.25s .25s ease;
}

.list-leave-active {
  transition: all 0.25s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: scale(.9);
  filter: blur(20px);
}
</style>