import { useEditor, EditorContent, HTMLContent } from '@tiptap/react';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import Image from '@tiptap/extension-image';
import StarterKit from '@tiptap/starter-kit';

import MenuBar from './menu-bar';

interface TiptapEditorProps {
  content?: HTMLContent;
  onChange?(value: string): void;
  editable?: boolean;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({ content, onChange, editable = true }) => {
  const editor = useEditor({
    editable,
    extensions: [
      Underline,
      Youtube,
      Image,
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph', 'youtube'],
      }),
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-base dark:prose-invert focus:outline-none rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[20rem] pt-16 max-w-full',
      },
    },
    content,
    onUpdate: ({ editor }) => {
      onChange && onChange(editor.getHTML());
    }
  });

  return (
    <div className='space-y-2 relative'>
      {
        editable &&
        <div className='absolute top-0 z-10 border-b w-full'>
          <MenuBar
            className='w-fit'
            editor={editor} />
        </div>
      }
      <EditorContent editor={editor} />
    </div>
  )
}

export default TiptapEditor;
