// Interactive Pipeline Excalidraw / Whiteboard Engine
// Vertical Pipeline Architecture with Draggable Notes & Text Tools on Both Sides

(function() {
  const STORAGE_KEY = 'aug_video_pipeline_drawing_v1';
  let canvas, ctx;
  let isDrawing = false;
  let startX = 0, startY = 0;
  let currentTool = 'pen'; // 'select' | 'pen' | 'highlighter' | 'arrow' | 'rect' | 'circle' | 'text' | 'sticky' | 'eraser'
  let currentColor = '#06b6d4'; // default cyan
  let currentStrokeWidth = 3;
  let currentFontSize = 14;

  let strokes = []; // Array of drawn objects
  let undoStack = [];

  // Dragging State
  let draggedStroke = null;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let hoveredStroke = null;

  const VIRTUAL_CANVAS_HEIGHT = 1320;

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

    const width = Math.max(900, rect.width);
    const height = VIRTUAL_CANVAS_HEIGHT;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

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

  // Hit Test to find which stroke/note is under cursor
  function hitTestStroke(pos) {
    if (!ctx) return null;
    // Iterate in reverse (topmost first)
    for (let i = strokes.length - 1; i >= 0; i--) {
      const s = strokes[i];
      if (s.tool === 'text' || s.tool === 'sticky') {
        const fontSize = s.fontSize || 14;
        ctx.font = `bold ${fontSize}px Inter, sans-serif`;
        const lines = (s.text || '').split('\n');
        const lineHeight = fontSize * 1.35;
        let maxLineW = 0;
        lines.forEach(l => {
          const w = ctx.measureText(l).width;
          if (w > maxLineW) maxLineW = w;
        });

        const boxW = Math.max(120, maxLineW + 24);
        const boxH = Math.max(36, lines.length * lineHeight + 18);
        const minX = s.startX - 10;
        const minY = s.startY - fontSize;
        const maxX = minX + boxW;
        const maxY = minY + boxH;

        if (pos.x >= minX && pos.x <= maxX && pos.y >= minY && pos.y <= maxY) {
          return { stroke: s, index: i, box: { x: minX, y: minY, w: boxW, h: boxH } };
        }
      } else if (s.tool === 'rect') {
        const minX = Math.min(s.startX, s.endX);
        const maxX = Math.max(s.startX, s.endX);
        const minY = Math.min(s.startY, s.endY);
        const maxY = Math.max(s.startY, s.endY);
        if (pos.x >= minX - 10 && pos.x <= maxX + 10 && pos.y >= minY - 10 && pos.y <= maxY + 10) {
          return { stroke: s, index: i, box: { x: minX, y: minY, w: maxX - minX, h: maxY - minY } };
        }
      } else if (s.tool === 'circle') {
        const rx = Math.abs(s.endX - s.startX) / 2;
        const ry = Math.abs(s.endY - s.startY) / 2;
        const cx = Math.min(s.startX, s.endX) + rx;
        const cy = Math.min(s.startY, s.endY) + ry;
        const dist = Math.hypot(pos.x - cx, pos.y - cy);
        if (dist <= Math.max(rx, ry) + 10) {
          return { stroke: s, index: i, box: { x: cx - rx, y: cy - ry, w: rx * 2, h: ry * 2 } };
        }
      }
    }
    return null;
  }

  // Draw the Pre-Rendered Vertical Base Pipeline Blueprint with Note Zones
  function drawBasePipelineBlueprint(context, width, height) {
    // Background Grid
    context.fillStyle = '#080c14';
    context.fillRect(0, 0, width, height);

    // Subtle grid pattern
    context.strokeStyle = 'rgba(255, 255, 255, 0.035)';
    context.lineWidth = 1;
    for (let x = 0; x < width; x += 28) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, height);
      context.stroke();
    }
    for (let y = 0; y < height; y += 28) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
    }

    // Top Header Banner inside Canvas
    context.fillStyle = 'rgba(255, 255, 255, 0.95)';
    context.font = 'bold 15px Inter, sans-serif';
    context.fillText('⚡ 3-MINUTE VIDEO PRODUCTION PIPELINE • VERTICAL WORKFLOW BLUEPRINT', 24, 30);

    context.fillStyle = '#06b6d4';
    context.font = '11px JetBrains Mono, monospace';
    context.fillText('Total Turnaround: ~2h 15m (135 min) • 176s Video (22 Scenes) • 330 Credits • Click & Drag notes anywhere on LEFT & RIGHT!', 24, 48);

    // Layout Dimensions: 3-Column Architecture (Left Note Zone | Center Spine | Right Note Zone)
    const cardWidth = Math.min(360, Math.max(300, width * 0.38));
    const cardX = (width - cardWidth) / 2;
    const leftZoneWidth = cardX - 35;
    const rightZoneX = cardX + cardWidth + 20;
    const rightZoneWidth = width - rightZoneX - 15;

    // Column Header Labels
    // Left Zone Header
    context.fillStyle = '#38bdf8';
    context.font = 'bold 11px Inter, sans-serif';
    context.fillText('📝 LEFT NOTE ZONE: Inputs, Prompts & Research', 20, 72);

    // Center Spine Header
    context.fillStyle = '#f59e0b';
    context.font = 'bold 11px Inter, sans-serif';
    const centerTitle = '⚡ PRODUCTION PIPELINE (TOP ➔ BOTTOM)';
    const centerMetrics = context.measureText(centerTitle);
    context.fillText(centerTitle, cardX + (cardWidth - centerMetrics.width) / 2, 72);

    // Right Zone Header
    context.fillStyle = '#f43f5e';
    context.font = 'bold 11px Inter, sans-serif';
    context.fillText('💡 RIGHT NOTE ZONE: Reviews, Feedback & Gaps', rightZoneX, 72);

    // Define All 8 Vertical Stages in Linear Sequence
    const stages = [
      {
        id: '1',
        name: 'Stage 1: Skool Ideation & Setup',
        icon: '🏫',
        time: '15-20 min (13%)',
        color: '#f59e0b',
        desc: 'Extract classroom topic, gather UI screenshots (127.0.0.1:3847) & define Roger Rabbit style.',
        leftHint: '📌 Prompts, research links & raw module notes (Drag notes here!)',
        rightHint: '💡 Topic approval & scope bottlenecks (Drag notes here!)'
      },
      {
        id: '2',
        name: 'Stage 2: Gemini Script & 8s Prompts',
        icon: '🤖',
        time: '10-15 min (9%)',
        color: '#06b6d4',
        desc: 'Generate 22 scenes × 8s pacing (176s) with strict 18-22 word voice-over lines.',
        leftHint: '📌 Master Gemini prompt tweaks & scene scripts',
        rightHint: '💡 Word count cadence & pacing checks'
      },
      {
        id: '2.5',
        name: 'Stage 2.5: Simulation & Dual Setup',
        icon: '🪟',
        time: '5 min (4%)',
        color: '#38bdf8',
        desc: 'Split-view staging: Gemini prompt director paired with Google Flow generation queue.',
        leftHint: '📌 Dual-pane window config & FlyWheelMVP tabs',
        rightHint: '💡 Multi-tab switching & handoff friction'
      },
      {
        id: '3',
        name: 'Stage 3: Google Flow 8s Generation',
        icon: '🎬',
        time: '25-35 min (22%)',
        color: '#a855f7',
        desc: 'Batch render 22 8s clips in Google Flow (15 credits/ea = 330 base credits).',
        leftHint: '📌 Veo prompt templates & camera motion presets',
        rightHint: '💡 Retakes (~25% buffer) & credit monitoring'
      },
      {
        id: 'QC',
        name: 'Stage QC: Quality Gate & Gap Audit',
        icon: '🧪',
        time: '10-15 min (9%)',
        color: '#fb7185',
        desc: 'CRITICAL GATE: Sort footages to used asset & verify zero timeline gaps with shotlist in hand.',
        leftHint: '📌 22-scene shotlist & text hallucination rules',
        rightHint: '💡 Blocker alert: Black gaps or missing clips'
      },
      {
        id: '4',
        name: 'Stage 4: Canva 3-Section Timeline',
        icon: '🎨',
        time: '30-45 min (26%)',
        color: '#f43f5e',
        desc: 'Pre-prod Post-its ➔ Bulk paste 22 8s placeholders ➔ Set Video as Background.',
        leftHint: '📌 8s placeholder container & track stacking',
        rightHint: '💡 Move footages one-by-one to used asset'
      },
      {
        id: '4.5',
        name: 'Stage 4.5: 8s VO Studio & Rehearsal',
        icon: '🎙️',
        time: '15-20 min (13%)',
        color: '#34d399',
        desc: 'Rehearse with 8s countdown loop & metronome, record authentic VO & apply Roger stamp.',
        leftHint: '📌 Teleprompter speed, audio cues & mic settings',
        rightHint: '💡 VO beat sync & Roger Rabbit cartoon stamp'
      },
      {
        id: '5',
        name: 'Stage 5: Multi-Platform Funnel',
        icon: '🚀',
        time: '15-20 min (11%)',
        color: '#10b981',
        desc: 'Export 1080p 60fps MP4, generate 22-chapter YouTube description, LinkedIn & Skool flywheel.',
        leftHint: '📌 SRT subtitles, social post copy & tags',
        rightHint: '💡 Value flywheel conversion & student feedback'
      }
    ];

    const startY = 90;
    const cardHeight = 98;
    const gapY = 46;

    stages.forEach((stage, i) => {
      const y = startY + i * (cardHeight + gapY);

      // 1. LEFT NOTE ZONE GUIDELINE CARD
      if (leftZoneWidth > 60) {
        drawNoteGuideBox(context, 20, y, leftZoneWidth, cardHeight, 'rgba(6, 182, 212, 0.18)', 'rgba(6, 182, 212, 0.4)', stage.leftHint, 'LEFT NOTE AREA');
      }

      // 2. CENTER STAGE CARD (VERTICAL SPINE)
      drawVerticalBlueprintCard(context, cardX, y, cardWidth, cardHeight, stage);

      // 3. RIGHT NOTE ZONE GUIDELINE CARD
      if (rightZoneWidth > 60) {
        drawNoteGuideBox(context, rightZoneX, y, rightZoneWidth, cardHeight, 'rgba(244, 63, 94, 0.18)', 'rgba(244, 63, 94, 0.4)', stage.rightHint, 'RIGHT NOTE AREA');
      }

      // 4. VERTICAL DOWNWARD CONNECTING ARROW TO NEXT STAGE
      if (i < stages.length - 1) {
        const arrowFromY = y + cardHeight + 4;
        const arrowToY = y + cardHeight + gapY - 6;
        const arrowX = cardX + cardWidth / 2;
        drawBlueprintVerticalArrow(context, arrowX, arrowFromY, arrowX, arrowToY, stage.color || '#3b82f6');
      }
    });

    // Reset dash
    context.setLineDash([]);
  }

  // Draw a Vertical Stage Card
  function drawVerticalBlueprintCard(c, x, y, w, h, stage) {
    c.save();
    c.setLineDash([]);
    c.fillStyle = 'rgba(15, 23, 42, 0.92)';
    c.strokeStyle = stage.color || 'rgba(255, 255, 255, 0.2)';
    c.lineWidth = 1.5;

    // Rounded rectangle
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
    c.fillText(`${stage.icon} ${stage.name}`, x + 12, y + 22);

    // Duration Pill
    c.fillStyle = 'rgba(245, 158, 11, 0.15)';
    c.strokeStyle = 'rgba(245, 158, 11, 0.4)';
    c.lineWidth = 1;
    c.beginPath();
    c.roundRect(x + 12, y + 32, w - 24, 18, 4);
    c.fill();
    c.stroke();

    c.fillStyle = '#fbbf24';
    c.font = 'bold 9.5px JetBrains Mono, monospace';
    c.fillText(`⏱️ Duration: ${stage.time}`, x + 18, y + 44);

    // Description text
    c.fillStyle = '#9ca3af';
    c.font = '9.5px Inter, sans-serif';
    wrapText(c, stage.desc, x + 12, y + 64, w - 24, 13);
    c.restore();
  }

  // Draw Dashed Note Taking Guideline Container on Both Sides
  function drawNoteGuideBox(c, x, y, w, h, bgFill, borderStroke, hintText, tag) {
    c.save();
    c.setLineDash([4, 4]);
    c.fillStyle = 'rgba(15, 23, 42, 0.45)';
    c.strokeStyle = borderStroke;
    c.lineWidth = 1;

    const r = 6;
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

    // Subtle Tag Header
    c.setLineDash([]);
    c.fillStyle = borderStroke;
    c.font = 'bold 8.5px JetBrains Mono, monospace';
    c.fillText(`✏️ ${tag}`, x + 8, y + 16);

    // Hint text
    c.fillStyle = 'rgba(255, 255, 255, 0.45)';
    c.font = 'italic 9.5px Inter, sans-serif';
    wrapText(c, hintText, x + 8, y + 36, w - 16, 13);
    c.restore();
  }

  // Draw Vertical Downward Arrow ⬇️
  function drawBlueprintVerticalArrow(c, fromX, fromY, toX, toY, color = '#3b82f6') {
    c.save();
    c.setLineDash([]);
    c.strokeStyle = color;
    c.fillStyle = color;
    c.lineWidth = 2.5;

    c.beginPath();
    c.moveTo(fromX, fromY);
    c.lineTo(toX, toY);
    c.stroke();

    // Arrowhead pointing straight down
    const headLen = 8;
    c.beginPath();
    c.moveTo(toX, toY);
    c.lineTo(toX - headLen * 0.7, toY - headLen);
    c.lineTo(toX + headLen * 0.7, toY - headLen);
    c.closePath();
    c.fill();
    c.restore();
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

  // Redraw Complete Canvas (Base blueprint + all user strokes + drag highlight)
  function redrawCanvas() {
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, VIRTUAL_CANVAS_HEIGHT);

    drawBasePipelineBlueprint(ctx, rect.width, VIRTUAL_CANVAS_HEIGHT);

    // Draw user strokes
    strokes.forEach(s => {
      ctx.save();
      ctx.strokeStyle = s.color;
      ctx.fillStyle = s.color;
      ctx.lineWidth = s.width || 3;
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
      } else if (s.tool === 'text' || s.tool === 'sticky') {
        const fontSize = s.fontSize || 14;
        ctx.font = `bold ${fontSize}px Inter, sans-serif`;
        const lines = (s.text || '').split('\n');
        const lineHeight = fontSize * 1.35;

        // Draw background container
        let maxLineW = 0;
        lines.forEach(l => {
          const w = ctx.measureText(l).width;
          if (w > maxLineW) maxLineW = w;
        });
        const boxW = Math.max(130, maxLineW + 20);
        const boxH = Math.max(42, lines.length * lineHeight + 18);

        if (s.isSticky || s.tool === 'sticky') {
          ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
          ctx.strokeStyle = s.color || '#06b6d4';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect(s.startX - 8, s.startY - fontSize, boxW, boxH, 6);
          ctx.fill();
          ctx.stroke();
        }

        ctx.fillStyle = s.color || '#ffffff';
        lines.forEach((line, idx) => {
          ctx.fillText(line, s.startX, s.startY + idx * lineHeight);
        });
      }
      ctx.restore();
    });

    // Highlight actively dragged or selected stroke
    if (draggedStroke) {
      ctx.save();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);

      if (draggedStroke.tool === 'text' || draggedStroke.tool === 'sticky') {
        const fontSize = draggedStroke.fontSize || 14;
        ctx.font = `bold ${fontSize}px Inter, sans-serif`;
        const lines = (draggedStroke.text || '').split('\n');
        const lineHeight = fontSize * 1.35;
        let maxLineW = 0;
        lines.forEach(l => {
          const w = ctx.measureText(l).width;
          if (w > maxLineW) maxLineW = w;
        });
        const boxW = Math.max(130, maxLineW + 20);
        const boxH = Math.max(42, lines.length * lineHeight + 18);
        ctx.strokeRect(draggedStroke.startX - 12, draggedStroke.startY - fontSize - 4, boxW + 8, boxH + 8);
      } else if (draggedStroke.tool === 'rect' || draggedStroke.tool === 'circle') {
        const minX = Math.min(draggedStroke.startX, draggedStroke.endX);
        const maxX = Math.max(draggedStroke.startX, draggedStroke.endX);
        const minY = Math.min(draggedStroke.startY, draggedStroke.endY);
        const maxY = Math.max(draggedStroke.startY, draggedStroke.endY);
        ctx.strokeRect(minX - 6, minY - 6, maxX - minX + 12, maxY - minY + 12);
      }
      ctx.restore();
    }
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

  // Interactive Inline Text Input Overlay
  function closeInlineTextInput() {
    const existing = document.getElementById('excali-inline-text-input');
    if (existing && existing.parentElement) {
      existing.parentElement.removeChild(existing);
    }
  }

  function openInlineTextInput(x, y, isSticky = false) {
    closeInlineTextInput();

    const wrapper = canvas.parentElement;
    const input = document.createElement('textarea');
    input.id = 'excali-inline-text-input';
    input.placeholder = isSticky ? 'Write sticky note...\n(Click outside to place & drag!)' : 'Type note text...\n(Click outside to place & drag!)';
    input.style.position = 'absolute';
    input.style.left = `${x}px`;
    input.style.top = `${y}px`;
    input.style.minWidth = isSticky ? '180px' : '160px';
    input.style.minHeight = isSticky ? '64px' : '44px';
    input.style.background = isSticky ? 'rgba(15, 23, 42, 0.95)' : 'rgba(10, 14, 23, 0.92)';
    input.style.color = currentColor;
    input.style.border = `2px solid ${currentColor}`;
    input.style.borderRadius = '6px';
    input.style.padding = '8px 10px';
    input.style.fontSize = `${currentFontSize}px`;
    input.style.fontFamily = 'Inter, sans-serif';
    input.style.fontWeight = '600';
    input.style.outline = 'none';
    input.style.zIndex = '100';
    input.style.boxShadow = `0 4px 20px rgba(0,0,0,0.6), 0 0 12px ${currentColor}50`;
    input.style.resize = 'both';

    wrapper.appendChild(input);
    input.focus();

    let committed = false;
    function commitText() {
      if (committed) return;
      committed = true;
      const val = input.value.trim();
      if (val) {
        const newStroke = {
          tool: isSticky ? 'sticky' : 'text',
          text: val,
          startX: x,
          startY: y + currentFontSize,
          color: currentColor,
          fontSize: currentFontSize,
          isSticky: isSticky
        };
        strokes.push(newStroke);
        undoStack = [];
        saveStrokes();
        redrawCanvas();
        if (window.showToast) window.showToast(`📝 Note placed! You can click and drag it anytime.`, 'success');
      }
      closeInlineTextInput();
    }

    input.addEventListener('blur', commitText);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        commitText();
      } else if (e.key === 'Enter' && !e.shiftKey && !isSticky) {
        e.preventDefault();
        commitText();
      }
    });
  }

  // Event Listeners for Drawing & Dragging
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
    startX = pos.x;
    startY = pos.y;

    // Check if user clicked on an existing note/shape to drag it
    const hit = hitTestStroke(pos);
    if (hit && (currentTool === 'select' || hit.stroke.tool === 'text' || hit.stroke.tool === 'sticky' || currentTool === 'eraser')) {
      if (currentTool === 'eraser') {
        strokes.splice(hit.index, 1);
        saveStrokes();
        redrawCanvas();
        return;
      }
      // Start Dragging Note/Shape
      draggedStroke = hit.stroke;
      dragOffsetX = pos.x - hit.stroke.startX;
      dragOffsetY = pos.y - hit.stroke.startY;
      canvas.style.cursor = 'grabbing';
      redrawCanvas();
      return;
    }

    if (currentTool === 'select') {
      // Clicked on empty space in select mode
      return;
    }

    if (currentTool === 'text') {
      openInlineTextInput(pos.x, pos.y, false);
      return;
    }

    if (currentTool === 'sticky') {
      openInlineTextInput(pos.x, pos.y, true);
      return;
    }

    isDrawing = true;

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
    const pos = getCanvasPos(e);

    // 1. Handle Active Dragging of Notes / Shapes
    if (draggedStroke) {
      if (e.preventDefault) e.preventDefault();
      const newX = pos.x - dragOffsetX;
      const newY = pos.y - dragOffsetY;

      if (draggedStroke.endX !== undefined) {
        const dx = newX - draggedStroke.startX;
        const dy = newY - draggedStroke.startY;
        draggedStroke.endX += dx;
        draggedStroke.endY += dy;
      }

      draggedStroke.startX = newX;
      draggedStroke.startY = newY;
      redrawCanvas();
      return;
    }

    // 2. Hover Cursor Management
    if (!isDrawing) {
      const hit = hitTestStroke(pos);
      if (hit) {
        canvas.style.cursor = 'grab';
      } else {
        canvas.style.cursor = currentTool === 'select' ? 'default' : 'crosshair';
      }
      return;
    }

    // 3. Handle Active Drawing
    if (e.preventDefault) e.preventDefault();

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
    if (draggedStroke) {
      draggedStroke = null;
      canvas.style.cursor = 'grab';
      saveStrokes();
      redrawCanvas();
      return;
    }

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
    if (canvas) {
      canvas.style.cursor = tool === 'select' ? 'default' : 'crosshair';
    }
  };

  window.setExcaliColor = function(color, btn) {
    currentColor = color;
    document.querySelectorAll('.color-swatch-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
  };

  window.setExcaliStrokeWidth = function(w) {
    currentStrokeWidth = parseInt(w) || 3;
  };

  window.setExcaliFontSize = function(size) {
    currentFontSize = parseInt(size) || 14;
  };

  window.addQuickNote = function(side) {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cardWidth = Math.min(360, Math.max(300, rect.width * 0.38));
    const cardX = (rect.width - cardWidth) / 2;
    
    let targetX = side === 'left' ? 40 : cardX + cardWidth + 30;
    let targetY = 160;

    openInlineTextInput(targetX, targetY, true);
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
    if (window.showToast) window.showToast('💾 Vertical pipeline feedback saved & synced!', 'success');
  };

  window.downloadExcaliPNG = function() {
    if (!canvas) return;
    redrawCanvas();
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'vertical_pipeline_feedback_annotated.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    if (window.showToast) window.showToast('📥 Vertical feedback diagram exported as PNG!', 'success');
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
