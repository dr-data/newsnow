import type { SourceID } from "@shared/types"
import { atom } from "jotai"

export const editingSourceAtom = atom<SourceID | null>(null)
