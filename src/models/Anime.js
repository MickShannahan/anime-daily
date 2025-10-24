
export class Anime {
  constructor(data) {
    data = data.node ?? data
    this.id = data.id
    this.title = data.title
    this.altEnTitle = data.alternative_titles?.en
    this.altJnTitle = data.alternative_titles?.ja
    this.titleSynonyms = data.alternative_titles?.synonyms ?? []
    this.genres = data.genres
    this.meanScore = data.mean
    this.rank = data.rank
    this.mediaType = data.media_type
    this.mainPictures = data.main_picture ?? { medium: '', large: '' }
    this.nsfw = data.nsfw ?? 'white'
    this.rating = data.rating ?? 'r'
    this.startDate = data.start_date
    this.airingStatus = data.status
    this.studios = data.studios ?? [{ id: 0, name: 'unknown' }]
    this.synopsis = data.synopsis
    this.source = data.source
  }

  get nsfwExplanation() {
    switch (this.nsfw) {
      case 'white': return 'Safe For Work'
      case 'gray': return 'May Not Be Safe For Work'
      case 'black': return 'Not Safe For Work'
      default: return 'unrated'
    }
  }

  get ratingExplanation() {
    switch (this.rating) {
      case 'g': return 'All Ages +'
      case 'pg': return 'Children +'
      case 'pg_13': return 'Teens 13 +'
      case 'r': return '17 + (violence & profanity)'
      case 'r+': return '17 + (violence & profanity & mild nudity)'
      case 'rx': return '17 + (violence & profanity & nudity)'
      default: return 'unrated'
    }
  }
}

export class AnimeDetails extends Anime {
  constructor(data) {
    data = data.node ?? data
    super(data)
    this.pictures = data.pictures
    this.background = data.background
    this.statistics = data.statistics
  }
}