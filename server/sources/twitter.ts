import process from "node:process"
import type { NewsItem } from "@shared/types"

interface TwitterTrend {
  name: string
  url: string
  tweet_volume: number | null
}

interface TwitterTrendsResponse {
  trends: TwitterTrend[]
}

/** Fetches worldwide Twitter/X trending topics via the v1.1 Trends API. Requires TWITTER_BEARER_TOKEN env var. */
export default defineSource(async (): Promise<NewsItem[]> => {
  const token = process.env.TWITTER_BEARER_TOKEN
  if (!token) return []

  const data: TwitterTrendsResponse[] = await myFetch(
    "https://api.twitter.com/1.1/trends/place.json?id=1",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  return data[0].trends.map(trend => ({
    id: trend.name,
    title: trend.name,
    url: `https://x.com/search?q=${encodeURIComponent(trend.name)}&src=trend_click`,
    extra: {
      info: trend.tweet_volume ? `${Math.round(trend.tweet_volume / 1000)}K` : undefined,
    },
  }))
})
