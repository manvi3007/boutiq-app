import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);

      alert("Login successful!");

      // ✅ redirect after login
    } catch (err) {
      console.error(err);

      // 🔥 Better error messages
      if (err.code === "auth/user-not-found") {
        alert("User not found. Please signup first.");
      } else if (err.code === "auth/wrong-password") {
        alert("Incorrect password.");
      } else if (err.code === "auth/invalid-email") {
        alert("Invalid email format.");
      } else {
        alert(err.message);
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleLogin} style={styles.button}>
          Login
        </button>

        <p>
          Don’t have an account?{" "}
          <span onClick={() => navigate("/signup")} style={styles.link}>
            Signup
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f1117",
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "10px",
    width: "300px",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#ff3366",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  link: {
    color: "#ff3366",
    cursor: "pointer",
  },
};

export default Login;
