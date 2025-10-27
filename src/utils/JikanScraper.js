
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { jikanService } from '../services/JikanService.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const outputPath = path.resolve(__dirname, '../jikan_data.json')
const listOutput = path.resolve(__dirname, '../anime_master_list.json')
const jikonData = []
const masterList = []
let currentPage = 1

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function normalizeTitle(title) {
  if (!title) return ''
  // Lowercase, remove punctuation, collapse whitespace
  let t = title.toLowerCase()
  t = t.replace(/[\u2018\u2019\u201c\u201d']/g, '')
  t = t.replace(/[^a-z0-9\s]/g, ' ')
  t = t.replace(/\bseason\b/g, ' ')
  t = t.replace(/\bpart\b/g, ' ')
  t = t.replace(/\b\d+\b/g, ' ')
  t = t.replace(/\s+/g, ' ').trim()
  return t
}

function findMergeIndexByTitle(normalized) {
  for (let i = 0; i < jikonData.length; i++) {
    const item = jikonData[i]
    const cand = normalizeTitle(item.title || item.title_english || item.title_japanese)
    if (!cand) continue
    if (cand === normalized) return i
    // also allow prefix matches (e.g., "attack on titan" vs "attack on titan o")
    if (cand.startsWith(normalized) || normalized.startsWith(cand)) return i
  }
  return -1
}

function saveFiles() {
  try {
    fs.writeFileSync(outputPath, JSON.stringify(jikonData, null, 2), 'utf8')
    fs.writeFileSync(listOutput, JSON.stringify(masterList, null, 2), 'utf8')
    console.log(`Saved ${jikonData.length} full items and ${masterList.length} master items`)
  } catch (err) {
    console.error('Error writing files', err)
  }
}

export async function scrapeJikan(q) {
  currentPage = 1
  let hasNext = true
  while (hasNext) {
    try {
      console.log(`Fetching page ${currentPage} ...`)
      const res = await jikanService.getAnimeList(currentPage, q)
      if (!res || !res.data) {
        console.warn('No data returned for page', currentPage)
        break
      }

      for (const anime of res.data) {
        // prepare full item (keep as much info as possible)
        const full = Object.assign({}, anime)

        const title = anime.title || anime.title_english || anime.title_japanese || ''
        const normalized = normalizeTitle(title)

        const existingIndex = findMergeIndexByTitle(normalized)
        if (existingIndex > -1) {
          // merge: prefer to keep existing fields, but copy any missing
          const existing = jikonData[existingIndex]
          jikonData[existingIndex] = Object.assign({}, full, existing)
        } else {
          jikonData.push(full)
          masterList.push({ mal_id: anime.mal_id, title })
        }
      }

      // save after each page
      saveFiles()

      // pagination
      if (res.pagination && res.pagination.has_next_page) {
        hasNext = true
        currentPage++
        // throttle to avoid >60 requests/min (1.2s per request)
        await sleep(1200)
      } else {
        hasNext = false
      }
    } catch (err) {
      console.error('Error fetching page', currentPage, err.message || err)
      // on error, backoff a bit and retry
      await sleep(5000)
    }
  }
  console.log('Scrape complete')
}

// If run directly via node, start scraping
if (process.argv && fileURLToPath(import.meta.url) === process.argv[1]) {
  const q = process.argv[2]
  scrapeJikan(q)
}


