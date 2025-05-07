"use client"

import { useState, useEffect } from "react"
import { useKanban } from "@/app/contexts/KanbanContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Palette, Save, StickyNote, Calendar } from "lucide-react"
import { UserNav } from "@/components/user-nav"
import { useSession } from "next-auth/react"

interface HeaderProps {
  onCustomize: () => void
  showCustomization: boolean
  onAddNote: () => void
}

export default function Header({ onCustomize, showCustomization, onAddNote }: HeaderProps) {
  const { boardName, updateBoardName } = useKanban()
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [title, setTitle] = useState(boardName)
  const { data: session } = useSession()

  useEffect(() => {
    setTitle(boardName)
  }, [boardName])

  const handleTitleSave = () => {
    if (title.trim()) {
      updateBoardName(title)
    } else {
      setTitle(boardName)
    }
    setIsEditingTitle(false)
  }

  const email = session?.user?.email

  const abrirNovoEvento = () => {
    const titulo = "Digite aqui o título do evento"
    const descricao = "Descrição do evento"
    const local = "Local do evento"

    const inicio = new Date()
    const fim = new Date(inicio.getTime() + 60 * 60 * 1000)

    const formatData = (d: Date) =>
      d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"

    const url = `https://calendar.google.com/calendar/u/0/r/eventedit?text=${encodeURIComponent(
      titulo
    )}&dates=${formatData(inicio)}/${formatData(fim)}&details=${encodeURIComponent(
      descricao
    )}&location=${encodeURIComponent(local)}`

    window.open(url, "_blank")
  }


  return (
    <header className="border-b bg-background">
      <div className="container flex flex-col sm:flex-row sm:h-16 gap-2 sm:gap-4 sm:items-center justify-between px-4 py-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          {isEditingTitle ? (
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                onBlur={handleTitleSave}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleTitleSave()
                  if (e.key === "Escape") {
                    setTitle(boardName)
                    setIsEditingTitle(false)
                  }
                }}
                className="w-full sm:w-[300px]"
              />
              <Button onClick={handleTitleSave} size="sm">
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
            </div>
          ) : (
            <h1
              className="text-xl font-bold cursor-pointer text-start uppercase text-foreground"
              onClick={() => setIsEditingTitle(true)}
            >
              {boardName}
            </h1>
          )}
        </div>

        <div className="flex justify-between items-center gap-2">
          <Button variant="outline" onClick={onAddNote} className="gap-2 w-full sm:w-auto">
            <StickyNote className="h-4 w-4" />
            Nova Nota
          </Button>

          

          <Button
            variant="outline"
            className="gap-2 w-full sm:w-auto"
            onClick={abrirNovoEvento}
          >
            <Calendar className="h-4 w-4" />
            Novo Evento
          </Button>
          <Button
            variant={showCustomization ? "default" : "outline"}
            onClick={onCustomize}
            className="gap-2 w-full sm:w-auto"
          >
            <Palette className="h-4 w-4" />
            Personalizar
          </Button>

          <div className="w-full sm:w-auto max-sm:ml-8">
            <UserNav />
          </div>
        </div>
      </div>
    </header>
  )
}
