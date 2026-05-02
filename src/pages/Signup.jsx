import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      // 🔥 store user in Firestore
      await setDoc(doc(db, "users", userCred.user.uid), {
        email: email,
        role: "customer",
      });

      alert("Signup successful!");

       // redirect after signup
    } catch (err) {
      console.error(err);
      alert(err.message); // 🔥 show real error
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Signup</h2>

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

        <button onClick={handleSignup} style={styles.button}>
          Signup
        </button>

        <p>
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} style={styles.link}>
            Login
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

export default Signup;
