"use client"

import { useEffect, useRef } from "react"

interface EditorProps {
  value: string
  onChange: (value: string) => void
}

export function Editor({ value, onChange }: EditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  return (
    <div
      ref={editorRef}
      contentEditable
      className="p-4 h-full outline-none prose prose-sm max-w-none"
      onInput={handleInput}
      dangerouslySetInnerHTML={{ __html: value }}
    />
  )
}

