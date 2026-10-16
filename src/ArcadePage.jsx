import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import BugSquasher from "./BugSquasher";
import "./App.css";

export default function ArcadePage() {
  useEffect(() => {
    document.title = "Arcade — Thiveen Roy";
    return () => { document.title = "Thiveen Roy"; };
  }, []);

  return (
    <div className="arcade-page">
      <div className="crt-scanlines"></div>
      <header className="arcade-page-header">
        <Link to="/" className="arcade-back-link">
          <span className="arcade-back-arrow">←</span> Back to Portfolio
        </Link>
        <div className="site-title-main">Arcade</div>
        <div className="site-title-sub">pick a game, beat your best</div>
      </header>

      <main className="arcade-page-main">
        <section className="arcade-game-card">
          <h2>Bug Squasher</h2>
          <BugSquasher />
        </section>

        <section className="arcade-game-card arcade-game-card-soon">
          <h2>More games coming soon</h2>
          <p>Got a game idea? Hit me up via the contact form.</p>
        </section>
      </main>
    </div>
  );
}
