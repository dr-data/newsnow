import type { SourceID } from "@shared/types"
import { useAtom } from "jotai"
import { currentSourcesAtom } from "~/atoms"
import { sources } from "@shared/sources"
import { useState, useEffect } from "react"
import { produce } from "immer"

export function EditSourceModal({ id, close }: { id: SourceID, close: () => void }) {
  const [currentSources, setCurrentSources] = useAtom(currentSourcesAtom)
  const [name, setName] = useState("")
  const [title, setTitle] = useState("")

  useEffect(() => {
    const source = sources[id]
    if (source) {
      setName(source.name)
      setTitle(source.title || "")
    }
  }, [id])

  const handleSave = () => {
    const newSources = produce(sources, (draft) => {
      draft[id].name = name
      draft[id].title = title
    })
    // This is a bit of a hack, as we are modifying the original sources object.
    // In a real app, this should be handled more gracefully, e.g. by using a different
    // state for user-modified source settings.
    Object.assign(sources, newSources)
    close()
  }

  const moveUp = () => {
    const index = currentSources.indexOf(id)
    if (index > 0) {
      const newSources = [...currentSources]
      ;[newSources[index - 1], newSources[index]] = [newSources[index], newSources[index - 1]]
      setCurrentSources(newSources)
    }
  }

  const moveDown = () => {
    const index = currentSources.indexOf(id)
    if (index < currentSources.length - 1) {
      const newSources = [...currentSources]
      ;[newSources[index], newSources[index + 1]] = [newSources[index + 1], newSources[index]]
      setCurrentSources(newSources)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-100">
      <div className="bg-base rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Source: {sources[id].name}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border border-base rounded-md p-2 bg-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full border border-base rounded-md p-2 bg-base"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Rank</span>
            <div className="flex gap-2">
              <button onClick={moveUp} className="btn i-ph:arrow-up-duotone" />
              <button onClick={moveDown} className="btn i-ph:arrow-down-duotone" />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button onClick={close} className="btn">Close</button>
          <button onClick={handleSave} className="btn btn-primary">Save</button>
        </div>
      </div>
    </div>
  )
}
