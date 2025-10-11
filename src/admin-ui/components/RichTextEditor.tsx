import { useEffect, useRef, useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Heading from '@tiptap/extension-heading'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import DOMPurify from 'dompurify'

type Props = {
  valueJson?: any
  valueHtml?: string
  onChange: (json: any, html: string, plainText: string) => void
  placeholder?: string
  className?: string
}

const buttonBase = 'px-2 py-1 text-sm border rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500';
const activeBtn  = 'bg-blue-100 text-blue-700 border-blue-400 ring-1 ring-blue-300'

export default function RichTextEditor({ valueJson, valueHtml, onChange, placeholder = 'Write your article…', className = '' }: Props) {
  const toolbarRef = useRef<HTMLDivElement | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [BubbleMenuCmp, setBubbleMenuCmp] = useState<any>(null)
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false }),
      Heading.configure({ levels: [2, 3] }),
      Placeholder.configure({ placeholder }),
      Underline,
      Link.configure({ openOnClick: false }),
    ],
    content: valueJson ? valueJson : (valueHtml || ''),
    onUpdate: ({ editor }) => {
      const json = editor.getJSON()
      const htmlUnsafe = editor.getHTML()
      const html = DOMPurify.sanitize(htmlUnsafe)
      const text = editor.getText()
      onChange(json, html, text)
    },
    editorProps: {
      attributes: {
        role: 'textbox',
        'aria-multiline': 'true',
        class: 'min-h-[180px] p-3 focus:outline-none prose max-w-none',
      },
    },
  })

  // Dynamically import BubbleMenu to avoid named export checks during build
  useEffect(() => {
    let mounted = true
    import('@tiptap/react')
      .then((mod: any) => {
        if (mounted) setBubbleMenuCmp(mod?.BubbleMenu ?? null)
      })
      .catch(() => {
        if (mounted) setBubbleMenuCmp(null)
      })
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (!editor) return
    // Determine if incoming content differs before applying
    const current = editor.getJSON()
    const incoming = valueJson || null
    if (incoming && JSON.stringify(current) !== JSON.stringify(incoming)) {
      editor.commands.setContent(incoming)
      return
    }
    if (!incoming && typeof valueHtml === 'string') {
      const html = valueHtml || ''
      // Only set if HTML changed (rough check)
      const currentHtml = editor.getHTML()
      if (currentHtml !== html) editor.commands.setContent(html)
    }
  }, [valueJson, valueHtml, editor])

  // Sticky toolbar shadow toggler
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const obs = new IntersectionObserver(
      (entries) => {
        const e = entries[0]
        setScrolled(!e.isIntersecting)
      },
      { root: null, threshold: 1 }
    )
    obs.observe(sentinel); return () => obs.disconnect()
  }, [])

  // Allow Esc to dismiss bubble menu (blur selection)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        editor?.commands.blur()
      }
    }
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey)
  }, [editor])

  const toggleLink = () => {
    if (!editor) return
    const previousUrl = editor.getAttributes('link').href || ''
    const url = window.prompt('Enter URL', previousUrl)
    if (url === null) return // cancel
    if (url === '') {
      editor.chain().focus().unsetLink().run()
      return
    }
    const newTab = window.confirm('Open in a new tab?')
    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url, target: newTab ? '_blank' : undefined })
      .run()
  }

  if (!editor) return <div className={`border rounded-md ${className}`}><div className="p-3 text-sm text-gray-500">Loading editor…</div></div>
  return (
    <div className={`border rounded-md ${className}`}>
      <div
        ref={toolbarRef}
        role="toolbar"
        aria-label="Rich text editor toolbar"
        data-scrolled={scrolled}
        className="flex flex-wrap gap-2 p-2 sticky top-0 z-30 bg-white/85 backdrop-blur-sm border-b transition-shadow data-[scrolled=true]:shadow-md"
      >
        {/* Heading toggles as Aa icons */}
        <button
          type="button"
          className={`${buttonBase} ${editor.isActive('paragraph') ? 'bg-blue-100 text-blue-700 border-blue-400' : ''}`}
          aria-label="Paragraph"
          title="Paragraph"
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          <span className="text-sm">Aa</span>
        </button>
        <button
          type="button"
          className={`${buttonBase} ${editor.isActive('heading', { level: 3 }) ? 'bg-blue-100 text-blue-700 border-blue-400' : ''}`}
          aria-label="Heading 3"
          title="Heading 3"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <span className="text-base font-semibold leading-none">Aa</span>
        </button>
        <button
          type="button"
          className={`${buttonBase} ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-100 text-blue-700 border-blue-400' : ''}`}
          aria-label="Heading 2"
          title="Heading 2"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <span className="text-xl font-bold leading-none">Aa</span>
        </button>

        {/* Inline formatting */}
        <button type="button" className={`${buttonBase} ${editor.isActive('bold') ? 'bg-blue-100 text-blue-700 border-blue-400' : ''}`} aria-label="Bold" title="Bold" onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
        <button type="button" className={`${buttonBase} ${editor.isActive('italic') ? 'bg-blue-100 text-blue-700 border-blue-400' : ''}`} aria-label="Italic" title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()}><span className="italic">I</span></button>
        <button type="button" className={`${buttonBase} ${editor.isActive('underline') ? 'bg-blue-100 text-blue-700 border-blue-400' : ''}`} aria-label="Underline" title="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()}><span className="underline">U</span></button>
        <button type="button" className={`${buttonBase} ${editor.isActive('strike') ? 'bg-blue-100 text-blue-700 border-blue-400' : ''}`} aria-label="Strikethrough" title="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()}><span className="line-through">S</span></button>

        {/* Lists and quote */}
        <button type="button" className={`${buttonBase} ${editor.isActive('bulletList') ? 'bg-blue-100 text-blue-700 border-blue-400' : ''}`} aria-label="Bulleted list" title="Bulleted list" onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
        <button type="button" className={`${buttonBase} ${editor.isActive('orderedList') ? 'bg-blue-100 text-blue-700 border-blue-400' : ''}`} aria-label="Numbered list" title="Numbered list" onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</button>
        <button type="button" className={`${buttonBase} ${editor.isActive('blockquote') ? 'bg-blue-100 text-blue-700 border-blue-400' : ''}`} aria-label="Blockquote" title="Blockquote" onClick={() => editor.chain().focus().toggleBlockquote().run()}>Quote</button>

        {/* Link + Clear */}
        <button type="button" className={buttonBase} aria-label="Insert link" title="Insert link" onClick={toggleLink}>Link</button>
        <button type="button" className={buttonBase} aria-label="Clear formatting" title="Clear formatting" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>Clear</button>
      </div>
      {/* Sentinel to detect scroll past the top of content */}
      <div ref={sentinelRef} style={{ position: 'relative', top: -1, height: 1, width: 1 }} />

      {/* Bubble Menu for quick formatting */}
      {editor && BubbleMenuCmp && (
        <BubbleMenuCmp
          editor={editor}
          tippyOptions={{ placement: 'bottom', interactive: true, offset: [0, 8], zIndex: 50 }}
          className="rounded-lg border bg-white shadow-md p-1 flex gap-1"
        >
          <button type="button" className={`${buttonBase} ${editor.isActive('bold') ? activeBtn : ''}`} aria-label="Bold" title="Bold" onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
          <button type="button" className={`${buttonBase} ${editor.isActive('italic') ? activeBtn : ''}`} aria-label="Italic" title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()}><span className="italic">I</span></button>
          <button type="button" className={`${buttonBase} ${editor.isActive('underline') ? activeBtn : ''}`} aria-label="Underline" title="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()}><span className="underline">U</span></button>
          <button type="button" className={buttonBase} aria-label="Insert link" title="Insert link" onClick={toggleLink}>Link</button>
          <button type="button" className={`${buttonBase} ${editor.isActive('paragraph') ? activeBtn : ''}`} aria-label="Paragraph" title="Paragraph" onClick={() => editor.chain().focus().setParagraph().run()}><span className="text-sm">Aa</span></button>
          <button type="button" className={`${buttonBase} ${editor.isActive('heading', { level: 3 }) ? activeBtn : ''}`} aria-label="Heading 3" title="Heading 3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><span className="text-base font-semibold leading-none">Aa</span></button>
          <button type="button" className={`${buttonBase} ${editor.isActive('heading', { level: 2 }) ? activeBtn : ''}`} aria-label="Heading 2" title="Heading 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><span className="text-xl font-bold leading-none">Aa</span></button>
        </BubbleMenuCmp>
      )}
      <EditorContent editor={editor} className="tiptap prose prose-slate max-w-none" />
    </div>
  )
}












