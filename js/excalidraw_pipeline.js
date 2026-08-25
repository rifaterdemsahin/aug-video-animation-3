// Interactive Pipeline Excalidraw / Whiteboard Engine
// Allows drawing, annotating, highlighting, and exporting the 3-Minute Video Animation Pipeline

(function() {
  const STORAGE_KEY = 'aug_video_pipeline_drawing_v1';
  let canvas, ctx;
  let isDrawing = false;
  let startX = 0, startY = 0;
  let currentTool = 'pen'; // 'pen' | 'highlighter' | 'arrow' | 'rect' | 'circle' | 'text' | 'eraser'
  let currentColor = '#06b6d4'; // default cyan
  let currentStrokeWidth = 3;

  let strokes = []; // Array of drawn objects
  let undoStack = [];

  // Initialize Canvas on Load
  window.initPipelineExcalidraw = function() {
    canvas = document.getElementById('excalidraw-canvas');
    if (!canvas) return;

    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    loadSavedStrokes();
    setupEventListeners();
    redrawCanvas();
  };

  function resizeCanvas() {
    if (!canvas) return;
    const wrapper = canvas.parentElement;
    const rect = wrapper.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    redrawCanvas();
  }

  function getCanvasPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  // Draw the Pre-Rendered Base Pipeline Architecture Blueprint
  function drawBasePipelineBlueprint(context, width, height) {
    // Background Grid
    context.fillStyle = '#080c14';
    context.fillRect(0, 0, width, height);

    // Subtle grid lines
    context.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    context.lineWidth = 1;
    for (let x = 0; x < width; x += 30) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, height);
      context.stroke();
    }
    for (let y = 0; y < height; y += 30) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
    }

    // Pipeline Title Header inside canvas
    context.fillStyle = 'rgba(255, 255, 255, 0.9)';
    context.font = 'bold 15px Inter, sans-serif';
    context.fillText('⚡ 3-MINUTE AI ANIMATION PIPELINE ARCHITECTURE (176s / 22 Scenes)', 24, 32);

    context.fillStyle = '#06b6d4';
    context.font = '11px JetBrains Mono, monospace';
    context.fillText('Total Turnaround: ~2h 15m (135 min) • 330 Base Credits • 18-22 Words/8s • Draw & annotate your feedback below!', 24, 50);

    // Define 8 stages across 2 rows
    const colWidth = Math.min(220, (width - 80) / 4);
    const cardHeight = 135;
    const row1Y = 75;
    const row2Y = 265;

    const stagesRow1 = [
      { id: '1', name: 'Stage 1: Skool Ideation', icon: '🏫', time: '15-20 min', color: '#f59e0b', desc: 'Raw topic extraction & UI research (127.0.0.1:3847)' },
      { id: '2', name: 'Stage 2: Gemini Script', icon: '🤖', time: '10-15 min', color: '#06b6d4', desc: '22 Scenes x 8s pacing & 18-22 word VO lines' },
      { id: '2.5', name: 'Stage 2.5: Simulation', icon: '🪟', time: '5 min', color: '#38bdf8', desc: 'Split-view Flow + Gemini pair staging' },
      { id: '3', name: 'Stage 3: Google Flow', icon: '🎬', time: '25-35 min', color: '#a855f7', desc: 'Render 22 8s isometric clips (15 credits/ea)' }
    ];

    const stagesRow2 = [
      { id: '5', name: 'Stage 5: Distribute', icon: '🚀', time: '15-20 min', color: '#10b981', desc: 'YouTube 22 chaps, LinkedIn post & Skool flywheel' },
      { id: '4.5', name: 'Stage 4.5: VO Studio', icon: '🎙️', time: '15-20 min', color: '#34d399', desc: '8s Teleprompter rehearsal in authentic voice' },
      { id: '4', name: 'Stage 4: Canva 3-Sec', icon: '🎨', time: '30-45 min', color: '#f43f5e', desc: '8s placeholder bulk paste & move to used asset' },
      { id: 'QC', name: 'QC: Quality Gate', icon: '🧪', time: '10-15 min', color: '#fb7185', desc: 'Sort footages & zero-gap check with shotlist' }
    ];

    // Render Row 1 Nodes
    stagesRow1.forEach((stage, i) => {
      const x = 24 + i * (colWidth + 24);
      drawBlueprintCard(context, x, row1Y, colWidth, cardHeight, stage);

      // Arrow to next
      if (i < stagesRow1.length - 1) {
        drawBlueprintArrow(context, x + colWidth + 4, row1Y + cardHeight / 2, x + colWidth + 20, row1Y + cardHeight / 2, '#3b82f6');
      }
    });

    // Connector from Row 1 to Row 2
    const lastX1 = 24 + 3 * (colWidth + 24) + colWidth / 2;
    drawBlueprintArrow(context, lastX1, row1Y + cardHeight + 4, lastX1, row2Y - 8, '#f43f5e');

    // Render Row 2 Nodes (Right to Left flow)
    const reversedRow2 = [stagesRow2[3], stagesRow2[2], stagesRow2[1], stagesRow2[0]];
    reversedRow2.forEach((stage, i) => {
      const x = 24 + (3 - i) * (colWidth + 24);
      drawBlueprintCard(context, x, row2Y, colWidth, cardHeight, stage);

      // Arrow pointing left
      if (i < reversedRow2.length - 1) {
        drawBlueprintArrow(context, x - 4, row2Y + cardHeight / 2, x - 20, row2Y + cardHeight / 2, '#10b981');
      }
    });
  }

  function drawBlueprintCard(c, x, y, w, h, stage) {
    // Card background
    c.fillStyle = 'rgba(15, 23, 42, 0.85)';
    c.strokeStyle = stage.color || 'rgba(255, 255, 255, 0.15)';
    c.lineWidth = 1.5;

    // Rounded rect
    const r = 8;
    c.beginPath();
    c.moveTo(x + r, y);
    c.lineTo(x + w - r, y);
    c.quadraticCurveTo(x + w, y, x + w, y + r);
    c.lineTo(x + w, y + h - r);
    c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    c.lineTo(x + r, y + h);
    c.quadraticCurveTo(x, y + h, x, y + h - r);
    c.lineTo(x, y + r);
    c.quadraticCurveTo(x, y, x + r, y);
    c.closePath();
    c.fill();
    c.stroke();

    // Stage Icon & Title
    c.fillStyle = '#ffffff';
    c.font = 'bold 12px Inter, sans-serif';
    c.fillText(`${stage.icon} ${stage.name}`, x + 10, y + 24);

    // Duration Pill
    c.fillStyle = 'rgba(245, 158, 11, 0.18)';
    c.strokeStyle = 'rgba(245, 158, 11, 0.4)';
    c.lineWidth = 1;
    c.beginPath();
    c.roundRect(x + 10, y + 36, w - 20, 20, 4);
    c.fill();
    c.stroke();

    c.fillStyle = '#fbbf24';
    c.font = 'bold 10px JetBrains Mono, monospace';
    c.fillText(`⏱️ Est: ${stage.time}`, x + 16, y + 50);

    // Description text
    c.fillStyle = '#9ca3af';
    c.font = '10px Inter, sans-serif';
    wrapText(c, stage.desc, x + 10, y + 74, w - 20, 14);
  }

  function drawBlueprintArrow(c, fromX, fromY, toX, toY, color = '#3b82f6') {
    c.strokeStyle = color;
    c.fillStyle = color;
    c.lineWidth = 2;

    c.beginPath();
    c.moveTo(fromX, fromY);
    c.lineTo(toX, toY);
    c.stroke();

    // Arrowhead
    const angle = Math.atan2(toY - fromY, toX - fromX);
    const headLen = 7;
    c.beginPath();
    c.moveTo(toX, toY);
    c.lineTo(toX - headLen * Math.cos(angle - Math.PI / 6), toY - headLen * Math.sin(angle - Math.PI / 6));
    c.lineTo(toX - headLen * Math.cos(angle + Math.PI / 6), toY - headLen * Math.sin(angle + Math.PI / 6));
    c.closePath();
    c.fill();
  }

  function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let currY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = context.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        context.fillText(line, x, currY);
        line = words[n] + ' ';
        currY += lineHeight;
      } else {
        line = testLine;
      }
    }
    context.fillText(line, x, currY);
  }

  // Redraw Complete Canvas (Base blueprint + all user strokes)
  function redrawCanvas() {
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    drawBasePipelineBlueprint(ctx, rect.width, rect.height);

    // Draw user strokes
    strokes.forEach(s => {
      ctx.save();
      ctx.strokeStyle = s.color;
      ctx.fillStyle = s.color;
      ctx.lineWidth = s.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = s.tool === 'highlighter' ? 0.35 : 1.0;

      if (s.tool === 'pen' || s.tool === 'highlighter') {
        if (s.points && s.points.length > 0) {
          ctx.beginPath();
          ctx.moveTo(s.points[0].x, s.points[0].y);
          for (let i = 1; i < s.points.length; i++) {
            ctx.lineTo(s.points[i].x, s.points[i].y);
          }
          ctx.stroke();
        }
      } else if (s.tool === 'arrow') {
        drawUserArrow(ctx, s.startX, s.startY, s.endX, s.endY, s.color, s.width);
      } else if (s.tool === 'rect') {
        ctx.beginPath();
        ctx.strokeRect(s.startX, s.startY, s.endX - s.startX, s.endY - s.startY);
      } else if (s.tool === 'circle') {
        ctx.beginPath();
        const rx = Math.abs(s.endX - s.startX) / 2;
        const ry = Math.abs(s.endY - s.startY) / 2;
        const cx = Math.min(s.startX, s.endX) + rx;
        const cy = Math.min(s.startY, s.endY) + ry;
        ctx.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (s.tool === 'text') {
        ctx.font = 'bold 14px Inter, sans-serif';
        ctx.fillText(s.text, s.startX, s.startY);
      }
      ctx.restore();
    });
  }

  function drawUserArrow(c, fromX, fromY, toX, toY, color, width) {
    c.beginPath();
    c.moveTo(fromX, fromY);
    c.lineTo(toX, toY);
    c.stroke();

    const angle = Math.atan2(toY - fromY, toX - fromX);
    const headLen = Math.max(10, width * 3);
    c.beginPath();
    c.moveTo(toX, toY);
    c.lineTo(toX - headLen * Math.cos(angle - Math.PI / 6), toY - headLen * Math.sin(angle - Math.PI / 6));
    c.lineTo(toX - headLen * Math.cos(angle + Math.PI / 6), toY - headLen * Math.sin(angle + Math.PI / 6));
    c.closePath();
    c.fill();
  }

  // Event Listeners for Drawing
  let currentStroke = null;

  function setupEventListeners() {
    canvas.addEventListener('mousedown', onPointerDown);
    canvas.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    canvas.addEventListener('touchstart', onPointerDown, { passive: false });
    canvas.addEventListener('touchmove', onPointerMove, { passive: false });
    window.addEventListener('touchend', onPointerUp);
  }

  function onPointerDown(e) {
    const pos = getCanvasPos(e);
    isDrawing = true;
    startX = pos.x;
    startY = pos.y;

    if (currentTool === 'text') {
      const text = prompt('Enter your note/feedback text:');
      if (text) {
        strokes.push({
          tool: 'text',
          text: text,
          startX: pos.x,
          startY: pos.y,
          color: currentColor,
          width: currentStrokeWidth
        });
        saveStrokes();
        redrawCanvas();
      }
      isDrawing = false;
      return;
    }

    if (currentTool === 'pen' || currentTool === 'highlighter') {
      currentStroke = {
        tool: currentTool,
        color: currentColor,
        width: currentTool === 'highlighter' ? currentStrokeWidth * 3.5 : currentStrokeWidth,
        points: [pos]
      };
    } else if (currentTool === 'eraser') {
      eraseNear(pos.x, pos.y);
    }
  }

  function onPointerMove(e) {
    if (!isDrawing) return;
    if (e.preventDefault) e.preventDefault();
    const pos = getCanvasPos(e);

    if (currentTool === 'pen' || currentTool === 'highlighter') {
      if (currentStroke) {
        currentStroke.points.push(pos);
        redrawCanvas();

        // Draw live stroke segment
        ctx.save();
        ctx.strokeStyle = currentStroke.color;
        ctx.lineWidth = currentStroke.width;
        ctx.lineCap = 'round';
        ctx.globalAlpha = currentTool === 'highlighter' ? 0.35 : 1.0;
        ctx.beginPath();
        const pts = currentStroke.points;
        ctx.moveTo(pts[pts.length - 2].x, pts[pts.length - 2].y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        ctx.restore();
      }
    } else if (currentTool === 'arrow' || currentTool === 'rect' || currentTool === 'circle') {
      redrawCanvas();
      // Draw live shape preview
      ctx.save();
      ctx.strokeStyle = currentColor;
      ctx.fillStyle = currentColor;
      ctx.lineWidth = currentStrokeWidth;
      if (currentTool === 'arrow') {
        drawUserArrow(ctx, startX, startY, pos.x, pos.y, currentColor, currentStrokeWidth);
      } else if (currentTool === 'rect') {
        ctx.strokeRect(startX, startY, pos.x - startX, pos.y - startY);
      } else if (currentTool === 'circle') {
        ctx.beginPath();
        const rx = Math.abs(pos.x - startX) / 2;
        const ry = Math.abs(pos.y - startY) / 2;
        ctx.ellipse(Math.min(startX, pos.x) + rx, Math.min(startY, pos.y) + ry, rx, ry, 0, 0, 2 * Math.PI);
        ctx.stroke();
      }
      ctx.restore();
    } else if (currentTool === 'eraser') {
      eraseNear(pos.x, pos.y);
    }
  }

  function onPointerUp(e) {
    if (!isDrawing) return;
    isDrawing = false;

    if (currentStroke && (currentTool === 'pen' || currentTool === 'highlighter')) {
      strokes.push(currentStroke);
      currentStroke = null;
      undoStack = [];
      saveStrokes();
      redrawCanvas();
    } else if (currentTool === 'arrow' || currentTool === 'rect' || currentTool === 'circle') {
      const pos = e.changedTouches ? getCanvasPos(e.changedTouches[0]) : (e.clientX ? getCanvasPos(e) : { x: startX, y: startY });
      strokes.push({
        tool: currentTool,
        startX: startX,
        startY: startY,
        endX: pos.x,
        endY: pos.y,
        color: currentColor,
        width: currentStrokeWidth
      });
      undoStack = [];
      saveStrokes();
      redrawCanvas();
    }
  }

  function eraseNear(x, y) {
    const threshold = 18;
    const before = strokes.length;
    strokes = strokes.filter(s => {
      if (s.points) {
        return !s.points.some(p => Math.hypot(p.x - x, p.y - y) < threshold);
      }
      if (s.startX && s.endX) {
        const midX = (s.startX + s.endX) / 2;
        const midY = (s.startY + s.endY) / 2;
        return Math.hypot(midX - x, midY - y) >= threshold;
      }
      return true;
    });

    if (strokes.length !== before) {
      saveStrokes();
      redrawCanvas();
    }
  }

  // Public Actions
  window.setExcaliTool = function(tool, btn) {
    currentTool = tool;
    document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
  };

  window.setExcaliColor = function(color, btn) {
    currentColor = color;
    document.querySelectorAll('.color-swatch-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
  };

  window.setExcaliStrokeWidth = function(w) {
    currentStrokeWidth = parseInt(w) || 3;
  };

  window.undoExcali = function() {
    if (strokes.length > 0) {
      undoStack.push(strokes.pop());
      saveStrokes();
      redrawCanvas();
    }
  };

  window.redoExcali = function() {
    if (undoStack.length > 0) {
      strokes.push(undoStack.pop());
      saveStrokes();
      redrawCanvas();
    }
  };

  window.clearExcali = function() {
    if (confirm('Clear all drawing annotations and reset base pipeline?')) {
      strokes = [];
      undoStack = [];
      saveStrokes();
      redrawCanvas();
      if (window.showToast) window.showToast('Drawing cleared & base reset', 'info');
    }
  };

  window.saveExcaliDrawing = function() {
    saveStrokes();
    if (window.pushStateToAzure) window.pushStateToAzure(false);
    if (window.showToast) window.showToast('💾 Pipeline feedback drawing saved & synced!', 'success');
  };

  window.downloadExcaliPNG = function() {
    if (!canvas) return;
    redrawCanvas();
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'pipeline_feedback_annotated.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    if (window.showToast) window.showToast('📥 Feedback drawing exported as PNG!', 'success');
  };

  function saveStrokes() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(strokes));
    } catch (e) {}
  }

  function loadSavedStrokes() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) strokes = JSON.parse(saved);
    } catch (e) {
      strokes = [];
    }
  }

  // Auto-init
  document.addEventListener('DOMContentLoaded', () => {
    window.initPipelineExcalidraw();
  });
})();
