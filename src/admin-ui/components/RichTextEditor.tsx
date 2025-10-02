import React, { useEffect, useRef } from 'react'

type Props = {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  className?: string
}

const buttonBase = 'px-2 py-1 text-sm border rounded-md hover:bg-gray-50'

export default function RichTextEditor({ value, onChange, placeholder = 'Write your content…', className = '' }: Props) {
  const editorRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = editorRef.current
    if (!el) return
    if (el.innerHTML !== (value || '')) {
      el.innerHTML = value || ''
    }
  }, [value])

  const exec = (cmd: string, v?: string) => {
    document.execCommand(cmd, false, v)
    if (editorRef.current) onChange(editorRef.current.innerHTML)
  }

  const addLink = () => {
    const url = window.prompt('Enter URL')
    if (url) exec('createLink', url)
  }

  const clear = () => {
    if (!editorRef.current) return
    editorRef.current.innerHTML = ''
    onChange('')
  }

  return (
    <div className={`border rounded-md ${className}`}>
      <div className="flex flex-wrap gap-2 p-2 border-b bg-gray-50">
        <button type="button" className={buttonBase} onClick={() => exec('formatBlock', '<h2>')}>H2</button>
        <button type="button" className={buttonBase} onClick={() => exec('formatBlock', '<h3>')}>H3</button>
        <button type="button" className={buttonBase} onClick={() => exec('bold')}>Bold</button>
        <button type="button" className={buttonBase} onClick={() => exec('italic')}>Italic</button>
        <button type="button" className={buttonBase} onClick={() => exec('underline')}>Underline</button>
        <button type="button" className={buttonBase} onClick={() => exec('insertUnorderedList')}>• List</button>
        <button type="button" className={buttonBase} onClick={() => exec('insertOrderedList')}>1. List</button>
        <button type="button" className={buttonBase} onClick={addLink}>Link</button>
        <button type="button" className={buttonBase} onClick={clear}>Clear</button>
      </div>
      <div
        ref={editorRef}
        className="min-h-[180px] p-3 focus:outline-none prose max-w-none"
        contentEditable
        onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
    </div>
  )
}
