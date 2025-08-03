import * as cheerio from "cheerio"
import type { NewsItem } from "@shared/types"

export default defineSource(async () => {
  const html = await myFetch("https://www.hk01.com/hot")
  const $ = cheerio.load(html)
  const nextData = $("#__NEXT_DATA__").html()
  if (!nextData) {
    throw new Error("Could not find __NEXT_DATA__")
  }
  const data = JSON.parse(nextData)
  const items = data.props.initialProps.pageProps.items
  const news: NewsItem[] = items.map((item: any) => {
    const article = item.data
    return {
      title: article.title,
      url: `https://www.hk01.com${article.canonicalUrl}`,
      id: article.articleId.toString(),
      pubDate: article.publishTime * 1000,
    }
  })
  return news
})
