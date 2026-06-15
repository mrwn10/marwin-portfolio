<template>
  <div class="projects-root">
    <!-- Header -->
    <div class="projects-header">
      <div class="header-left">
        <div class="page-eyebrow">My work</div>
        <h1 class="page-title">Projects</h1>
      </div>
      <!-- Filter tabs -->
      <div class="filter-tabs">
        <button
          v-for="tab in tabs"
          :key="tab"
          class="filter-tab"
          :class="{ active: activeTab === tab }"
          @click="activeTab = tab"
        >{{ tab }}</button>
      </div>
    </div>

    <!-- Project cards -->
    <div class="projects-grid">
      <div
        v-for="project in filteredProjects"
        :key="project.id"
        class="project-card"
      >
        <!-- Thumbnail -->
        <div class="project-thumb">
          <!-- Replace with: <img :src="project.image" class="thumb-img" /> -->
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="thumb-icon">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        <!-- Info -->
        <div class="project-info">
          <div class="project-name">{{ project.name }}</div>
          <p class="project-desc">{{ project.description }}</p>
          <div class="project-footer">
            <div class="project-tags">
              <span v-for="tag in project.tags" :key="tag" class="ptag">{{ tag }}</span>
            </div>
            <div class="project-links">
              <a v-if="project.github" :href="project.github" target="_blank" class="plink">GitHub</a>
              <a v-if="project.live"   :href="project.live"   target="_blank" class="plink plink-primary">Live</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="filteredProjects.length === 0" class="empty-state">
      No projects in this category yet.
    </div>
  </div>
</template>

<script>
export default {
  name: 'DesktopProjects',

  data() {
    return {
      activeTab: 'All',
      tabs: ['All', 'Web', 'App', 'Other'],

      // Replace with your real projects
      projects: [
        {
          id: 1,
          name: 'Windows 10 Portfolio',
          description: 'A Vue CLI 3 personal portfolio built as a fully interactive Windows 10 desktop simulation.',
          tags: ['Vue.js', 'CSS', 'JavaScript'],
          category: 'Web',
          github: '#',
          live: '#'
        },
        {
          id: 2,
          name: 'Project Two',
          description: 'Short description of what this project does and the problem it solves.',
          tags: ['Node.js', 'REST API'],
          category: 'App',
          github: '#',
          live: null
        },
        {
          id: 3,
          name: 'Project Three',
          description: 'Short description of what this project does and the problem it solves.',
          tags: ['HTML', 'CSS'],
          category: 'Web',
          github: '#',
          live: '#'
        },
        {
          id: 4,
          name: 'Project Four',
          description: 'Short description of what this project does and the problem it solves.',
          tags: ['Vue.js', 'Firebase'],
          category: 'App',
          github: null,
          live: '#'
        }
      ]
    }
  },

  computed: {
    filteredProjects() {
      if (this.activeTab === 'All') return this.projects
      return this.projects.filter(p => p.category === this.activeTab)
    }
  }
}
</script>

<style scoped>
.projects-root {
  height: 100%;
  overflow-y: auto;
  padding: 40px 48px;
  background: #1e1e1e;
  color: white;
  font-family: 'Segoe UI', 'Roboto', sans-serif;
  box-sizing: border-box;
}

/* ── Header ────────────────────────────────────────────────────────────────── */
.projects-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 36px;
  flex-wrap: wrap;
  gap: 16px;
}

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

/* ── Filter tabs ───────────────────────────────────────────────────────────── */
.filter-tabs { display: flex; gap: 4px; }

.filter-tab {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.5);
  font-size: 12px;
  font-family: 'Segoe UI', 'Roboto', sans-serif;
  padding: 6px 14px;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-tab:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.8); }

.filter-tab.active {
  background: rgba(0,120,212,0.15);
  border-color: rgba(0,120,212,0.5);
  color: #4db3ff;
}

/* ── Grid ──────────────────────────────────────────────────────────────────── */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

/* ── Card ──────────────────────────────────────────────────────────────────── */
.project-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
  overflow: hidden;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.project-card:hover {
  background: rgba(0,120,212,0.06);
  border-color: rgba(0,120,212,0.25);
}

/* Thumbnail */
.project-thumb {
  height: 140px;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.thumb-icon { width: 40px; height: 40px; color: rgba(255,255,255,0.15); }

.thumb-img { width: 100%; height: 100%; object-fit: cover; }

/* Info */
.project-info { padding: 16px; }

.project-name {
  font-size: 15px;
  font-weight: 600;
  color: white;
  margin-bottom: 6px;
}

.project-desc {
  font-size: 13px;
  color: rgba(255,255,255,0.5);
  line-height: 1.5;
  margin: 0 0 12px;
}

.project-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.project-tags { display: flex; flex-wrap: wrap; gap: 5px; }

.ptag {
  font-size: 10px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.45);
  padding: 2px 8px;
  border-radius: 3px;
}

.project-links { display: flex; gap: 8px; }

.plink {
  font-size: 12px;
  color: rgba(255,255,255,0.5);
  text-decoration: none;
  padding: 4px 10px;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 3px;
  transition: all 0.2s ease;
}

.plink:hover { background: rgba(255,255,255,0.06); color: white; }

.plink-primary {
  background: rgba(0,120,212,0.15);
  border-color: rgba(0,120,212,0.4);
  color: #4db3ff;
}

.plink-primary:hover { background: rgba(0,120,212,0.25); }

/* ── Empty state ───────────────────────────────────────────────────────────── */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: rgba(255,255,255,0.3);
  font-size: 14px;
  font-style: italic;
}

/* ── Scrollbar ─────────────────────────────────────────────────────────────── */
.projects-root::-webkit-scrollbar { width: 6px; }
.projects-root::-webkit-scrollbar-track { background: transparent; }
.projects-root::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 3px; }

@media (max-width: 640px) {
  .projects-root    { padding: 24px 20px; }
  .projects-header  { flex-direction: column; align-items: flex-start; }
  .projects-grid    { grid-template-columns: 1fr; }
}
</style>