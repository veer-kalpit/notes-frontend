import {Trash} from "lucide-react";
import {useEffect, useState} from "react";
import {getAllNotes, createNote, updateNote, deleteNote} from "../services/api";

type Note = {
 _id: string;
 text: string;
};

const Dashboard = () => {
 const [notes, setNotes] = useState<Note[]>([]);
 const [editingId, setEditingId] = useState<string | null>(null);
 const [editText, setEditText] = useState<string>("");
 const [updating, setUpdating] = useState(false);
 const [loading, setLoading] = useState(false);
 const [newNote, setNewNote] = useState("");
 const [creating, setCreating] = useState(false);
 const [error, setError] = useState("");

 useEffect(() => {
  fetchNotes();
 }, []);

 const fetchNotes = async () => {
  setLoading(true);
  setError("");
  try {
   const data = await getAllNotes();
   const notesArray = Array.isArray(data?.notes) ? data.notes : data;

  setNotes(
   Array.isArray(notesArray)
    ? notesArray.map((n: any) => ({
       _id: n._id,
       text: n.text || n.content || "",
      }))
    : []
  );
  } catch {
   setError("Failed to load notes");
  } finally {
   setLoading(false);
  }
 };

 const handleCreateNote = async () => {
  if (!newNote.trim()) return;
  setCreating(true);
  setError("");
  try {
   const created = await createNote({content: newNote.trim()});
   const note = created?.note || created;

   setNotes((prev) => [
    {
     _id: note?._id || Math.random().toString(),
     text: note?.text || note?.content || newNote.trim(),
    },
    ...prev,
   ]);
   setNewNote("");
  } catch {
   setError("Failed to create note");
  } finally {
   setCreating(false);
  }
 };

 const handleDeleteNote = async (id: string) => {
  setError("");
  try {
   await deleteNote(id);
   setNotes((prev) => prev.filter((n) => n._id !== id));
  } catch {
   setError("Failed to delete note");
  }
 };

 const handleEditNote = (id: string, text: string) => {
  setEditingId(id);
  setEditText(text);
 };

 const handleUpdateNote = async (id: string) => {
  if (!editText.trim()) return;
  setUpdating(true);
  setError("");
  try {
   const updated = await updateNote(id, {content: editText.trim()});
   const note = updated?.note || updated;

   setNotes((prev) =>
    prev.map((n) =>
     n._id === id
      ? {
         ...n,
         text: note?.text || note?.content || editText.trim(),
        }
      : n
    )
   );
   setEditingId(null);
   setEditText("");
  } catch {
   setError("Failed to update note");
  } finally {
   setUpdating(false);
  }
 };

 return (
  <div className="min-h-screen bg-white p-4">
   {/* Header */}
   <div className="flex justify-between items-center mb-6">
    <div className="flex items-center gap-2">
     <div className="w-6 h-6 rounded-full border-4 border-blue-500 animate-spin"></div>
     <span className="font-semibold text-lg">Dashboard</span>
    </div>
    <a href="#" className="text-blue-500 font-medium text-sm">
     Sign Out
    </a>
   </div>

   {/* Welcome Box */}
   <div className="bg-gray-100 p-4 rounded-lg shadow-sm mb-6">
    <h2 className="text-lg font-semibold">Welcome, Jonas Khanwald !</h2>
    <p className="text-gray-500 text-sm">Email: xxxxxx@xxxx.com</p>
   </div>

   {/* Create Note Input */}
   <div className="flex gap-2 mb-4">
    <input
     className="flex-1 border rounded-md px-3 py-2"
     placeholder="Write a note..."
     value={newNote}
     onChange={(e) => setNewNote(e.target.value)}
     onKeyDown={(e) => {
      if (e.key === "Enter") handleCreateNote();
     }}
     disabled={creating}
    />
    <button
     className="bg-blue-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-600 transition"
     onClick={handleCreateNote}
     disabled={creating}
    >
     {creating ? "Adding..." : "Add"}
    </button>
   </div>

   {/* Error */}
   {error && <div className="text-red-500 mb-2">{error}</div>}

   {/* Notes List */}
   <div className="space-y-3">
    {loading ? (
     <div>Loading notes...</div>
    ) : notes.length === 0 ? (
     <div className="text-gray-400">No notes yet.</div>
    ) : (
     notes.map((note) => (
      <div
       key={note._id}
       className="flex justify-between items-center bg-gray-100 p-3 rounded-md shadow-sm"
      >
       {editingId === note._id ? (
        <>
         <input
          className="flex-1 border rounded-md px-2 py-1 mr-2"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={(e) => {
           if (e.key === "Enter") handleUpdateNote(note._id);
           if (e.key === "Escape") {
            setEditingId(null);
            setEditText("");
           }
          }}
          disabled={updating}
          autoFocus
          placeholder="Edit note"
          title="Edit note"
         />
         <button
          className="bg-green-500 text-white px-2 py-1 rounded mr-1 text-xs font-semibold hover:bg-green-600"
          onClick={() => handleUpdateNote(note._id)}
          disabled={updating}
         >
          {updating ? "Saving..." : "Save"}
         </button>
         <button
          className="bg-gray-300 text-gray-700 px-2 py-1 rounded text-xs font-semibold hover:bg-gray-400"
          onClick={() => {
           setEditingId(null);
           setEditText("");
          }}
          disabled={updating}
         >
          Cancel
         </button>
        </>
       ) : (
        <>
         <span
          className="flex-1 cursor-pointer"
          onClick={() => handleEditNote(note._id, note.text)}
         >
          {note.text}
         </span>
         <Trash
          className="w-4 h-4 text-gray-500 cursor-pointer hover:text-red-500 ml-2"
          onClick={() => handleDeleteNote(note._id)}
         />
        </>
       )}
      </div>
     ))
    )}
   </div>
  </div>
 );
};

export default Dashboard;
