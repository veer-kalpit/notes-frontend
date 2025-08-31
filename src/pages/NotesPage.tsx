import {Trash, ArrowLeft} from "lucide-react";
import {useEffect, useState} from "react";
import {getAllNotes, createNote, updateNote, deleteNote} from "../services/api";
import RichTextEditor from "../components/RichTextEditor";

type Note = {
 _id: string;
 heading: string;
 content: string;
};

const Dashboard = () => {
 const [notes, setNotes] = useState<Note[]>([]);
 const [selectedNote, setSelectedNote] = useState<Note | null>(null);
 const [editing, setEditing] = useState(false);
 const [editHeading, setEditHeading] = useState("");
 const [editContent, setEditContent] = useState("");
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");

 // New note creation states
 const [adding, setAdding] = useState(false);
 const [newHeading, setNewHeading] = useState("");
 const [newContent, setNewContent] = useState("");
 const [creating, setCreating] = useState(false);

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
        heading: n.heading || "Untitled",
        content: n.content || "",
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
  if (!newHeading.trim() || !newContent.trim()) return;
  setCreating(true);
  setError("");
  try {
   const created = await createNote({
    heading: newHeading.trim(),
    content: newContent.trim(),
   });
   const note = created?.note || created;

   const newNoteObj: Note = {
    _id: note?._id || Math.random().toString(),
    heading: note?.heading || newHeading.trim(),
    content: note?.content || newContent.trim(),
   };

   setNotes((prev) => [newNoteObj, ...prev]);
   setSelectedNote(newNoteObj);
   setNewHeading("");
   setNewContent("");
   setAdding(false);
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
   if (selectedNote?._id === id) setSelectedNote(null);
  } catch {
   setError("Failed to delete note");
  }
 };

 const handleSaveEdit = async () => {
  if (!selectedNote || !editHeading.trim() || !editContent.trim()) return;
  try {
   const updated = await updateNote(selectedNote._id, {
    heading: editHeading.trim(),
    content: editContent.trim(),
   });
   const note = updated?.note || updated;

   const updatedNote: Note = {
    ...selectedNote,
    heading: note?.heading || editHeading.trim(),
    content: note?.content || editContent.trim(),
   };

   setNotes((prev) =>
    prev.map((n) => (n._id === selectedNote._id ? updatedNote : n))
   );
   setSelectedNote(updatedNote);
   setEditing(false);
  } catch {
   setError("Failed to update note");
  }
 };

 return (
  <div className="min-h-screen bg-white p-4">
   {/* Header */}
   <div className="flex justify-between items-center mb-6">
    <div className="flex items-center gap-2">
     <div className="w-8 h-8 rounded-full">
      <img src="/logo.png" alt="logo" />
     </div>
     <span className="font-bold text-[30px]">Dashboard</span>
    </div>
    <button
     className="text-blue-500 font-medium text-sm"
     onClick={() => {
      localStorage.clear();
      window.location.reload();
     }}
    >
     Sign Out
    </button>
   </div>

   {/* Welcome */}
   <div className="bg-gray-100 p-4 rounded-lg mb-6 border border-[#D9D9D9] shadow">
    <h2 className="text-2xl font-bold">
     Welcome, {localStorage.getItem("name") || "User"} !
    </h2>
    <p className="text-gray-500 text-sm">
     Email: {localStorage.getItem("email") || "unknown"}
    </p>
   </div>

   {error && <div className="text-red-500 mb-2">{error}</div>}

   {/* Desktop: Two-column layout */}
   <div className="hidden md:grid grid-cols-2 gap-6">
    {/* Left */}
    <div className="bg-gray-50 p-4 rounded-lg shadow-sm h-[70vh] overflow-y-auto flex flex-col">
     <button
      className="bg-blue-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-600 mb-4"
      onClick={() => {
       setAdding(true);
       setSelectedNote(null);
       setEditing(false);
       setNewHeading("");
       setNewContent("");
      }}
     >
      Add Note
     </button>

     {loading ? (
      <div>Loading notes...</div>
     ) : notes.length === 0 ? (
      <div className="text-gray-400">No notes yet.</div>
     ) : (
      notes.map((note) => (
       <div
        key={note._id}
        onClick={() => {
         setSelectedNote(note);
         setEditing(false);
         setAdding(false);
        }}
        className={`flex justify-between items-center p-3 rounded-md cursor-pointer mb-2 ${
         selectedNote?._id === note._id
          ? "bg-blue-100 border border-blue-400"
          : "bg-white hover:bg-gray-100"
        }`}
       >
        <span className="truncate font-semibold">{note.heading}</span>
        <Trash
         className="w-4 h-4 text-gray-500 hover:text-red-500 ml-2"
         onClick={(e) => {
          e.stopPropagation();
          handleDeleteNote(note._id);
         }}
        />
       </div>
      ))
     )}
    </div>

    {/* Right */}
    <div className="bg-gray-50 p-4 rounded-lg shadow-sm h-[70vh]">
     {adding ? (
      <div className="flex flex-col h-full">
       <input
        className="border rounded-md px-3 py-2 mb-3"
        placeholder="Note heading..."
        value={newHeading}
        onChange={(e) => setNewHeading(e.target.value)}
        disabled={creating}
       />
       <RichTextEditor content={newContent} onChange={setNewContent} />
       <div className="flex gap-2 mt-3">
        <button
         className="bg-blue-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-600"
         onClick={handleCreateNote}
         disabled={creating}
        >
         {creating ? "Saving..." : "Save"}
        </button>
        <button
         className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
         onClick={() => setAdding(false)}
        >
         Cancel
        </button>
       </div>
      </div>
     ) : selectedNote ? (
      editing ? (
       <div className="flex flex-col h-full">
        <input
         className="border rounded-md px-3 py-2 mb-3"
         value={editHeading}
         onChange={(e) => setEditHeading(e.target.value)}
         placeholder="Edit heading..."
        />
        <RichTextEditor content={editContent} onChange={setEditContent} />
        <div className="flex gap-2 mt-3">
         <button
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          onClick={handleSaveEdit}
         >
          Save
         </button>
         <button
          className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
          onClick={() => setEditing(false)}
         >
          Cancel
         </button>
        </div>
       </div>
      ) : (
       <div className="flex flex-col h-full overflow-hidden">
        <h3 className="text-xl font-bold mb-2">{selectedNote.heading}</h3>
        <div
         className="flex-1 prose max-w-none overflow-y-auto break-words whitespace-pre-wrap pr-2"
         dangerouslySetInnerHTML={{__html: selectedNote.content}}
        />
        <button
         className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-600"
         onClick={() => {
          setEditing(true);
          setEditHeading(selectedNote.heading);
          setEditContent(selectedNote.content);
         }}
        >
         Edit
        </button>
       </div>
      )
     ) : (
      <div className="text-gray-400 flex items-center justify-center h-full">
       Select a note or click "Add Note"
      </div>
     )}
    </div>
   </div>

   {/* Mobile: Single-column flow */}
   <div className="md:hidden">
    {selectedNote ? (
     <div className="bg-gray-50 p-4 rounded-lg shadow-sm min-h-[70vh] flex flex-col">
      <button
       className="flex items-center gap-1 text-sm text-blue-500 mb-3"
       onClick={() => {
        setSelectedNote(null);
        setEditing(false);
       }}
      >
       <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {editing ? (
       <div className="flex flex-col h-full">
        <input
         className="border rounded-md px-3 py-2 mb-3"
         value={editHeading}
         onChange={(e) => setEditHeading(e.target.value)}
         placeholder="Edit heading..."
        />
        <RichTextEditor content={editContent} onChange={setEditContent} />
        <div className="flex gap-2 mt-3">
         <button
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          onClick={handleSaveEdit}
         >
          Save
         </button>
         <button
          className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
          onClick={() => setEditing(false)}
         >
          Cancel
         </button>
        </div>
       </div>
      ) : (
       <>
        <h3 className="text-xl font-bold mb-2">{selectedNote.heading}</h3>
        <div
         className="flex-1 prose max-w-none overflow-y-auto break-words whitespace-pre-wrap pr-2"
         dangerouslySetInnerHTML={{__html: selectedNote.content}}
        />
        <button
         className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-600"
         onClick={() => {
          setEditing(true);
          setEditHeading(selectedNote.heading);
          setEditContent(selectedNote.content);
         }}
        >
         Edit
        </button>
       </>
      )}
     </div>
    ) : (
     <div className="bg-gray-50 p-4 rounded-lg shadow-sm min-h-[70vh] flex flex-col">
      <button
       className="bg-blue-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-600 mb-4"
       onClick={() => {
        setAdding(true);
        setSelectedNote(null);
        setEditing(false);
        setNewHeading("");
        setNewContent("");
       }}
      >
       Add Note
      </button>

      {adding ? (
       <div className="flex flex-col h-full">
        <input
         className="border rounded-md px-3 py-2 mb-3"
         placeholder="Note heading..."
         value={newHeading}
         onChange={(e) => setNewHeading(e.target.value)}
         disabled={creating}
        />
        <RichTextEditor content={newContent} onChange={setNewContent} />
        <div className="flex gap-2 mt-3">
         <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-600"
          onClick={handleCreateNote}
          disabled={creating}
         >
          {creating ? "Saving..." : "Save"}
         </button>
         <button
          className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
          onClick={() => setAdding(false)}
         >
          Cancel
         </button>
        </div>
       </div>
      ) : loading ? (
       <div>Loading notes...</div>
      ) : notes.length === 0 ? (
       <div className="text-gray-400">No notes yet.</div>
      ) : (
       notes.map((note) => (
        <div
         key={note._id}
         onClick={() => {
          setSelectedNote(note);
          setEditing(false);
          setAdding(false);
         }}
         className="flex justify-between items-center p-3 rounded-md cursor-pointer mb-2 bg-white hover:bg-gray-100"
        >
         <span className="truncate font-semibold">{note.heading}</span>
         <Trash
          className="w-4 h-4 text-gray-500 hover:text-red-500 ml-2"
          onClick={(e) => {
           e.stopPropagation();
           handleDeleteNote(note._id);
          }}
         />
        </div>
       ))
      )}
     </div>
    )}
   </div>
  </div>
 );
};

export default Dashboard;
