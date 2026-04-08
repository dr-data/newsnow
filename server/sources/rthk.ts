import * as cheerio from "cheerio"
import type { NewsItem } from "@shared/types"

const BASE_URL = "https://news.rthk.hk"

/** Parse "2026-04-08 HKT 20:43" as HKT (UTC+8) and return ms timestamp. */
function parseHKTDate(s: string): number | undefined {
  const clean = s.replace(/\s+HKT\s+/, "T").trim()
  if (!clean) return undefined
  const d = new Date(`${clean}:00+08:00`)
  return Number.isNaN(d.getTime()) ? undefined : d.getTime()
}

export default defineSource(async () => {
  const html: any = await myFetch(`${BASE_URL}/rthk/ch/latest-news.htm`)
  const $ = cheerio.load(html)
  const news: NewsItem[] = []

  $(".ns2-inner").each((_, el) => {
    const $el = $(el)
    const a = $el.find("h4.ns2-title a")
    const title = a.text().trim()
    const href = a.attr("href")
    if (!title || !href) return
    const url = href.startsWith("http") ? href : `${BASE_URL}${href}`
    const cleanUrl = url.split("?")[0]
    const dateText = $el.find(".ns2-created").text().trim()
    const pubDate = parseHKTDate(dateText)
    news.push({ url: cleanUrl, title, id: cleanUrl, pubDate })
  })

  return news
})
