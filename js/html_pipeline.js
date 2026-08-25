// HTML Vertical Pipeline Note-Taking & Feedback Aggregator Engine

(function() {
  const STORAGE_KEY = 'aug_video_html_pipeline_feedback_v1';

  // Default stage templates
  const DEFAULT_FEEDBACK = {
    stage_1: {
      left: 'Prompt tweaks: Isometric 3D dark-mode UI aesthetic, Claude Token Optimization.\nRef screenshots: 127.0.0.1:3847 terminal.',
      right: 'Topic approved. Focus on Token Optimizer & FlyWheelMVP.'
    },
    stage_2: {
      left: 'Gemini 8s prompt format: 18-22 words per VO line. 22 scenes = 176s master duration.',
      right: 'Pacing verified. VO word counts strictly under 22 words.'
    },
    stage_2_5: {
      left: 'Dual-pane Chrome setup: Left window Gemini prompt generator, Right window Google Flow queue.',
      right: 'Smooth handoff. 14 tabs loaded in cockpit.'
    },
    stage_3: {
      left: 'Google Flow Veo prompts: Isometric render style, camera pan speed 1.0x, 3D animated graphs.',
      right: '330 base credits allocated. 25% retake buffer reserved.'
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
      report += `* **📝 Inputs, Prompts & Research**:\n`;
      report += data.left.trim() ? `${data.left.trim().split('\n').map(l => `  > ${l}`).join('\n')}\n` : `  > *(No notes added)*\n`;
      report += `* **💡 Reviews, Feedback & Gaps**:\n`;
      report += data.right.trim() ? `${data.right.trim().split('\n').map(l => `  > ${l}`).join('\n')}\n` : `  > *(No feedback added)*\n`;
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
      report += `### 📝 Inputs, Prompts & Research\n${data.left || '(None)'}\n\n`;
      report += `### 💡 Reviews, Feedback & Gaps\n${data.right || '(None)'}\n\n`;
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

  // Auto-init
  document.addEventListener('DOMContentLoaded', () => {
    window.initHtmlPipeline();
  });
})();
