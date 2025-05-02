import { Trash2, Pencil, Minus, Plus } from "lucide-react"
import { useRef, useState } from "react"
import { motion, useDragControls } from "framer-motion"

interface Note {
  id: string
  content: string
  color: string
}

interface Props {
  notes: Note[]
  onDelete: (id: string) => void
  onEdit: (id: string, content: string) => void
}

export function StickyNoteColumn({ notes, onDelete, onEdit }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState("")
  const [minimized, setMinimized] = useState(false)
  const dragControls = useDragControls()
  const containerRef = useRef<HTMLDivElement>(null)

  const handleEdit = (id: string, content: string) => {
    setEditingId(id)
    setEditingContent(content)
  }

  const saveEdit = () => {
    if (editingId && editingContent.trim()) {
      onEdit(editingId, editingContent)
      setEditingId(null)
      setEditingContent("")
    }
  }

  return (
    <div ref={containerRef} className="fixed inset-0 z-40 pointer-events-none select-none">
      <motion.div
        drag="x"
        dragListener={false}
        dragControls={dragControls}
        dragConstraints={containerRef}
        dragElastic={0.1}
        className={`
          fixed bottom-4 right-4 z-50 bg-background/90 border border-border backdrop-blur-md
          rounded-2xl shadow-xl w-[95vw] max-w-sm pointer-events-auto
        `}
      >
        <div
          className="cursor-move bg-muted/70 px-4 py-3 flex justify-between items-center border-b border-border rounded-t-2xl"
          onPointerDown={(e) => dragControls.start(e)}
        >
          <h2 className="text-base font-semibold text-foreground">Notas</h2>
          <button
            onClick={() => setMinimized(!minimized)}
            className="text-muted-foreground hover:text-primary transition"
          >
            {minimized ? <Plus size={18} /> : <Minus size={18} />}
          </button>
        </div>

        {!minimized && (
          <div className="p-4 space-y-4 max-h-[40vh] overflow-y-auto">
            {notes.map((note) => (
              <div
                key={note.id}
                style={{ backgroundColor: note.color }}
                className="p-3 rounded-xl shadow-inner flex flex-col gap-2 text-sm text-foreground/90 transition-all"
              >
                {editingId === note.id ? (
                  <>
                    <textarea
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      className="w-full resize-none p-2 rounded-md border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <button
                      onClick={saveEdit}
                      className="self-end bg-primary text-primary-foreground px-3 py-1 rounded-md text-xs hover:brightness-105 transition"
                    >
                      Salvar
                    </button>
                  </>
                ) : (
                  <p className="whitespace-pre-wrap break-words">{note.content}</p>
                )}

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleEdit(note.id, note.content)}
                    className="text-muted-foreground hover:text-blue-500 transition"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(note.id)}
                    className="text-muted-foreground hover:text-red-500 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
