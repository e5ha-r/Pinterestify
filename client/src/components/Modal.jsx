import { useEffect } from "react";

function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={styles.overlay}
      onClick={onClose}
    >
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>{title}</h2>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>
        <div style={styles.body}>{children}</div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed", inset: 0,
    background: "rgba(26,26,46,0.5)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 500, backdropFilter: "blur(4px)",
    padding: "20px",
  },
  modal: {
    background: "white",
    borderRadius: "24px",
    border: "2.5px solid #1A1A2E",
    boxShadow: "8px 8px 0 #1A1A2E",
    width: "100%", maxWidth: "440px",
    maxHeight: "80vh", overflow: "auto",
  },
  header: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "20px 24px 16px",
    borderBottom: "2px solid #EAE0D5",
  },
  title: {
    fontFamily: "Fraunces, serif",
    fontWeight: 700, fontSize: "22px", color: "#1A1A2E",
  },
  closeBtn: {
    background: "#FFF8EE", border: "1.5px solid #EAE0D5",
    borderRadius: "50%", width: "32px", height: "32px",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", fontSize: "14px", color: "#7A7080",
  },
  body: { padding: "20px 24px 24px" },
};

export default Modal;
