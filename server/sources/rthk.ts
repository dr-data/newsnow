import * as cheerio from "cheerio"
import type { NewsItem } from "@shared/types"
import dayjs from "dayjs"

export default defineSource(async () => {
  const html = await myFetch("https://news.rthk.hk/rthk/ch/latest-news.htm")
  const $ = cheerio.load(html)
  const news: NewsItem[] = []

  $("div.nsb_wrap").each((_, el) => {
    const $el = $(el)
    const title = $el.find(".title").text().trim()
    const url = $el.find("a").attr("href")
    const dateStr = $el.find(".date").text().trim()
    const pubDate = dayjs(dateStr, "YYYY-MM-DD HKT HH:mm").valueOf()

    if (title && url) {
      news.push({
        title,
        url: `https://news.rthk.hk${url}`,
        id: url,
        pubDate,
      })
    }
  })

  return news
})
