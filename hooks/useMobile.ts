"use client"

import { useState, useEffect } from "react"

export const isMobile = () => {
  // Inicializar com false para evitar erros de hidratação
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    // Verificar se estamos no navegador
    if (typeof window === "undefined") return

    function handleResize() {
      setMobile(window.innerWidth <= 768)
    }

    // Definir o valor inicial
    handleResize()

    // Adicionar listener para redimensionamento
    window.addEventListener("resize", handleResize)

    // Limpar listener ao desmontar
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return mobile
}

export default isMobile
