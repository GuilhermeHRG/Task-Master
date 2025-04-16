"use client"

import { useState } from "react"
import { useKanban } from "@/context/KanbanContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Palette, Save, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export default function Header({ onCustomize, showCustomization }) {
  const { boardName, updateBoardName } = useKanban()
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [title, setTitle] = useState(boardName)
  const { theme, setTheme } = useTheme()

  const handleTitleSave = () => {
    if (title.trim()) {
      updateBoardName(title)
    } else {
      setTitle(boardName)
    }
    setIsEditingTitle(false)
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header className="border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {isEditingTitle ? (
            <div className="flex gap-2">
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
                className="w-[300px]"
              />
              <Button onClick={handleTitleSave} size="sm">
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
            </div>
          ) : (
            <h1 className="text-xl font-bold cursor-pointer" onClick={() => setIsEditingTitle(true)}>
              {boardName}
            </h1>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            title={theme === "dark" ? "Modo claro" : "Modo escuro"}
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant={showCustomization ? "default" : "outline"} onClick={onCustomize} className="gap-2">
            <Palette className="h-4 w-4" />
            Personalizar
          </Button>
        </div>
      </div>
    </header>
  )
}
