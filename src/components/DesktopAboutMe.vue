<template>
  <div class="about-root">
    <!-- Header -->
    <div class="page-header">
      <div class="page-eyebrow">Who I am</div>
      <h1 class="page-title">About Me</h1>
    </div>

    <!-- Content -->
    <div class="about-body">
      <!-- Left: bio + skills -->
      <div class="about-main">
        <div class="avatar-row">
          <div class="avatar-placeholder">
            <!-- Replace with: <img :src="profileImage" class="avatar-img" /> -->
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="avatar-icon">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div class="avatar-meta">
            <div class="meta-name">Marwin Dalin</div>
            <div class="meta-role">Developer</div>
            <div class="meta-location">📍 Philippines</div>
          </div>
        </div>

        <div class="section-title">Bio</div>
        <p class="bio-text">
          <!-- Replace with your real bio -->
          I'm a developer who enjoys building clean, thoughtful interfaces and scalable back-end systems.
          I care about the craft — both the code and the experience it produces.
        </p>

        <div class="section-title">Skills</div>
        <div class="skills-grid">
          <!-- Replace / extend these items -->
          <div class="skill-tag">Vue.js</div>
          <div class="skill-tag">JavaScript</div>
          <div class="skill-tag">HTML &amp; CSS</div>
          <div class="skill-tag">Node.js</div>
          <div class="skill-tag">Git</div>
          <div class="skill-tag">REST APIs</div>
        </div>
      </div>

      <!-- Right: timeline / highlights -->
      <div class="about-side">
        <div class="section-title">Highlights</div>
        <div class="timeline">
          <!-- Replace / extend these entries -->
          <div class="timeline-item">
            <div class="timeline-year">2024</div>
            <div class="timeline-desc">Built a Windows 10-style portfolio desktop in Vue CLI 3</div>
          </div>
          <div class="timeline-item">
            <div class="timeline-year">2023</div>
            <div class="timeline-desc">Completed first full-stack project with Vue + Node.js</div>
          </div>
          <div class="timeline-item">
            <div class="timeline-year">2022</div>
            <div class="timeline-desc">Started learning web development seriously</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DesktopAboutMe'
}
</script>

<style scoped>
.about-root {
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
  margin: 0;
  color: white;
}

/* ── Body layout ───────────────────────────────────────────────────────────── */
.about-body {
  display: grid;
  grid-template-columns: 1fr 260px;
  gap: 48px;
  align-items: start;
}

/* ── Avatar row ────────────────────────────────────────────────────────────── */
.avatar-row {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
}

.avatar-placeholder {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(0,120,212,0.15);
  border: 2px solid rgba(0,120,212,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-icon { width: 36px; height: 36px; color: #0078d4; }

.avatar-img {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
}

.meta-name { font-size: 18px; font-weight: 600; color: white; }
.meta-role { font-size: 13px; color: rgba(255,255,255,0.55); margin-top: 2px; }
.meta-location { font-size: 12px; color: rgba(255,255,255,0.4); margin-top: 4px; }

/* ── Sections ──────────────────────────────────────────────────────────────── */
.section-title {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(255,255,255,0.4);
  margin-bottom: 12px;
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.bio-text {
  font-size: 14px;
  color: rgba(255,255,255,0.75);
  line-height: 1.7;
  margin: 0 0 32px;
}

/* ── Skills ────────────────────────────────────────────────────────────────── */
.skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  background: rgba(0,120,212,0.12);
  border: 1px solid rgba(0,120,212,0.3);
  color: #4db3ff;
  font-size: 12px;
  padding: 5px 12px;
  border-radius: 3px;
}

/* ── Timeline ──────────────────────────────────────────────────────────────── */
.timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
  padding-left: 16px;
  border-left: 2px solid rgba(0,120,212,0.25);
}

.timeline-item {
  position: relative;
  padding: 0 0 24px 20px;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: -7px;
  top: 4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #0078d4;
  border: 2px solid #1e1e1e;
}

.timeline-year {
  font-size: 11px;
  color: #0078d4;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.timeline-desc {
  font-size: 13px;
  color: rgba(255,255,255,0.65);
  line-height: 1.5;
}

/* ── Scrollbar ─────────────────────────────────────────────────────────────── */
.about-root::-webkit-scrollbar { width: 6px; }
.about-root::-webkit-scrollbar-track { background: transparent; }
.about-root::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 3px; }

@media (max-width: 640px) {
  .about-root { padding: 24px 20px; }
  .about-body { grid-template-columns: 1fr; gap: 32px; }
}
</style>