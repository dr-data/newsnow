import * as cheerio from "cheerio"
import type { NewsItem } from "@shared/types"
import dayjs from "dayjs"

export default defineSource(async () => {
  const date = dayjs().format("YYYYMMDD")
  const url = `https://news.mingpao.com/ins/%E6%B8%AF%E8%81%9E/section/${date}/s00001`
  const html = await myFetch(url)
  const $ = cheerio.load(html)
  const news: NewsItem[] = []

  $("div.in_news_list a").each((_, el) => {
    const $el = $(el)
    const title = $el.find("h3").text().trim()
    const href = $el.attr("href")

    if (title && href) {
      const match = href.match(/\/(\d{13})\//)
      const pubDate = match ? parseInt(match[1]) : undefined

      news.push({
        title,
        url: `https://news.mingpao.com${href}`,
        id: href,
        pubDate,
      })
    }
  })

  return news
})
