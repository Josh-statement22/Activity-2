import { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import NoteCard from "../components/NoteCard";
import { NotebookPen, User, PlusCircle } from "lucide-react";


export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch user info and notes
  useEffect(() => {
    if (!token) return navigate("/login");

    api
      .get("/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUser(res.data.email))
      .catch(() => navigate("/login"));

    api
      .get("/notes", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setNotes(res.data))
      .catch(() => navigate("/login"));
  }, [token, navigate]);

  // Add note
  const addNote = async (e) => {
    e.preventDefault();
    const res = await api.post(
      "/notes",
      { title, content },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setNotes((prev) => [res.data, ...prev]);
    setTitle("");
    setContent("");
    setShowModal(false);
  };

  // Edit note
  const handleEdit = async (id, updatedTitle, updatedContent) => {
    const res = await api.patch(
      `/notes/${id}`,
      { title: updatedTitle, content: updatedContent },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setNotes((prev) => prev.map((n) => (n._id === id ? res.data : n)));
  };

  // Archive note
  const handleArchive = async (id) => {
    await api.patch(
      `/notes/${id}`,
      { archived: true },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setNotes((prev) =>
      prev.map((n) => (n._id === id ? { ...n, archived: true } : n))
    );
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-gray-100 to-yellow-50 text-gray-800">
      {/* Navbar */}
      <header className="flex justify-between items-center px-8 py-5 bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-20 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-400 text-white p-2 rounded-xl shadow-md">
            <NotebookPen size={28} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            Pa-Notes
          </h1>
        </div>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium shadow-sm">
            <User size={18} />
            <span>{user || "Loading..."}</span>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-medium shadow-sm"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Notes Grid */}
      <main className="p-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              Your Notes ({notes.filter((n) => !n.archived).length})
            </h2>
            {/* ✅ Removed duplicate Add Note button here */}
          </div>

          {notes.filter((n) => !n.archived).length === 0 ? (
            <p className="text-center text-gray-500 italic mt-16">
              No notes yet. Click “Add Note” to create one.
            </p>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {notes
                .filter((n) => !n.archived)
                .map((n) => (
                  <NoteCard
                    key={n._id}
                    note={n}
                    onArchive={handleArchive}
                    onEdit={handleEdit}
                  />
                ))}
            </div>
          )}
        </div>
      </main>

      {/* ✅ Floating Add Note Button with same design as old upper-right button */}
      <motion.button
        onClick={() => setShowModal(true)}
        initial={{ y: 100, opacity: 0, scale: 0.8 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 10,
          delay: 0.2,
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 flex items-center gap-2 bg-yellow-400 text-white px-5 py-3 rounded-full shadow-lg hover:bg-yellow-500 transition font-medium"
      >
        <PlusCircle size={22} />
        Add Note
      </motion.button>


      {showModal && (
  <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-30 backdrop-blur-sm">
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: 30 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="bg-white/90 backdrop-blur-md border border-gray-100 shadow-2xl rounded-3xl w-[90%] max-w-md p-8 relative overflow-hidden"
    >
      {/* Decorative header */}
      <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-r from-yellow-400 to-yellow-300 rounded-t-3xl"></div>

      {/* Content */}
      <div className="relative z-10 mt-6">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-white p-3 rounded-full shadow-md">
            <PlusCircle size={32} className="text-yellow-500" />
          </div>
          <h2 className="text-2xl font-bold mt-3 text-gray-800">Add a New Note</h2>
          <p className="text-gray-500 text-sm">Write down your thoughts and reminders</p>
        </div>

        <form onSubmit={addNote} className="space-y-5 mt-2">
          <div className="relative">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="peer w-full border border-gray-300 rounded-lg px-3 pt-6 pb-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-transparent"
              placeholder="Title"
            />
            <label className="absolute left-3 top-2.5 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2.5 peer-focus:text-sm peer-focus:text-yellow-500">
              Title
            </label>
          </div>

          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="Content"
              className="peer w-full border border-gray-300 rounded-lg px-3 pt-6 pb-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 h-32 resize-none placeholder-transparent"
            ></textarea>
            <label className="absolute left-3 top-2.5 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2.5 peer-focus:text-sm peer-focus:text-yellow-500">
              Note Content
            </label>
          </div>

          <div className="flex justify-end gap-3 mt-5">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-400 text-white hover:bg-yellow-500 transition font-semibold"
            >
              <PlusCircle size={18} />
              Add Note
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  </div>
)}

    </div>
  );
}
