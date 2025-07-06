import React from "react";

export default function GameModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', zIndex: 9999, left: 0, top: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: '#291b44', border: '3px solid #23dd68', borderRadius: 16, boxShadow: '0 0 30px #23dd68',
        padding: '2.5rem 2rem', position: 'relative', minWidth: 360, minHeight: 580
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute', right: 18, top: 10, fontSize: 24,
            background: 'none', border: 'none', color: '#ffea64', cursor: 'pointer'
          }}
          aria-label="Close"
        >✕</button>
        <h2 style={{
          fontFamily: "'Press Start 2P', monospace",
          color: '#ffea64', textAlign: 'center', marginBottom: 24, marginTop: 0
        }}>
          Mini Game: TETRIS
        </h2>
        <iframe
          src="https://djblue.github.io/tetris/"
          width="340"
          height="520"
          title="Tetris Game"
          style={{
            border: "none",
            borderRadius: "8px",
            background: "#1a1033",
            boxShadow: "0 0 12px #23dd68"
          }}
        ></iframe>
      </div>
    </div>
  );
}
