<template>
  <div class="services-root">
    <!-- Header -->
    <div class="page-header">
      <div class="page-eyebrow">What I offer</div>
      <h1 class="page-title">Services</h1>
      <p class="page-subtitle">Here's how I can help you bring your ideas to life.</p>
    </div>

    <!-- Service cards -->
    <div class="services-grid">
      <!-- Replace / extend these cards -->
      <div class="service-card">
        <div class="service-icon-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="service-icon">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div class="service-name">Front-end Development</div>
        <p class="service-desc">
          Responsive, accessible, and performant web interfaces built with Vue.js, HTML, and CSS.
        </p>
        <div class="service-tags">
          <span class="stag">Vue.js</span>
          <span class="stag">JavaScript</span>
          <span class="stag">CSS</span>
        </div>
      </div>

      <div class="service-card">
        <div class="service-icon-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="service-icon">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
          </svg>
        </div>
        <div class="service-name">Back-end Development</div>
        <p class="service-desc">
          REST API design, database modelling, and server-side logic with Node.js.
        </p>
        <div class="service-tags">
          <span class="stag">Node.js</span>
          <span class="stag">REST APIs</span>
          <span class="stag">SQL</span>
        </div>
      </div>

      <div class="service-card">
        <div class="service-icon-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="service-icon">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
        </div>
        <div class="service-name">UI / UX Design</div>
        <p class="service-desc">
          Clean, functional interfaces with a focus on usability, consistency, and visual clarity.
        </p>
        <div class="service-tags">
          <span class="stag">Figma</span>
          <span class="stag">Wireframing</span>
          <span class="stag">Prototyping</span>
        </div>
      </div>

      <div class="service-card">
        <div class="service-icon-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="service-icon">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <div class="service-name">Freelance Projects</div>
        <p class="service-desc">
          Available for short or long-term freelance engagements — web apps, dashboards, and landing pages.
        </p>
        <div class="service-tags">
          <span class="stag">Web Apps</span>
          <span class="stag">Dashboards</span>
          <span class="stag">Landing Pages</span>
        </div>
      </div>
    </div>

    <!-- CTA -->
    <div class="services-cta">
      <p class="cta-text">Interested in working together?</p>
      <button class="cta-btn">Get in touch</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DesktopServices',
  emits: ['navigate-contact'],
  methods: {
    goToContact() {
      this.$emit('navigate-contact')
    }
  }
}
</script>

<style scoped>
.services-root {
  height: 100%;
  overflow-y: auto;
  padding: 40px 48px;
  background: #1e1e1e;
  color: white;
  font-family: 'Segoe UI', 'Roboto', sans-serif;
  box-sizing: border-box;
}

/* ── Header ────────────────────────────────────────────────────────────────── */
.page-header { margin-bottom: 36px; }

.page-eyebrow {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #0078d4;
  margin-bottom: 8px;
}

.page-title {
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 10px;
  color: white;
}

.page-subtitle {
  font-size: 14px;
  color: rgba(255,255,255,0.55);
  margin: 0;
  line-height: 1.6;
}

/* ── Grid ──────────────────────────────────────────────────────────────────── */
.services-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 48px;
}

/* ── Card ──────────────────────────────────────────────────────────────────── */
.service-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
  padding: 24px;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.service-card:hover {
  background: rgba(0,120,212,0.07);
  border-color: rgba(0,120,212,0.3);
}

.service-icon-wrap {
  width: 40px;
  height: 40px;
  background: rgba(0,120,212,0.12);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.service-icon { width: 20px; height: 20px; color: #0078d4; }

.service-name {
  font-size: 15px;
  font-weight: 600;
  color: white;
  margin-bottom: 8px;
}

.service-desc {
  font-size: 13px;
  color: rgba(255,255,255,0.55);
  line-height: 1.6;
  margin: 0 0 14px;
}

.service-tags { display: flex; flex-wrap: wrap; gap: 6px; }

.stag {
  font-size: 11px;
  background: rgba(0,120,212,0.1);
  border: 1px solid rgba(0,120,212,0.25);
  color: rgba(255,255,255,0.5);
  padding: 3px 10px;
  border-radius: 3px;
}

/* ── CTA ───────────────────────────────────────────────────────────────────── */
.services-cta {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  background: rgba(0,120,212,0.08);
  border: 1px solid rgba(0,120,212,0.2);
  border-radius: 8px;
}

.cta-text { font-size: 14px; color: rgba(255,255,255,0.7); margin: 0; flex: 1; }

.cta-btn {
  background: #0078d4;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  font-family: 'Segoe UI', 'Roboto', sans-serif;
  font-weight: 500;
  padding: 9px 20px;
  cursor: pointer;
  transition: background 0.2s ease;
  white-space: nowrap;
}

.cta-btn:hover { background: #006cbd; }

/* ── Scrollbar ─────────────────────────────────────────────────────────────── */
.services-root::-webkit-scrollbar { width: 6px; }
.services-root::-webkit-scrollbar-track { background: transparent; }
.services-root::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 3px; }

@media (max-width: 640px) {
  .services-root  { padding: 24px 20px; }
  .services-grid  { grid-template-columns: 1fr; }
  .services-cta   { flex-direction: column; align-items: flex-start; }
}
</style>