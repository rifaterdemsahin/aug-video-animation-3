// Shared left-menu: Pipeline + Feedback (simple hubs) + stage detail pages
(function () {
  const GROUPS = [
    {
      title: 'Overview',
      items: [
        { id: 'pipeline', href: 'pipeline.html', icon: '⚡', label: 'Pipeline', badge: 'CODE' },
        { id: 'feedback', href: 'index.html', icon: '💬', label: 'Feedback', badge: 'Issues' }
      ]
    },
    {
      title: 'Capture',
      items: [
        { id: 'stage-1', href: 'stage-1.html', icon: '🏫', label: '1 Skool Setup', badge: '—' },
        { id: 'stage-1-5', href: 'stage-1-5.html', icon: '🧪', label: '1.5 Flow Gate', badge: '5m' }
      ]
    },
    {
      title: 'Organize',
      items: [
        { id: 'stage-2', href: 'stage-2.html', icon: '🤖', label: '2 Script & Prompts', badge: '5m' },
        { id: 'stage-2-5', href: 'stage-2-5.html', icon: '🪟', label: '2.5 Dual Setup', badge: '5m' },
        { id: 'stage-3', href: 'stage-3.html', icon: '🎬', label: '3 Flow Generate', badge: '30m' },
        { id: 'stage-qc', href: 'stage-qc.html', icon: '🧪', label: 'QC Gap Audit', badge: '5m' },
        { id: 'stage-4', href: 'stage-4.html', icon: '🎨', label: '4 Canva Timeline', badge: '5m' }
      ]
    },
    {
      title: 'Distill',
      items: [
        { id: 'stage-4-5', href: 'stage-4-5.html', icon: '🎙️', label: '4.5 VO Rehearsal', badge: '5m' },
        { id: 'stage-vo', href: 'stage-vo.html', icon: '🧬', label: 'VO Voice Sync', badge: '10m' }
      ]
    },
    {
      title: 'Express',
      items: [
        { id: 'stage-5', href: 'stage-5.html', icon: '🚀', label: '5 Multi-Platform', badge: '5m' }
      ]
    }
  ];

  function activeId() {
    const fromBody = document.body.getAttribute('data-active-page');
    if (fromBody) return fromBody;
    const file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    if (file === '' || file === 'index.html') return 'feedback';
    return file.replace('.html', '');
  }

  function renderNav() {
    const nav = document.querySelector('.rhs-nav-groups');
    if (!nav) return;
    const current = activeId();
    nav.innerHTML = GROUPS.map(group => `
      <div class="rhs-nav-group">
        <div class="rhs-group-title">${group.title}</div>
        <div class="rhs-nav-links">
          ${group.items.map(item => `
            <a href="${item.href}" class="rhs-nav-link${item.id === current ? ' active' : ''}">
              <span class="link-label"><span>${item.icon}</span> ${item.label}</span>
              <span class="link-badge">${item.badge}</span>
            </a>
          `).join('')}
        </div>
      </div>
    `).join('');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderNav);
  } else {
    renderNav();
  }
})();
