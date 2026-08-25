// HTML Vertical Pipeline Note-Taking & Feedback Aggregator Engine

(function() {
  const STORAGE_KEY = 'aug_video_html_pipeline_feedback_v3';

  // Default stage templates matching the production report
  const DEFAULT_FEEDBACK = {
    stage_1: {
      left: '',
      right: ''
    },
    stage_2: {
      left: '',
      right: ''
    },
    stage_2_5: {
      left: '',
      right: ''
    },
    stage_3: {
      left: '',
      right: ''
    },
    stage_qc: {
      left: 'Shotlist in hand: Sort clips 1-by-1 to used asset. Verify 0 blank frames.',
      right: 'Quality Gate PASS. Zero text hallucination in video model.'
    },
    stage_4: {
      left: 'Canva 3-Section workspace: Pre-prod Post-its on left, 22 8s placeholders on timeline.',
      right: 'Used asset folder sorted. Set Video as Background verified.'
    },
    stage_4_5: {
      left: '8s VO Teleprompter: Speak at 150 WPM with metronome audio cue.',
      right: 'Authentic creator voice + Roger Rabbit cartoon stamp on real IDE.'
    },
    stage_5: {
      left: 'Social copy: YouTube 22-chapter timestamps, LinkedIn value post, Skool module upload.',
      right: 'Distribution ready. Value flywheel engaged.'
    }
  };

  let feedbackData = {};

  window.initHtmlPipeline = function() {
    loadFeedbackData();
    populateTextareas();
    attachEventListeners();
  };

  function loadFeedbackData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        feedbackData = JSON.parse(saved);
      } else {
        feedbackData = JSON.parse(JSON.stringify(DEFAULT_FEEDBACK));
      }
    } catch (e) {
      feedbackData = JSON.parse(JSON.stringify(DEFAULT_FEEDBACK));
    }
  }

  function saveFeedbackData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(feedbackData));
    } catch (e) {}
  }

  function populateTextareas() {
    document.querySelectorAll('.note-textarea').forEach(textarea => {
      const stage = textarea.getAttribute('data-stage');
      const side = textarea.getAttribute('data-side');
      if (stage && side && feedbackData[stage] && feedbackData[stage][side] !== undefined) {
        textarea.value = feedbackData[stage][side];
      }
    });
  }

  function attachEventListeners() {
    document.querySelectorAll('.note-textarea').forEach(textarea => {
      textarea.addEventListener('input', (e) => {
        const stage = e.target.getAttribute('data-stage');
        const side = e.target.getAttribute('data-side');
        if (stage && side) {
          if (!feedbackData[stage]) feedbackData[stage] = {};
          feedbackData[stage][side] = e.target.value;
          saveFeedbackData();
        }
      });
    });
  }

  // Quick tag chip insertion
  window.insertQuickTag = function(stage, side, tag) {
    const textarea = document.querySelector(`.note-textarea[data-stage="${stage}"][data-side="${side}"]`);
    if (!textarea) return;
    const currentVal = textarea.value;
    const separator = currentVal.trim().length > 0 ? '\n' : '';
    textarea.value = currentVal + separator + tag + ' ';
    textarea.focus();
    if (!feedbackData[stage]) feedbackData[stage] = {};
    feedbackData[stage][side] = textarea.value;
    saveFeedbackData();
  };

  // 📋 Main Feature: Copy All Pipeline Feedback
  window.copyAllPipelineFeedback = function() {
    const stagesMeta = [
      { key: 'stage_1', title: '🏫 Stage 1: Skool Ideation & Setup', time: '15-20 min' },
      { key: 'stage_2', title: '🤖 Stage 2: Gemini Script & 8s Prompts', time: '10-15 min' },
      { key: 'stage_2_5', title: '🪟 Stage 2.5: Simulation & Dual Setup', time: '5 min' },
      { key: 'stage_3', title: '🎬 Stage 3: Google Flow 8s Generation', time: '25-35 min' },
      { key: 'stage_qc', title: '🧪 Stage QC: Quality Gate & Gap Audit', time: '10-15 min' },
      { key: 'stage_4', title: '🎨 Stage 4: Canva 3-Section Timeline', time: '30-45 min' },
      { key: 'stage_4_5', title: '🎙️ Stage 4.5: 8s VO Studio & Rehearsal', time: '15-20 min' },
      { key: 'stage_5', title: '🚀 Stage 5: Multi-Platform Funnel', time: '15-20 min' }
    ];

    let report = `# 🎬 3-Minute Video Pipeline Feedback & Review Report\n`;
    report += `**Project**: Claude Developer Certification: Token Optimization & Custom IDEs\n`;
    report += `**Turnaround Target**: ~2h 15m (135 min) • 176s Master Video (22 Scenes) • 330 Credits\n`;
    report += `**Generated**: ${new Date().toLocaleString()}\n\n`;
    report += `---\n\n`;

    stagesMeta.forEach(s => {
      const data = feedbackData[s.key] || { left: '', right: '' };
      report += `### ${s.title} (⏱️ ${s.time})\n`;
      report += `* **📝 Updates**:\n`;
      report += data.left.trim() ? `${data.left.trim().split('\n').map(l => `  > ${l}`).join('\n')}\n` : `  > *(No updates added)*\n`;
      report += `* **⚠️ Issues**:\n`;
      report += data.right.trim() ? `${data.right.trim().split('\n').map(l => `  > ${l}`).join('\n')}\n` : `  > *(No issues reported)*\n`;
      report += `\n`;
    });

    report += `---\n*Generated from the 3-Minute Video Animation Production Cockpit*\n`;

    navigator.clipboard.writeText(report).then(() => {
      if (window.showToast) {
        window.showToast('📋 All pipeline feedback copied to clipboard!', 'success');
      } else {
        alert('📋 All pipeline feedback copied to clipboard!');
      }
    }).catch(err => {
      console.error('Failed to copy: ', err);
      // Fallback prompt
      prompt('Copy your pipeline feedback below:', report);
    });
  };

  // Export Feedback as Markdown File
  window.exportFeedbackMarkdown = function() {
    const stagesMeta = [
      { key: 'stage_1', title: '🏫 Stage 1: Skool Ideation & Setup', time: '15-20 min' },
      { key: 'stage_2', title: '🤖 Stage 2: Gemini Script & 8s Prompts', time: '10-15 min' },
      { key: 'stage_2_5', title: '🪟 Stage 2.5: Simulation & Dual Setup', time: '5 min' },
      { key: 'stage_3', title: '🎬 Stage 3: Google Flow 8s Generation', time: '25-35 min' },
      { key: 'stage_qc', title: '🧪 Stage QC: Quality Gate & Gap Audit', time: '10-15 min' },
      { key: 'stage_4', title: '🎨 Stage 4: Canva 3-Section Timeline', time: '30-45 min' },
      { key: 'stage_4_5', title: '🎙️ Stage 4.5: 8s VO Studio & Rehearsal', time: '15-20 min' },
      { key: 'stage_5', title: '🚀 Stage 5: Multi-Platform Funnel', time: '15-20 min' }
    ];

    let report = `# 🎬 3-Minute Video Pipeline Feedback & Review Report\n\n`;
    stagesMeta.forEach(s => {
      const data = feedbackData[s.key] || { left: '', right: '' };
      report += `## ${s.title}\n`;
      report += `### 📝 Updates\n${data.left || '(None)'}\n\n`;
      report += `### ⚠️ Issues\n${data.right || '(None)'}\n\n`;
    });

    const blob = new Blob([report], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'aug_video_pipeline_feedback.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (window.showToast) window.showToast('📥 Pipeline feedback downloaded as .MD', 'success');
  };

  // Save to Azure / State
  window.savePipelineFeedbackState = function() {
    saveFeedbackData();
    saveRowOrder();
    if (window.pushStateToAzure) window.pushStateToAzure(false);
    if (window.showToast) window.showToast('💾 Pipeline feedback saved and synced!', 'success');
  };

  // Reset / Clear Feedback
  window.clearAllFeedbackNotes = function() {
    if (confirm('Reset all pipeline notes to default values?')) {
      feedbackData = JSON.parse(JSON.stringify(DEFAULT_FEEDBACK));
      saveFeedbackData();
      populateTextareas();
      if (window.showToast) window.showToast('🗑️ Notes reset to default values', 'info');
    }
  };

  // ============================================================
  // MOVEABLE ROWS & DRAG-AND-DROP REORDERING ENGINE
  // ============================================================
  const ORDER_STORAGE_KEY = 'aug_video_pipeline_row_order_v1';
  let draggedRow = null;

  function initRowReordering() {
    restoreRowOrder();
    setupDragAndDrop();
  }

  function setupDragAndDrop() {
    const tbody = document.querySelector('.pipeline-table tbody');
    if (!tbody) return;

    tbody.addEventListener('dragstart', (e) => {
      const row = e.target.closest('.pipeline-table-row');
      if (row) {
        draggedRow = row;
        row.classList.add('is-dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', row.id);
      }
    });

    tbody.addEventListener('dragend', () => {
      if (draggedRow) {
        draggedRow.classList.remove('is-dragging');
        draggedRow = null;
      }
      document.querySelectorAll('.pipeline-table-row').forEach(r => r.classList.remove('drag-over'));
      rebuildConnectors();
      saveRowOrder();
    });

    tbody.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      const targetRow = e.target.closest('.pipeline-table-row');
      if (targetRow && targetRow !== draggedRow) {
        document.querySelectorAll('.pipeline-table-row').forEach(r => r.classList.remove('drag-over'));
        targetRow.classList.add('drag-over');
      }
    });

    tbody.addEventListener('dragleave', (e) => {
      const targetRow = e.target.closest('.pipeline-table-row');
      if (targetRow) {
        targetRow.classList.remove('drag-over');
      }
    });

    tbody.addEventListener('drop', (e) => {
      e.preventDefault();
      const targetRow = e.target.closest('.pipeline-table-row');
      if (targetRow && draggedRow && targetRow !== draggedRow) {
        const rows = Array.from(tbody.querySelectorAll('.pipeline-table-row'));
        const draggedIndex = rows.indexOf(draggedRow);
        const targetIndex = rows.indexOf(targetRow);

        if (draggedIndex < targetIndex) {
          targetRow.after(draggedRow);
        } else {
          targetRow.before(draggedRow);
        }

        rebuildConnectors();
        saveRowOrder();
        if (window.showToast) window.showToast('🔀 Stage row reordered successfully!', 'info');
      }
      document.querySelectorAll('.pipeline-table-row').forEach(r => r.classList.remove('drag-over'));
    });
  }

  // 1-Click Move Up / Move Down Handler
  window.moveStageRow = function(stageId, direction) {
    const tbody = document.querySelector('.pipeline-table tbody');
    if (!tbody) return;
    const row = document.getElementById(stageId);
    if (!row) return;

    const rows = Array.from(tbody.querySelectorAll('.pipeline-table-row'));
    const currentIndex = rows.indexOf(row);
    const targetIndex = currentIndex + direction;

    if (targetIndex < 0 || targetIndex >= rows.length) return;

    const targetRow = rows[targetIndex];
    if (direction > 0) {
      targetRow.after(row);
    } else {
      targetRow.before(row);
    }

    rebuildConnectors();
    saveRowOrder();
    if (window.showToast) window.showToast(`↕️ Moved stage ${direction < 0 ? 'up' : 'down'}`, 'info');
  };

  // Re-generate connectors between adjacent stage rows
  function rebuildConnectors() {
    const tbody = document.querySelector('.pipeline-table tbody');
    if (!tbody) return;

    // Remove existing connector rows
    tbody.querySelectorAll('.stage-connector-row').forEach(r => r.remove());

    const rows = tbody.querySelectorAll('.pipeline-table-row');
    rows.forEach((row, idx) => {
      if (idx < rows.length - 1) {
        const connector = document.createElement('tr');
        connector.className = 'stage-connector-row';
        connector.innerHTML = `
          <td></td>
          <td>
            <div class="table-arrow-cell">
              <div class="arrow"></div>
            </div>
          </td>
          <td></td>
        `;
        row.after(connector);
      }
    });
  }

  function saveRowOrder() {
    const tbody = document.querySelector('.pipeline-table tbody');
    if (!tbody) return;
    const rows = Array.from(tbody.querySelectorAll('.pipeline-table-row'));
    const order = rows.map(r => r.id).filter(Boolean);
    try {
      localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order));
    } catch (e) {}
  }

  function restoreRowOrder() {
    try {
      const saved = localStorage.getItem(ORDER_STORAGE_KEY);
      if (!saved) return;
      const order = JSON.parse(saved);
      const tbody = document.querySelector('.pipeline-table tbody');
      if (!tbody || !Array.isArray(order)) return;

      order.forEach(id => {
        const row = document.getElementById(id);
        if (row) {
          tbody.appendChild(row);
        }
      });
      rebuildConnectors();
    } catch (e) {}
  }

  // Auto-init
  document.addEventListener('DOMContentLoaded', () => {
    window.initHtmlPipeline();
    initRowReordering();
  });
})();

