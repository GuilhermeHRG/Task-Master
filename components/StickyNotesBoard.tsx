"use client"

import { useState, useEffect, useRef } from "react"
import { DndProvider, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { StickyNote } from "./StickyNote"
import Header from "./Header"
import { NewNoteDialog } from "./NewNoteDialog"

interface Note {
  id: string
  content: string
  left: number
  top: number
}

export default function StickyNotesBoard() {
  const [notes, setNotes] = useState<Note[]>([])
  const [showModal, setShowModal] = useState(false)
  const boardRef = useRef<HTMLDivElement>(null)

  const [, drop] = useDrop(() => ({ accept: "sticky-note" }))

  useEffect(() => {
    const savedNotes = localStorage.getItem("sticky-notes")
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("sticky-notes", JSON.stringify(notes))
  }, [notes])

  useEffect(() => {
    if (boardRef.current) {
      drop(boardRef.current)
    }
  }, [drop])

  const addNote = (content: string) => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      content,
      left: 100,
      top: 100,
    }
    setNotes((prev) => [...prev, newNote])
  }

  const moveNote = (id: string, left: number, top: number) => {
    setNotes((prev) =>
      prev.map((note) => (note.id === id ? { ...note, left, top } : note))
    )
  }

  const updateNoteContent = (id: string, content: string) => {
    setNotes((prev) =>
      prev.map((note) => (note.id === id ? { ...note, content } : note))
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Header
        onAddNote={() => setShowModal(true)}
        onCustomize={() => {}}
        showCustomization={false}
      />

      <div
        ref={boardRef}
        className="relative w-full h-[calc(100vh-64px)] bg-gray-100 overflow-hidden"
      >
        {notes.map((note) => (
          <StickyNote
            key={note.id}
            id={note.id}
            content={note.content}
            left={note.left}
            top={note.top}
            onMove={moveNote}
            onUpdateContent={updateNoteContent}
          />
        ))}
      </div>

      <NewNoteDialog
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={addNote}
      />
    </DndProvider>
  )
}
