import { existsSync, readFile } from "node:fs"
import { promisify } from "node:util"
import type { Plugin } from "rollup"

const readFileAsync = promisify(readFile)

export function RollupHtml(): Plugin {
  return {
    name: "rollup-html",
    resolveId(id) {
      // Handle raw: prefixed HTML imports
      if (id.startsWith("raw:") && id.endsWith(".html")) {
        return id
      }
      return null
    },
    async load(id) {
      if (id.startsWith("raw:") && id.endsWith(".html")) {
        const filePath = id.replace("raw:", "")

        // Check if file exists synchronously first
        if (existsSync(filePath)) {
          try {
            const content = await readFileAsync(filePath, "utf-8")
            return `export default ${JSON.stringify(content)}`
          } catch {
            // If reading fails, fall back
          }
        }

        // Return a fallback that will work for the deployment
        return `export default "<!DOCTYPE html><html><head><title>Loading...</title></head><body><div id='app'></div></body></html>"`
      }

      if (id.endsWith(".html")) {
        if (existsSync(id)) {
          try {
            const content = await readFileAsync(id, "utf-8")
            return `export default ${JSON.stringify(content)}`
          } catch {
            // If reading fails, fall back
          }
        }

        // Return a fallback that will work for the deployment
        return `export default "<!DOCTYPE html><html><head><title>Loading...</title></head><body><div id='app'></div></body></html>"`
      }
      return null
    },
  }
}
