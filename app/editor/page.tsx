import { EditorLayout } from "@/components/editor/editor-layout"
import { getEditorProjectLists } from "@/lib/project-data"

export default async function EditorPage() {
  const projectLists = await getEditorProjectLists()

  return <EditorLayout {...projectLists} />
}
