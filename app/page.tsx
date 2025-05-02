"use client"

import { useState, useEffect } from "react"
import Header from "@/components/Header"
import Board from "@/components/Board"
import CustomizationPanel from "@/components/CustomizationPanel"
import { useKanban } from "@/app/contexts/KanbanContext"
import { NewNoteDialog } from "@/components/NewNoteDialog"
import { StickyNoteColumn } from "@/components/StickyNoteColumn"
import { db } from "@/app/lib/firebaseConfig"
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore"

interface Note {
  id: string
  content: string
  color: string
}

export default function Home() {
  const [showCustomization, setShowCustomization] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [notes, setNotes] = useState<Note[]>([])
  const { theme } = useKanban()

  useEffect(() => {
    document.body.setAttribute("data-color-scheme", theme.colorScheme)
    return () => {
      document.body.removeAttribute("data-color-scheme")
    }
  }, [theme.colorScheme])

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "sticky-notes"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as { content: string; color: string })
      }))
      setNotes(data)
    })
    return () => unsubscribe()
  }, [])

  const addNote = async (content: string, color: string) => {
    await addDoc(collection(db, "sticky-notes"), { content, color })
  }

  const deleteNote = async (id: string) => {
    await deleteDoc(doc(db, "sticky-notes", id))
  }

  const editNote = async (id: string, content: string) => {
    await updateDoc(doc(db, "sticky-notes", id), { content })
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header
        onCustomize={() => setShowCustomization(!showCustomization)}
        showCustomization={showCustomization}
        onAddNote={() => setShowModal(true)}
      />

      <main className="flex-1 px-2 py-4 sm:px-4 md:px-6 overflow-hidden">
        <Board />
      </main>

      <NewNoteDialog
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={addNote}
      />

      <StickyNoteColumn
        notes={notes}
        onDelete={deleteNote}
        onEdit={editNote}
      />

      {showCustomization && (
        <CustomizationPanel onClose={() => setShowCustomization(false)} />
      )}
    </div>
  )
}
