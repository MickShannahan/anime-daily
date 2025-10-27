<script setup>
import { AppState } from '@/AppState.js';
import { animeService } from '@/services/AnimeService.js';
import { jikanService } from '@/services/JikanService.js';
import { logger } from '@/utils/Logger.js';
import { Pop } from '@/utils/Pop.js';
import { randomInt } from '@/utils/Randoms.js';
import { computed, onMounted, ref } from 'vue';

const anime = computed(() => AppState.GameFramesAnime)
const animeFrames = ref([])
const selectedFrame = ref(0)
const guess = ref([])

onMounted(getRandomTopAnime)

async function getRandomTopAnime() {
  try {
    const query = { limit: 1, ranking_type: 'tv', offset: randomInt(0, 700, { seed: 'framesq' }) }
    // const animes = await animeService.getAnime('ranking', query)
    const animes = await jikanService.getAnimeList(1)
    // formatFrames(images.data.episodes)
  } catch (error) {
    logger.error(error)
    Pop.error(error, 'Could not get random anime')
  }
}

function formatFrames(framesRaw) {
  logger.log(framesRaw)
  animeFrames.value = framesRaw.map(f => f.images?.jpg?.image_url)
}

</script>


<template>
  <section class="my-3">
    <div class="glass-box p-3 rounded shadow">
      <article v-if="anime">
        <div class="anime-frames">
          <img v-for="(frame, f) in animeFrames" :src="frame" :key="frame"
            :class="{ 'transform-before': selectedFrame > f, 'transform-after': selectedFrame < f, 'selected-frame': selectedFrame == f }">
        </div>
        <div class="frame-btns d-flex flex-wrap justify-content-center gap-2 my-2">
          <button @click="selectedFrame = f" v-for="(frame, f) in animeFrames" class="btn" :key="`btn-${frame}`"
            :class="{ 'active-btn': selectedFrame == f }">
            <i class="mdi mdi-image"></i>
          </button>
        </div>
        <div>{{ anime.title }}</div>
      </article>
    </div>
  </section>
</template>


<style lang="scss" scoped>
.anime-frames {
  width: 100%;
  height: 400px;
  position: relative;
  display: flex;
  justify-content: center;

  img {
    border-radius: 5px;
    position: absolute;
    object-fit: contain;
    // background: rgba(var(--bs-dark-rgb), .4);
    height: 100%;
    transition: all .2s ease;
  }

  .selected-frame {
    border: 1px solid var(--bs-pink);
    z-index: 1;
  }

  .transform-before {
    transform: scale(.8) translateX(-20%);
  }

  .transform-after {
    transform: scale(.8) translateX(20%);
  }

}

.frame-btns {
  width: 100%;
}

.active-btn {
  background: rgba(var(--bs-pink-rgb), .2);
}
</style>