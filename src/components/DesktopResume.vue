<template>
  <div class="resume-root">
    <!-- Header bar -->
    <div class="resume-header">
      <div class="resume-identity">
        <div class="page-eyebrow">Curriculum Vitae</div>
        <h1 class="page-title">Marwin Dalin</h1>
        <div class="resume-tagline">Developer — Philippines</div>
      </div>
      <button class="download-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="btn-icon">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download PDF
      </button>
    </div>

    <!-- Body -->
    <div class="resume-body">
      <!-- Main column -->
      <div class="resume-main">
        <!-- Experience -->
        <section class="resume-section">
          <div class="section-title">Experience</div>
          <!-- Replace with real entries -->
          <div class="entry">
            <div class="entry-header">
              <div class="entry-role">Front-end Developer</div>
              <div class="entry-period">2023 – Present</div>
            </div>
            <div class="entry-company">Company Name</div>
            <ul class="entry-bullets">
              <li>Built and maintained Vue.js web applications</li>
              <li>Collaborated with designers to implement pixel-perfect UIs</li>
              <li>Improved page load performance by 30%</li>
            </ul>
          </div>
        </section>

        <!-- Education -->
        <section class="resume-section">
          <div class="section-title">Education</div>
          <div class="entry">
            <div class="entry-header">
              <div class="entry-role">BS Information Technology</div>
              <div class="entry-period">2019 – 2023</div>
            </div>
            <div class="entry-company">University Name, Philippines</div>
          </div>
        </section>

        <!-- Projects -->
        <section class="resume-section">
          <div class="section-title">Notable Projects</div>
          <div class="entry">
            <div class="entry-role">Windows 10 Portfolio Desktop</div>
            <div class="entry-company">Vue CLI 3 · JavaScript · CSS</div>
            <ul class="entry-bullets">
              <li>Designed and built a fully interactive desktop OS simulation as a personal portfolio</li>
              <li>Implemented drag, resize, maximize, start menu, taskbar, and sleep/shutdown flows</li>
            </ul>
          </div>
        </section>
      </div>

      <!-- Sidebar -->
      <div class="resume-side">
        <section class="resume-section">
          <div class="section-title">Skills</div>
          <div class="side-skill-list">
            <div class="side-skill">Vue.js</div>
            <div class="side-skill">JavaScript (ES6+)</div>
            <div class="side-skill">HTML &amp; CSS</div>
            <div class="side-skill">Node.js</div>
            <div class="side-skill">Git &amp; GitHub</div>
            <div class="side-skill">REST APIs</div>
          </div>
        </section>

        <section class="resume-section">
          <div class="section-title">Contact</div>
          <div class="side-contact-list">
            <div class="side-contact-item">marwin@example.com</div>
            <div class="side-contact-item">github.com/marwin</div>
            <div class="side-contact-item">linkedin.com/in/marwin</div>
          </div>
        </section>

        <section class="resume-section">
          <div class="section-title">Languages</div>
          <div class="side-skill-list">
            <div class="side-skill">Filipino — Native</div>
            <div class="side-skill">English — Fluent</div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DesktopResume'
}
</script>

<style scoped>
.resume-root {
  height: 100%;
  overflow-y: auto;
  padding: 40px 48px;
  background: #1e1e1e;
  color: white;
  font-family: 'Segoe UI', 'Roboto', sans-serif;
  box-sizing: border-box;
}

/* ── Header ────────────────────────────────────────────────────────────────── */
.resume-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 40px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.page-eyebrow {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #0078d4;
  margin-bottom: 6px;
}

.page-title {
  font-size: 30px;
  font-weight: 600;
  margin: 0 0 4px;
  color: white;
}

.resume-tagline {
  font-size: 13px;
  color: rgba(255,255,255,0.45);
}

.download-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(0,120,212,0.15);
  border: 1px solid rgba(0,120,212,0.4);
  color: #4db3ff;
  font-size: 13px;
  font-family: 'Segoe UI', 'Roboto', sans-serif;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s ease;
  white-space: nowrap;
}

.download-btn:hover { background: rgba(0,120,212,0.25); }
.btn-icon { width: 15px; height: 15px; }

/* ── Body ──────────────────────────────────────────────────────────────────── */
.resume-body {
  display: grid;
  grid-template-columns: 1fr 200px;
  gap: 48px;
  align-items: start;
}

/* ── Sections ──────────────────────────────────────────────────────────────── */
.resume-section { margin-bottom: 32px; }

.section-title {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(255,255,255,0.4);
  margin-bottom: 14px;
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

/* ── Entry ─────────────────────────────────────────────────────────────────── */
.entry { margin-bottom: 24px; }
.entry:last-child { margin-bottom: 0; }

.entry-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 2px;
}

.entry-role    { font-size: 15px; font-weight: 600; color: white; }
.entry-period  { font-size: 12px; color: #0078d4; white-space: nowrap; }
.entry-company { font-size: 13px; color: rgba(255,255,255,0.5); margin-bottom: 8px; }

.entry-bullets {
  margin: 0;
  padding-left: 18px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.entry-bullets li {
  font-size: 13px;
  color: rgba(255,255,255,0.65);
  line-height: 1.5;
}

/* ── Sidebar ───────────────────────────────────────────────────────────────── */
.side-skill-list { display: flex; flex-direction: column; gap: 8px; }

.side-skill {
  font-size: 13px;
  color: rgba(255,255,255,0.7);
  padding: 4px 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.side-skill:last-child { border-bottom: none; }

.side-contact-list { display: flex; flex-direction: column; gap: 8px; }

.side-contact-item {
  font-size: 12px;
  color: #4db3ff;
  word-break: break-all;
}

/* ── Scrollbar ─────────────────────────────────────────────────────────────── */
.resume-root::-webkit-scrollbar { width: 6px; }
.resume-root::-webkit-scrollbar-track { background: transparent; }
.resume-root::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 3px; }

@media (max-width: 640px) {
  .resume-root   { padding: 24px 20px; }
  .resume-header { flex-direction: column; align-items: flex-start; gap: 16px; }
  .resume-body   { grid-template-columns: 1fr; gap: 0; }
}
</style>