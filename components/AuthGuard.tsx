"use client"

import { useAuth } from "@/app/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/login")
        }
    }, [loading, user, router])

    if (loading) {
        return <p className="text-muted-foreground text-sm p-4">Carregando autenticação...</p>
    }

    if (!user) {
        return null // ou uma tela de bloqueio temporária
    }

    return <>{children}</>
}
