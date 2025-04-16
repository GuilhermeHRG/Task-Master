"use client"

import { useState } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { TouchBackend } from "react-dnd-touch-backend"
import { useKanban } from "@/context/KanbanContext"
import Column from "./Column"
import AddColumnForm from "./AddColumnForm"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { isMobile } from "@/hooks/use-mobile"

export default function Board() {
  const { columns, addColumn, theme } = useKanban()
  const [showAddColumn, setShowAddColumn] = useState(false)
  const mobile = isMobile()
  const backend = mobile ? TouchBackend : HTML5Backend

  return (
    <DndProvider backend={backend}>
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-x-auto">
          <div
            className="flex gap-4 h-full pb-4"
            style={{
              minHeight: "calc(100vh - 180px)",
            }}
          >
            {columns.map((column) => (
              <Column key={column.id} column={column} />
            ))}

            {showAddColumn ? (
              <AddColumnForm
                onAdd={(title) => {
                  addColumn(title)
                  setShowAddColumn(false)
                }}
                onCancel={() => setShowAddColumn(false)}
              />
            ) : (
              <Button
                variant="outline"
                className="h-min whitespace-nowrap flex items-center gap-2 mt-1"
                onClick={() => setShowAddColumn(true)}
              >
                <Plus size={16} />
                Adicionar Coluna
              </Button>
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  )
}
