"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { db } from '@/lib/firebase'
import { doc, setDoc, deleteDoc } from 'firebase/firestore'

export function NoteEditor({ note, userId }) {
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const [tags, setTags] = useState(note.tags?.join(', ') || '')
  const { toast } = useToast()

  useEffect(() => {
    setTitle(note.title)
    setContent(note.content)
    setTags(note.tags?.join(', ') || '')
  }, [note])

  const handleSave = async () => {
    const updatedNote = {
      title,
      content,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      userId,
      updatedAt: new Date().toISOString(),
    }

    try {
      if (note.id === 'new') {
        const newNoteRef = doc(collection(db, 'notes'))
        await setDoc(newNoteRef, updatedNote)
      } else {
        await setDoc(doc(db, 'notes', note.id), updatedNote, { merge: true })
      }
      toast({
        title: "Note Saved",
        description: "Your note has been successfully saved.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while saving the note.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    if (note.id === 'new') return

    try {
      await deleteDoc(doc(db, 'notes', note.id))
      toast({
        title: "Note Deleted",
        description: "Your note has been successfully deleted.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the note.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note title"
        className="text-lg font-semibold"
      />
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start typing your note..."
        className="min-h-[300px]"
      />
      <Input
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags (comma-separated)"
      />
      <div className="flex justify-between">
        <Button onClick={handleSave}>Save</Button>
        {note.id !== 'new' && (
          <Button variant="destructive" onClick={handleDelete}>Delete</Button>
        )}
      </div>
    </div>
  )
}