"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const experiences = [
  {
    role: "Jr. React Developer",
    company: "Entertainment Technologists",
    location: "Pune",
    period: "April 2026 — Present",
    bullets: [
      "Collaborate daily with a cross-functional team to build and refine a B2B marketplace platform, communicating updates and gathering feedback from stakeholders across departments.",
      "Explain technical features and platform capabilities in clear, simple terms to non-technical colleagues and clients, supporting adoption and reducing confusion.",
      "Manage multiple concurrent tasks and shifting priorities in a fast-paced, deadline-driven environment while maintaining a high standard of accuracy.",
    ],
  },
  {
    role: "Software Developer",
    company: "ANG Software Ltd",
    location: "Pune",
    period: "January 2025 — March 2026",
    bullets: [
      "Supported end users and internal teams by walking them through new features of an enterprise insurance platform, tailoring explanations to each audience’s familiarity with the product.",
      "Worked within a shared-responsibility team model, proactively helping colleagues troubleshoot issues and pass on product knowledge.",
      "Handled sensitive customer and policy data with strict confidentiality and accuracy, in line with company data-protection standards.",
      "Balanced several ongoing projects simultaneously, prioritising effectively to meet deadlines without sacrificing quality.",
    ],
  },
];

const strengths = [
  [
    "Product knowledge & curiosity",
    "Self-driven learner staying current on web frameworks, AI tools, cloud platforms, Apple products, services, and purchase options.",
  ],
  [
    "Simplifying the complex",
    "Translating technical workflows and features into plain language for non-technical stakeholders and end users.",
  ],
  [
    "Team collaboration",
    "Working closely with design, QA, and backend teams while sharing knowledge and supporting colleagues.",
  ],
  [
    "Fast-paced environments",
    "Juggling multiple concurrent tasks and tight deadlines without compromising quality or attention to detail.",
  ],
  [
    "Trust & discretion",
    "Handling sensitive user and business data with strict accuracy and confidentiality across enterprise applications.",
  ],
];

const stack = [
  {
    title: "Frontend",
    items: ["React", "Next.js", "TypeScript", "HTML & CSS", "Tailwind CSS"],
  },
  {
    title: "Backend",
    items: ["Node.js", "Python", "REST APIs"],
  },
  {
    title: "Data & AI",
    items: ["SQL (Intermediate)", "Generative AI", "AI tools"],
  },
  {
    title: "Workflow",
    items: [
      "Git & GitHub",
      "Agile & Scrum",
      "Vercel",
      "Cybersecurity awareness",
    ],
  },
];

const softSkills = [
  "Communication & Presentation",
  "Problem Solving",
  "Team Collaboration",
  "Time Management",
  "Adaptability",
  "Tech-savvy",
];

const certifications = [
  "TCS iON Career Edge – Young Professional",
  "Introduction to Generative AI – Certificate of Accomplishment",
  "Employee CyberSecurity Awareness: First Line of Defense",
  "Professional Certificate in Agile and Scrum (Udemy)",
  "SQL (Intermediate) & Artificial Intelligence Basic Level 1 – Certificates of Accomplishment",
];

const NAV_ITEMS = [
  { id: "about", label: "About" },
  { id: "strengths", label: "Strengths" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
] as const;

/* ------------------------------------------------------------------ */
/*  HOOKS                                                              */
/* ------------------------------------------------------------------ */

/** Reveal-on-scroll. Adds `is-visible` to elements with `.reveal`. */
function useRevealOnScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) {
      document
        .querySelectorAll<HTMLElement>(".reveal")
        .forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );
    document
      .querySelectorAll<HTMLElement>(".reveal")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/** Tracks which section is currently in view. */
function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string>(ids[0] ?? "");
  useEffect(() => {
    if (typeof window === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

/** Scroll progress from 0 → 1. */
function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (typeof window === "undefined") return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? window.scrollY / max : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  return progress;
}

/** Typewriter for the hero tagline. */
function useTypewriter(text: string, speed = 26, startDelay = 600) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) {
      setDisplayed(text);
      setDone(true);
      return;
    }
    let i = 0;
    let interval: ReturnType<typeof setInterval> | null = null;
    const startTimer = setTimeout(() => {
      interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          if (interval) clearInterval(interval);
          setDone(true);
        }
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(startTimer);
      if (interval) clearInterval(interval);
    };
  }, [text, speed, startDelay]);
  return { displayed, done };
}

/** Live clock (HH:MM in user's local timezone). */
function useLiveClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  return time;
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [formStatus, setFormStatus] = useState("");
  const [formOk, setFormOk] = useState(false);
  const [sending, setSending] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState("");
  const [messageLen, setMessageLen] = useState(0);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const paletteInputRef = useRef<HTMLInputElement>(null);

  const activeSection = useActiveSection(NAV_ITEMS.map((n) => n.id));
  const progress = useScrollProgress();
  const clock = useLiveClock();

  const heroTagline =
    "Jr. React Developer with 1.9+ years of experience building a B2B marketplace and an enterprise insurance platform — and explaining them in plain language to the people who use them.";
  const { displayed: typewritten, done: typingDone } =
    useTypewriter(heroTagline);

  useRevealOnScroll();

  const close = useCallback(() => setMenuOpen(false), []);

  /* Theme persistence */
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {
      /* noop */
    }
  }, [dark]);

  /* Restore theme on mount */
  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme");
      if (stored === "dark") setDark(true);
    } catch {
      /* noop */
    }
  }, []);

  /* ⌘K / Ctrl+K opens palette */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
      if (e.key === "Escape") setPaletteOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* Focus palette input when opened */
  useEffect(() => {
    if (paletteOpen) {
      setPaletteQuery("");
      setTimeout(() => paletteInputRef.current?.focus(), 20);
    }
  }, [paletteOpen]);

  /* Custom cursor glow (desktop, motion-safe only) */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const glow = document.getElementById("cursor-glow");
    if (!glow) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        glow.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
        glow.style.opacity = "1";
      });
    };
    const onLeave = () => {
      glow.style.opacity = "0";
    };
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  /* Contact form */
  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl = event.currentTarget;
    const data = Object.fromEntries(new FormData(formEl));

    setSending(true);
    setFormOk(false);
    setFormStatus("Sending…");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );

      if (response.ok) {
        formEl.reset();
        setMessageLen(0);
        setTouched({});
        setFormOk(true);
        setFormStatus("Message sent. Thank you — I'll get back to you soon.");
        setTimeout(() => setFormStatus(""), 6000);
      } else {
        const result = await response.json().catch(() => null);
        setFormStatus(
          result?.error || "Please check your details and try again.",
        );
      }
    } catch {
      setFormStatus("Could not reach the server. Please try again.");
    } finally {
      setSending(false);
    }
  }

  /* Command palette results */
  const paletteResults = useMemo(() => {
    const q = paletteQuery.trim().toLowerCase();
    const items = [
      ...NAV_ITEMS.map((n) => ({
        id: n.id,
        label: `Go to ${n.label}`,
        hint: "Section",
      })),
      { id: "contact", label: "Go to Contact", hint: "Section" },
      { id: "email", label: "Email Amey", hint: "ameymali2@gmail.com" },
      {
        id: "linkedin",
        label: "Open LinkedIn",
        hint: "linkedin.com/in/amey-mali",
      },
      { id: "github", label: "Open GitHub", hint: "github.com/Amey2701" },
      {
        id: "resume",
        label: "Download resume",
        hint: "Amey_Mali_Resume.pdf",
      },
    ];
    if (!q) return items;
    return items.filter(
      (i) =>
        i.label.toLowerCase().includes(q) || i.hint.toLowerCase().includes(q),
    );
  }, [paletteQuery]);

  function runPaletteAction(id: string) {
    setPaletteOpen(false);
    if (id === "email") {
      window.location.href = "mailto:ameymali2@gmail.com";
    } else if (id === "linkedin") {
      window.open(
        "https://www.linkedin.com/in/amey-mali",
        "_blank",
        "noopener,noreferrer",
      );
    } else if (id === "github") {
      window.open(
        "https://github.com/Amey2701",
        "_blank",
        "noopener,noreferrer",
      );
    } else if (id === "resume") {
      const a = document.createElement("a");
      a.href = "/Amey_Mali_Resume.pdf";
      a.download = "Amey_Mali_Resume.pdf";
      a.click();
    } else if (id === "contact") {
      document
        .querySelector(".contact-section")
        ?.scrollIntoView({ behavior: "smooth" });
    } else {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <main id="top" className="page">
      {/* Scroll progress bar */}
      <div
        className="scroll-progress"
        style={{ transform: `scaleX(${progress})` }}
        aria-hidden="true"
      />

      {/* Cursor glow */}
      <div id="cursor-glow" className="cursor-glow" aria-hidden="true" />

      {/* ============================ HEADER ============================ */}
      <header className="site-header">
        <a className="mini-mark" href="#top" aria-label="Amey Mali home">
          AM
        </a>
        <nav className={menuOpen ? "open" : ""} aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={close}
              className={activeSection === item.id ? "is-active" : ""}
              aria-current={activeSection === item.id ? "location" : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="header-tools">
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* ============================ HERO ============================ */}
      <section className="resume-section hero-section">
        <div className="hero-grid">
          <div>
            <p className="kicker">
              Jr. React Developer · Mumbai, Maharashtra, India
            </p>
            <h1>
              AMEY
              <br />
              MALI
            </h1>
            <p className="hero-subtitle" aria-live="polite">
              {typewritten}
              {!typingDone && (
                <span className="type-caret" aria-hidden="true">
                  ▌
                </span>
              )}
            </p>
            <div className="hero-actions">
              <a className="pill-button dark" href="#experience">
                View experience <span>↘</span>
              </a>
              <a
                className="pill-button"
                href="https://www.linkedin.com/in/amey-mali"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn <span>↗</span>
              </a>
              <a
                className="pill-button"
                href="https://github.com/Amey2701"
                target="_blank"
                rel="noreferrer"
              >
                GitHub <span>↗</span>
              </a>
              <a
                className="pill-button yellow"
                href="/Amey_Mali_Resume.pdf"
                download="Amey_Mali_Resume.pdf"
              >
                Resume<span>↓</span>
              </a>
            </div>
          </div>
          <div className="hero-photo">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/amey-JezmfTCHXYO6fiBwXUmA8iHfIVaDm3.jpeg"
              alt="Amey Mali in a suit"
              loading="eager"
            />
            <span className="photo-label">JR. REACT DEVELOPER</span>
          </div>
        </div>
      </section>

      {/* ============================ ABOUT ============================ */}
      <section className="resume-section intro-section reveal" id="about">
        <p className="kicker">01 — Profile</p>
        <div className="two-col">
          <h2>
            Hi there!
            <br />
            <span>I make technology feel human.</span>
          </h2>
          <div>
            <p>
              Personable and technically fluent professional with 1.9+ years of
              hands-on experience building and explaining software products to
              diverse users.
            </p>
            <p>
              Genuinely passionate about Apple&apos;s ecosystem of products and
              services, with a strong ability to translate technical detail into
              simple, relatable guidance.
            </p>
            <p>
              Comfortable in fast-paced, team-based environments, quick to learn
              new products, and driven to create a genuine, only-at-Apple
              experience for every customer.
            </p>
            <div className="contact-line">
              <a href="tel:+917517359266">+91 75173 59266</a>
              <a href="mailto:ameymali2@gmail.com">ameymali2@gmail.com</a>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ STRENGTHS ============================ */}
      <section className="resume-section skills-section reveal" id="strengths">
        <p className="kicker">02 — Relevant strengths</p>
        <div className="two-col">
          <h2>What I bring</h2>
          <div className="strength-list">
            {strengths.map(([title, text], i) => (
              <article key={title}>
                <span>0{i + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ EXPERIENCE ============================ */}
      <section
        className="resume-section experience-section reveal"
        id="experience"
      >
        <p className="kicker">03 — Experience</p>
        <div className="two-col experience-layout">
          <h2>Where I&apos;ve been</h2>
          <div className="experience-list">
            {experiences.map((item, i) => (
              <article className="resume-card" key={item.company}>
                <div className="card-top">
                  <div>
                    <span className="card-index">
                      0{i + 1} · {item.location}
                    </span>
                    <h3>{item.company}</h3>
                    <p className="role-line">
                      {item.role} · {item.period}
                    </p>
                  </div>
                  <span className="card-arrow">↗</span>
                </div>
                <ul>
                  {item.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ SKILLS ============================ */}
      <section className="resume-section toolkit-section reveal" id="skills">
        <p className="kicker">04 — Full-stack toolkit</p>
        <div className="two-col">
          <h2>
            How I build
            <br />
            <span>end to end.</span>
          </h2>
          <div>
            <div className="stack-grid">
              {stack.map((group) => (
                <div className="stack-group" key={group.title}>
                  <div className="stack-head">
                    <h3>{group.title}</h3>
                    <span className="stack-count">{group.items.length}</span>
                  </div>
                  <div className="skills-list">
                    {group.items.map((item) => (
                      <span className="skill-chip" key={item}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <h3 className="soft-title">How I work with people</h3>
            <div className="skills-list">
              {softSkills.map((s) => (
                <span className="skill-chip highlighted" key={s}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================ EDUCATION ============================ */}
      <section
        className="resume-section education-section reveal"
        id="education"
      >
        <p className="kicker">05 — Education &amp; certifications</p>

        <div className="education-grid">
          <article>
            <span>2018 — 2019</span>
            <h3>SSC</h3>
            <p>J.M. Rathi English School</p>
            <p>
              <strong>92%</strong>
            </p>
          </article>

          <article>
            <span>2019 — 2021</span>
            <h3>HSC</h3>
            <p>S.S. High School &amp; Jr. College, Seawood, Navi Mumbai</p>
            <p>
              <strong>94.17%</strong>
            </p>
          </article>

          <article>
            <span>Graduated June 2025</span>
            <h3>B.E. Information Technology</h3>
            <p>
              Vidyalankar Institute of Technology, Mumbai
              <br />
              <strong>CGPA 9.48/10 · 82.15%</strong>
            </p>
          </article>
        </div>

        <div className="certifications">
          <h3>Certifications</h3>
          <ul>
            {certifications.map((cert) => (
              <li key={cert}>{cert}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============================ CONTACT ============================ */}
      <section className="contact-section reveal">
        <div className="contact-grid">
          <div className="contact-info">
            <p className="kicker">06 — Let&apos;s connect</p>
            <h2>
              Let&apos;s build
              <br />
              <span>something.</span>
            </h2>
            <p>
              Open to conversations about software products, customer-focused
              technology, and new opportunities.
            </p>
          </div>

          <form className="contact-form" onSubmit={sendMessage} noValidate>
            <div className="field">
              <input
                name="name"
                required
                placeholder="Your name"
                aria-label="Your name"
                onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              />
              {touched.name && (
                <span className="field-hint">We&apos;ll never share this.</span>
              )}
            </div>
            <div className="field">
              <input
                name="email"
                type="email"
                required
                placeholder="Your email"
                aria-label="Your email"
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              />
              {touched.email && (
                <span className="field-hint">
                  I&apos;ll reply within a day or two.
                </span>
              )}
            </div>
            <div className="field">
              <textarea
                name="message"
                required
                placeholder="Your message"
                aria-label="Your message"
                onChange={(e) => setMessageLen(e.target.value.length)}
              />
            </div>
            <button
              className="pill-button dark send-btn"
              type="submit"
              disabled={sending}
            >
              {sending ? "Sending…" : "Send message ↗"}
            </button>
            {formStatus && (
              <span role="status" className={formOk ? "form-success" : ""}>
                {formStatus}
              </span>
            )}
          </form>
        </div>
      </section>

      <footer>
        <span>© {new Date().getFullYear()} Amey Mali</span>
        <div>
          <button
            className="footer-link"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Back to top ↑
          </button>
        </div>
      </footer>

      {/* ============================ COMMAND PALETTE ============================ */}
      {paletteOpen && (
        <div
          className="palette-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPaletteOpen(false);
          }}
        >
          <div className="palette">
            <input
              ref={paletteInputRef}
              className="palette-input"
              placeholder="Type a command or section…"
              value={paletteQuery}
              onChange={(e) => setPaletteQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && paletteResults[0]) {
                  runPaletteAction(paletteResults[0].id);
                }
              }}
            />
            <ul className="palette-results">
              {paletteResults.length === 0 && (
                <li className="palette-empty">No matches</li>
              )}
              {paletteResults.map((r) => (
                <li key={r.id}>
                  <button
                    className="palette-item"
                    onClick={() => runPaletteAction(r.id)}
                  >
                    <span>{r.label}</span>
                    <span className="palette-hint">{r.hint}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="palette-footer">
              <span>↑↓ navigate</span>
              <span>↵ select</span>
              <span>esc close</span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
