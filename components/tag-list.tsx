"use client"

import { Badge } from '@/components/ui/badge'

export function TagList({ tags }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(tag => (
        <Badge key={tag} variant="secondary">{tag}</Badge>
      ))}
    </div>
  )
}