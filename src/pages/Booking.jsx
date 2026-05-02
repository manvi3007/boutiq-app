import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { addDoc, collection } from "firebase/firestore";

function Booking() {
  const [name, setName] = useState("");
  const [service, setService] = useState("");
  const [refNumber, setRefNumber] = useState("");
  const [deliveryType, setDeliveryType] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleBooking = async () => {
    try {
      const today = new Date().toISOString().split("T")[0]; // ✅ AUTO DATE

      await addDoc(collection(db, "bookings"), {
        name,
        date: today, // ✅ AUTO STORED
        service,
        refNumber,
        deliveryType,
        userId: auth.currentUser.uid,
        status: "pending",
      });

      setShowPopup(true);

      // reset form
      setName("");
      setService("");
      setRefNumber("");
      setDeliveryType("");
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => setShowPopup(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  return (
    <div style={container}>
      <div style={card}>
        <h2 style={{ marginBottom: "20px" }}>Book Appointment</h2>

        <input
          style={input}
          value={name}
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />

        {/* ❌ DATE REMOVED */}

        <input
          style={input}
          value={service}
          placeholder="Service"
          onChange={(e) => setService(e.target.value)}
        />

        <input
          style={input}
          value={refNumber}
          placeholder="Design Reference Number"
          onChange={(e) => setRefNumber(e.target.value)}
        />

        <select
          style={input}
          value={deliveryType}
          onChange={(e) => setDeliveryType(e.target.value)}
        >
          <option value="">Select Delivery Type</option>
          <option value="visit">Visit Boutique</option>
          <option value="pickup">Home Pickup</option>
        </select>

        <button style={button} onClick={handleBooking}>
          Book Now
        </button>
      </div>

      {showPopup && (
        <div style={overlay}>
          <div style={modal}>
            <div style={checkmark}>✓</div>
            <h3>Booking Confirmed</h3>
            <p>We’ve received your request.</p>
            <p>Our team will contact you soon.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Booking;

// 🎨 Styles

const container = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #667eea, #764ba2)",
};

const card = {
  background: "rgba(255,255,255,0.15)",
  backdropFilter: "blur(15px)",
  padding: "30px",
  borderRadius: "16px",
  width: "320px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  color: "#fff",
  boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
};

const input = {
  padding: "10px",
  borderRadius: "8px",
  border: "none",
  outline: "none",
};

const button = {
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  background: "#00c6ff",
  backgroundImage: "linear-gradient(45deg, #00c6ff, #0072ff)",
  color: "#fff",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "0.3s",
};

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  animation: "fadeIn 0.3s ease",
};

const modal = {
  background: "#fff",
  padding: "30px",
  borderRadius: "16px",
  textAlign: "center",
  width: "280px",
  animation: "scaleUp 0.3s ease",
};

const checkmark = {
  fontSize: "40px",
  color: "green",
  marginBottom: "10px",
};
