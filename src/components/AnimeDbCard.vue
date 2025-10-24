<script setup>
import { Anime, AnimeDetails } from '@/models/Anime.js';

const { anime } = defineProps({
  anime: { type: [Anime, AnimeDetails], required: true }
})
</script>


<template>
  <div class="anime-card">
    <img height="600" width="600" :src="anime.mainPictures.large" alt="">
    <div class="details-hover p-1">
      <div class="title">{{ anime.title }}</div>
      <small class="text-light opacity-75">{{ anime.altJnTitle }}</small>
      <hr class="my-1" />
      <section class="stats d-flex gap-2 text-light opacity-75">
        <div>
          <i class="mdi mdi-star"></i><span>{{ anime.meanScore }}</span>
        </div>
        <div>
          <i class="mdi mdi-chart-areaspline-variant"></i><span>{{ anime.rank }}</span>
        </div>
        <div>
          <i class="mdi mdi-devices"></i><span>{{ anime.mediaType }}</span>
        </div>
      </section>
    </div>
  </div>
</template>


<style lang="scss" scoped>
.anime-card {
  width: 100%;
  position: relative;
  overflow: hidden;
  border: solid 1px transparent;
  border-radius: 4px;
  padding: 1px;
  background: linear-gradient(rgba(var(--bs-dark-rgb), .5), var(--bs-black)) padding-box,
    linear-gradient(to left, rgba(203, 219, 255, 0.2), rgba(55, 135, 255, 0.2)) border-box;

  img {
    border-radius: inherit;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top;
    background-color: var(--bs-dark);
    position: relative;
    // opacity: 0;
  }

  .details-hover {
    font-size: 14px;
    color: var(--bs-white);
    position: absolute;
    width: 100%;
    height: 100%;
    // backdrop-filter: blur(3px);
    text-shadow: 0px 0px 5px black;
    bottom: 0;
    background: linear-gradient(to top, rgba(var(--bs-black-rgb), .8) 80%, transparent);
    transition: all .2s ease;
    margin-bottom: -19.6em;
  }

  &:hover .details-hover {
    margin-bottom: -50%;
    backdrop-filter: blur(5px) brightness(.5);
    background: linear-gradient(to top, rgba(var(--bs-black-rgb), .5) 80%, transparent);

    .title {
      color: var(--bs-cyan);
    }
  }
}

.stats {
  i {
    margin-right: .2em;
  }
}
</style>