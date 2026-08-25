// Production Script & Scene Data for 3-Minute Animation Videos
// Project: Claude Developer Certification: Token Optimization, Cost Controls & Custom IDEs
// Total: 22 Scenes x 8s = 176s (~2.93 mins)

window.VIDEO_DATA = {
  title: "Claude Developer Certification: Token Optimization, Cost Controls & Custom IDEs",
  totalDuration: 176,
  sceneCount: 22,
  sceneDuration: 8,
  links: {
    skoolClassroom: "https://www.skool.com/delivery-pilot-8938/classroom/2193c55b?md=d5f6b19d348d4f28a062641d2fc3e4df",
    geminiPromptApp: "https://gemini.google.com/app/5778f4a7d4e60f03",
    canvaWorkspace: "https://www.canva.com",
    googleFlow: "https://labs.google/flow",
    youtubeStudio: "https://studio.youtube.com",
    linkedinPost: "https://www.linkedin.com/feed/",
    xPost: "https://x.com/compose/post",
    rogerRabbitRepo: "https://github.com/rifaterdemsahin/roger-rabbit/tree/main",
    rogerRabbitLive: "https://rifaterdemsahin.github.io/roger-rabbit/"
  },
  chromeTabs: [
    { category: "🎨 Canva Production", title: "aug 3 video - Video", icon: "🎨", role: "Primary Canva video timeline, sliding Post-it note script reader, and 8s asset tracks." },
    { category: "💻 CLI Terminal", title: "~/projects/aug-video-animation-3 · chromeTerminal", icon: "💻", role: "Antigravity CLI terminal running git, Azure sync scripts, and file management." },
    { category: "🎬 Generative Video", title: "Google Flow - 25 Aug, 1", icon: "🎬", role: "AI video generation engine (15 credits/8s clip) in FlyWheelMVP tab group." },
    { category: "🤖 Script Director", title: "Building a Token-Managing IDE - Google Gemini", icon: "🤖", role: "Master Gemini session generating 22 scenes x 8s visual prompts and VO lines." },
    { category: "🤖 Script Director", title: "Building a Token-Managing IDE - Google Gemini (Active)", icon: "⚡", role: "Live Gemini prompt iteration and script tweaking workspace." },
    { category: "🎨 Canva Secondary", title: "aug 3 video - Video (Tab 2)", icon: "🎞️", role: "Secondary Canva tab for asset uploads and component formatting." },
    { category: "🎬 Flow Batch Queue", title: "Google Flow - 25 Aug, 1 (Batch)", icon: "🚀", role: "Active Google Flow render queue with 'Approve, do not ask again' active." },
    { category: "📊 Social Distribution", title: "Community - YouTube Studio", icon: "🔴", role: "YouTube Studio for chapter timestamp uploading and community video launch." },
    { category: "🖼️ Simulation QC", title: "aug-video-animation-3/3_Simulation/prod_stage_read_...", icon: "🔍", role: "Sliding Post-it footage gap check reference capture on GitHub." },
    { category: "🐰 Style Signature", title: "rifaterdemsahin/roger-rabbit: Animation in real world", icon: "🐰", role: "Roger Rabbit toon-meets-reality and La Linea style reference repository." },
    { category: "🌱 Community Flywheel", title: "🌱 Become the person who does what they say they will", icon: "🌱", role: "Skool community commitment thread and peer accountability hub." },
    { category: "⚡ Production Helper", title: "3-Minute AI Animation Video Production Suite 🎬 | Helper... (Live)", icon: "🌐", role: "GitHub Pages live production cockpit with Azure state sync." },
    { category: "💻 CLI IDE Workspace", title: "agy · chromeTerminal", icon: "⚡", role: "Antigravity (AGY) custom browser terminal and developer agent interface." },
    { category: "⚡ Production Helper", title: "3-Minute AI Animation Video Production Suite 🎬 | Helper... (Local)", icon: "🛠️", role: "Local dev helper suite (file:///.../index.html) for instantaneous testing." }
  ],
  azureConfig: {
    storageAccount: "animationasistant",
    fileShare: "aug-video-state",
    fileName: "aug_video_animation_state.json",
    keyVaultName: "dp-kv-deliverypilot",
    secretName: "aug-video-animation-sas",
    defaultSasToken: "se=2028-12-31T23%3A59%3A59Z&sp=rcwdl&sv=2026-04-06&sr=s&sig=C2kVBHWIxNXZM3nqYZjD6LvlpuKy%2B5eDcWlcJIE7PD8%3D"
  },
  productionChecklistStages: [
    {
      id: "stage-1",
      title: "Stage 1: Skool Ideation & Research (Pre-Prod Setup)",
      icon: "🏫",
      items: [
        { id: "s1-chrome-tabs-cockpit", label: "Pre-Prod: Set up Chrome Tabs Production Cockpit (14 orchestrated tabs: Canva 'aug 3 video', Google Flow, Gemini 'Building a Token-Managing IDE', chromeTerminal, YouTube Studio, Skool Community, Roger Rabbit repo, and Helper Suite)." },
        { id: "s1-review-video", label: "Review source classroom module & discussion threads in Skool." },
        { id: "s1-research-pics", label: "Extract subject research pictures, Antigravity IDE UI screens & benchmarks." },
        { id: "s1-roger-rabbit", label: "Define Roger Rabbit signature styling (cartoon overlays over real IDE at 127.0.0.1:3847, see roger-rabbit repo)." }
      ]
    },
    {
      id: "stage-2",
      title: "Stage 2: Gemini 8s Script Engineering",
      icon: "🤖",
      items: [
        { id: "s2-run-prompt", label: "Execute Master Gemini Director Prompt for 22 scenes x 8s pacing." },
        { id: "s2-word-count", label: "Verify each VO line is strictly within 18–22 words." },
        { id: "s2-visual-cards", label: "Review and lock all 22 Google Flow visual motion graphic prompts." }
      ]
    },
    {
      id: "stage-2-5",
      title: "Stage 2.5: Simulation & Split-Screen Setup",
      icon: "🪟",
      items: [
        { id: "s25-split-view", label: "Arrange Gemini on right and Google Flow on left in FlyWheelMVP tab group." },
        { id: "s25-approve-mode", label: "Enable 'Approve, do not ask again' for continuous 15-credit generation flow." }
      ]
    },
    {
      id: "stage-3",
      title: "Stage 3: Google Flow Visual Generation",
      icon: "🎬",
      items: [
        { id: "s3-test-render", label: "Render 1 representative clip to lock isometric dark-mode visual style." },
        { id: "s3-batch-gen", label: "Generate all 22 8s clips in Google Flow (330 base credits)." },
        { id: "s3-download-label", label: "Download and label MP4 files from scene_01.mp4 to scene_22.mp4." }
      ]
    },
    {
      id: "stage-qc",
      title: "QC: Production Sanity Check & Quality Gate",
      icon: "🧪",
      items: [
        { id: "sqc-code-check", label: "Text/Code Hallucination Defense: Capture real IDE for fine text/numbers." },
        { id: "sqc-style-check", label: "Visual Continuity Check: Verify color palette & lighting consistency across scenes." },
        { id: "sqc-drift-check", label: "Pacing Drift Check: Verify voice cadence matches 8-second cuts." }
      ]
    },
    {
      id: "stage-4",
      title: "Stage 4: Canva 3-Section & 'aug 3' Asset Organization",
      icon: "🎨",
      items: [
        { id: "s4-create-aug3-folder", label: "Create 'aug 3' ('aug video 3') project folder in Canva & local workspace." },
        { id: "s4-upload-flow-assets", label: "Upload all 22 Google Flow generated 8s MP4 video footages into 'aug video 3'." },
        { id: "s4-create-used-assets-folder", label: "Create 'used asset' subfolder inside 'aug video 3' to archive placed clips." },
        { id: "s4-open-flow-canva-simultaneous", label: "Prod: Open Google Flow (labs.google/flow) and Canva Prod Section at the same time in split-view to place footage before importing to Post-Prod." },
        { id: "s4-add-postits-to-canva", label: "Pre-Prod: Add 22 color-coded Post-it notes containing scripts directly above Canva timeline tracks to guide Post-Prod sync." },
        { id: "s4-storyboard-upload-prod", label: "Prod: Use Storyboard-like sequence grid in Canva to upload and align 8-second video slices scene-by-scene." },
        { id: "s4-move-footages-one-by-one", label: "Prod: Move footages one by one from 'aug video 3' to 'used asset' as each clip is placed on the Canva track." },
        { id: "s4-read-check-sliding-postit", label: "Prod: Read & check footages for timeline gaps using a sliding Post-it note overlay in Canva to verify scene-by-scene script sync." },
        { id: "s4-prod-roger-rabbit", label: "Prod: Apply Roger Rabbit Signature Format (blend real IDE/screen captures with animated cartoon & La Linea line overlays via Google Flow)." },
        { id: "s4-prod-playback-script-review", label: "Prod Review: Watch complete Canva Prod timeline playback and cross-check against Post-it scripts to verify visual-to-narration sync before moving to Post-Prod." },
        { id: "s4-vo-sync", label: "Post-Prod: Follow timeline Post-it notes to record master voice-over in own authentic voice." },
        { id: "s4-postprod-roger-rabbit", label: "Post-Prod: Sync Roger Rabbit character motion to VO audio beats, apply signature stamp overlay, and color-balance toon layers." },
        { id: "s4-export-master", label: "Post-Prod: Export final 1080p 60fps master video (176s)." }
      ]
    },
    {
      id: "stage-4-5",
      title: "Stage 4.5: 8s Teleprompter & VO Rehearsal",
      icon: "🎙️",
      items: [
        { id: "s45-studio-loop", label: "Rehearse all 22 scenes in the 8-Second Teleprompter Studio." },
        { id: "s45-audio-cue", label: "Verify natural breathing pause at the end of each 8s beat." }
      ]
    },
    {
      id: "stage-5",
      title: "Stage 5: Multi-Platform Distribution & Funnel",
      icon: "🚀",
      items: [
        { id: "s5-youtube-chapters", label: "Upload to YouTube with 22 scene chapter timestamps (0:00 - 2:48)." },
        { id: "s5-linkedin-post", label: "Publish 5-pillar technical summary post on LinkedIn." },
        { id: "s5-x-thread", label: "Post 5-part key takeaways thread on X (Twitter)." },
        { id: "s5-skool-packaging", label: "Upload raw template pack to Skool Community & Classroom." }
      ]
    }
  ],
  flywheel: [
    {
      step: 1,
      title: "Free Value Distribution",
      icon: "🎁",
      platforms: ["Skool", "YouTube", "LinkedIn", "X (Twitter)"],
      description: "High-value 3-minute animated breakdown distributed freely across all socials to build authority and reach ambitious developers."
    },
    {
      step: 2,
      title: "Packaging & Templates",
      icon: "📦",
      platforms: ["Skool Classroom"],
      description: "Exclusive production assets, prompt cheat sheets, code snippets, and custom IDE config files organized systematically."
    },
    {
      step: 3,
      title: "Community & Peer Engagement",
      icon: "👥",
      platforms: ["Skool Community"],
      description: "Engaged developer network sharing benchmark tests, model setups, real-time cost strategies, and feedback loops."
    },
    {
      step: 4,
      title: "Self-Commitment & Accountability",
      icon: "🤝",
      platforms: ["Daily Build Challenges"],
      description: "Habit-building sprints, weekly project milestones, and public learning build logs that turn passive viewers into active builders."
    },
    {
      step: 5,
      title: "1-on-1 Sessions & Mentorship",
      icon: "🎯",
      platforms: ["Deep-Dive Strategy Calls"],
      description: "Personalized architecture audits, private model routing optimization, and pair-programming sessions for high-growth engineers."
    }
  ],
  scenes: [
    {
      id: 1,
      timecode: "0:00 - 0:08",
      startSec: 0,
      endSec: 8,
      title: "Hook: Token Optimization & Cost Controls",
      visual: "Motion graphic title card reading \"Claude Developer Certification: Token Optimization & Cost Controls\". Animated graphs show token burn rates dropping while performance spikes.",
      googleFlowPrompt: "3D modern isometric motion graphics title card with sleek glowing text 'Claude Developer Certification: Token Optimization & Cost Controls', vibrant cyber-blue and emerald palette, animated line graphs trending sharply downward for cost and spiking upward for performance, 8k resolution, smooth cinematic 60fps.",
      vo: "Welcome! In this guide, we explore token optimization and cost control strategies for scaling your AI developer tooling without breaking the bank.",
      section: "pre-prod",
      keywords: ["Token Optimization", "Cost Controls", "Title Card", "AI Tooling"],
      canvaPostItColor: "#fef08a" // yellow
    },
    {
      id: 2,
      timecode: "0:08 - 0:16",
      startSec: 8,
      endSec: 16,
      title: "Custom Browser-Based Antigravity IDE",
      visual: "Screen capture of your custom browser-based Antigravity IDE UI (127.0.0.1:3847) showcasing tab groups, terminal, status bar, and model toggle buttons (Grok Night, Antigravity).",
      googleFlowPrompt: "Futuristic dark-mode code editor interface running locally at 127.0.0.1:3847, glowing neon accent buttons for model switching 'Grok Night' and 'Antigravity', active live streaming terminal, tabbed layout, clean minimalist tech aesthetic, smooth UI pan.",
      vo: "Managing context windows and routing models dynamically in a custom IDE gives you complete mastery over your LLM token expenditure.",
      section: "prod",
      keywords: ["Antigravity IDE", "127.0.0.1:3847", "Model Toggle", "Context Windows"],
      canvaPostItColor: "#fed7aa" // orange
    },
    {
      id: 3,
      timecode: "0:16 - 0:24",
      startSec: 16,
      endSec: 24,
      title: "Strategic Model Switching vs Heavy Flagships",
      visual: "Split animation comparing a heavy, expensive flagship reasoning model against lightweight, fast models processing a stream of code tokens.",
      googleFlowPrompt: "Split screen dynamic comparison: on the left a massive heavy monolithic server cog burning glowing red dollar signs, on the right a sleek agile glowing green pipeline processing rapid streams of binary and code tokens with high efficiency, 3D motion graphics.",
      vo: "Instead of routing every prompt to high-reasoning flagship models, strategic switching keeps your costs low while maintaining high accuracy.",
      section: "prod",
      keywords: ["Strategic Switching", "Flagship Models", "Cost Reduction", "High Accuracy"],
      canvaPostItColor: "#bbf7d0" // green
    },
    {
      id: 4,
      timecode: "0:24 - 0:32",
      startSec: 24,
      endSec: 32,
      title: "Parallel & Continuous Tool Usage",
      visual: "Motion graphics illustrating Parallel & Continuous Tool Usage—showing multi-file reads (ListDir, Read styles.css, Read nav.js) running in rapid sequence.",
      googleFlowPrompt: "Abstract 3D digital pipeline showing multiple micro-tasks branching in parallel: glowing file icons 'ListDir', 'styles.css', 'nav.js' flashing with instant green verification checks at hyper-speed, seamless data flow, clean dark tech backdrop.",
      vo: "By running lightweight tools in parallel and continuous loops, agentic workflows execute multi-step file inspections in milliseconds.",
      section: "prod",
      keywords: ["Parallel Execution", "Tool Calls", "Multi-file Read", "Agentic Loops"],
      canvaPostItColor: "#e9d5ff" // purple
    },
    {
      id: 5,
      timecode: "0:32 - 0:40",
      startSec: 32,
      endSec: 40,
      title: "The Mystery of 0% Dashboard Usage",
      visual: "Zoom-in on the user's Usage Limits Dashboard displaying 0% used, transitioning to a CLI terminal showing active Gemini 3.7 Flash executions.",
      googleFlowPrompt: "Camera smoothly zooming into a sleek digital telemetry dashboard showing '0% Quota Used' circular gauge, morphing seamlessly into an ultra-fast cyberpunk CLI terminal with glowing green output scrolling Gemini 3.7 Flash commands.",
      vo: "Ever wonder why your usage limits dashboard shows zero percent used? It comes down to how model tiers and quota accounting function under the hood.",
      section: "prod",
      keywords: ["Usage Limits", "0% Used", "Quota Accounting", "CLI Terminal"],
      canvaPostItColor: "#bfdbfe" // blue
    },
    {
      id: 6,
      timecode: "0:40 - 0:48",
      startSec: 40,
      endSec: 48,
      title: "Gemini Flash vs Pro Quota Limits",
      visual: "Graphic highlighting Gemini Flash vs. Pro Quota Limits, displaying low token consumption bars versus heavy Pro capacity meters.",
      googleFlowPrompt: "Side-by-side holographic comparison bar charts: Gemini 3.7 Flash in Low Reasoning showing tiny token consumption sliver versus Gemini Pro filling massive quota meters, sleek glassmorphism HUD display, 4k.",
      vo: "Gemini 3.7 Flash in Low reasoning mode consumes negligible quota compared to heavier Pro tiers, letting you run extensive CLI tasks effortlessly.",
      section: "prod",
      keywords: ["Gemini Flash", "Gemini Pro", "Low Reasoning", "Quota Meter"],
      canvaPostItColor: "#fbcfe8" // pink
    },
    {
      id: 7,
      timecode: "0:48 - 0:56",
      startSec: 48,
      endSec: 56,
      title: "Asynchronous & Batch Quota Updates",
      visual: "Animated rolling window graph illustrating Asynchronous & Batch Quota Updates updating periodically rather than per-token in real time.",
      googleFlowPrompt: "Futuristic financial/telemetry rolling window timeline with glowing discrete timestamp markers updating in rhythmic pulses rather than continuous lines, smooth glowing waves, deep indigo background.",
      vo: "Second, usage metrics often update in rolling windows or asynchronous batches rather than real-time per token.",
      section: "prod",
      keywords: ["Asynchronous Quota", "Rolling Windows", "Batch Accounting", "Telemetry"],
      canvaPostItColor: "#fed7aa"
    },
    {
      id: 8,
      timecode: "0:56 - 1:04",
      startSec: 56,
      endSec: 64,
      title: "Direct Developer API Key Routing",
      visual: "Diagram showing request routing: Antigravity CLI connected via Developer API key directly to dedicated RPM/TPM backend pools.",
      googleFlowPrompt: "Architectural network flowchart: Antigravity CLI laptop icon shooting an encrypted gold laser stream directly through a Developer API key gateway into dedicated high-throughput cloud RPM/TPM server racks, glowing connections.",
      vo: "Third, local tools like Antigravity CLI route via developer API keys, tracking against separate backend rate limits rather than standard web interface pools.",
      section: "prod",
      keywords: ["Developer API", "RPM/TPM Pools", "Direct Routing", "Antigravity CLI"],
      canvaPostItColor: "#bbf7d0"
    },
    {
      id: 9,
      timecode: "1:04 - 1:12",
      startSec: 64,
      endSec: 72,
      title: "Grok vs Gemini Flash (Low Effort)",
      visual: "Animated comparison card between Grok Reasoning (Low Effort) and Gemini Flash Reasoning (Low Effort).",
      googleFlowPrompt: "Two illuminated futuristic badges face-off: 'Grok Reasoning (Low Effort)' with stark white minimal branding vs 'Gemini Flash Reasoning (Low Effort)' with iridescent Google AI aura, energetic particles colliding gently in the center.",
      vo: "In agentic workflows, both Grok Low Thinking and Gemini Flash Low Thinking minimize latency while maintaining chain-of-thought verification.",
      section: "prod",
      keywords: ["Grok Low", "Gemini Flash Low", "Chain of Thought", "Latency Reduction"],
      canvaPostItColor: "#e9d5ff"
    },
    {
      id: 10,
      timecode: "1:12 - 1:20",
      startSec: 72,
      endSec: 80,
      title: "Grok's Algorithmic & Bug Detection Power",
      visual: "Code animation highlighting complex algorithms, syntax bug checks, and logical deduction trees under the Grok Reasoning badge.",
      googleFlowPrompt: "Glowing holographic code snippet highlighting a recursive AST tree and binary search logic, an illuminated laser scanner instantly catches a subtle syntax bug and turns it into a checkmark, sleek 3D developer aesthetic.",
      vo: "Grok excels at raw logical deduction, complex algorithm synthesis, and pinpointing tricky syntax bugs with minimal step bloat.",
      section: "prod",
      keywords: ["Logical Deduction", "Algorithm Synthesis", "Bug Detection", "Grok"],
      canvaPostItColor: "#bfdbfe"
    },
    {
      id: 11,
      timecode: "1:20 - 1:28",
      startSec: 80,
      endSec: 88,
      title: "Context Windows: 500k vs 1M+ Tokens",
      visual: "Context window graphics filling up to 256k - 500k tokens for Grok, then expanding to 1M+ tokens with fast needle-in-a-haystack retrieval for Gemini Flash.",
      googleFlowPrompt: "Visual representation of context memory: A 500k token memory cylinder expands outwards into an infinite glowing 1-Million token holographic grid, with an instant laser pinpointing a golden memory needle in milliseconds.",
      vo: "While Grok supports up to 500k tokens, Gemini Flash features over 1 Million tokens with high-throughput needle retrieval.",
      section: "prod",
      keywords: ["Context Window", "1M+ Tokens", "500k Tokens", "Needle Retrieval"],
      canvaPostItColor: "#fef08a"
    },
    {
      id: 12,
      timecode: "1:28 - 1:36",
      startSec: 88,
      endSec: 96,
      title: "Brief Planning Bursts & Rapid Tool Calls",
      visual: "High-speed terminal stream showing Gemini Flash outputting brief initial plans (200-500 token thoughts) followed by instant tool executions.",
      googleFlowPrompt: "Split visual: a compact 200-word glowing thought bubble flashes for a split second, immediately triggering an explosion of 10 automated tool execution cards cascading rapidly down the terminal with green completion checks.",
      vo: "Gemini Flash generates brief initial planning bursts before executing rapid batch tool calls across your codebase.",
      section: "prod",
      keywords: ["Thought Bursts", "Batch Tool Calls", "Rapid Execution", "Codebase"],
      canvaPostItColor: "#fed7aa"
    },
    {
      id: 13,
      timecode: "1:36 - 1:44",
      startSec: 96,
      endSec: 104,
      title: "Native Multimodal Repo & UI Ingestion",
      visual: "Multimodal diagram demonstrating full repo payload ingestion, multi-file document parsing, and image asset reads.",
      googleFlowPrompt: "A floating 3D folder ingestion sphere swallowing entire code directories, CSS files, PNG image wireframes, and architectural markdown docs simultaneously, radiating glowing synaptic connections.",
      vo: "With native multimodal support, Flash handles full repository payloads, modern UI templates, and image references seamlessly.",
      section: "prod",
      keywords: ["Multimodal Support", "Repository Ingestion", "UI Templates", "Image Assets"],
      canvaPostItColor: "#bbf7d0"
    },
    {
      id: 14,
      timecode: "1:44 - 1:52",
      startSec: 104,
      endSec: 112,
      title: "Industry-Leading Time-to-First-Token",
      visual: "Latency gauge showing industry-leading Time-to-First-Token (TTFT) speed meters for Gemini Flash vs. moderate latency for deep reasoning.",
      googleFlowPrompt: "High-precision digital speedometer needle flying instantly from 0 to top speed labeled 'TTFT: Ultra-Fast Response', comparison timeline displaying near-instant token streaming against slower thinking bars.",
      vo: "It delivers industry-leading Time-to-First-Token performance, making it the ideal engine for high-speed, iterative agent loops.",
      section: "prod",
      keywords: ["TTFT Speed", "Low Latency", "Iterative Loops", "Stream Rate"],
      canvaPostItColor: "#fbcfe8"
    },
    {
      id: 15,
      timecode: "1:52 - 2:00",
      startSec: 112,
      endSec: 120,
      title: "Decision Matrix: Choose Gemini Flash",
      visual: "Flowchart guiding model selection: \"Broad Scaffolding & Fast Iteration\" → Gemini Flash (Low).",
      googleFlowPrompt: "Clean interactive UI decision tree: A branch labeled 'Broad Scaffolding, Repo Discovery, & Rapid UI' lights up and points with glowing electric cyan arrows to the 'Gemini 3.7 Flash (Low Reasoning)' hero card.",
      vo: "So when should you choose each? Choose Gemini Flash for broad codebase scaffolding, repo discovery, and routine UI generation.",
      section: "prod",
      keywords: ["Scaffolding", "Repo Discovery", "UI Generation", "Model Routing"],
      canvaPostItColor: "#e9d5ff"
    },
    {
      id: 16,
      timecode: "2:00 - 2:08",
      startSec: 120,
      endSec: 128,
      title: "Decision Matrix: Choose Grok (Low)",
      visual: "Flowchart guiding model selection: \"Algorithmic Logic & Complex State Debugging\" → Grok (Low).",
      googleFlowPrompt: "The second branch of the decision tree illuminates: labeled 'Complex State Logic, Math Algorithms & Cryptic Bugs' pulsing with sharp amber energy pointing to the 'Grok (Low Effort)' badge.",
      vo: "Choose Grok Low Effort when debugging complex state transitions, mathematically dense routines, or deep logic.",
      section: "prod",
      keywords: ["State Debugging", "Algorithmic Logic", "Grok Low", "Math Routines"],
      canvaPostItColor: "#fed7aa"
    },
    {
      id: 17,
      timecode: "2:08 - 2:16",
      startSec: 128,
      endSec: 136,
      title: "Dynamic Effort Switcher in Antigravity IDE",
      visual: "Close-up on Antigravity IDE showing the effort switcher: toggling between Low, Medium, and High effort modes in real time.",
      googleFlowPrompt: "Extreme close-up macro UI shot of a smooth metallic slider toggle in the Antigravity IDE shifting effortlessly between 'Low', 'Medium', and 'High' reasoning effort, with real-time token cost indicators dynamically adjusting.",
      vo: "Be ready to change the effort setting inside your IDE based on task complexity to keep token burn rates optimized.",
      section: "prod",
      keywords: ["Effort Switcher", "Dynamic Tuning", "Low/Med/High", "Optimization"],
      canvaPostItColor: "#bfdbfe"
    },
    {
      id: 18,
      timecode: "2:16 - 2:24",
      startSec: 136,
      endSec: 144,
      title: "WebDev Arena Leaderboard: 1588 Elo",
      visual: "WebDev Arena Leaderboard animation highlighting Gemini 3.7 Flash's 1588 Native Web Elo rating for HTML5 and CSS Grid.",
      googleFlowPrompt: "Futuristic holographic esports-style leaderboard zooming to the top rank: 'Gemini 3.7 Flash - 1588 Web Elo' glowing with gold laurels, displaying crisp HTML5, CSS Grid, and responsive layout badges.",
      vo: "Gemini 3.7 Flash handles frontend and HTML tasks with ease, boasting a 1588 WebDev Arena Elo rating for production-ready code.",
      section: "prod",
      keywords: ["WebDev Arena", "1588 Web Elo", "HTML5/CSS Grid", "Frontend Mastery"],
      canvaPostItColor: "#fef08a"
    },
    {
      id: 19,
      timecode: "2:24 - 2:32",
      startSec: 144,
      endSec: 152,
      title: "Low Reasoning Overhead for Declarative UI",
      visual: "DOM hierarchy tree building visually on screen while a light 200-token thought burst completes in the terminal.",
      googleFlowPrompt: "An elegant visual DOM tree assembling itself like glowing geometric architecture with nested HTML nodes and CSS styling rules snapping into place seamlessly while a compact 200-token counter completes.",
      vo: "Declarative HTML and CSS require low reasoning overhead—a short reasoning burst is all it needs to construct rich DOM structures.",
      section: "prod",
      keywords: ["DOM Hierarchy", "Declarative UI", "200-token Burst", "CSS Rules"],
      canvaPostItColor: "#bbf7d0"
    },
    {
      id: 20,
      timecode: "2:32 - 2:40",
      startSec: 152,
      endSec: 160,
      title: "Local Asset Directory Indexing & Generation",
      visual: "Terminal reading local asset directories (/styles, /scripts) and generating fully formatted, responsive HTML code on the fly.",
      googleFlowPrompt: "Visual showing terminal scanning local directory trees '/styles' and '/scripts', extracting color palettes and components, and projecting a fully live-rendering responsive web application window instantly.",
      vo: "Its fast tool-calling indexes local site assets instantly, outputting matched layouts and classes without losing context.",
      section: "prod",
      keywords: ["Local Asset Indexing", "Responsive HTML", "Asset Matching", "Directory Scan"],
      canvaPostItColor: "#e9d5ff"
    },
    {
      id: 21,
      timecode: "2:40 - 2:48",
      startSec: 160,
      endSec: 168,
      title: "Custom IDE Controls & Granular Oversight",
      visual: "UI screen capture showing custom theme tabs (Grok Night, Forest, Amber, High Contrast) and live terminal connection in Antigravity IDE.",
      googleFlowPrompt: "Sleek IDE workspace showcasing color theme switcher transitioning between 'Grok Night', 'Forest Emerald', and 'Amber Glow', with live CPU/Token telemetry dials and active terminal output windows.",
      vo: "Building custom IDE controls gives you granular oversight over model routing, reasoning effort, and active context sizes.",
      section: "post-prod",
      keywords: ["Custom Themes", "Granular Oversight", "Grok Night", "Telemetry Controls"],
      canvaPostItColor: "#fbcfe8"
    },
    {
      id: 22,
      timecode: "2:48 - 2:56",
      startSec: 168,
      endSec: 176,
      title: "Takeaways & Outro: Community Call-To-Action",
      visual: "Outro screen with key takeaway checklist (Token Optimization, Dynamic Routing, Cost Controls), Roger Rabbit signature overlay badge, and call-to-action link to the Skool community.",
      googleFlowPrompt: "Cinematic outro card with a glowing checklist highlighting: 1. Token Optimization, 2. Dynamic Routing, 3. Cost Controls. Roger Rabbit cartoon-meets-reality signature animation stamp, and vibrant call to action badge to join the Skool classroom.",
      vo: "Mastering model routing and reasoning effort ensures maximum developer efficiency at minimal cost. Thanks for watching!",
      section: "post-prod",
      keywords: ["Takeaways Checklist", "Roger Rabbit Signature", "Community CTA", "Mastery"],
      canvaPostItColor: "#fed7aa"
    }
  ]
};
