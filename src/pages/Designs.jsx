import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Designs() {
  const [designs, setDesigns] = useState([]);
  const [filter, setFilter] = useState("");
  const [selectedDesign, setSelectedDesign] = useState(null); // 🔥 for popup
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDesigns = async () => {
      const snapshot = await getDocs(collection(db, "designs"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDesigns(data);
    };

    fetchDesigns();
  }, []);

  const filteredDesigns = filter
    ? designs.filter((d) => d.category === filter)
    : designs;

  // 🔥 Book
  const handleBookDesign = (design) => {
    navigate("/customer", {
      state: {
        category: design.category,
        refNumber: design.refNumber,
      },
    });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Explore Designs</h2>

      <div style={styles.filterBox}>
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
      </div>

      <div style={styles.grid}>
        {filteredDesigns.map((d) => (
          <div key={d.id} style={styles.card}>
            <img src={d.imageUrl} alt="" style={styles.image} />

            <h4 style={styles.name}>{d.name}</h4>
            <p style={styles.ref}>Ref: {d.refNumber}</p>

            <div style={styles.actions}>
              <button
                style={styles.viewBtn}
                onClick={() => setSelectedDesign(d)}
              >
                View
              </button>

              <button
                style={styles.bookBtn}
                onClick={() => handleBookDesign(d)}
              >
                Book
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 🔥 MODAL */}
      {selectedDesign && (
        <div style={styles.overlay} onClick={() => setSelectedDesign(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <img src={selectedDesign.imageUrl} alt="" style={styles.modalImg} />
            <h3>{selectedDesign.name}</h3>
            <p>Ref: {selectedDesign.refNumber}</p>

            <button
              style={styles.modalBtn}
              onClick={() => handleBookDesign(selectedDesign)}
            >
              Book this Design
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Designs;

// 🎨 PREMIUM MATCHING STYLES (like Manage Designs)

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #fdf2f8, #fce7f3)",
    padding: "50px 6%",
  },

  title: {
    textAlign: "center",
    marginBottom: "30px",
  },

  filterBox: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "30px",
  },

  select: {
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    width: "250px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "25px",
  },

  card: {
    background: "#fff",
    padding: "15px",
    borderRadius: "15px",
    textAlign: "center",
    boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
  },

  image: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "10px",
  },

  name: {
    marginBottom: "5px",
  },

  ref: {
    color: "#777",
    fontSize: "13px",
  },

  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },

  viewBtn: {
    flex: 1,
    border: "2px solid #e91e63",
    background: "transparent",
    color: "#e91e63",
    borderRadius: "8px",
    padding: "8px",
    cursor: "pointer",
  },

  bookBtn: {
    flex: 1,
    border: "none",
    background: "#e91e63",
    color: "#fff",
    borderRadius: "8px",
    padding: "8px",
    cursor: "pointer",
  },

  // 🔥 MODAL
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    background: "#fff",
    padding: "20px",
    borderRadius: "15px",
    width: "350px",
    textAlign: "center",
  },

  modalImg: {
    width: "100%",
    height: "250px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "10px",
  },

  modalBtn: {
    marginTop: "10px",
    padding: "10px",
    width: "100%",
    border: "none",
    background: "#e91e63",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
  },
};
