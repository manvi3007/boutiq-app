import { useState } from "react";
import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

function AddDesign() {
  const [form, setForm] = useState({
    name: "",
    refNumber: "",
    imageUrl: "",
    category: "",
  });

  const [msg, setMsg] = useState("");

  const handleAdd = async () => {
    if (!form.name || !form.refNumber || !form.category) {
      setMsg("Please fill all required fields");
      return;
    }

    await addDoc(collection(db, "designs"), {
      ...form,
      createdAt: serverTimestamp(),
    });

    setMsg("Design added successfully");

    setForm({
      name: "",
      refNumber: "",
      imageUrl: "",
      category: "",
    });

    setTimeout(() => setMsg(""), 2000);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Add New Design</h2>

        <input
          placeholder="Design Name"
          value={form.name}
          style={styles.input}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Reference Number"
          value={form.refNumber}
          style={styles.input}
          onChange={(e) => setForm({ ...form, refNumber: e.target.value })}
        />

        <select
          value={form.category}
          style={styles.input}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option value="">Select Category</option>
          <option value="salwar">Salwar Suit</option>
          <option value="kurti">Kurti</option>
          <option value="plazo">Plazo Suit</option>
          <option value="unique">Unique Dress</option>
        </select>

        <input
          placeholder="Image URL"
          value={form.imageUrl}
          style={styles.input}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
        />

        {/* 🔥 IMAGE PREVIEW */}
        {form.imageUrl && (
          <img src={form.imageUrl} alt="" style={styles.preview} />
        )}

        <button onClick={handleAdd} style={styles.button}>
          Add Design
        </button>

        {msg && <p style={styles.msg}>{msg}</p>}
      </div>
    </div>
  );
}

export default AddDesign;

// 🎨 PREMIUM STYLES

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #fdf2f8, #fce7f3)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    background: "rgba(255,255,255,0.7)",
    backdropFilter: "blur(10px)",
    padding: "30px",
    borderRadius: "18px",
    width: "380px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
  },

  title: {
    textAlign: "center",
    marginBottom: "10px",
  },

  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #eee",
    outline: "none",
  },

  button: {
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(45deg, #ff4d6d, #ff758f)",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
  },

  preview: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "10px",
  },

  msg: {
    textAlign: "center",
    color: "#555",
  },
};
