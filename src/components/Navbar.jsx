import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function Navbar({ user, role }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div style={styles.nav}>
      <h2 onClick={() => navigate("/")}>Boutiq</h2>

      <div style={styles.links}>
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
};
