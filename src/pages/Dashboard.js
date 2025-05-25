import React, { useEffect, useState } from "react";
import axios from "../api/axios";

const Dashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");

  const [editingDocId, setEditingDocId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editFile, setEditFile] = useState(null);

  const [selectedDocId, setSelectedDocId] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const [loading, setLoading] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!localStorage.getItem("access")) {
      window.location.href = "/";
    }
  }, []);

  // Fetch documents list
  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/documents/");
      setDocuments(res.data);
    } catch (err) {
      console.error("Failed to load documents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Upload new document
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);

    setLoading(true);
    try {
      await axios.post("/documents/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setFile(null);
      setTitle("");
      await fetchDocuments();
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete document
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`/documents/${id}/`);
      if (selectedDocId === id) {
        setSelectedDocId(null);
        setQuestion("");
        setAnswer("");
      }
      if (editingDocId === id) {
        setEditingDocId(null);
        setEditTitle("");
        setEditFile(null);
      }
      await fetchDocuments();
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setLoading(false);
    }
  };

  // Start editing document
  const startEdit = (doc) => {
    setEditingDocId(doc.id);
    setEditTitle(doc.title);
    setEditFile(null);
    setAnswer("");
    setQuestion("");
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingDocId(null);
    setEditTitle("");
    setEditFile(null);
  };

  // Update document (PUT)
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editTitle) return;

    const formData = new FormData();
    formData.append("title", editTitle);
    if (editFile) formData.append("file", editFile);

    setLoading(true);
    try {
      await axios.put(`/documents/${editingDocId}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      cancelEdit();
      await fetchDocuments();
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setLoading(false);
    }
  };

  // Ask question about a document
  const handleAsk = async () => {
    if (!question) return;

    setLoading(true);
    try {
      const res = await axios.post(`/documents/${selectedDocId}/ask/`, {
        question,
      });
      setAnswer(res.data.answer);
    } catch (err) {
      console.error("Q&A failed", err);
      setAnswer("Something went wrong while answering.");
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-600">📄 Dashboard</h2>
          <button
            onClick={handleLogout}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Logout
          </button>
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center items-center mb-4">
            <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Upload or Edit form */}
        {editingDocId ? (
          <form onSubmit={handleUpdate} className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-700">
              Update Document #{editingDocId}
            </h3>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              required
              className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setEditFile(e.target.files[0])}
              className="w-full"
            />
            <div className="space-x-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Update Document
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                disabled={loading}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleUpload} className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-700">
              Upload New Document
            </h3>
            <input
              type="text"
              placeholder="Document title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
              required
              className="w-full"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Upload
            </button>
          </form>
        )}

        {/* Document list */}
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Your Documents
        </h3>
        {documents.length === 0 ? (
          <p className="text-gray-500">No documents found.</p>
        ) : (
          <ul className="space-y-3">
            {documents.map((doc) => (
              <li
                key={doc.id}
                className="flex flex-col md:flex-row md:items-center justify-between bg-gray-50 border rounded p-3"
              >
                <div className="font-medium text-gray-800">
                  {doc.title}{" "}
                  <span className="text-sm text-gray-500">
                    ({doc.file.split("/").pop()})
                  </span>
                </div>
                <div className="mt-2 md:mt-0 space-x-2">
                  <button
                    onClick={() => startEdit(doc)}
                    disabled={loading}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 disabled:opacity-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    disabled={loading}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      setSelectedDocId(doc.id);
                      setAnswer("");
                      setQuestion("");
                    }}
                    disabled={loading}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    Ask
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Ask question form */}
        {selectedDocId && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Ask a question about document #{selectedDocId}
            </h3>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Type your question here"
                className="flex-1 border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              <button
                onClick={handleAsk}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Ask
              </button>
            </div>

            {answer && (
              <div className="mt-4 p-4 border rounded bg-blue-50">
                <strong className="text-blue-800">Answer:</strong>
                <p className="text-gray-700 mt-1">{answer}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
