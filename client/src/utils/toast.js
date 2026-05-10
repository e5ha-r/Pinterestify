/**
 * Lightweight toast notifications — no external library needed.
 * Usage: showToast("Saved! ✨")  |  showToast("Error", "error")
 */
export function showToast(message, type = "success") {
  // Remove existing toast if any
  document.getElementById("__toast")?.remove();

  const el = document.createElement("div");
  el.id = "__toast";
  el.textContent = message;
  Object.assign(el.style, {
    position:     "fixed",
    bottom:       "32px",
    left:         "50%",
    transform:    "translateX(-50%)",
    background:   type === "error" ? "#FF2D55" : "#1A1A2E",
    color:        type === "error" ? "white"   : "#FFD93D",
    padding:      "12px 24px",
    borderRadius: "99px",
    fontFamily:   "Cabinet Grotesk, sans-serif",
    fontWeight:   "800",
    fontSize:     "14px",
    zIndex:       "9999",
    boxShadow:    "0 4px 24px rgba(0,0,0,0.18)",
    transition:   "opacity 0.3s",
    pointerEvents:"none",
  });

  document.body.appendChild(el);
  setTimeout(() => { el.style.opacity = "0"; setTimeout(() => el.remove(), 300); }, 2500);
}
