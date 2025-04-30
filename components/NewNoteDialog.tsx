import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
  import { Button } from "@/components/ui/button"
  import { Textarea } from "@/components/ui/textarea"
  import { Label } from "@/components/ui/label"
  import { Input } from "@/components/ui/input"
  import { useState } from "react"
  
  interface Props {
    open: boolean
    onClose: () => void
    onSave: (content: string, color: string) => void
  }
  
  export function NewNoteDialog({ open, onClose, onSave }: Props) {
    const [content, setContent] = useState("")
    const [color, setColor] = useState("#fef08a")
  
    const handleSave = () => {
      if (!content.trim()) return
      onSave(content.trim(), color)
      setContent("")
      setColor("#fef08a")
      onClose()
    }
  
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar nova nota</DialogTitle>
          </DialogHeader>
  
          <div className="space-y-4">
            <div>
              <Label>Conteúdo</Label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Digite sua nota..."
              />
            </div>
            <div>
              <Label>Cor</Label>
              <Input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-16 h-8 p-0 border-none"
              />
            </div>
          </div>
  
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!content.trim()}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
  