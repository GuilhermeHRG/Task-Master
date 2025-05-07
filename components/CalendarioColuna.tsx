"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useDragControls } from "framer-motion"
import { CalendarIcon, Clock, MapPin, Minus, Plus } from "lucide-react"

interface Evento {
    id: string
    summary: string
    location?: string
    start: { dateTime?: string; date?: string }
    end: { dateTime?: string; date?: string }
}

export function CalendarioColuna() {
    const [eventos, setEventos] = useState<Evento[]>([])
    const [erro, setErro] = useState("")
    const [minimized, setMinimized] = useState(false)
    const dragControls = useDragControls()
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const token = localStorage.getItem("google_calendar_token")
        if (!token) {
            setErro("Token não encontrado. Faça login com Google.")
            return
        }

        const fetchEventos = async () => {
            try {
                const res = await fetch(
                    `https://www.googleapis.com/calendar/v3/calendars/primary/events?orderBy=startTime&singleEvents=true&maxResults=10&timeMin=${new Date().toISOString()}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                const data = await res.json()
                if (data.error) throw new Error(data.error.message)
                setEventos(data.items || [])
            } catch (err: any) {
                setErro(err.message || "Erro ao buscar eventos.")
            }
        }

        fetchEventos()
    }, [])

    return (
        <div ref={containerRef} className="fixed inset-0 z-40 pointer-events-none select-none">
            <motion.div
                drag="x"
                dragListener={false}
                dragControls={dragControls}
                dragConstraints={containerRef}
                dragElastic={0.1}
                className="fixed z-50 bottom-4 right-6 bg-background/90 border border-border backdrop-blur-md 
                   rounded-2xl shadow-xl w-[95vw] max-w-sm pointer-events-auto"
            >
                <div
                    className="cursor-move bg-muted/70 px-4 py-3 flex justify-between items-center border-b border-border rounded-t-2xl"
                    onPointerDown={(e) => dragControls.start(e)}
                >
                    <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" />
                        Eventos
                    </h2>
                    <button
                        onClick={() => setMinimized(!minimized)}
                        className="text-muted-foreground hover:text-primary transition"
                    >
                        {minimized ? <Plus size={18} /> : <Minus size={18} />}
                    </button>
                </div>

                {!minimized && (
                    <div className="p-4 space-y-4 max-h-[40vh] overflow-y-auto">
                        {erro && (
                            <p className="text-sm text-red-500">{erro}</p>
                        )}

                        {eventos.length === 0 && !erro && (
                            <p className="text-sm text-muted-foreground">Nenhum evento encontrado.</p>
                        )}

                        {eventos.map((evento) => (
                            <div
                                key={evento.id}
                                className="bg-white dark:bg-zinc-800 p-3 rounded-xl shadow-inner flex flex-col gap-1 text-sm border border-border"
                            >
                                <p className="font-semibold">{evento.summary}</p>

                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                    <Clock className="w-4 h-4" />
                                    {formatarData(evento.start.dateTime || evento.start.date)}
                                </div>

                                {evento.location && (
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <MapPin className="w-4 h-4" />
                                        {evento.location}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    )
}

function formatarData(data?: string) {
    if (!data) return "Data não informada"
    const d = new Date(data)
    return d.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    })
}
