import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import CustomerDashboard from "./pages/CustomerDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Designs from "./pages/Designs";
import MyBookings from "./pages/MyBookings";
import AddDesign from "./pages/AddDesign";
import ManageDesigns from "./pages/ManageDesigns";
import EditDesign from "./pages/EditDesign";

import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        let userRole = "customer";

        if (docSnap.exists()) {
          userRole = docSnap.data().role;
        } else {
          await setDoc(docRef, {
            email: currentUser.email,
            role: "customer",
          });
        }

        setRole(userRole);

        navigate(userRole === "owner" ? "/owner" : "/customer");
      } else {
        setUser(null);
        setRole(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  return (
    <div>
      <Navbar user={user} role={role} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/designs"
          element={
            <ProtectedRoute user={user}>
              <Designs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute user={user}>
              <MyBookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customer"
          element={
            <ProtectedRoute user={user} role={role} allowedRole="customer">
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner"
          element={
            <ProtectedRoute user={user} role={role} allowedRole="owner">
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-design"
          element={
            <ProtectedRoute user={user} role={role} allowedRole="owner">
              <AddDesign />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-designs"
          element={
            <ProtectedRoute user={user} role={role} allowedRole="owner">
              <ManageDesigns />
            </ProtectedRoute>
          }
        />

        {/* ✅ FIXED EDIT ROUTE */}
        <Route
          path="/edit-design/:id"
          element={
            <ProtectedRoute user={user} role={role} allowedRole="owner">
              <EditDesign />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
