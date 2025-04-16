"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"

export default function TaskForm({ task, onSubmit, onCancel }) {
  const [taskData, setTaskData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    priority: task?.priority || "média",
    dueDate: task?.dueDate || "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setTaskData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setTaskData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!taskData.title.trim()) return
    onSubmit(taskData)
  }

  return (
    <Card className="p-3">
      <form onSubmit={handleSubmit} className="space-y-2">
        <Input
          name="title"
          placeholder="Título da tarefa"
          value={taskData.title}
          onChange={handleChange}
          autoFocus
          className="text-sm"
        />

        <Textarea
          name="description"
          placeholder="Descrição (opcional)"
          value={taskData.description}
          onChange={handleChange}
          className="text-sm min-h-[60px] resize-none"
        />

        <div className="flex gap-2">
          <Select value={taskData.priority} onValueChange={(value) => handleSelectChange("priority", value)}>
            <SelectTrigger className="text-xs h-8">
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alta">Alta</SelectItem>
              <SelectItem value="média">Média</SelectItem>
              <SelectItem value="baixa">Baixa</SelectItem>
            </SelectContent>
          </Select>

          <Input type="date" name="dueDate" value={taskData.dueDate} onChange={handleChange} className="text-xs h-8" />
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" size="sm">
            {task ? "Salvar" : "Adicionar"}
          </Button>
        </div>
      </form>
    </Card>
  )
}
