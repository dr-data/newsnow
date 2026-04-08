import * as cheerio from "cheerio"
import type { NewsItem } from "@shared/types"

/** Scrapes yt-trends.iamrohit.in for Hong Kong YouTube trending videos. No API key required. */
export default defineSource(async (): Promise<NewsItem[]> => {
  const html: any = await myFetch("https://yt-trends.iamrohit.in/Hong-Kong")
  const $ = cheerio.load(html)
  const news: NewsItem[] = []
  const seen = new Set<string>()

  $("a.pl[videoid]").each((_, el) => {
    const $a = $(el)
    const videoId = $a.attr("videoid")
    if (!videoId || seen.has(videoId)) return
    seen.add(videoId)
    const title = $a.find("img").attr("alt")?.trim()
    if (!title) return
    news.push({
      id: videoId,
      title,
      url: `https://www.youtube.com/watch?v=${videoId}`,
    })
  })

  return news
})
