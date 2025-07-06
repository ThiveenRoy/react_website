import React, { useEffect, useState, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import AOS from "aos";
import "aos/dist/aos.css";
import "./App.css";
import ContactForm from './ContactForm';

gsap.registerPlugin(ScrollTrigger);

const NAV = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

const TIMELINE = [
  {
    title: "Software QA Engineer",
    meta: "Creative Labs Pte Ltd • Sep 2023 – Present",
    bullets: [
      "Ensure high-quality standards through test cases and automation.",
      "Manage test cases and defects (TestRail, Mantis).",
      "Manual & automation test coverage across Windows, iOS, Android, macOS.",
    ],
  },
  {
    title: "Transport Operator (NSF)",
    meta: "Singapore Armed Forces • Jul 2021 – Jul 2023",
    bullets: [
      "Operated Class 3/4 military vehicles for logistics operations.",
      "Appointed as Vehicle Commander for missions.",
      "Received CTO Coin for exemplary service.",
    ],
  },
  {
    title: "Software Engineer",
    meta: "Zionext Pte Ltd • Mar 2021 – Jul 2021",
    bullets: [
      "Developed ASP.NET web apps and Android apps for government project.",
      "Collaborated in Agile team using Git and JIRA.",
      "Promoted to SDET within first month.",
    ],
  },
  {
    title: "SDET / SDET Intern",
    meta: "MQ Spectrum Pte Ltd • Mar 2020 – Mar 2021",
    bullets: [
      "Tested apps and websites in Agile teams.",
      "Logged and verified defects in JIRA.",
      "Participated in daily stand-ups and sprints.",
    ],
  },
];

// Utility for splitting text into spans for char-by-char animation
function SplitText({ text, cursor = false, animateIn = true }) {
  return (
    <span>
      {text.split("").map((char, idx) => (
        <span
          key={idx}
          className={`split-char${animateIn ? " split-char-in" : ""}`}
          style={{
            display: "inline-block",
            whiteSpace: char === " " ? "pre" : undefined,
          }}
        >
          {char}
        </span>
      ))}
      {cursor && <span className="blinky-cursor">█</span>}
    </span>
  );
}

// Real-time clock for footer
function LiveTime() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <span>
      {now.toLocaleTimeString("en-SG", { hour12: false })} SGT (GMT+8)
    </span>
  );
}

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // Hero section typewriter
  const heroTitle = "Welcome to My Portfolio";
  const [typed, setTyped] = useState('');
  const [showSubtitle, setShowSubtitle] = useState(false);

  // Refs for hero anims
  const heroTitleRef = useRef();
  const heroSubRef = useRef();

  // Loader: fake progress
  useEffect(() => {
    let prog = 0;
    const totalDuration = 3500;
    const steps = 100;
    const stepTime = totalDuration / steps;
    const interval = setInterval(() => {
      prog += 1;
      setProgress(prog);
      if (prog >= 100) {
        clearInterval(interval);
        setTimeout(() => setShowLoading(false), 400);
      }
    }, stepTime);
    return () => clearInterval(interval);
  }, []);

  // Typewriter effect (start after loader gone)
  useEffect(() => {
    if (showLoading) return;
    let idx = 0;
    setTyped('');
    setShowSubtitle(false);
    const interval = setInterval(() => {
      setTyped(heroTitle.slice(0, idx + 1));
      idx++;
      if (idx === heroTitle.length) {
        clearInterval(interval);
        setTimeout(() => setShowSubtitle(true), 600);
      }
    }, 65);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [showLoading]);

  // Hero fly-off by character on scroll
  useEffect(() => {
    if (!heroTitleRef.current || !heroSubRef.current) return;

    const titleChars = heroTitleRef.current.querySelectorAll(".split-char");
    const subtitleChars = heroSubRef.current.querySelectorAll(".split-char");

    // For performance, don't run unless typewriter is finished and subtitle is shown
    if (typed.length !== heroTitle.length || !showSubtitle) return;

    const trigger = ScrollTrigger.create({
      trigger: "#hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        // Animate title
        titleChars.forEach((char, i) => {
          const prog = Math.max(0, self.progress * (titleChars.length + 7) - i);
          gsap.to(char, {
            y: -70 * prog,
            opacity: 1 - prog * 1.4,
            filter: `blur(${prog * 4.2}px)`,
            duration: 0.01,
            overwrite: "auto",
          });
        });
        // Animate subtitle
        subtitleChars.forEach((char, i) => {
          const prog = Math.max(0, self.progress * (subtitleChars.length + 7) - i);
          gsap.to(char, {
            y: -30 * prog,
            opacity: 1 - prog * 1.7,
            filter: `blur(${prog * 4.2}px)`,
            duration: 0.01,
            overwrite: "auto",
          });
        });
      },
    });

    return () => {
      titleChars.forEach((char) => gsap.set(char, { clearProps: "all" }));
      subtitleChars.forEach((char) => gsap.set(char, { clearProps: "all" }));
      if (trigger) trigger.kill();
    };
  }, [typed, showSubtitle]);

  // Lenis + GSAP
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.16, smoothWheel: true, smoothTouch: false, touchMultiplier: 1.3 });
    function raf(time) {
      lenis.raf(time);
      ScrollTrigger.update();
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  // AOS Animation
  useEffect(() => {
    AOS.init({ duration: 900, once: true, offset: 80 });
  }, []);

  useEffect(() => {
    ScrollTrigger.getAll().forEach(t => t.kill());
    gsap.utils.toArray('.section').forEach((section, i) => {
      gsap.fromTo(section,
        { opacity: 0, y: 80, scale: 0.97, filter: "blur(5px)" },
        { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.88 + i * 0.07, ease: "steps(8)", scrollTrigger: {
          trigger: section, start: "top 82%", toggleActions: "play none none none", once: true,
        }}
      );
    });
    gsap.utils.toArray('.section h2').forEach(h2 => {
      ScrollTrigger.create({
        trigger: h2,
        start: "top 85%",
        onEnter: () => {
          h2.classList.add('pixel-flicker');
          setTimeout(() => h2.classList.remove('pixel-flicker'), 800);
        }
      });
    });
    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  const handleNav = (id) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      {/* === RETRO LOADING OVERLAY === */}
      {showLoading && (
        <div className="retro-loader-overlay">
          <div className="retro-loader-window">
            <div className="retro-loader-title">LOADING...</div>
            <div className="retro-loader-bar">
              <div className="retro-loader-bar-fill" style={{width: `${progress}%`}} />
            </div>
            <div className="retro-loader-status">
              Loading assets… {progress}%
            </div>
            <div className="retro-loader-coin">
              <span className="insert-coin-text">INSERT COIN</span>
            </div>
          </div>
        </div>
      )}

      <div className="crt-scanlines"></div>
      {/* HEADER */}
      <header className="site-header">
        <div className="header-inner">
          <div>
            <div className="site-title-main">My Portfolio</div>
            <div className="site-title-sub">coded by Thiveen</div>
          </div>
          <nav className="site-nav">
            {NAV.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={e => { e.preventDefault(); handleNav(item.id); }}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <button className="mobile-menu-btn" aria-label="Open menu" onClick={() => setMobileOpen(v => !v)}>
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="mobile-menu">
          <nav>
            {NAV.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={e => { e.preventDefault(); handleNav(item.id); }}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <button className="mobile-menu-close" onClick={() => setMobileOpen(false)}>✕</button>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="snap-container">
        <section id="hero" className="section hero">
          <h2
            ref={heroTitleRef}
            style={{
              letterSpacing: '1.5px',
              minHeight: '2.4em',
              whiteSpace: 'pre'
            }}
          >
            <SplitText text={typed} cursor={typed.length < heroTitle.length} />
          </h2>
          <p
            ref={heroSubRef}
            className={showSubtitle ? "hero-sub-visible" : "hero-sub-hidden"}
            style={{ minHeight: "2em", transition: "opacity 0.6s" }}
          >
            <SplitText text="Scroll down to discover more!" animateIn={showSubtitle} />
          </p>
        </section>
        <section id="about" className="section">
          <h2>About Me</h2>
          <div className="about-block">
            <img src="/image.jpeg" alt="Thiveen Roy" className="about-img" />
            <div className="about-text">
              <p style={{ fontWeight: 700, color: "#ffea64" }}>
                Hi, I’m Thiveen – QA Engineer @ Creative Labs
              </p>
              <p>
                I break things so users don’t have to.<br />
                I test audio products, build automation scripts, and make sure every release is rock solid.<br /><br />
                Always curious, always learning. Let’s connect!
              </p>
            </div>
          </div>
        </section>
        <section id="experience" className="section experience-section">
          <h2>Experience</h2>
          <VerticalTimeline lineColor="#23dd68">
            {TIMELINE.map((item, idx) => (
              <VerticalTimelineElement
                key={item.title}
                contentStyle={{
                  background: "#291b44",
                  color: "#e7eedd",
                  border: "2.5px solid #ffea64",
                  borderRadius: "16px",
                  boxShadow: "0 6px 20px #000b, 0 0 0 #23dd6844, 0 0 12px #ffea6466 inset",
                  fontFamily: "'Press Start 2P', monospace",
                  padding: "1.1rem 1.7rem",
                  transition: "box-shadow 0.18s, border-color 0.16s"
                }}
                contentArrowStyle={{
                  borderRight: `8px solid #ffea64`
                }}
                date={item.meta.split('•').map((str, idx) =>
                  idx === 0
                    ? <>{str.trim()} <span style={{ color: '#23dd68', margin: '0 6px' }}></span><br /></>
                    : str.trim()
                )}
                dateClassName="timeline-date"
                iconStyle={{
                  background: "#23dd68",
                  color: "#201642",
                  boxShadow: "0 0 0 4px #232, 0 0 18px #ffea6477, 0 0 16px #23dd6888"
                }}
                className="aos-fade-up"
                data-aos="fade-up"
              >
                <div className="timeline-title">{item.title}</div>
                <ul>
                  {item.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </VerticalTimelineElement>
            ))}
          </VerticalTimeline>
        </section>
        <section id="projects" className="section">
          <h2>Projects</h2>
          <ul>
            <li>Portfolio Website (this one!)</li>
            <li>Automated Test Suite for Audio Devices</li>
            <li>Robotics Hobby Projects</li>
            <li>More coming soon...</li>
          </ul>
          <div className="dev-blink-msg">
            🚧 This section is in development 🚧
          </div>
        </section>
        <section id="contact" className="section contact-section-modern">
          <h2>Contact</h2>
          <ContactForm />
        </section>
        <footer className="footer-bar">
          <span>
            QA/LLM enthusiast &nbsp;|&nbsp; Tech tinker &nbsp;|&nbsp; Breaking &amp; fixing things &nbsp;|&nbsp; Based in SG 🇸🇬
          </span>
          <span className="footer-bar-time">
            <b>Time:</b> <LiveTime />
          </span>
          <span className="footer-bar-socials">
            <b>Socials:</b> <a href="https://linkedin.com/in/thiveenroy" target="_blank" rel="noopener noreferrer">LinkedIn</a> &nbsp; <a href="https://github.com/thiveenroy" target="_blank" rel="noopener noreferrer">GitHub</a>
          </span>
        </footer>
      </main>
    </div>
  );
}
