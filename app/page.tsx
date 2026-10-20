'use client'

import { FormEvent, useEffect, useState } from 'react'

const experiences = [
  {
    role: 'Jr. Frontend Developer', company: 'Entertainment Technologists', location: 'Pune', period: 'April 2026 — Present',
    bullets: [
      'Collaborate daily with a cross-functional team to build and refine a B2B marketplace platform, communicating updates and gathering feedback from stakeholders across departments.',
      'Explain technical features and platform capabilities in clear, simple terms to non-technical colleagues and clients, supporting adoption and reducing confusion.',
      'Manage multiple concurrent tasks and shifting priorities in a fast-paced, deadline-driven environment while maintaining a high standard of accuracy.',
    ],
  },
  {
    role: 'Software Developer', company: 'ANG Software Ltd', location: 'Pune', period: 'January 2025 — March 2026',
    bullets: [
      'Supported end users and internal teams by walking them through new features of an enterprise insurance platform, tailoring explanations to each audience’s familiarity with the product.',
      'Worked within a shared-responsibility team model, proactively helping colleagues troubleshoot issues and pass on product knowledge.',
      'Handled sensitive customer and policy data with strict confidentiality and accuracy, in line with company data-protection standards.',
      'Balanced several ongoing projects simultaneously, prioritising effectively to meet deadlines without sacrificing quality.',
    ],
  },
]

const strengths = [
  ['Product knowledge & curiosity', 'Self-driven learner staying current on web frameworks, AI tools, cloud platforms, Apple products, services, and purchase options.'],
  ['Simplifying the complex', 'Translating technical workflows and features into plain language for non-technical stakeholders and end users.'],
  ['Team collaboration', 'Working closely with design, QA, and backend teams while sharing knowledge and supporting colleagues.'],
  ['Fast-paced environments', 'Juggling multiple concurrent tasks and tight deadlines without compromising quality or attention to detail.'],
  ['Trust & discretion', 'Handling sensitive user and business data with strict accuracy and confidentiality across enterprise applications.'],
]

const skills = ['React', 'Node.js', 'Python', 'AI tools', 'SQL', 'Communication & Presentation', 'Problem Solving', 'Team Collaboration', 'Time Management', 'Adaptability', 'Tech-savvy']
const certifications = ['TCS iON Career Edge – Young Professional', 'Introduction to Generative AI – Certificate of Accomplishment', 'Employee CyberSecurity Awareness: First Line of Defense', 'Professional Certificate in Agile and Scrum (Udemy)', 'SQL (Intermediate) & Artificial Intelligence Basic Level 1 – Certificates of Accomplishment']

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dark, setDark] = useState(false)
  const [formStatus, setFormStatus] = useState('')
  const close = () => setMenuOpen(false)
  useEffect(() => { document.documentElement.dataset.theme = dark ? 'dark' : 'light' }, [dark])
  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormStatus('Sending…')
    const form = new FormData(event.currentTarget)
    const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(form)) })
    setFormStatus(response.ok ? 'Message sent. Thank you.' : 'Please check your details and try again.')
    if (response.ok) event.currentTarget.reset()
  }
  return (
    <main id="top">
      <header className="site-header">
        <a className="mini-mark" href="#top" aria-label="Amey Mali home">AM</a>
        <nav className={menuOpen ? 'open' : ''} aria-label="Main navigation">
          <a href="#about" onClick={close}>About</a><a href="#strengths" onClick={close}>Strengths</a><a href="#experience" onClick={close}>Experience</a><a href="#education" onClick={close}>Education</a><a className="header-button" href="mailto:ameymali2@gmail.com">Let&apos;s talk <span>↗</span></a>
        </nav>
        <div className="header-tools"><button className="theme-toggle" onClick={() => setDark(!dark)} aria-label={dark ? 'Switch to day theme' : 'Switch to night theme'}>{dark ? 'Day' : 'Night'} mode</button><button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle navigation"><span /><span /></button></div>
      </header>

      <section className="resume-section hero-section">
        <div className="hero-grid"><div><p className="kicker">Software developer · Mumbai, Maharashtra, India</p><h1>AMEY<br />MALI</h1><p className="hero-subtitle">Personable and technically fluent professional with 1.9+ years of hands-on experience building and explaining software products to diverse users.</p><div className="hero-actions"><a className="pill-button dark" href="#experience">View experience <span>↘</span></a><a className="under-link" href="mailto:ameymali2@gmail.com">Get in touch ↗</a><a className="under-link" href="/api/download">Download frontend + backend ↧</a></div></div><div className="hero-photo"><img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/amey-JezmfTCHXYO6fiBwXUmA8iHfIVaDm3.jpeg" alt="Amey Mali in a suit" /><span className="photo-label">AM · SOFTWARE DEVELOPER</span></div></div>
      </section>

      <section className="resume-section intro-section" id="about"><p className="kicker">01 — Profile</p><div className="two-col"><h2>Hi there!<br /><span>I make technology feel human.</span></h2><div><p>Genuinely passionate about Apple&apos;s ecosystem of products and services, with a strong ability to translate technical detail into simple, relatable guidance.</p><p>Comfortable in fast-paced, team-based environments, quick to learn new products, and driven to create a genuine, only-at-Apple experience for every customer.</p><div className="contact-line"><a href="tel:+917517359266">+91 75173 59266</a><a href="mailto:ameymali2@gmail.com">ameymali2@gmail.com</a></div></div></div></section>

      <section className="resume-section skills-section" id="strengths"><p className="kicker">02 — Relevant strengths</p><div className="two-col"><h2>What I bring</h2><div className="strength-list">{strengths.map(([title, text], i) => <article key={title}><span>0{i + 1}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></div></section>

      <section className="resume-section experience-section" id="experience"><p className="kicker">03 — Experience</p><div className="two-col experience-layout"><h2>Where I&apos;ve been</h2><div className="experience-list">{experiences.map((item, i) => <article className="resume-card" key={item.company}><div className="card-top"><div><span className="card-index">0{i + 1} · {item.location}</span><h3>{item.company}</h3><p className="role-line">{item.role} · {item.period}</p></div><span className="card-arrow">↗</span></div><ul>{item.bullets.map(b => <li key={b}>{b}</li>)}</ul></article>)}</div></div></section>

      <section className="resume-section toolkit-section"><p className="kicker">04 — Additional skills</p><div className="two-col"><h2>How I work</h2><div className="skills-list">{skills.map((skill, i) => <span className={i < 5 ? 'skill-chip highlighted' : 'skill-chip'} key={skill}>{skill}</span>)}</div></div></section>

      <section className="resume-section education-section" id="education"><p className="kicker">05 — Education & certifications</p><div className="education-grid"><article><span>2018 — 2019</span><h3>SSC</h3><p>J.M.R.E.S ROHA RAIGAD</p></article><article><span>2019 — 2021</span><h3>HSC</h3><p>S.S. High School & Jr. College, Seawood, Navi Mumbai</p></article><article><span>Graduated June 2025</span><h3>B.E. Information Technology</h3><p>Vidyalankar Institute of Technology, Mumbai<br /><strong>CGPA 9.48/10 · 82.15%</strong></p></article></div><div className="certifications"><h3>Certifications</h3><ul>{certifications.map(cert => <li key={cert}>{cert}</li>)}</ul></div></section>

      <section className="contact-section"><p className="kicker">06 — Let&apos;s connect</p><h2>Let&apos;s build<br /><span>something.</span></h2><p>Open to conversations about software products, customer-focused technology, and new opportunities.</p><a className="pill-button yellow" href="mailto:ameymali2@gmail.com">ameymali2@gmail.com ↗</a><form className="contact-form" onSubmit={sendMessage}><input name="name" required placeholder="Your name" aria-label="Your name" /><input name="email" type="email" required placeholder="Your email" aria-label="Your email" /><textarea name="message" required minLength={10} placeholder="Your message" aria-label="Your message" /><button className="pill-button dark" type="submit">Send message ↗</button>{formStatus && <span role="status">{formStatus}</span>}</form><div className="social-links"><a href="https://www.linkedin.com/in/amey-mali" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="https://github.com/Amey2701" target="_blank" rel="noreferrer">GitHub ↗</a></div></section>
      <footer><span>© 2026 Amey Mali</span><span>Mumbai · Maharashtra · India</span><div><a href="tel:+917517359266">+91 75173 59266</a></div></footer>
    </main>
  )
}
