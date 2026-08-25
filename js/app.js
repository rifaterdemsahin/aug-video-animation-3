// Main Interactive Application Logic for 3-Minute Video Animation Helper
document.addEventListener('DOMContentLoaded', () => {
  const data = window.VIDEO_DATA;
  if (!data) {
    console.error('Video data not found!');
    return;
  }

  // State Management with LocalStorage
  const STORAGE_KEY = 'aug_video_animation_progress_v1';
  let appState = loadState();

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {
        completedScenes: {},
        stageChecklist: {},
        sanityChecklist: {},
        currentPrompterIndex: 0
      };
    } catch (e) {
      return { completedScenes: {}, stageChecklist: {}, sanityChecklist: {}, currentPrompterIndex: 0 };
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
      updateProgressStats();
    } catch (e) {
      console.warn('Could not save state to localStorage', e);
    }
  }

  // Toast Notification System
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${type === 'success' ? '✅' : '📋'}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  window.copyToClipboard = function(text, label = 'Copied to clipboard!') {
    navigator.clipboard.writeText(text).then(() => {
      showToast(label, 'success');
    }).catch(err => {
      console.error('Copy failed', err);
      showToast('Failed to copy', 'error');
    });
  };

  // Credit Budget Estimator Logic
  window.updateBudgetEstimate = function() {
    const sceneCountInput = document.getElementById('calc-scenes');
    const creditPerClipInput = document.getElementById('calc-credits-per-clip');
    const retakeRateSelect = document.getElementById('calc-retakes');

    if (!sceneCountInput || !creditPerClipInput || !retakeRateSelect) return;

    const scenes = parseInt(sceneCountInput.value) || 22;
    const creditsPerClip = parseInt(creditPerClipInput.value) || 15;
    const retakeRate = parseFloat(retakeRateSelect.value) || 0.25;

    const baseCredits = scenes * creditsPerClip;
    const totalGens = Math.round(scenes * (1 + retakeRate));
    const totalCredits = totalGens * creditsPerClip;
    const durationSec = scenes * 8;
    const durationMin = (durationSec / 60).toFixed(1);

    const baseEl = document.getElementById('est-base-credits');
    const totalEl = document.getElementById('est-total-credits');
    const gensEl = document.getElementById('est-total-gens');
    const durEl = document.getElementById('est-duration');

    if (baseEl) baseEl.innerText = `${baseCredits}`;
    if (totalEl) totalEl.innerText = `${totalCredits}`;
    if (gensEl) gensEl.innerText = `${totalGens} clips`;
    if (durEl) durEl.innerText = `${durationSec}s (${durationMin}m)`;
  };

  // Render Flywheel Cards
  function renderFlywheel() {
    const container = document.getElementById('flywheel-container');
    if (!container) return;

    container.innerHTML = data.flywheel.map(item => `
      <div class="flywheel-card">
        <span class="flywheel-step-badge">Step 0${item.step}</span>
        <h4><span>${item.icon}</span> ${item.title}</h4>
        <p>${item.description}</p>
        <div class="platform-pills">
          ${item.platforms.map(p => `<span class="platform-pill">${p}</span>`).join('')}
        </div>
      </div>
    `).join('');
  }

  // Render Canva 3-Section Suite
  function renderCanvaSuite() {
    const preprodContainer = document.getElementById('canva-preprod-postits');
    const prodContainer = document.getElementById('canva-prod-timeline');

    if (preprodContainer) {
      preprodContainer.innerHTML = data.scenes.map(s => `
        <div class="postit-note" style="background-color: ${s.canvaPostItColor || '#fef08a'};" onclick="copyToClipboard('${escapeQuotes(s.vo)}', 'Scene ${s.id} Script Copied!')" title="Click to copy Scene ${s.id} script">
          <div class="postit-header">
            <span>Scene ${s.id} (${s.timecode})</span>
            <span>📝 Post-it</span>
          </div>
          <div class="postit-body">
            <strong>${s.title}</strong><br>
            "${s.vo}"
          </div>
        </div>
      `).join('');
    }

    if (prodContainer) {
      prodContainer.innerHTML = data.scenes.map(s => {
        const isDone = appState.completedScenes[s.id] || false;
        return `
          <div class="flow-prompt-card" style="margin-bottom: 0.75rem; padding: 0.75rem; background: rgba(15, 23, 42, 0.85);">
            <div class="flow-prompt-header">
              <span style="font-size:0.75rem; font-weight:700; color:var(--accent-cyan);">Scene ${s.id}: ${s.timecode}</span>
              <button class="btn btn-secondary btn-sm" onclick="copyToClipboard('${escapeQuotes(s.googleFlowPrompt)}', 'Scene ${s.id} Flow Prompt Copied!')">
                📋 Copy Prompt
              </button>
            </div>
            <p style="font-size:0.78rem; color:#d1d5db; margin:0.3rem 0;">${s.visual}</p>
            <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.72rem; color:var(--text-muted);">
              <span>Target: 8.0s Clip (15 Credits)</span>
              <label style="cursor:pointer; display:flex; align-items:center; gap:4px;">
                <input type="checkbox" ${isDone ? 'checked' : ''} onchange="toggleSceneDone(${s.id}, this.checked)">
                Uploaded to Canva
              </label>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // Render Master Storyboard Scenes
  function renderStoryboard(filter = 'all', searchQuery = '') {
    const container = document.getElementById('scenes-container');
    if (!container) return;

    let filtered = data.scenes;

    if (filter !== 'all') {
      if (filter === 'completed') {
        filtered = filtered.filter(s => !!appState.completedScenes[s.id]);
      } else if (filter === 'pending') {
        filtered = filtered.filter(s => !appState.completedScenes[s.id]);
      } else {
        filtered = filtered.filter(s => s.section === filter);
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(s => 
        s.title.toLowerCase().includes(q) ||
        s.vo.toLowerCase().includes(q) ||
        s.visual.toLowerCase().includes(q) ||
        (s.keywords && s.keywords.some(k => k.toLowerCase().includes(q)))
      );
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--text-muted); background: rgba(15, 23, 42, 0.4); border-radius: var(--radius-md);">
          🔍 No scenes match your filter criteria.
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(s => {
      const isCompleted = !!appState.completedScenes[s.id];
      const wordCount = s.vo.split(/\s+/).filter(Boolean).length;
      const paceStatus = wordCount >= 16 && wordCount <= 24 ? '🟢 Optimal Pace' : (wordCount > 24 ? '🔴 Too Fast (>24 words)' : '🟡 Too Slow (<16 words)');

      return `
        <div class="scene-item-card ${isCompleted ? 'completed' : ''}" id="scene-card-${s.id}">
          <div class="scene-time-col">
            <div class="scene-num-badge">#${s.id}</div>
            <div class="scene-time-badge">${s.timecode}</div>
            <div class="scene-duration">⏱️ 8.0s</div>
            <div style="font-size:0.62rem; color:var(--text-muted); margin-top:2px;">15 Cr</div>
          </div>

          <div class="scene-content-col">
            <span class="label-tag">🎬 Visual & Motion Graphic (8s)</span>
            <h4>${s.title}</h4>
            <p style="margin-bottom: 0.6rem;">${s.visual}</p>
            <button class="btn btn-secondary btn-sm" onclick="copyToClipboard('${escapeQuotes(s.googleFlowPrompt)}', 'Scene ${s.id} Flow Prompt Copied!')">
              ⚡ Copy Google Flow Prompt
            </button>
          </div>

          <div class="scene-content-col">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span class="label-tag" style="color: var(--accent-cyan);">🎙️ Voice-Over Narration</span>
              <span style="font-size:0.68rem; color:var(--text-muted); font-family:var(--font-mono);">${wordCount} words • ${paceStatus}</span>
            </div>
            <p style="font-size: 0.9rem; font-weight: 500; color: #ffffff; background: rgba(0,0,0,0.25); padding: 0.6rem; border-radius: var(--radius-sm); border-left: 3px solid var(--accent-cyan);">
              "${s.vo}"
            </p>
            <div style="display: flex; gap: 0.4rem; margin-top: 0.5rem;">
              <button class="btn btn-secondary btn-sm" onclick="copyToClipboard('${escapeQuotes(s.vo)}', 'Scene ${s.id} VO Copied!')">
                📋 Copy VO
              </button>
              <button class="btn btn-secondary btn-sm" onclick="speakText('${escapeQuotes(s.vo)}')">
                🔊 Listen (TTS)
              </button>
            </div>
          </div>

          <div class="scene-actions-col">
            <label class="scene-checkbox-label">
              <input type="checkbox" ${isCompleted ? 'checked' : ''} onchange="toggleSceneDone(${s.id}, this.checked)">
              <span>${isCompleted ? '✅ Complete' : '⭕ Mark Done'}</span>
            </label>
            <button class="btn btn-primary btn-sm" onclick="jumpToPrompter(${s.id - 1})">
              🎙️ Practice in Studio
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // Toggle Scene Done
  window.toggleSceneDone = function(sceneId, isChecked) {
    if (isChecked) {
      appState.completedScenes[sceneId] = true;
    } else {
      delete appState.completedScenes[sceneId];
    }
    saveState();
    renderStoryboard(currentFilter, currentSearch);
    renderCanvaSuite();
  };

  // Helper Escape Function for JS onclick attributes
  function escapeQuotes(str) {
    if (!str) return '';
    return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '&quot;');
  }

  // Update Global Progress Bar & Counters
  function updateProgressStats() {
    const totalScenes = data.scenes.length;
    const completedCount = Object.keys(appState.completedScenes).length;
    const percent = Math.round((completedCount / totalScenes) * 100);

    const statsElem = document.getElementById('stat-completed-scenes');
    if (statsElem) statsElem.innerText = `${completedCount} / ${totalScenes}`;

    const percentElem = document.getElementById('stat-progress-percent');
    if (percentElem) percentElem.innerText = `${percent}%`;

    const progressFill = document.getElementById('global-progress-fill');
    if (progressFill) progressFill.style.width = `${percent}%`;
  }

  // Teleprompter & 8-Second Voice-Over Studio Logic
  let prompterTimer = null;
  let currentPrompterIndex = 0;
  let secondsRemaining = 8;
  let isPlaying = false;

  function updatePrompterUI() {
    const scene = data.scenes[currentPrompterIndex];
    if (!scene) return;

    const titleEl = document.getElementById('prompter-title');
    const voEl = document.getElementById('prompter-vo');
    const visualEl = document.getElementById('prompter-visual');
    const indexEl = document.getElementById('prompter-index');
    const timecodeEl = document.getElementById('prompter-timecode');

    if (titleEl) titleEl.innerText = `Scene ${scene.id}: ${scene.title}`;
    if (voEl) voEl.innerText = `"${scene.vo}"`;
    if (visualEl) visualEl.innerText = `Visual: ${scene.visual}`;
    if (indexEl) indexEl.innerText = `${scene.id} / ${data.scenes.length}`;
    if (timecodeEl) timecodeEl.innerText = scene.timecode;

    const barEl = document.getElementById('prompter-bar-fill');
    if (barEl) barEl.style.width = `${((8 - secondsRemaining) / 8) * 100}%`;

    const timerCircle = document.getElementById('prompter-timer-num');
    if (timerCircle) timerCircle.innerText = `${secondsRemaining}s`;
  }

  window.jumpToPrompter = function(index) {
    currentPrompterIndex = Math.max(0, Math.min(data.scenes.length - 1, index));
    secondsRemaining = 8;
    updatePrompterUI();
    const studioEl = document.getElementById('teleprompter-section');
    if (studioEl) {
      studioEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  window.startPrompter = function() {
    if (isPlaying) {
      pausePrompter();
      return;
    }

    isPlaying = true;
    const playBtn = document.getElementById('prompter-play-btn');
    if (playBtn) playBtn.innerHTML = '⏸️ Pause 8s Loop';

    const circle = document.getElementById('prompter-timer-circle');
    if (circle) circle.classList.add('active');

    prompterTimer = setInterval(() => {
      secondsRemaining--;
      if (secondsRemaining <= 0) {
        // Play soft audio cue
        playAudioCue();

        if (currentPrompterIndex < data.scenes.length - 1) {
          currentPrompterIndex++;
          secondsRemaining = 8;
        } else {
          // Reached the end
          secondsRemaining = 8;
          pausePrompter();
          showToast('🎉 Rehearsal Complete! All 22 scenes reviewed.', 'success');
          return;
        }
      }
      updatePrompterUI();
    }, 1000);
  };

  window.pausePrompter = function() {
    isPlaying = false;
    clearInterval(prompterTimer);
    prompterTimer = null;
    const playBtn = document.getElementById('prompter-play-btn');
    if (playBtn) playBtn.innerHTML = '▶️ Start 8s Practice Loop';

    const circle = document.getElementById('prompter-timer-circle');
    if (circle) circle.classList.remove('active');
  };

  window.nextPrompterScene = function() {
    if (currentPrompterIndex < data.scenes.length - 1) {
      currentPrompterIndex++;
      secondsRemaining = 8;
      updatePrompterUI();
    }
  };

  window.prevPrompterScene = function() {
    if (currentPrompterIndex > 0) {
      currentPrompterIndex--;
      secondsRemaining = 8;
      updatePrompterUI();
    }
  };

  window.resetPrompter = function() {
    pausePrompter();
    currentPrompterIndex = 0;
    secondsRemaining = 8;
    updatePrompterUI();
  };

  // Web Audio Metronome Cue
  function playAudioCue() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880; // A5 tone
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      // Audio context might be restricted before user gesture
    }
  }

  // Text-To-Speech function
  window.speakText = function(text) {
    if (!('speechSynthesis' in window)) {
      showToast('Speech synthesis not supported on this browser', 'error');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05; // natural upbeat delivery
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  // Distribution Generation Functions
  window.generateYouTubeChapters = function() {
    const chapters = data.scenes.map(s => {
      const startMin = Math.floor(s.startSec / 60);
      const startSec = (s.startSec % 60).toString().padStart(2, '0');
      return `${startMin}:${startSec} ${s.title}`;
    }).join('\n');

    const fullDescription = `${data.title}

In this complete 3-minute guide, we explore token optimization, custom IDE architecture, and dynamic model routing (Grok Low vs Gemini 3.7 Flash Low) to achieve maximum agentic performance at lowest cost.

📌 CHAPTERS:
${chapters}

🚀 RESOURCES & COMMUNITY:
• Skool Classroom: ${data.links.skoolClassroom}
• Interactive Helper App: https://rifaterdemsahin.github.io/aug-video-animation-3/
• 1-on-1 Strategy & Architecture: Join our Skool community for audits & pairing.

#AI #Claude #Gemini #Grok #SoftwareEngineering #AgenticAI #WebDevelopment`;

    copyToClipboard(fullDescription, 'YouTube Description & Chapters Copied!');
  };

  window.generateSRT = function() {
    let srtContent = '';
    data.scenes.forEach((s, idx) => {
      const formatTime = (sec) => {
        const h = Math.floor(sec / 3600).toString().padStart(2, '0');
        const m = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
        const sRem = Math.floor(sec % 60).toString().padStart(2, '0');
        return `${h}:${m}:${sRem},000`;
      };

      srtContent += `${idx + 1}\n`;
      srtContent += `${formatTime(s.startSec)} --> ${formatTime(s.endSec)}\n`;
      srtContent += `${s.vo}\n\n`;
    });

    const blob = new Blob([srtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'claude_token_optimization_subtitles.srt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('SRT Subtitles Downloaded!', 'success');
  };

  window.generateLinkedInPost = function() {
    const post = `🚀 Claude Developer Certification: Token Optimization, Cost Controls & Custom IDEs

How do you run 24/7 agentic coding workflows across massive repos without burning through your API budget?

Here is the 5-part framework we broke down in our new 3-minute animation:

1️⃣ Dynamic Model Routing: Route scaffolding & file reads to lightweight low-reasoning engines like Gemini 3.7 Flash (1588 Web Elo), keeping heavy reasoning exclusively for complex deduction.
2️⃣ Asynchronous Quota Accounting: Understanding rolling window telemetry to maximize developer throughput.
3️⃣ Antigravity IDE Controls: Toggling reasoning effort (Low/Med/High) directly inside your custom editor.
4️⃣ 1M+ Context Windows vs 500k: High-throughput needle-in-a-haystack retrieval for repo-wide payloads.
5️⃣ The Community Flywheel: Turning free video insights into structured packaging, peer accountability, and 1-on-1 architecture audits.

Watch the full 3-minute animated breakdown on YouTube & Skool!

Link in comments 👇

#AI #SoftwareEngineering #CloudArchitecture #DeveloperProductivity #Gemini #Anthropic`;

    copyToClipboard(post, 'LinkedIn Post Template Copied!');
  };

  window.generateXThread = function() {
    const thread = `🧵 Master Token Optimization & Custom IDE Routing in 3 Minutes:

1/ How to scale AI developer tooling without breaking the bank?
Strategic model routing + dynamic context management. 

2/ Why use Gemini 3.7 Flash in Low Reasoning?
• 1588 WebDev Arena Elo rating
• 1M+ token context window
• Industry-leading Time-to-First-Token
• Negligible quota burn compared to heavy Pro models.

3/ When to route to Grok Low?
• Complex state transitions
• Algorithmic deduction
• Pinpointing cryptic syntax bugs with minimal step bloat.

4/ The Secret: Custom IDE controls (127.0.0.1:3847) give you granular oversight over reasoning effort in real time.

5/ Want the full prompt pack, scene templates & 1-on-1 strategy sessions?
Join our community on Skool: ${data.links.skoolClassroom}

RT and like if you found this valuable! 🚀`;

    copyToClipboard(thread, 'X / Twitter Thread Copied!');
  };

  // Filter & Search Event Listeners
  let currentFilter = 'all';
  let currentSearch = '';

  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter || 'all';
      renderStoryboard(currentFilter, currentSearch);
    });
  });

  const searchInput = document.getElementById('scene-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value;
      renderStoryboard(currentFilter, currentSearch);
    });
  }

  // Sticky Nav Active State on Scroll (Scrollspy)
  const navLinks = document.querySelectorAll('.stage-nav-btn');
  const sections = document.querySelectorAll('.workflow-section, .hero-banner');

  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      if (window.pageYOffset >= sectionTop) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // Initial Renders & Setup
  renderFlywheel();
  renderCanvaSuite();
  renderStoryboard();
  updateProgressStats();
  updatePrompterUI();
  updateBudgetEstimate();
});
