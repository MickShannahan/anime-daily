<script setup>
import { AnimeDetails } from '@/models/Anime.js';
import { animeService } from '@/services/AnimeService.js';
import { logger } from '@/utils/Logger.js';
import { Pop } from '@/utils/Pop.js';
import { randomFromArray, randomInt } from '@/utils/Randoms.js';
import { onMounted } from 'vue';

onMounted(getRandomTopAnime)

async function getRandomTopAnime() {
  try {
    const query = { limit: 1, ranking_type: 'tv', offset: randomInt(0, 700) }
    const animes = await animeService.getAnime('ranking', query)
    const randomAnime = await animeService.getOneAnimeById(animes[0].id)
    logger.log(randomAnime)
  } catch (error) {
    logger.error(error)
    Pop.error(error, 'Could not get random anime')
  }
}

</script>


<template>
  <div class="container">
    <h1 class="f-bitcount opacity-50">Game Page</h1>
    <section>
      <div class="anime-details">

      </div>
    </section>
  </div>
</template>


<style lang="scss" scoped></style>