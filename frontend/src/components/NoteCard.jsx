import { useState } from "react";
import { Archive, Edit2, Save, X, Clock } from "lucide-react";

export default function NoteCard({ note, onArchive, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState(note.title);
  const [editedContent, setEditedContent] = useState(note.content);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const handleSave = () => {
    onEdit(note._id, editedTitle, editedContent);
    setIsEditing(false);
  };

  const handleArchiveClick = () => {
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    onArchive(note._id);
    setIsConfirmOpen(false);
  };

  return (
    <>
      {/* Note Card */}
      <div className="relative bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.01] transition-all p-5">
        {isEditing ? (
          <>
            <input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full text-lg font-semibold border-b border-gray-300 mb-3 focus:outline-none focus:border-yellow-400 transition"
              placeholder="Note title..."
            />
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full text-gray-700 border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 h-28 resize-none transition"
              placeholder="Write your note..."
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition font-medium"
              >
                <X size={16} /> Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-yellow-400 text-white hover:bg-yellow-500 transition font-medium"
              >
                <Save size={16} /> Save
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="pr-10">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {note.title}
              </h3>
              <p className="text-gray-700 mb-4 whitespace-pre-line wrap-break-word leading-relaxed">
                {note.content}
              </p>
            </div>

            {/* Dates */}
            <div className="text-xs text-gray-500 mt-4 space-y-1">
              <p className="flex items-center gap-1">
                <Clock size={14} className="text-yellow-400" /> Created on:{" "}
                {formatDate(note.createdAt)}
              </p>
              <p className="flex items-center gap-1 italic">
                <Clock size={14} className="text-yellow-400" /> Last edited:{" "}
                {formatDate(note.updatedAt || note.createdAt)}
              </p>
            </div>

            {/* Action buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                title="Edit Note"
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-full bg-yellow-100 hover:bg-yellow-200 text-yellow-600 transition"
              >
                <Edit2 size={18} />
              </button>
              <button
                title="Archive Note"
                onClick={handleArchiveClick}
                className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-500 transition"
              >
                <Archive size={18} />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-sm text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Are you sure you want to delete this note?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 font-medium transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
