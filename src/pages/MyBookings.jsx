import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";

function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "bookings"), (snapshot) => {
      const data = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((b) => b.userId === auth.currentUser?.uid);

      setBookings(data);
    });

    return () => unsubscribe();
  }, []);

  const handleCancel = async (id) => {
    await updateDoc(doc(db, "bookings", id), {
      status: "cancelled",
    });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>My Orders</h2>

      {bookings.map((b) => (
        <div key={b.id} style={styles.card}>
          <div style={styles.row}>
            <h3>{b.name}</h3>
            <span style={getStatusStyle(b.status)}>{b.status}</span>
          </div>

          <p>📅 {b.date}</p>
          <p>👗 {b.category}</p>
          <p>🔖 Ref #{b.refNumber}</p>

          {/* 🚀 ANIMATED TRACKER */}
          {b.status !== "cancelled" && (
            <div style={styles.progressWrapper}>
              {steps.map((step, index) => {
                const activeIndex = steps.indexOf(b.status);
                const active = activeIndex >= index;

                return (
                  <div key={index} style={styles.step}>
                    {/* LINE */}
                    {index !== steps.length - 1 && (
                      <div
                        style={{
                          ...styles.line,
                          background: activeIndex > index ? "#ff3366" : "#ddd",
                        }}
                      />
                    )}

                    {/* CIRCLE */}
                    <div
                      style={{
                        ...styles.circle,
                        background: active ? "#ff3366" : "#ddd",
                        animation:
                          active && activeIndex === index
                            ? "pulse 1s infinite"
                            : "none",
                      }}
                    />

                    {/* LABEL */}
                    <span style={styles.label}>{step}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* CANCEL */}
          {b.status === "pending" && (
            <button style={styles.cancelBtn} onClick={() => handleCancel(b.id)}>
              Cancel Order
            </button>
          )}

          {b.status === "cancelled" && (
            <p style={styles.cancelText}>❌ Order Cancelled</p>
          )}
        </div>
      ))}

      {bookings.length === 0 && <p style={styles.empty}>No bookings found</p>}
    </div>
  );
}

export default MyBookings;

// 🔢 STEPS
const steps = [
  "pending",
  "in progress",
  "stitched",
  "out for delivery",
  "completed",
];

// 🎨 STYLES
const styles = {
  container: {
    padding: "40px",
    background: "linear-gradient(135deg, #fdf2f8, #fce7f3)",
    minHeight: "100vh",
  },

  heading: {
    textAlign: "center",
    marginBottom: "30px",
  },

  card: {
    background: "#fff",
    padding: "20px",
    margin: "20px auto",
    borderRadius: "15px",
    maxWidth: "650px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
  },

  progressWrapper: {
    display: "flex",
    margin: "25px 0",
    position: "relative",
  },

  step: {
    flex: 1,
    textAlign: "center",
    position: "relative",
  },

  circle: {
    width: "14px",
    height: "14px",
    borderRadius: "50%",
    margin: "0 auto",
    transition: "0.4s",
  },

  line: {
    position: "absolute",
    top: "6px",
    left: "50%",
    width: "100%",
    height: "2px",
    transition: "0.4s",
  },

  label: {
    fontSize: "11px",
    marginTop: "5px",
  },

  cancelBtn: {
    marginTop: "10px",
    padding: "10px",
    background: "#ff4d4d",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  cancelText: {
    marginTop: "10px",
    color: "#999",
  },

  empty: {
    textAlign: "center",
    marginTop: "20px",
    color: "#777",
  },
};

// 🎯 STATUS STYLE
const getStatusStyle = (status) => ({
  background: "#eee",
  padding: "5px 10px",
  borderRadius: "20px",
  fontSize: "12px",
  textTransform: "capitalize",
});
