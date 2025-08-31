"use client";

import {useEditor, EditorContent} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {TextStyle} from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";

type Props = {
 content: string;
 onChange: (html: string) => void;
};

export default function RichTextEditor({content, onChange}: Props) {
 const editor = useEditor({
  extensions: [StarterKit, TextStyle, Color, Highlight],
  content,
  onUpdate: ({editor}) => {
   onChange(editor.getHTML()); 
  },
 });

 if (!editor) return null;

 return (
  <div className="border rounded-md p-2">
   {/* Toolbar */}
   <div className="flex flex-wrap gap-2 mb-2">
    <button
     onClick={() => editor.chain().focus().toggleBold().run()}
     className={`px-2 py-1 rounded ${
      editor.isActive("bold") ? "bg-gray-300" : "bg-gray-100"
     }`}
    >
     B
    </button>
    <button
     onClick={() => editor.chain().focus().toggleItalic().run()}
     className={`px-2 py-1 rounded ${
      editor.isActive("italic") ? "bg-gray-300" : "bg-gray-100"
     }`}
    >
     I
    </button>
    <button
     onClick={() => editor.chain().focus().toggleHighlight().run()}
     className={`px-2 py-1 rounded ${
      editor.isActive("highlight") ? "bg-yellow-300" : "bg-gray-100"
     }`}
    >
     Highlight
    </button>
    <input
     type="color"
     className="w-8 h-8 cursor-pointer"
     title="Text color"
     onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
    />
   </div>

   {/* Editor */}
   <EditorContent editor={editor} className="prose max-w-none h-fit" />
  </div>
 );
}
