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

  // Redirect if not authenticated
  useEffect(() => {
    if (!localStorage.getItem("access")) {
      window.location.href = "/";
    }
  }, []);

  // Fetch documents list
  const fetchDocuments = async () => {
    try {
      const res = await axios.get("/documents/");
      setDocuments(res.data);
    } catch (err) {
      console.error("Failed to load documents:", err);
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

    try {
      await axios.post("/documents/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setFile(null);
      setTitle("");
      fetchDocuments();
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  // Delete document
  const handleDelete = async (id) => {
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
      fetchDocuments();
    } catch (err) {
      console.error("Delete failed", err);
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

    try {
      await axios.put(`/documents/${editingDocId}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      cancelEdit();
      fetchDocuments();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  // Ask question about a document
  const handleAsk = async () => {
    if (!question) return;

    try {
      const res = await axios.post(`/documents/${selectedDocId}/ask/`, {
        question,
      });
      setAnswer(res.data.answer);
    } catch (err) {
      console.error("Q&A failed", err);
      setAnswer("Something went wrong while answering.");
    }
  };

  // Logout user
  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.location.href = "/";
  };

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>📄 Dashboard</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {/* Upload or Edit form */}
      {editingDocId ? (
        <form onSubmit={handleUpdate} style={{ marginBottom: "20px" }}>
          <h3>Update Document #{editingDocId}</h3>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            required
          />
          &nbsp;
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setEditFile(e.target.files[0])}
          />
          &nbsp;
          <button type="submit">Update Document</button>
          &nbsp;
          <button type="button" onClick={cancelEdit}>
            Cancel
          </button>
        </form>
      ) : (
        <form onSubmit={handleUpload} style={{ marginBottom: "20px" }}>
          <h3>Upload New Document</h3>
          <input
            type="text"
            placeholder="Document title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          &nbsp;
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
          &nbsp;
          <button type="submit">Upload</button>
        </form>
      )}

      {/* Document list */}
      <h3>Your Documents</h3>
      {documents.length === 0 && <p>No documents found.</p>}
      <ul>
        {documents.map((doc) => (
          <li key={doc.id} style={{ marginBottom: "8px" }}>
            <b>{doc.title}</b> ({doc.file.split("/").pop()})
            &nbsp;
            <button onClick={() => startEdit(doc)}>Edit</button>
            &nbsp;
            <button onClick={() => handleDelete(doc.id)}>Delete</button>
            &nbsp;
            <button
              onClick={() => {
                setSelectedDocId(doc.id);
                setAnswer("");
                setQuestion("");
              }}
            >
              Ask
            </button>
          </li>
        ))}
      </ul>

      {/* Ask question form */}
      {selectedDocId && (
        <div style={{ marginTop: "30px" }}>
          <h3>Ask a question about document #{selectedDocId}</h3>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question here"
            style={{ width: "60%" }}
          />
          &nbsp;
          <button onClick={handleAsk}>Ask</button>

          {answer && (
            <div
              style={{
                marginTop: "15px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                maxWidth: "600px",
              }}
            >
              <strong>Answer:</strong>
              <p>{answer}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;