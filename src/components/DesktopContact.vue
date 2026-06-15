<template>
  <div class="contact-root">
    <!-- Header -->
    <div class="page-header">
      <div class="page-eyebrow">Get in touch</div>
      <h1 class="page-title">Contact</h1>
      <p class="page-subtitle">Have a project in mind or just want to say hello? Fill out the form below.</p>
    </div>

    <!-- Content -->
    <div class="contact-body">
      <!-- Form -->
      <div class="contact-form-panel">
        <div class="form-group">
          <label class="form-label">Name</label>
          <input class="form-input" type="text" placeholder="Your name" />
        </div>
        <div class="form-group">
          <label class="form-label">Email</label>
          <input class="form-input" type="email" placeholder="your@email.com" />
        </div>
        <div class="form-group">
          <label class="form-label">Subject</label>
          <input class="form-input" type="text" placeholder="What's this about?" />
        </div>
        <div class="form-group">
          <label class="form-label">Message</label>
          <textarea class="form-input form-textarea" placeholder="Write your message here..."></textarea>
        </div>
        <button class="submit-btn">Send Message</button>
      </div>

      <!-- Sidebar info -->
      <div class="contact-info-panel">
        <div class="info-block">
          <div class="info-label">Email</div>
          <div class="info-value">marwin@example.com</div>
        </div>
        <div class="info-block">
          <div class="info-label">Location</div>
          <div class="info-value">Philippines</div>
        </div>
        <div class="info-block">
          <div class="info-label">Available for</div>
          <div class="info-value">Freelance &amp; Full-time</div>
        </div>
        <div class="info-divider"></div>
        <div class="info-label">Socials</div>
        <div class="social-links">
          <a class="social-link" href="#" target="_blank">GitHub</a>
          <a class="social-link" href="#" target="_blank">LinkedIn</a>
          <a class="social-link" href="#" target="_blank">Twitter</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DesktopContact'
}
</script>

<style scoped>
.contact-root {
  height: 100%;
  overflow-y: auto;
  padding: 40px 48px;
  background: #1e1e1e;
  color: white;
  font-family: 'Segoe UI', 'Roboto', sans-serif;
  box-sizing: border-box;
}

/* ── Header ────────────────────────────────────────────────────────────────── */
.page-header { margin-bottom: 40px; }

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
  max-width: 480px;
  line-height: 1.6;
}

/* ── Body layout ───────────────────────────────────────────────────────────── */
.contact-body {
  display: grid;
  grid-template-columns: 1fr 220px;
  gap: 48px;
  align-items: start;
}

/* ── Form ──────────────────────────────────────────────────────────────────── */
.contact-form-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: rgba(255,255,255,0.5);
}

.form-input {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 4px;
  color: white;
  font-size: 14px;
  font-family: 'Segoe UI', 'Roboto', sans-serif;
  padding: 10px 14px;
  outline: none;
  transition: border-color 0.2s ease, background 0.2s ease;
  resize: none;
}

.form-input::placeholder { color: rgba(255,255,255,0.25); }
.form-input:focus {
  border-color: #0078d4;
  background: rgba(0,120,212,0.08);
}

.form-textarea { height: 120px; }

.submit-btn {
  align-self: flex-start;
  background: #0078d4;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  font-family: 'Segoe UI', 'Roboto', sans-serif;
  font-weight: 500;
  padding: 10px 24px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.submit-btn:hover { background: #006cbd; }

/* ── Info sidebar ──────────────────────────────────────────────────────────── */
.contact-info-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 4px;
}

.info-block { display: flex; flex-direction: column; gap: 4px; }

.info-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: rgba(255,255,255,0.4);
}

.info-value {
  font-size: 14px;
  color: rgba(255,255,255,0.85);
}

.info-divider {
  border: none;
  border-top: 1px solid rgba(255,255,255,0.08);
  margin: 4px 0;
}

.social-links { display: flex; flex-direction: column; gap: 8px; margin-top: 4px; }

.social-link {
  font-size: 13px;
  color: #0078d4;
  text-decoration: none;
  transition: color 0.2s ease;
}

.social-link:hover { color: #4db3ff; }

/* ── Scrollbar ─────────────────────────────────────────────────────────────── */
.contact-root::-webkit-scrollbar { width: 6px; }
.contact-root::-webkit-scrollbar-track { background: transparent; }
.contact-root::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 3px; }

@media (max-width: 640px) {
  .contact-root { padding: 24px 20px; }
  .contact-body { grid-template-columns: 1fr; gap: 32px; }
}
</style>