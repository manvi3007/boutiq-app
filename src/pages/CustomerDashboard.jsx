import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { useLocation } from "react-router-dom";

function CustomerDashboard() {
  const location = useLocation();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    category: "",
    refNumber: "",
    deliveryType: "",
    address: "",
  });

  const [designs, setDesigns] = useState([]);
  const [filteredDesigns, setFilteredDesigns] = useState([]);

  const [showPopup, setShowPopup] = useState(false);
  const [errorPopup, setErrorPopup] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 Fetch designs
  useEffect(() => {
    const fetchDesigns = async () => {
      const snapshot = await getDocs(collection(db, "designs"));
      const data = snapshot.docs.map((doc) => doc.data());
      setDesigns(data);
    };

    fetchDesigns();
  }, []);

  // 🔥 Auto-fill
  useEffect(() => {
    if (location.state) {
      setForm((prev) => ({
        ...prev,
        category: location.state.category || "",
        refNumber: location.state.refNumber || "",
      }));
    }
  }, [location.state]);

  // 🔥 Filter
  useEffect(() => {
    if (form.category) {
      const filtered = designs.filter((d) => d.category === form.category);
      setFilteredDesigns(filtered);
    } else {
      setFilteredDesigns([]);
    }
  }, [form.category, designs]);

  // 🔥 BOOK FUNCTION
  const handleBook = async () => {
    if (
      !form.name ||
      !form.phone ||
      !form.category ||
      !form.refNumber ||
      !form.deliveryType ||
      (form.deliveryType === "pickup" && !form.address)
    ) {
      setErrorPopup("Please fill all required fields");
      return;
    }

    if (!auth.currentUser) {
      setErrorPopup("Please login first");
      return;
    }

    setLoading(true);

    try {
      const today = new Date().toISOString().split("T")[0]; // ✅ AUTO DATE

      await addDoc(collection(db, "bookings"), {
        ...form,
        date: today, // ✅ AUTO STORED
        address: form.deliveryType === "pickup" ? form.address : "",
        userId: auth.currentUser.uid,
        status: "pending",
        createdAt: new Date(),
      });

      setShowPopup(true);

      setForm({
        name: "",
        phone: "",
        category: "",
        refNumber: "",
        deliveryType: "",
        address: "",
      });
    } catch (err) {
      setErrorPopup(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => setShowPopup(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  useEffect(() => {
    if (errorPopup) {
      const timer = setTimeout(() => setErrorPopup(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorPopup]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Book Appointment</h2>

        <input
          placeholder="Full Name"
          value={form.name}
          style={styles.input}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Phone Number"
          value={form.phone}
          style={styles.input}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        {/* ❌ DATE INPUT REMOVED */}

        <select
          value={form.category}
          style={styles.input}
          onChange={(e) =>
            setForm({
              ...form,
              category: e.target.value,
              refNumber: "",
            })
          }
        >
          <option value="">Select Design Type</option>
          <option value="salwar">Salwar Suit</option>
          <option value="kurti">Kurti</option>
          <option value="plazo">Plazo Suit</option>
          <option value="dress">Dress</option>
          <option value="unique">Unique Dress</option>
        </select>

        <select
          value={form.refNumber}
          style={styles.input}
          disabled={!form.category}
          onChange={(e) => setForm({ ...form, refNumber: e.target.value })}
        >
          <option value="">Select Design Reference</option>
          {filteredDesigns.map((d, i) => (
            <option key={i} value={d.refNumber}>
              {d.name} ({d.refNumber})
            </option>
          ))}
        </select>

        <select
          value={form.deliveryType}
          style={styles.input}
          onChange={(e) =>
            setForm({
              ...form,
              deliveryType: e.target.value,
              address: "",
            })
          }
        >
          <option value="">Select Delivery Type</option>
          <option value="visit">Visit Boutique</option>
          <option value="pickup">Home Pickup</option>
        </select>

        {form.deliveryType === "pickup" && (
          <textarea
            placeholder="Enter your address"
            value={form.address}
            style={styles.input}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        )}

        <button
          style={{ ...styles.button, opacity: loading ? 0.6 : 1 }}
          onClick={handleBook}
          disabled={loading}
        >
          {loading ? "Booking..." : "Confirm Booking"}
        </button>
      </div>

      {showPopup && (
        <div style={overlay}>
          <div style={modal}>
            <div style={checkmark}>✓</div>
            <h3>Booking Confirmed</h3>
            <p>We’ll contact you shortly.</p>
          </div>
        </div>
      )}

      {errorPopup && <div style={errorBox}>{errorPopup}</div>}
    </div>
  );
}

export default CustomerDashboard;

// 🎨 LUXURY UI

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #fdf6f0, #f8e1e7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    background: "#ffffff",
    padding: "40px",
    borderRadius: "20px",
    width: "380px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
  },
  title: {
    textAlign: "center",
    fontWeight: "600",
    marginBottom: "10px",
    color: "#2c2c2c",
  },
  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #eee",
    background: "#fafafa",
    outline: "none",
  },
  button: {
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    background: "#e91e63",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
  },
};

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modal = {
  background: "#fff",
  padding: "30px",
  borderRadius: "16px",
  textAlign: "center",
  width: "260px",
};

const checkmark = {
  fontSize: "40px",
  color: "#e91e63",
  marginBottom: "10px",
};

const errorBox = {
  position: "fixed",
  bottom: "20px",
  right: "20px",
  background: "#e91e63",
  color: "#fff",
  padding: "12px 18px",
  borderRadius: "8px",
};
