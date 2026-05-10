import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { AppContext } from "../context/context";
import { showToast } from "../utils/toast";

const CATEGORIES = ["desi", "phool", "art", "quote", "henna", "song", "fanart", "food", "music"];

function CreatePin() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { createPin, user } = useContext(AppContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("art");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // A simple image validation regex
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !image.trim()) {
      showToast("Title and Image URL are required!", "error");
      return;
    }
    
    if (!isValidUrl(image) && !image.startsWith("/")) {
      showToast("Please provide a valid image URL", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      await createPin({
        title: title.trim(),
        image: image.trim(),
        category,
        author: user?.name || "Anonymous",
        likes: 0,
        saves: 0
      });
      showToast("Pin created successfully!", "success");
      navigate("/dashboard");
    } catch (err) {
      showToast("Failed to create pin", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <h1 style={styles.title}>Create a Pin</h1>
            <p style={styles.sub}>Share your inspiration with the world</p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Title</label>
              <input
                style={styles.input}
                placeholder="e.g. Aesthetic Sunset"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={40}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Image URL</label>
              <input
                style={styles.input}
                placeholder="https://images.unsplash.com/..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
              {image && (isValidUrl(image) || image.startsWith("/")) && (
                <div style={styles.previewWrap}>
                  <p style={styles.previewLabel}>Preview:</p>
                  <img src={image} alt="Preview" style={styles.previewImg} onError={(e) => e.target.style.display = 'none'} />
                </div>
              )}
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Category</label>
              <div style={styles.categoryGrid}>
                {CATEGORIES.map(cat => (
                  <div
                    key={cat}
                    style={{
                      ...styles.catBtn,
                      background: category === cat ? "#1A1A2E" : "#FFF8EE",
                      color: category === cat ? "#FFD93D" : "#7A7080",
                      borderColor: category === cat ? "#1A1A2E" : "#EAE0D5"
                    }}
                    onClick={() => setCategory(cat)}
                  >
                    {cat}
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.actions}>
              <button 
                type="button" 
                onClick={() => navigate(-1)} 
                style={styles.cancelBtn}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                style={styles.submitBtn}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Pin"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "40px 24px",
  },
  card: {
    background: "white",
    borderRadius: "24px",
    border: "2.5px solid #1A1A2E",
    padding: "40px",
    boxShadow: "6px 6px 0 #1A1A2E",
  },
  header: {
    marginBottom: "32px",
    borderBottom: "2px solid #EAE0D5",
    paddingBottom: "24px",
  },
  title: {
    fontFamily: "Fraunces, serif",
    fontSize: "36px",
    fontWeight: 700,
    color: "#1A1A2E",
    marginBottom: "8px",
  },
  sub: {
    fontFamily: "Cabinet Grotesk, sans-serif",
    fontSize: "15px",
    color: "#7A7080",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontFamily: "Cabinet Grotesk, sans-serif",
    fontWeight: 800,
    fontSize: "14px",
    color: "#1A1A2E",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  input: {
    padding: "14px 16px",
    borderRadius: "12px",
    border: "2px solid #EAE0D5",
    fontFamily: "Cabinet Grotesk, sans-serif",
    fontSize: "16px",
    color: "#1A1A2E",
    outline: "none",
    transition: "border-color 0.2s",
  },
  previewWrap: {
    marginTop: "12px",
    padding: "16px",
    background: "#FFF8EE",
    borderRadius: "12px",
    border: "1.5px dashed #EAE0D5",
  },
  previewLabel: {
    fontFamily: "Cabinet Grotesk, sans-serif",
    fontSize: "13px",
    fontWeight: 700,
    color: "#7A7080",
    marginBottom: "8px",
  },
  previewImg: {
    width: "100%",
    maxWidth: "300px",
    height: "auto",
    borderRadius: "8px",
    objectFit: "cover",
    border: "2px solid #EAE0D5",
  },
  categoryGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },
  catBtn: {
    padding: "8px 16px",
    borderRadius: "99px",
    border: "2px solid",
    fontFamily: "Cabinet Grotesk, sans-serif",
    fontWeight: 700,
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 0.2s",
    textTransform: "capitalize",
  },
  actions: {
    display: "flex",
    gap: "16px",
    marginTop: "16px",
    paddingTop: "24px",
    borderTop: "2px solid #EAE0D5",
  },
  cancelBtn: {
    flex: 1,
    padding: "14px",
    background: "transparent",
    border: "2px solid #EAE0D5",
    borderRadius: "12px",
    fontFamily: "Cabinet Grotesk, sans-serif",
    fontWeight: 700,
    fontSize: "15px",
    color: "#7A7080",
    cursor: "pointer",
  },
  submitBtn: {
    flex: 2,
    padding: "14px",
    background: "#FF5EBA",
    color: "white",
    border: "2.5px solid #1A1A2E",
    borderRadius: "12px",
    fontFamily: "Cabinet Grotesk, sans-serif",
    fontWeight: 800,
    fontSize: "15px",
    cursor: "pointer",
    boxShadow: "3px 3px 0 #1A1A2E",
  },
};

export default CreatePin;
