"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { NoteEditor } from '@/components/note-editor'
import { NoteList } from '@/components/note-list'
import { TagList } from '@/components/tag-list'
import { ThemeToggle } from '@/components/theme-toggle'
import { useAuth } from '@/components/auth-provider'
import { db } from '@/lib/firebase'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { UserNav } from '@/components/user-nav'

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedNote, setSelectedNote] = useState(null)
  const [notes, setNotes] = useState([])
  const [tags, setTags] = useState([])
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    const notesQuery = query(collection(db, 'notes'), where('userId', '==', user.uid))
    const unsubscribe = onSnapshot(notesQuery, (snapshot) => {
      const notesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setNotes(notesData)
      const uniqueTags = [...new Set(notesData.flatMap(note => note.tags || []))]
      setTags(uniqueTags)
    })

    return () => unsubscribe()
  }, [user, router])

  // Rest of the component code...
}