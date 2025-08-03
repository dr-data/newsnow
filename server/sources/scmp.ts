import * as cheerio from "cheerio"
import type { NewsItem } from "@shared/types"

export default defineSource(async () => {
  const html = await myFetch(
    "https://www.scmp.com/live?module=oneline_menu_section_int&pgtype=section"
  )
  const $ = cheerio.load(html)
  const nextData = $("#__NEXT_DATA__").html()
  if (!nextData) {
    throw new Error("Could not find __NEXT_DATA__")
  }
  const data = JSON.parse(nextData)
  const edges = data.props.pageProps.operationDescriptor.root.data.contents.edges

  const news: NewsItem[] = edges.map((edge: any) => {
    const node = edge.node
    return {
      title: node.headline,
      url: `https://www.scmp.com${node.urlAlias}`,
      id: node.entityId,
      pubDate: node.publishedDate,
    }
  })

  return news
})
