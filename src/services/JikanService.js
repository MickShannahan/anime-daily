import { logger } from "../utils/Logger.js"
import axios from "axios"

const jikanApi = axios.create({
  baseURL: 'https://api.jikan.moe/v4/'
})

class JikanService {

  async getAnimeList(page = 1, q) {
    const res = await jikanApi.get(`anime`, { params: { page, q, } })
    logger.log('👹🎞️🎞️', res.data)
    return res.data
  }

  async getAnimeById(animeId) {
    const res = await jikanApi.get(`anime/${animeId}`)
    logger.log('👹📕', res.data)
    return res.data
  }
  async getAnimePictures(animeId) {
    const res = await jikanApi.get(`anime/${animeId}/pictures`)
    logger.log('👹', res.data)
    return res.data
  }
  async getAnimeFrames(animeId) {
    const res = await jikanApi.get(`anime/${animeId}/videos`)
    logger.log('👹🎞️', res.data)
    return res.data
  }
}

export const jikanService = new JikanService()