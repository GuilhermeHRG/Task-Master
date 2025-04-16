"use client"

import { useState } from "react"
import { useDrag } from "react-dnd"
import { useKanban } from "@/context/KanbanContext"
import TaskForm from "./TaskForm"
import { Calendar, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { Card as CardUI, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function Card({ task, columnId }) {
  const { deleteTask, updateTask } = useKanban()
  const [isEditing, setIsEditing] = useState(false)

  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { id: task.id, columnId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  })

  if (isEditing) {
    return (
      <TaskForm
        task={task}
        onSubmit={(taskData) => {
          updateTask(columnId, task.id, taskData)
          setIsEditing(false)
        }}
        onCancel={() => setIsEditing(false)}
      />
    )
  }

  const priorityColors = {
    alta: "bg-red-500",
    média: "bg-yellow-500",
    baixa: "bg-green-500",
  }

  return (
    <CardUI
      ref={drag}
      className={cn("cursor-grab shadow-sm hover:shadow-md transition-shadow", isDragging ? "opacity-50" : "")}
    >
      <CardHeader className="p-3 pb-0 flex flex-row items-start justify-between space-y-0">
        <div className="font-medium">{task.title}</div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEditing(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => deleteTask(columnId, task.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-3 pt-1">
        {task.description && <p className="text-sm text-muted-foreground">{task.description}</p>}
      </CardContent>
      <CardFooter className="p-3 pt-0 flex flex-wrap gap-2">
        {task.priority && (
          <Badge variant="secondary" className={cn("text-xs text-white", priorityColors[task.priority])}>
            {task.priority}
          </Badge>
        )}
        {task.dueDate && (
          <Badge variant="outline" className="text-xs flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(task.dueDate).toLocaleDateString()}
          </Badge>
        )}
      </CardFooter>
    </CardUI>
  )
}
