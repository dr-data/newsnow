import * as cheerio from "cheerio"
import type { NewsItem } from "@shared/types"
import dayjs from "dayjs"

export default defineSource(async () => {
  const html = await myFetch("https://www.info.gov.hk/gia/general/ctoday.htm")
  const $ = cheerio.load(html)
  const news: NewsItem[] = []
  const date = $("div.date_st_right.font_size_12").text().trim()

  $("ul.GINSlisthk-speed li").each((_, el) => {
    const $el = $(el)
    const a = $el.find("a")
    const title = a.text().trim()
    const url = a.attr("href")

    if (title && url) {
      const urlDateMatch = url.match(/P(\d{8})/)
      let pubDate = dayjs(date, "DD-MM-YYYY").valueOf()
      if (urlDateMatch) {
        const time = url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.')).replace(/P\d{8}/, '')
        pubDate = dayjs(`${date} ${time.substring(0,2)}:${time.substring(2,4)}`, "DD-MM-YYYY HH:mm").valueOf()
      }

      news.push({
        title,
        url: `https://www.info.gov.hk${url}`,
        id: url,
        pubDate,
      })
    }
  })

  return news
})
