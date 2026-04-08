import { ourongxing, react } from "@ourongxing/eslint-config"

// @ourongxing/eslint-config beta.6 references rule names from eslint-react v3.x,
// but the project is pinned to v2.x (ESLint v9 compat). Patch both plugins so
// ESLint v9 config validation doesn't throw "Could not find rule" errors.
//
// Rule name changes from v2 → v3:
//   react-dom: no-void-elements-with-children → no-children-in-void-dom-elements
//   react:     jsx-no-comment-textnodes       → no-comment-textnodes
//   react:     jsx-shorthand-boolean          → prefer-shorthand-boolean
//   react:     jsx-shorthand-fragment         → prefer-shorthand-fragment
//   react:     (new rules, no v2 equivalent)  → ensure-forward-ref-using-ref, no-nested-components
const noop = { create: () => ({}) }

function patchPlugin(plugin, aliases) {
  if (!plugin) return plugin
  const extra = {}
  for (const [newName, oldName] of Object.entries(aliases)) {
    extra[newName] = plugin.rules?.[oldName] ?? noop
  }
  return { ...plugin, rules: { ...plugin.rules, ...extra } }
}

async function patchedReact(options) {
  const configs = await react(options)
  return configs.map((c) => {
    if (!c.plugins) return c
    const plugins = { ...c.plugins }
    if (plugins["react-dom"]) {
      plugins["react-dom"] = patchPlugin(plugins["react-dom"], {
        "no-children-in-void-dom-elements": "no-void-elements-with-children",
      })
    }
    if (plugins.react) {
      plugins.react = patchPlugin(plugins.react, {
        "no-comment-textnodes": "jsx-no-comment-textnodes",
        "prefer-shorthand-boolean": "jsx-shorthand-boolean",
        "prefer-shorthand-fragment": "jsx-shorthand-fragment",
        "ensure-forward-ref-using-ref": null, // new in v3, no v2 equivalent
        "no-nested-components": null, // new in v3, no v2 equivalent
      })
    }
    return { ...c, plugins }
  })
}

export default ourongxing({
  type: "app",
  // 貌似不能 ./ 开头，
  ignores: ["src/routeTree.gen.ts", "imports.app.d.ts", "public/", ".vscode", "**/*.json"],
}).append(patchedReact({
  files: ["src/**"],
})).append({
  // react/no-implicit-key calls getParserServices() internally, which requires
  // parserOptions.project to be configured for type-aware linting. Since the
  // project doesn't configure typed linting, disable it to avoid runtime errors.
  rules: {
    "react/no-implicit-key": "off",
  },
})
