"use client"

import { useState } from "react"
import Board from "@/components/Board"
import Header from "@/components/Header"
import CustomizationPanel from "@/components/CustomizationPanel"
import { KanbanProvider } from "@/context/KanbanContext"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

export default function Home() {
  const [showCustomization, setShowCustomization] = useState(false)

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <KanbanProvider>
        <div className="min-h-screen flex flex-col bg-background">
          <Header onCustomize={() => setShowCustomization(!showCustomization)} showCustomization={showCustomization} />
          <main className="flex-1 p-4 md:p-6 overflow-hidden">
            <Board />
          </main>
          {showCustomization && <CustomizationPanel onClose={() => setShowCustomization(false)} />}
        </div>
      </KanbanProvider>
    </ThemeProvider>
  )
}
