import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  const handleDesignClick = () => {
    if (user) navigate("/designs");
    else navigate("/signup");
  };

  const categories = [
    {
      name: "Salwar Suit",
      img: "https://fashiondoctorz.com/wp-content/uploads/2024/06/punjabi-salwar-suit-design-for-girls-1.webp",
    },
    {
      name: "Plazo Suit",
      img: "https://www.jaipurinaari.com/cdn/shop/files/IMG-20240927-WA0066.jpg?v=1727450335",
    },
    {
      name: "Dress",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvD6r7EIh5TvmLhShlSvo9_mqpcmmoxQFqvw&s",
    },
    {
      name: "Kurti",
      img: "https://www.ethnicrajasthan.com/cdn/shop/files/APKULCCSPPLGM11201ER00M_7.jpg?v=1729936393&width=2048",
    },
  ];

  return (
    <div>
      {/* 🔥 HERO */}
      <section style={styles.hero}>
        <div style={styles.heroImage}></div>
        <div style={styles.overlay}></div>

        <div style={styles.heroContent}>
          <h1 style={styles.title}>Boutiq</h1>
          <p style={styles.subtitle}>Stitching that defines your elegance</p>

          <button
            onClick={() => navigate("/customer")}
            style={styles.primaryBtn}
          >
            Book Your Stitching
          </button>
        </div>
      </section>

      {/* 🔥 ABOUT */}
      <section style={styles.about}>
        <div style={styles.aboutCard}>
          <h2 style={styles.aboutTitle}>Designed For You</h2>

          <p style={styles.aboutText}>
            Every outfit at Boutiq is tailored with precision and crafted to
            match your personality.
          </p>

          <p style={styles.aboutText}>
            Experience premium stitching with doorstep pickup and real-time
            tracking.
          </p>

          <p style={styles.location}>📍 Bathinda, Punjab</p>
        </div>
      </section>

      {/* 🔥 CATEGORIES */}
      <section style={styles.categories}>
        <h2 style={styles.categoryTitle}>Explore Collections</h2>

        <div style={styles.grid}>
          {categories.map((item, i) => (
            <div key={i} style={styles.card} onClick={handleDesignClick}>
              <div style={styles.imageWrapper}>
                <img src={item.img} alt="" style={styles.img} />
                <div style={styles.cardOverlay}></div>
                <h3 style={styles.cardText}>{item.name}</h3>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <button onClick={handleDesignClick} style={styles.secondaryBtn}>
            View All Designs
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;

// 🎨 STYLES

const styles = {
  hero: {
    height: "85vh",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  // ✅ YOUR IMAGE USED HERE + ANIMATION
  heroImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundImage:
      "url('https://www.textileexcellence.com/uploads/news/women.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    animation: "zoomHero 20s ease-in-out infinite",
  },

  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.6)",
  },

  heroContent: {
    position: "relative",
    textAlign: "center",
    color: "#fff",
    animation: "fadeIn 1.2s ease",
  },

  title: {
    fontSize: "60px",
    fontWeight: "700",
    letterSpacing: "2px",
    textShadow: "0 5px 20px rgba(0,0,0,0.6)",
  },

  subtitle: {
    margin: "15px 0 25px",
    fontSize: "18px",
    opacity: 0.9,
  },

  primaryBtn: {
    padding: "14px 32px",
    borderRadius: "30px",
    border: "none",
    background: "linear-gradient(45deg, #ff4d6d, #ff758f)",
    color: "#fff",
    fontSize: "15px",
    cursor: "pointer",
  },

  about: {
    padding: "80px 20px",
    background: "linear-gradient(135deg, #ffe4e6, #fbcfe8)",
    display: "flex",
    justifyContent: "center",
  },

  aboutCard: {
    maxWidth: "700px",
    background: "#fff",
    padding: "30px",
    borderRadius: "20px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
    textAlign: "center",
  },

  aboutTitle: {
    fontSize: "26px",
    marginBottom: "15px",
  },

  aboutText: {
    color: "#555",
    lineHeight: "1.7",
  },

  location: {
    marginTop: "10px",
    color: "#ff4d6d",
    fontWeight: "600",
  },

  categories: {
    padding: "80px 10%",
    background: "linear-gradient(135deg, #fdf2f8, #fce7f3)",
  },

  categoryTitle: {
    textAlign: "center",
    fontSize: "28px",
    marginBottom: "40px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "30px",
  },

  card: {
    borderRadius: "20px",
    overflow: "hidden",
    cursor: "pointer",
    boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
  },

  imageWrapper: {
    position: "relative",
    height: "300px",
  },

  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  cardOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    background: "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.1))",
  },

  cardText: {
    position: "absolute",
    bottom: "20px",
    left: "20px",
    color: "#fff",
    fontSize: "20px",
    fontWeight: "600",
  },

  secondaryBtn: {
    padding: "12px 28px",
    borderRadius: "30px",
    border: "none",
    background: "#e91e63",
    color: "#fff",
    cursor: "pointer",
  },
};

// 🔥 ANIMATIONS

const sheet = document.styleSheets[0];

sheet.insertRule(
  `
@keyframes zoomHero {
  0% { transform: scale(1); }
  50% { transform: scale(1.08); }
  100% { transform: scale(1); }
}`,
  sheet.cssRules.length,
);

sheet.insertRule(
  `
@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0); }
}`,
  sheet.cssRules.length,
);
