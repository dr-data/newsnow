import * as cheerio from "cheerio"
import type { NewsItem } from "@shared/types"

export default defineSource(async () => {
  const html = await myFetch("https://hk.news.yahoo.com/hong-kong/")
  const $ = cheerio.load(html)
  const script = $("script")
    .filter((_, el) => {
      return $(el).html()?.includes("root.App.main") || false
    })
    .html()

  if (!script) {
    throw new Error("Could not find script with root.App.main")
  }

  const match = script.match(/root.App.main\s*=\s*({.*});/);
  if (!match || !match[1]) {
    throw new Error("Could not extract JSON from script")
  }

  const data = JSON.parse(match[1])
  const streams = data.context.dispatcher.stores.StreamStore.streams
  const news: NewsItem[] = []

  for (const streamId in streams) {
    const stream = streams[streamId];
    if (stream.data && stream.data.stream_items) {
      for (const item of stream.data.stream_items) {
        news.push({
          title: item.title,
          url: item.url,
          id: item.id,
          pubDate: item.pubtime * 1000,
        })
      }
    }
  }

  return news
})
