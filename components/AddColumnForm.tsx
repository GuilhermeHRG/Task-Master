"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function AddColumnForm({ onAdd, onCancel }) {
  const [title, setTitle] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (title.trim()) {
      onAdd(title)
      setTitle("")
    }
  }

  return (
    <Card className="w-72 p-3">
      <form onSubmit={handleSubmit} className="space-y-2">
        <Input placeholder="Título da coluna" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" size="sm">
            Adicionar
          </Button>
        </div>
      </form>
    </Card>
  )
}
