<script setup>
import { AppState } from '@/AppState.js';
import { AnimeDetails } from '@/models/Anime.js';
import { animeService } from '@/services/AnimeService.js';
import { logger } from '@/utils/Logger.js';
import { Pop } from '@/utils/Pop.js';
import { randomFromArray, randomInt } from '@/utils/Randoms.js';
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { RouterLink, RouterView, useRoute } from 'vue-router';

// The bubble position/size will be stored as percentages of the .game-links parent
const activeLinkPos = reactive({ l: 0, w: 0 }) // numeric percentages (0-100)
const activeLink = ref('')
const route = useRoute()

function updateActiveBubble(link) {
  if (!link) return
  const parent = link.closest('.game-links')
  if (!parent) return
  const parentRect = parent.getBoundingClientRect()
  const linkRect = link.getBoundingClientRect()
  const leftPercent = ((linkRect.left - parentRect.left) / parentRect.width) * 100
  const widthPercent = (linkRect.width / parentRect.width) * 100
  activeLinkPos.l = Number(leftPercent.toFixed(4))
  activeLinkPos.w = Number(widthPercent.toFixed(4))
}

watch(route, () => {
  logger.log(route.path)
  const link = document.querySelector(`[href="#${route.path}"]`)
  if (link) {
    activeLink.value = route.path
    updateActiveBubble(link)
  } else {
    activeLinkPos.l = 0
  }
})



let resizeHandler = null
onMounted(() => {
  // initial placement based on current route
  const currentPath = route.path
  const link = document.querySelector(`[href="#${currentPath}"]`)
  if (link) {
    activeLink.value = currentPath
    updateActiveBubble(link)
  }

  // recompute on window resize so percentages stay accurate
  resizeHandler = () => {
    const link = document.querySelector(`[href="#${route.path}"]`)
    if (link) updateActiveBubble(link)
  }
  window.addEventListener('resize', resizeHandler)
})

onUnmounted(() => {
  if (resizeHandler) window.removeEventListener('resize', resizeHandler)
})

</script>


<template>
  <div class="container">
    <h1 class="f-bitcount opacity-50">Game Page</h1>
    <section>
      <div class="game-nav glass-box rounded-pill shadow-sm">
        <div class="d-flex justify-content-around p-2 px-4 game-links f-bitcount fw-bold">
          <RouterLink to="/game/frames">
            Frames
          </RouterLink>
          <RouterLink to="/game/characters">
            Characters
          </RouterLink>
          <RouterLink to="/game/guess">
            Guess
          </RouterLink>
          <span class="active-link" :style="`--link-l:${activeLinkPos.l}%; --link-w:${activeLinkPos.w}%;`"></span>
        </div>
      </div>
    </section>
    <section>
      <RouterView />
    </section>
  </div>
</template>


<style lang="scss" scoped>
.game-links {
  position: relative;

  a {
    color: var(--bs-pink);
    text-decoration: none;
    padding: .25em 2em;
    padding-top: .3em;
    border-radius: 50px;
    transition: all .1s ease;
    cursor: pointer;

    &:hover {
      background-color: rgba(var(--bs-pink-rgb), .2);
    }

    &.router-link-active {
      color: var(--bs-light);
    }
  }

  .active-link {
    position: absolute;
    background-color: var(--bs-pink);
    bottom: .5em;
    height: 2em;
    left: calc(var(--link-l, 0%));
    width: calc(var(--link-w, 0%));
    border-radius: 50px;
    mix-blend-mode: soft-light;
    transition: all .2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    pointer-events: none;
    /* remove padding so width comes purely from calculated percent; padding can be applied via transform if needed */
  }
}
</style>