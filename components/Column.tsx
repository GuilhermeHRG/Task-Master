"use client"

import { useState } from "react"
import { useDrop } from "react-dnd"
import { useKanban } from "@/context/KanbanContext"
import Card from "./Card"
import TaskForm from "./TaskForm"
import { MoreHorizontal, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function Column({ column }) {
  const { moveTask, addTask, deleteColumn, updateColumn } = useKanban()
  const [showAddTask, setShowAddTask] = useState(false)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [title, setTitle] = useState(column.title)

  const [{ isOver }, drop] = useDrop({
    accept: "TASK",
    drop: (item) => {
      moveTask(item.id, item.columnId, column.id)
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  })

  const handleTitleSave = () => {
    if (title.trim()) {
      updateColumn(column.id, { title })
    } else {
      setTitle(column.title)
    }
    setIsEditingTitle(false)
  }

  return (
    <div
      ref={drop}
      className={`flex-shrink-0 w-72 flex flex-col rounded-lg bg-muted/50 ${isOver ? "border-2 border-primary" : ""}`}
    >
      <div className="p-3 flex items-center justify-between border-b">
        {isEditingTitle ? (
          <div className="flex w-full gap-1">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              onBlur={handleTitleSave}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleTitleSave()
                if (e.key === "Escape") {
                  setTitle(column.title)
                  setIsEditingTitle(false)
                }
              }}
              className="h-7 py-1"
            />
          </div>
        ) : (
          <div className="font-medium flex items-center gap-2 cursor-pointer" onClick={() => setIsEditingTitle(true)}>
            {column.title}
            <Badge variant="outline" className="text-xs">
              {column.tasks.length}
            </Badge>
          </div>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEditingTitle(true)}>Renomear</DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => deleteColumn(column.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2">
        {column.tasks.map((task) => (
          <Card key={task.id} task={task} columnId={column.id} />
        ))}
      </div>

      <div className="p-2">
        {showAddTask ? (
          <TaskForm
            onSubmit={(taskData) => {
              addTask(column.id, taskData)
              setShowAddTask(false)
            }}
            onCancel={() => setShowAddTask(false)}
          />
        ) : (
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground"
            onClick={() => setShowAddTask(true)}
          >
            <Plus size={16} className="mr-2" />
            Adicionar Tarefa
          </Button>
        )}
      </div>
    </div>
  )
}
