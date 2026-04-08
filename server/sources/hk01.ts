import * as cheerio from "cheerio"
import type { NewsItem } from "@shared/types"

export default defineSource(async (): Promise<NewsItem[]> => {
  const html = await myFetch("https://www.hk01.com/latest")
  const $ = cheerio.load(html as string)
  const raw = $("#__NEXT_DATA__").html()
  if (!raw) throw new Error("hk01: __NEXT_DATA__ not found")
  const data = JSON.parse(raw)
  const items: any[] = data?.props?.initialProps?.pageProps?.items ?? []
  return items.map((item: any) => {
    const a = item.data
    return {
      id: String(a.articleId),
      title: a.title,
      url: `https://www.hk01.com${a.canonicalUrl}`,
      pubDate: a.publishTime * 1000,
    }
  })
})
