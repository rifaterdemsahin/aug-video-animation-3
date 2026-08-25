// Main Interactive Application Logic for 3-Minute Video Animation Helper
document.addEventListener('DOMContentLoaded', () => {
  const data = window.VIDEO_DATA;
  if (!data) {
    console.error('Video data not found!');
    return;
  }

  // State Management with LocalStorage & Azure Files Cloud Sync
  const STORAGE_KEY = 'aug_video_animation_progress_v1';
  const AZURE_CONFIG_KEY = 'aug_video_azure_config_v1';

  let appState = loadState();
  let azureConfig = loadAzureConfig();
  let isAutoSyncEnabled = true;

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {
        completedScenes: {},
        stageChecklist: {},
        sanityChecklist: {},
        currentPrompterIndex: 0,
        lastSynced: null
      };
    } catch (e) {
      return { completedScenes: {}, stageChecklist: {}, sanityChecklist: {}, currentPrompterIndex: 0, lastSynced: null };
    }
  }

  function saveState(triggerCloudSync = true) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
      updateProgressStats();
      updateChecklistUI();
      if (triggerCloudSync && isAutoSyncEnabled) {
        debouncedCloudSync();
      }
    } catch (e) {
      console.warn('Could not save state to localStorage', e);
    }
  }

  function loadAzureConfig() {
    try {
      const saved = localStorage.getItem(AZURE_CONFIG_KEY);
      return saved ? JSON.parse(saved) : (data.azureConfig || {});
    } catch (e) {
      return data.azureConfig || {};
    }
  }

  function saveAzureConfig(newCfg) {
    azureConfig = { ...azureConfig, ...newCfg };
    localStorage.setItem(AZURE_CONFIG_KEY, JSON.stringify(azureConfig));
    showToast('Azure cloud settings updated!', 'success');
  }

  // Toast Notification System
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${type === 'success' ? '✅' : (type === 'cloud' ? '☁️' : '📋')}</span> <span>${message}</span>`;
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

  // Azure Files REST API Cloud Sync Implementation
  let syncTimeout = null;
  function debouncedCloudSync() {
    clearTimeout(syncTimeout);
    syncTimeout = setTimeout(() => {
      window.pushStateToAzure(false);
    }, 1500);
  }

  function setSyncStatus(status, text) {
    const statusPill = document.getElementById('azure-sync-status-pill');
    const lastSyncEl = document.getElementById('azure-last-sync-time');
    if (statusPill) {
      statusPill.className = `badge-pill badge-sync-${status}`;
      statusPill.innerHTML = `<span class="badge-pulse"></span> ${text}`;
    }
    if (lastSyncEl && appState.lastSynced) {
      const d = new Date(appState.lastSynced);
      lastSyncEl.innerText = `Synced: ${d.toLocaleTimeString()}`;
    }
  }

  // Push State to Azure Files
  window.pushStateToAzure = async function(isManual = true) {
    if (!azureConfig.storageAccount || !azureConfig.fileShare || !azureConfig.defaultSasToken) {
      if (isManual) showToast('Missing Azure configuration credentials.', 'error');
      return;
    }

    setSyncStatus('syncing', 'Syncing to Azure...');

    const payload = JSON.stringify({
      updatedAt: new Date().toISOString(),
      project: "aug-video-animation-3",
      completedScenes: appState.completedScenes,
      stageChecklist: appState.stageChecklist,
      currentPrompterIndex: currentPrompterIndex,
      syncedVia: "Web App Azure Files REST API"
    }, null, 2);

    const account = azureConfig.storageAccount;
    const share = azureConfig.fileShare;
    const fileName = azureConfig.fileName || "aug_video_animation_state.json";
    const sas = azureConfig.defaultSasToken.startsWith('?') ? azureConfig.defaultSasToken.substring(1) : azureConfig.defaultSasToken;

    const fileUrl = `https://${account}.file.core.windows.net/${share}/${fileName}?${sas}`;

    try {
      const contentLength = new Blob([payload]).size;

      // 1. Create/Allocate the file in Azure Files
      const createRes = await fetch(fileUrl, {
        method: 'PUT',
        headers: {
          'x-ms-type': 'file',
          'x-ms-content-length': contentLength.toString(),
          'x-ms-version': '2026-04-06'
        }
      });

      if (!createRes.ok && createRes.status !== 201 && createRes.status !== 200) {
        throw new Error(`File create returned HTTP ${createRes.status}`);
      }

      // 2. Put the Range (Upload the content)
      const rangeUrl = `https://${account}.file.core.windows.net/${share}/${fileName}?comp=range&${sas}`;
      const uploadRes = await fetch(rangeUrl, {
        method: 'PUT',
        headers: {
          'x-ms-write': 'update',
          'x-ms-range': `bytes=0-${contentLength - 1}`,
          'x-ms-version': '2026-04-06'
        },
        body: payload
      });

      if (!uploadRes.ok && uploadRes.status !== 201 && uploadRes.status !== 200) {
        throw new Error(`Range write returned HTTP ${uploadRes.status}`);
      }

      appState.lastSynced = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
      setSyncStatus('online', 'Azure Files Synced');
      if (isManual) showToast('☁️ State pushed to Azure Files!', 'cloud');

    } catch (err) {
      console.warn('Azure Files REST push error (CORS or network):', err);
      setSyncStatus('local', 'Local Active (CLI Sync Ready)');
      if (isManual) {
        showToast('Local state saved. Run ./scripts/azure_sync.sh push for CLI sync', 'info');
      }
    }
  };

  // Pull State from Azure Files
  window.pullStateFromAzure = async function() {
    if (!azureConfig.storageAccount || !azureConfig.fileShare || !azureConfig.defaultSasToken) {
      showToast('Missing Azure credentials', 'error');
      return;
    }

    setSyncStatus('syncing', 'Fetching from Azure...');

    const account = azureConfig.storageAccount;
    const share = azureConfig.fileShare;
    const fileName = azureConfig.fileName || "aug_video_animation_state.json";
    const sas = azureConfig.defaultSasToken.startsWith('?') ? azureConfig.defaultSasToken.substring(1) : azureConfig.defaultSasToken;

    const fileUrl = `https://${account}.file.core.windows.net/${share}/${fileName}?${sas}`;

    try {
      const res = await fetch(fileUrl, {
        method: 'GET',
        headers: {
          'x-ms-version': '2026-04-06'
        }
      });

      if (!res.ok) {
        throw new Error(`Fetch failed with status ${res.status}`);
      }

      const remoteData = await res.json();
      if (remoteData) {
        appState.completedScenes = remoteData.completedScenes || {};
        appState.stageChecklist = remoteData.stageChecklist || {};
        appState.lastSynced = remoteData.updatedAt || new Date().toISOString();
        saveState(false);
        renderStoryboard(currentFilter, currentSearch);
        renderCanvaSuite();
        renderAllStageChecklists();
        setSyncStatus('online', 'Azure Files Synced');
        showToast('🔄 Pulled latest state from Azure Files!', 'success');
      }
    } catch (err) {
      console.warn('Azure pull failed:', err);
      setSyncStatus('local', 'Local Active');
      showToast('Remote state empty or CORS blocked. Use ./scripts/azure_sync.sh pull', 'info');
    }
  };

  // Render Master Multi-Stage Production Checklist
  function renderAllStageChecklists() {
    const container = document.getElementById('canva-multi-stage-checklist');
    if (!container || !data.productionChecklistStages) return;

    container.innerHTML = data.productionChecklistStages.map(stage => {
      const total = stage.items.length;
      const done = stage.items.filter(it => !!appState.stageChecklist[it.id]).length;
      const isStageComplete = done === total;

      return `
        <div class="stage-check-card ${isStageComplete ? 'stage-card-complete' : ''}" style="background: rgba(15, 23, 42, 0.7); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 0.75rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:0.4rem;">
            <div style="font-weight:700; font-size:0.88rem; color:#ffffff; display:flex; align-items:center; gap:0.5rem;">
              <span>${stage.icon}</span> ${stage.title}
            </div>
            <span style="font-size:0.72rem; font-family:var(--font-mono); color:${isStageComplete ? 'var(--accent-emerald)' : 'var(--text-muted)'}; background:rgba(255,255,255,0.06); padding:2px 8px; border-radius:10px;">
              ${done}/${total} Done
            </span>
          </div>
          <ul class="checklist" style="gap: 0.5rem;">
            ${stage.items.map(it => {
              const isChecked = !!appState.stageChecklist[it.id];
              return `
                <li class="checklist-item">
                  <input type="checkbox" id="check-${it.id}" ${isChecked ? 'checked' : ''} onchange="toggleStageItem('${it.id}', this.checked)">
                  <label for="check-${it.id}" style="font-size:0.8rem; color:${isChecked ? 'var(--accent-emerald)' : '#d1d5db'}; text-decoration:${isChecked ? 'line-through' : 'none'};">
                    ${it.label}
                  </label>
                </li>
              `;
            }).join('')}
          </ul>
        </div>
      `;
    }).join('');
  }

  window.toggleStageItem = function(itemId, isChecked) {
    if (isChecked) {
      appState.stageChecklist[itemId] = true;
    } else {
      delete appState.stageChecklist[itemId];
    }
    saveState(true);
    renderAllStageChecklists();
  };

  function updateChecklistUI() {
    renderAllStageChecklists();
  }

  // Budget Estimator Calculation
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

  // Advance or set footage status in aug video 3 / used asset workflow
  window.setFootageStatus = function(sceneId, status) {
    if (!appState.footageStatus) appState.footageStatus = {};
    appState.footageStatus[sceneId] = status;
    if (status === 'used' || status === 'uploaded') {
      appState.completedScenes[sceneId] = true;
    }
    saveState(true);
    renderCanvaSuite();
    renderStoryboard(currentFilter, currentSearch);
    updateGlobalProgress();
    showToast(`Scene ${sceneId} footage: ${status === 'used' ? '🗃️ Moved to used asset' : status === 'uploaded' ? '🎥 Timeline Placed' : '📥 In aug video 3'}`);
  };

  window.moveAllNextFootage = function() {
    if (!appState.footageStatus) appState.footageStatus = {};
    const nextScene = data.scenes.find(s => appState.footageStatus[s.id] !== 'used');
    if (nextScene) {
      window.setFootageStatus(nextScene.id, 'used');
    } else {
      showToast('🎉 All 22 footages have been moved to used asset!', 'success');
    }
  };

  window.resetAllFootageStatus = function() {
    appState.footageStatus = {};
    saveState(true);
    renderCanvaSuite();
    showToast('🔄 Footage placement reset to initial state');
  };

  // Launch Dual Workspace (Google Flow + Canva) simultaneously
  window.launchDualProductionWorkspace = function() {
    window.open('https://labs.google/flow', '_blank');
    window.open('https://www.canva.com', '_blank');
    showToast('🪟 Opened Google Flow & Canva Prod side-by-side!', 'cloud');
  };

  // Render Canva 3-Section Suite
  function renderCanvaSuite() {
    const preprodContainer = document.getElementById('canva-preprod-postits');
    const prodContainer = document.getElementById('canva-prod-timeline');

    if (!appState.footageStatus) appState.footageStatus = {};

    const usedCount = data.scenes.filter(s => appState.footageStatus[s.id] === 'used').length;
    const uploadedCount = data.scenes.filter(s => appState.footageStatus[s.id] === 'uploaded').length;

    // 1. Pre-Prod Column: Digital Post-it Notes with Script & Post-Prod Guides
    if (preprodContainer) {
      preprodContainer.innerHTML = data.scenes.map(s => `
        <div class="postit-note" style="background-color: ${s.canvaPostItColor || '#fef08a'};" onclick="copyToClipboard('${escapeQuotes(s.vo)}', 'Scene ${s.id} Script Copied!')" title="Click to copy Scene ${s.id} script for Post-Prod VO">
          <div class="postit-header">
            <span>Scene ${s.id} (${s.timecode})</span>
            <span>📝 Post-it Script</span>
          </div>
          <div class="postit-body">
            <div style="font-weight:700; margin-bottom:2px;">${s.title}</div>
            <div style="font-style:italic; font-size:0.79rem; color:#111827;">"${s.vo}"</div>
            <div style="margin-top:6px; font-size:0.68rem; font-weight:700; text-transform:uppercase; color:#4b5563; border-top:1px dashed rgba(0,0,0,0.15); padding-top:4px;">
              🎯 Post-Prod Cue: ~${s.vo.split(' ').length} words / 8s cadence
            </div>
          </div>
        </div>
      `).join('');
    }

    // 2. Prod Column: Storyboard-like Video Upload & Sequencer (Move footages one by one)
    if (prodContainer) {
      const headerBar = `
        <div style="background: rgba(0,0,0,0.35); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 0.6rem 0.75rem; margin-bottom: 0.75rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.75rem; font-weight:700; margin-bottom:0.35rem;">
            <span>📁 'aug video 3' ➔ 'used asset'</span>
            <span style="color:var(--accent-emerald);">${usedCount}/22 Placed</span>
          </div>
          <div class="progress-bar-container" style="height:5px; margin-bottom:0.5rem;">
            <div class="progress-bar-fill" style="width: ${(usedCount / 22) * 100}%; background: linear-gradient(90deg, var(--accent-cyan), var(--accent-emerald));"></div>
          </div>
          <div style="display:flex; gap:0.4rem;">
            <button class="btn btn-secondary btn-sm" style="flex:1; font-size:0.7rem; padding:2px 6px;" onclick="moveAllNextFootage()">
              ⚡ Move Next Footage
            </button>
            <button class="btn btn-secondary btn-sm" style="font-size:0.7rem; padding:2px 6px;" onclick="resetAllFootageStatus()">
              🔄 Reset
            </button>
          </div>
        </div>
      `;

      const cardsHtml = data.scenes.map(s => {
        const status = appState.footageStatus[s.id] || (appState.completedScenes[s.id] ? 'uploaded' : 'incoming');
        const isUsed = status === 'used';
        const isUploaded = status === 'uploaded';

        return `
          <div class="flow-prompt-card ${isUsed ? 'stage-card-complete' : ''}" style="margin-bottom: 0.75rem; padding: 0.85rem; background: ${isUsed ? 'rgba(6, 78, 59, 0.25)' : 'rgba(15, 23, 42, 0.85)'}; border-left: 3px solid ${isUsed ? 'var(--accent-emerald)' : isUploaded ? 'var(--accent-cyan)' : 'var(--accent-amber)'};">
            <!-- Header -->
            <div class="flow-prompt-header">
              <div>
                <span style="font-size:0.8rem; font-weight:800; color:#ffffff;">Scene ${s.id}</span>
                <span style="font-size:0.72rem; font-family:var(--font-mono); color:var(--accent-cyan); margin-left:4px;">(${s.timecode})</span>
              </div>
              <span class="badge-pill" style="font-size:0.65rem; padding:1px 6px; ${isUsed ? 'background:rgba(16,185,129,0.2); color:#6ee7b7;' : isUploaded ? 'background:rgba(6,182,212,0.2); color:#67e8f9;' : 'background:rgba(245,158,11,0.2); color:#fcd34d;'}">
                ${isUsed ? '🗃️ in used asset' : isUploaded ? '🎥 on Timeline' : '📥 in aug video 3'}
              </span>
            </div>

            <!-- Post-it Script preview for Post-Prod guidance -->
            <div style="background: ${s.canvaPostItColor || '#fef08a'}; color:#1f2937; padding: 0.4rem 0.6rem; border-radius: 4px; font-size: 0.72rem; margin: 0.4rem 0; box-shadow:0 1px 3px rgba(0,0,0,0.2);">
              <strong>📝 Post-it:</strong> "${s.vo.substring(0, 75)}..."
            </div>

            <!-- Visual Prompt -->
            <p style="font-size:0.75rem; color:#d1d5db; margin:0.3rem 0; line-height:1.35;">
              <strong style="color:var(--accent-cyan);">Visual:</strong> ${s.visual}
            </p>

            <!-- Video File Tag & Prompt Copy -->
            <div style="display:flex; justify-content:space-between; align-items:center; margin:0.4rem 0 0.6rem 0;">
              <span style="font-family:var(--font-mono); font-size:0.7rem; color:var(--text-muted); background:rgba(0,0,0,0.3); padding:2px 6px; border-radius:4px;">
                📼 scene_${String(s.id).padStart(2, '0')}.mp4 (8.0s)
              </span>
              <button class="btn btn-secondary btn-sm" style="font-size:0.68rem; padding:2px 6px;" onclick="copyToClipboard('${escapeQuotes(s.googleFlowPrompt)}', 'Scene ${s.id} Flow Prompt Copied!')">
                📋 Copy Prompt
              </button>
            </div>

            <!-- Step Sequencer Action Buttons (Move one by one) -->
            <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap: 4px; margin-top: 4px;">
              <button class="btn btn-sm ${status === 'incoming' ? 'btn-primary' : 'btn-secondary'}" style="font-size:0.65rem; padding:3px 2px; justify-content:center;" onclick="setFootageStatus(${s.id}, 'incoming')">
                📥 Incoming
              </button>
              <button class="btn btn-sm ${status === 'uploaded' ? 'btn-primary' : 'btn-secondary'}" style="font-size:0.65rem; padding:3px 2px; justify-content:center;" onclick="setFootageStatus(${s.id}, 'uploaded')">
                🎥 Placed
              </button>
              <button class="btn btn-sm ${status === 'used' ? 'btn-accent' : 'btn-secondary'}" style="font-size:0.65rem; padding:3px 2px; justify-content:center;" onclick="setFootageStatus(${s.id}, 'used')">
                🗃️ To used asset
              </button>
            </div>
          </div>
        `;
      }).join('');

      prodContainer.innerHTML = headerBar + cardsHtml;
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
    saveState(true);
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
        playAudioCue();
        if (currentPrompterIndex < data.scenes.length - 1) {
          currentPrompterIndex++;
          secondsRemaining = 8;
        } else {
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
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {}
  }

  // Text-To-Speech function
  window.speakText = function(text) {
    if (!('speechSynthesis' in window)) {
      showToast('Speech synthesis not supported on this browser', 'error');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
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
  renderAllStageChecklists();
  updateProgressStats();
  updatePrompterUI();
  updateBudgetEstimate();
  setSyncStatus('online', 'Azure Files Connected');
});
