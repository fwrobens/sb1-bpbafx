"use client"

import { Button } from '@/components/ui/button'
import { formatDistanceToNow } from 'date-fns'

export function NoteList({ notes, searchQuery, onNoteSelect }) {
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="space-y-2">
      {filteredNotes.map(note => (
        <Button
          key={note.id}
          variant="ghost"
          className="w-full justify-start text-left"
          onClick={() => onNoteSelect(note)}
        >
          <div>
            <div className="font-semibold">{note.title}</div>
            <div className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
            </div>
          </div>
        </Button>
      ))}
    </div>
  )
}