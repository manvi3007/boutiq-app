import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

function EditDesign() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    refNumber: "",
    imageUrl: "",
    category: "",
  });

  const [loading, setLoading] = useState(true);

  // 🔥 FETCH DESIGN FROM FIRESTORE
  useEffect(() => {
    const fetchDesign = async () => {
      try {
        const docRef = doc(db, "designs", id);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          setForm(snap.data());
        } else {
          alert("Design not found");
          navigate("/manage-designs");
        }

        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    fetchDesign();
  }, [id]);

  // 🔥 UPDATE
  const handleUpdate = async () => {
    if (!form.name || !form.refNumber || !form.category) {
      alert("Fill all fields");
      return;
    }

    await updateDoc(doc(db, "designs", id), form);

    alert("Updated successfully");
    navigate("/manage-designs");
  };

  if (loading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Edit Design</h2>

        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Name"
          style={styles.input}
        />

        <input
          value={form.refNumber}
          onChange={(e) => setForm({ ...form, refNumber: e.target.value })}
          placeholder="Ref Number"
          style={styles.input}
        />

        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          style={styles.input}
        >
          <option value="">Select Category</option>
          <option value="salwar">Salwar Suit</option>
          <option value="kurti">Kurti</option>
          <option value="plazo">Plazo Suit</option>
          <option value="unique">Unique Dress</option>
        </select>

        <input
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          placeholder="Image URL"
          style={styles.input}
        />

        <button style={styles.button} onClick={handleUpdate}>
          Update
        </button>
      </div>
    </div>
  );
}

export default EditDesign;

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#fdf2f8",
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "15px",
    width: "350px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#ff3366",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
  },
};
