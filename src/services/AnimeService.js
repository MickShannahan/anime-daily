import { AppState } from "@/AppState.js";
import { MALURL, dev } from "@/env.js";
import { Anime, AnimeDetails } from "@/models/Anime.js";
import { logger } from "@/utils/Logger.js";
import axios from "axios";

const animeApi = axios.create({
  baseURL: dev ? 'http://localhost:8088/' + MALURL : MALURL,
  headers: {
    "X-MAL-CLIENT-ID": '4531da6f6a9e32eb4ead4cda0086e665',
    "Access-Control-Allow-Origin": '*'
  },
  params: {
    fields: 'id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,nsfw,created_at,updated_at,media_type,status,genres,my_list_status,num_episodes,start_season,broadcast,source,average_episode_duration,rating,pictures,background,related_anime,related_manga,recommendations,studios,statistics,pictures,num_volumes,num_chapters,pictures,background,authors{first_name,last_name}'
  }
})

class AnimeService {
  async getAnime(uri = '', query = { ranking_type: 'tv' }) {
    uri = uri && !uri.startsWith('/') ? '/' + uri : uri
    // @ts-ignore
    const queryString = new URLSearchParams(query)
    AppState.animes = []
    const res = await animeApi.get(`anime${uri}?${queryString}`,)
    logger.log('📕📡', res.data)
    const animes = res.data.data.map(an => new Anime(an))
    AppState.animes = animes
    return animes
  }

  async getOneAnimeById(animeId) {
    const res = await animeApi.get(`anime/${animeId}`)
    logger.log('👉📕📡', res.data)
    return new AnimeDetails(res.data)
  }
}

export const animeService = new AnimeService()