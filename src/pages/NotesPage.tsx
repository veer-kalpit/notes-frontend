// src/pages/NotesPage.tsx
import React, {useEffect, useState} from "react";
import {
 getNotes,
 createNote as createNoteApi,
 deleteNote as deleteNoteApi,
} from "../services/api";
import useAuth from "../hooks/useAuth";
import {useNavigate} from "react-router-dom";

interface Note {
 _id: string;
 text: string;
 createdAt: string;
}

export default function NotesPage() {
 const {user, loading} = useAuth();
 const navigate = useNavigate();
 const [notes, setNotes] = useState<Note[]>([]);
 const [text, setText] = useState("");
 const [error, setError] = useState<string | null>(null);
 const [busy, setBusy] = useState(false);

 useEffect(() => {
  if (!loading && !user) navigate("/auth");
 }, [user, loading, navigate]);

 useEffect(() => {
  if (user) fetchNotes();
 }, [user]);

 const fetchNotes = async () => {
  try {
   setBusy(true);
   const data = await getNotes();
   setNotes(data);
  } catch (err: any) {
   setError(err.response?.data?.error || "Failed to fetch notes");
  } finally {
   setBusy(false);
  }
 };

 const createNote = async () => {
  if (!text.trim()) return setError("Note cannot be empty");
  try {
   setError(null);
   await createNoteApi(text.trim());
   setText("");
   await fetchNotes();
  } catch (err: any) {
   setError(err.response?.data?.error || "Failed to create note");
  }
 };

 const deleteNote = async (id: string) => {
  try {
   await deleteNoteApi(id);
   setNotes((s) => s.filter((n) => n._id !== id));
  } catch (err: any) {
   setError(err.response?.data?.error || "Failed to delete note");
  }
 };

 return (
  <div className="max-w-4xl mx-auto p-4">
   <div className="bg-white rounded-lg shadow p-4 mb-4">
    <div className="flex flex-col sm:flex-row gap-2">
     <input
      className="flex-1 border rounded px-3 py-2"
      placeholder="Write a quick note..."
      value={text}
      onChange={(e) => setText(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && createNote()}
     />
     <button
      onClick={createNote}
      className="bg-blue-600 text-white px-4 rounded"
     >
      Add
     </button>
    </div>
    {error && <div className="mt-2 text-red-500">{error}</div>}
   </div>

   <div>
    <h2 className="text-lg font-semibold mb-2">My Notes</h2>
    {busy ? (
     <div className="text-slate-500">Loading...</div>
    ) : notes.length === 0 ? (
     <div className="text-slate-400">No notes yet — add your first.</div>
    ) : (
     <ul className="space-y-3">
      {notes.map((n) => (
       <li
        key={n._id}
        className="bg-white rounded p-3 shadow-sm flex items-start justify-between"
       >
        <div>
         <div className="text-slate-800">{n.text}</div>
         <div className="text-xs text-slate-400 mt-1">
          {new Date(n.createdAt).toLocaleString()}
         </div>
        </div>
        <div className="flex-shrink-0 ml-4">
         <button
          onClick={() => deleteNote(n._id)}
          className="text-red-500 text-sm"
         >
          Delete
         </button>
        </div>
       </li>
      ))}
     </ul>
    )}
   </div>
  </div>
 );
}
