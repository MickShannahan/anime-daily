<script setup>
import { animeService } from '@/services/AnimeService.js';
import { logger } from '@/utils/Logger.js';
import { Pop } from '@/utils/Pop.js';
import { randomFromArray, randomInt } from '@/utils/Randoms.js';
import { onMounted } from 'vue';

onMounted(getRandomTopAnime)

async function getRandomTopAnime() {
  try {
    const query = { limit: 500, ranking_type: 'tv', offset: randomInt(50) }
    const animes = await animeService.getAnime('ranking', query)
    const randomAnime = randomFromArray(animes)
    logger.log(randomAnime)
  } catch (error) {
    logger.error(error)
    Pop.error(error, 'Could not get random anime')
  }
}

</script>


<template>
  <div class="container">
    <h1 class="f-bitcount">Game Page</h1>
  </div>
</template>


<style lang="scss" scoped></style>