'use client'
import {
  EditorContent, useEditor
} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from "@tiptap/extension-character-count";
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import React, { useEffect } from 'react'
import {
  StrikethroughIcon,
  FontBoldIcon,
  FontItalicIcon,
  ListBulletIcon,
  UnderlineIcon,
} from '@radix-ui/react-icons';

interface TiptapProps {
  setEditor: (value: any) => void
}

const charLimit = 500

const Tiptap = ({setEditor}: TiptapProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit as any,
      Placeholder.configure({
        placeholder: 'Write match notes here...',
      }),
      CharacterCount.configure({
        limit: charLimit,
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Underline
    ],
    editorProps: {
      attributes: {
        class: "min-h-[100px] bg-neutral-900 p-3 shadow-md shadow-neutral-900 rounded-t-2xl overflow-y-auto"
      }
    },
    content: '<p></p>',
    editable: false,
  })

  useEffect(() => {
    setEditor(editor)
  }, [editor])

  return (
    <>
      {/* Toolbar */}
      {editor &&
        <div className="mb-5 flex 2xs:flex-row flex-col gap-3 rounded-xl bg-neutral-900 p-2 shadow-md shadow-neutral-900">
          <div className="flex flex-row gap-3">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`${editor.isActive('bold') ? 'is-active' : ''} hover:bg-neutral-700 rounded-md p-1`}
            >
              <FontBoldIcon/>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive('italic') ? 'is-active' : ''}
            >
              <FontItalicIcon/>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={editor.isActive('underline') ? 'is-active' : ''}
            >
              <UnderlineIcon/>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={editor.isActive('strike') ? 'is-active' : ''}
            >
              <StrikethroughIcon/>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
            >
              h1
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
            >
              h2
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive('bulletList') ? 'is-active' : ''}
            >
              <ListBulletIcon/>
            </button>
          </div>
          <div className="flex flex-row gap-1">
            <button
              onClick={() => editor.chain().focus().toggleHighlight({ color: '#DC262640' }).run()}
              className={editor.isActive('highlight', { color: '#DC262640' }) ? 'is-active' : ''}
            >
              <div className="h-5 w-5 rounded-full bg-red-600"></div>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHighlight({ color: '#f1e74040' }).run()}
              className={editor.isActive('highlight', { color: '#f1e74040' }) ? 'is-active' : ''}
            >
              <div className="h-5 w-5 rounded-full bg-yellow-400"></div>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHighlight({ color: '#2be22240' }).run()}
              className={editor.isActive('highlight', { color: '#2be22240' }) ? 'is-active' : ''}
            >
              <div className="h-5 w-5 rounded-full bg-green-600"></div>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHighlight({ color: '#2563eb40' }).run()}
              className={editor.isActive('highlight', { color: '#2563eb40' }) ? 'is-active' : ''}
            >
              <div className="h-5 w-5 rounded-full bg-blue-600"></div>
            </button>
          </div>
        </div>
      }
      <EditorContent editor={editor} />
      {editor &&
        <div className="rounded-b-2xl bg-neutral-900 p-3 text-xs text-gray-500 shadow-md shadow-neutral-900">
          {editor.storage.characterCount.characters()}/{charLimit} characters
        </div>
      }
    </>
  )
}

export default Tiptap