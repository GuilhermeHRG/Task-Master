"use client"

import { useState } from "react"
import { useKanban } from "@/context/KanbanContext"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"

export default function CustomizationPanel({ onClose }) {
  const { theme, updateTheme } = useKanban()
  const [localTheme, setLocalTheme] = useState(theme)

  const handleSave = () => {
    updateTheme(localTheme)
    onClose()
  }

  const colorSchemes = [
    { name: "Padrão", primary: "#0284c7", secondary: "#7c3aed" },
    { name: "Verde", primary: "#059669", secondary: "#0891b2" },
    { name: "Vermelho", primary: "#dc2626", secondary: "#ea580c" },
    { name: "Roxo", primary: "#7c3aed", secondary: "#db2777" },
    { name: "Azul", primary: "#2563eb", secondary: "#0891b2" },
  ]

  return (
    <Sheet open={true} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:max-w-[540px]">
        <SheetHeader className="mb-5">
          <SheetTitle className="text-xl">Personalizar Interface</SheetTitle>
          <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
            <X className="h-4 w-4" />
            <span className="sr-only">Fechar</span>
          </SheetClose>
        </SheetHeader>

        <Tabs defaultValue="colors">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="colors">Cores</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
          </TabsList>

          <TabsContent value="colors" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-3">Esquema de cores</h3>
                <RadioGroup
                  value={localTheme.colorScheme}
                  onValueChange={(value) => setLocalTheme({ ...localTheme, colorScheme: value })}
                  className="grid grid-cols-2 gap-2"
                >
                  {colorSchemes.map((scheme) => (
                    <div key={scheme.name} className="flex items-center space-x-2">
                      <RadioGroupItem value={scheme.name} id={scheme.name} />
                      <Label htmlFor={scheme.name} className="flex items-center gap-2">
                        {scheme.name}
                        <div className="flex gap-1">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: scheme.primary }} />
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: scheme.secondary }} />
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3">Estilo de cartão</h3>
                <RadioGroup
                  value={localTheme.cardStyle}
                  onValueChange={(value) => setLocalTheme({ ...localTheme, cardStyle: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="default" id="default-card" />
                    <Label htmlFor="default-card">Padrão</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="flat" id="flat-card" />
                    <Label htmlFor="flat-card">Plano</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bordered" id="bordered-card" />
                    <Label htmlFor="bordered-card">Com borda</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="layout" className="space-y-4 mt-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Espaçamento entre colunas</h3>
              <Slider
                defaultValue={[localTheme.columnGap || 16]}
                max={32}
                step={4}
                onValueChange={(value) => setLocalTheme({ ...localTheme, columnGap: value[0] })}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Compacto</span>
                <span>Espaçado</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Arredondamento dos cartões</h3>
              <Slider
                defaultValue={[localTheme.borderRadius || 8]}
                max={16}
                step={2}
                onValueChange={(value) => setLocalTheme({ ...localTheme, borderRadius: value[0] })}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Quadrado</span>
                <span>Arredondado</span>
              </div>
            </div>

            <div className="pt-2">
              <h3 className="text-sm font-medium mb-3">Largura das colunas</h3>
              <RadioGroup
                value={localTheme.columnWidth || "medium"}
                onValueChange={(value) => setLocalTheme({ ...localTheme, columnWidth: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="narrow" id="narrow-column" />
                  <Label htmlFor="narrow-column">Estreita</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium-column" />
                  <Label htmlFor="medium-column">Média</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="wide" id="wide-column" />
                  <Label htmlFor="wide-column">Larga</Label>
                </div>
              </RadioGroup>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Aplicar</Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
