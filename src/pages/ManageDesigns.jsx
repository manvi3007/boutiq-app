import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function ManageDesigns() {
  const [designs, setDesigns] = useState([]);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "designs"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDesigns(data);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "designs", id));
  };

  // ✅ FIXED EDIT
  const handleEdit = (design) => {
    navigate(`/edit-design/${design.id}`);
  };

  const filteredDesigns = designs
    .filter((d) => (filter ? d.category === filter : true))
    .filter((d) => {
      const name = d.name?.toLowerCase() || "";
      const ref = d.refNumber?.toLowerCase() || "";

      return (
        name.includes(search.toLowerCase()) ||
        ref.includes(search.toLowerCase())
      );
    });

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Manage Designs</h2>

      <input
        placeholder="Search by name or ref"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.search}
      />

      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={styles.select}
      >
        <option value="">All Categories</option>
        <option value="salwar">Salwar Suit</option>
        <option value="kurti">Kurti</option>
        <option value="plazo">Plazo Suit</option>
        <option value="unique">Unique Dress</option>
      </select>

      <div style={styles.grid}>
        {filteredDesigns.map((d) => (
          <div key={d.id} style={styles.card}>
            <img src={d.imageUrl} alt="" style={styles.img} />
            <h4>{d.name}</h4>
            <p>Ref: {d.refNumber}</p>

            <div style={styles.actions}>
              <button style={styles.edit} onClick={() => handleEdit(d)}>
                Edit
              </button>

              <button style={styles.delete} onClick={() => handleDelete(d.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredDesigns.length === 0 && (
        <p style={styles.empty}>No designs found</p>
      )}
    </div>
  );
}

export default ManageDesigns;

// styles unchanged

// ✅ STYLES (UNCHANGED)
const styles = {
  container: {
    padding: "40px",
    background: "linear-gradient(135deg, #fdf2f8, #fce7f3)",
    minHeight: "100vh",
  },

  heading: {
    textAlign: "center",
    marginBottom: "20px",
  },

  search: {
    display: "block",
    margin: "0 auto 15px",
    padding: "10px",
    width: "300px",
    borderRadius: "10px",
    border: "1px solid #ddd",
  },

  select: {
    display: "block",
    margin: "0 auto 20px",
    padding: "10px",
    width: "300px",
    borderRadius: "10px",
    border: "1px solid #ddd",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "25px",
  },

  card: {
    background: "#fff",
    padding: "15px",
    borderRadius: "15px",
    textAlign: "center",
  },

  img: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    borderRadius: "10px",
  },

  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },

  edit: {
    flex: 1,
    border: "2px solid #e91e63",
    background: "transparent",
    color: "#e91e63",
    borderRadius: "8px",
    padding: "8px",
    cursor: "pointer",
  },

  delete: {
    flex: 1,
    border: "2px solid black",
    background: "transparent",
    color: "black",
    borderRadius: "8px",
    padding: "8px",
    cursor: "pointer",
  },

  empty: {
    textAlign: "center",
    marginTop: "20px",
  },
};
