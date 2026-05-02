import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

function OwnerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [seenCancelled, setSeenCancelled] = useState([]);

  const userId = auth.currentUser?.uid;

  // 🔥 FETCH SEEN DATA FROM FIRESTORE
  useEffect(() => {
    const fetchSeen = async () => {
      if (!userId) return;

      const userRef = doc(db, "users", userId);
      const snap = await getDoc(userRef);

      if (snap.exists() && snap.data().seenCancelled) {
        setSeenCancelled(snap.data().seenCancelled);
      }
    };

    fetchSeen();
  }, [userId]);

  // 🔥 REALTIME BOOKINGS
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "bookings"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBookings(data);
    });

    return () => unsubscribe();
  }, []);

  // 🔔 MARK AS SEEN (SAVE TO FIRESTORE)
  useEffect(() => {
    const markSeen = async () => {
      if (activeTab !== "cancelled" || !userId) return;

      const cancelledIds = bookings
        .filter((b) => b.status === "cancelled")
        .map((b) => b.id);

      const updated = [...new Set([...seenCancelled, ...cancelledIds])];

      setSeenCancelled(updated);

      const userRef = doc(db, "users", userId);

      await setDoc(userRef, { seenCancelled: updated }, { merge: true });
    };

    markSeen();
  }, [activeTab, bookings, userId]);

  const updateStatus = async (id, status) => {
    const booking = bookings.find((b) => b.id === id);
    if (!booking || booking.status === "cancelled") return;

    await updateDoc(doc(db, "bookings", id), { status });
  };

  // 🔢 STATUS LIST
  const statuses = [
    "all",
    "pending",
    "in progress",
    "stitched",
    "out for delivery",
    "completed",
    "cancelled",
  ];

  // 🔢 COUNTS
  const counts = {};
  statuses.forEach((s) => {
    counts[s] =
      s === "all"
        ? bookings.length
        : bookings.filter((b) => b.status === s).length;
  });

  // 🔍 FILTER + SEARCH
  const filtered = bookings
    .filter((b) => (activeTab === "all" ? true : b.status === activeTab))
    .filter((b) => {
      const name = b.name?.toLowerCase() || "";
      const ref = b.refNumber?.toLowerCase() || "";
      const phone = b.phone || "";

      return (
        name.includes(search.toLowerCase()) ||
        ref.includes(search.toLowerCase()) ||
        phone.includes(search)
      );
    });

  // 🔴 BADGE COUNT
  const newCancelledCount = bookings.filter(
    (b) => b.status === "cancelled" && !seenCancelled.includes(b.id),
  ).length;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Owner Dashboard</h2>

      {/* 🔍 SEARCH */}
      <input
        placeholder="Search by name, phone, or ref"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.search}
      />

      {/* 📊 STATUS TABS */}
      <div style={styles.tabs}>
        {statuses.map((s) => (
          <div
            key={s}
            onClick={() => setActiveTab(s)}
            style={{
              ...styles.tab,
              border:
                activeTab === s ? "2px solid #e91e63" : "2px solid transparent",
            }}
          >
            <h3>{counts[s]}</h3>
            <p style={{ textTransform: "capitalize" }}>
              {s}

              {/* 🔴 BADGE */}
              {s === "cancelled" && newCancelledCount > 0 && (
                <span style={styles.badge}>{newCancelledCount}</span>
              )}
            </p>
          </div>
        ))}
      </div>

      {/* 📦 BOOKINGS */}
      {filtered.map((b) => (
        <div key={b.id} style={styles.card}>
          <div style={styles.row}>
            <h3>{b.name}</h3>
            <span style={getStatusStyle(b.status)}>{b.status}</span>
          </div>

          <p>📞 {b.phone}</p>
          <p>📅 {b.date}</p>
          <p>👗 {b.category}</p>
          <p>🔖 {b.refNumber}</p>

          {b.status !== "cancelled" && (
            <select
              value={b.status}
              onChange={(e) => updateStatus(b.id, e.target.value)}
              style={styles.select}
            >
              {statuses.slice(1, -1).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          )}

          {b.status === "cancelled" && (
            <p style={styles.cancel}>❌ Cancelled</p>
          )}
        </div>
      ))}

      {filtered.length === 0 && <p style={styles.empty}>No bookings found</p>}
    </div>
  );
}

export default OwnerDashboard;

// 🎨 STYLES (UNCHANGED)

const styles = {
  container: {
    padding: "40px",
    background: "linear-gradient(135deg, #fdf2f8, #fce7f3)",
    minHeight: "100vh",
  },
  heading: { textAlign: "center" },
  search: {
    display: "block",
    margin: "20px auto",
    padding: "10px",
    width: "300px",
    borderRadius: "10px",
  },
  tabs: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  tab: {
    padding: "15px",
    background: "#fff",
    borderRadius: "10px",
    textAlign: "center",
    cursor: "pointer",
    minWidth: "120px",
    position: "relative",
  },
  badge: {
    marginLeft: "6px",
    background: "#ff3366",
    color: "#fff",
    padding: "2px 7px",
    borderRadius: "50%",
    fontSize: "11px",
  },
  card: {
    background: "#fff",
    padding: "20px",
    margin: "20px auto",
    borderRadius: "12px",
    maxWidth: "600px",
  },
  row: { display: "flex", justifyContent: "space-between" },
  select: { marginTop: "10px", padding: "8px" },
  cancel: { color: "#999" },
  empty: { textAlign: "center", marginTop: "20px" },
};

const getStatusStyle = (status) => ({
  background: "#eee",
  padding: "5px 10px",
  borderRadius: "20px",
  fontSize: "12px",
});
