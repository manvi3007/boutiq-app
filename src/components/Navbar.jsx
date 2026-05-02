import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useState } from "react"; // ✅ added

function Navbar({ user, role }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false); // ✅ mobile menu state

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div style={styles.nav}>
      <h2 onClick={() => navigate("/")}>Boutiq</h2>

      {/* 🍔 HAMBURGER (mobile only) */}
      <div style={styles.hamburger} onClick={() => setOpen(!open)}>
        ☰
      </div>

      <div
        style={{
          ...styles.links,
          ...(open ? styles.mobileMenu : {}),
        }}
      >
        <span onClick={() => navigate("/")}>Home</span>
        <span onClick={() => navigate("/designs")}>Designs</span>

        {user && role === "customer" && (
          <>
            <span onClick={() => navigate("/customer")}>Book</span>
            <span onClick={() => navigate("/my-bookings")}>My Bookings</span>
          </>
        )}

        {user && role === "owner" && (
          <>
            <span onClick={() => navigate("/owner")}>Dashboard</span>
            <span onClick={() => navigate("/add-design")}>Add Design</span>
            <span onClick={() => navigate("/manage-designs")}>
              Manage Designs
            </span>
          </>
        )}

        {user && (
          <button onClick={handleLogout} style={styles.logout}>
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

export default Navbar;

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px 30px",
    background: "#fff",
    borderBottom: "1px solid #eee",
    position: "relative", // ✅ needed for dropdown
  },

  links: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    cursor: "pointer",
  },

  logout: {
    padding: "6px 12px",
    background: "#ff3366",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  /* 🍔 hidden on desktop */
  hamburger: {
    display: "none",
    fontSize: "24px",
    cursor: "pointer",
  },

  /* 📱 mobile dropdown */
  mobileMenu: {
    position: "absolute",
    top: "60px",
    right: "0",
    background: "#fff",
    flexDirection: "column",
    width: "100%",
    padding: "20px",
    gap: "15px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  },
};
