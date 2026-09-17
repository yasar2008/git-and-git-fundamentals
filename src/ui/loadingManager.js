import { soundFX } from '../audio/soundEffects.js';

export class LoadingManager {
  constructor(options = {}) {
    this.onComplete = options.onComplete || (() => {});
    this.transitSpeed = 'cinematic'; // 'cinematic' (600ms) or 'instant' (0ms)
    this.isBooting = true;
    this.bootProgress = 0;
    this.bootSpamCount = 0;

    this.bootQuotes = [
      { step: '01/06', text: "Scanning SSD for 'project_v2_FINAL_USE_THIS_ONE.py'... (147 copies detected 📁)" },
      { step: '02/06', text: "Brewing developer coffee to optimal hackathon temperature (99°C ☕)..." },
      { step: '03/06', text: "Calibrating 3D Time Machine flux capacitor for infinite CTRL+Z ⏳..." },
      { step: '04/06', text: "Bribing GitHub cloud satellites with shiny green commit squares 🟩..." },
      { step: '05/06', text: "Rehearsing Member 1's voice lines so they sound 400% more confident 🎤..." },
      { step: '06/06', text: "Assembling 3D Cyber Holographic Deck... Ready for takeoff! 🚀" }
    ];

    this.initMainLoader();
    this.initTransitOverlay();
  }

  /* =========================================================================
     1. MAIN BOOTLOADER SCREEN (FUNNY & HIGH-TECH)
     ========================================================================= */
  initMainLoader() {
    const loaderEl = document.createElement('div');
    loaderEl.id = 'main-boot-loader';
    loaderEl.className = 'main-boot-loader';

    loaderEl.innerHTML = `
      <div class="boot-backdrop-glow"></div>
      <div class="boot-cyber-grid"></div>

      <div class="boot-card">
        <!-- TOP BRANDING -->
        <div class="boot-header">
          <div class="boot-badge">
            <span class="pulse-dot"></span>
            <span>CYBER GIT-DECK OS v4.2</span>
          </div>
          <div class="boot-subtitle">Member 1 Presentation Core • Interactive 3D</div>
        </div>

        <!-- HOLOGRAPHIC GIT TREE ANIMATION -->
        <div class="boot-git-visual">
          <svg class="boot-tree-svg" viewBox="0 0 280 90">
            <path class="tree-line main-branch" d="M 20 45 L 260 45" />
            <path class="tree-line feature-branch" d="M 60 45 C 90 15, 130 15, 160 15 L 200 15 C 230 15, 240 45, 260 45" />
            <circle class="commit-node n1" cx="30" cy="45" r="7" />
            <circle class="commit-node n2" cx="80" cy="45" r="7" />
            <circle class="commit-node n3" cx="120" cy="15" r="7" />
            <circle class="commit-node n4" cx="180" cy="15" r="7" />
            <circle class="commit-node n5" cx="210" cy="45" r="7" />
            <circle class="commit-node n6" cx="255" cy="45" r="9" />
          </svg>
        </div>

        <!-- FUNNY TERMINAL LOG -->
        <div class="boot-terminal">
          <div class="terminal-bar">
            <span class="term-dot red"></span>
            <span class="term-dot yellow"></span>
            <span class="term-dot green"></span>
            <span class="term-title">git-boot-daemon.sh</span>
          </div>
          <div class="terminal-body">
            <div class="terminal-quote-box">
              <span id="boot-quote-step" class="step-tag">[01/06]</span>
              <span id="boot-quote-text" class="quote-text">Scanning SSD for 'project_v2_FINAL.py'...</span>
            </div>
          </div>
        </div>

        <!-- PROGRESS BAR -->
        <div class="boot-progress-section">
          <div class="progress-labels">
            <span id="boot-status-text">INITIALIZING KNOWLEDGE MODULES...</span>
            <span id="boot-percent-text" class="percent-val">0%</span>
          </div>
          <div class="progress-track">
            <div id="boot-progress-bar" class="progress-bar">
              <div class="progress-glow-tip"></div>
            </div>
          </div>
          <div class="progress-sub-info">
            <span id="boot-bytes-text">0.0 / 13.37 MB downloaded</span>
            <span class="server-status">GitHub Remote: Connected 🟢</span>
          </div>
        </div>

        <!-- INTERACTIVE SPAM BUTTON & SKIP BUTTON -->
        <div class="boot-interactive-row">
          <button id="boot-spam-btn" class="boot-action-btn spam-btn">
            <span class="btn-icon">⚡</span>
            <span>Spam to Speed Up!</span>
            <span id="boot-spam-counter" class="spam-badge">0x</span>
          </button>
          <button id="boot-skip-btn" class="boot-action-btn skip-btn">
            <span>Skip Intro →</span>
          </button>
        </div>

        <div id="boot-spam-hint" class="boot-spam-hint">Tip: Rapid clicks inject pure caffeine into the Vite build engine!</div>
      </div>
    `;

    document.body.appendChild(loaderEl);

    // Bind spam click
    const spamBtn = document.getElementById('boot-spam-btn');
    const spamCounter = document.getElementById('boot-spam-counter');
    const hintEl = document.getElementById('boot-spam-hint');

    const funnySpamPhrases = [
      "Turbo Coffee Injection! ☕",
      "Overclocking Student Laptop! 🔥",
      "Bypassing campus Wi-Fi throttles! 💨",
      "Git commit --fast-forward enabled! ⚡",
      "Merge conflict miraculously self-healed! 🪄",
      "Recruiter already starred your repo! ⭐",
      "MAXIMUM VELOCITY ACHIEVED! 🚀"
    ];

    spamBtn?.addEventListener('click', () => {
      this.bootSpamCount++;
      soundFX.playSpark();
      if (spamCounter) spamCounter.textContent = `${this.bootSpamCount}x`;
      
      // Bump progress by 8% - 15%
      this.bootProgress = Math.min(this.bootProgress + 12, 100);
      this.updateBootUI();

      // Screen spark animation
      spamBtn.classList.add('spammed');
      setTimeout(() => spamBtn.classList.remove('spammed'), 120);

      const phrase = funnySpamPhrases[this.bootSpamCount % funnySpamPhrases.length];
      if (hintEl) {
        hintEl.textContent = phrase;
        hintEl.classList.add('highlight');
        setTimeout(() => hintEl.classList.remove('highlight'), 300);
      }
    });

    // Bind skip button
    const skipBtn = document.getElementById('boot-skip-btn');
    skipBtn?.addEventListener('click', () => {
      this.bootProgress = 100;
      this.updateBootUI();
      soundFX.playClick();
      this.finishBoot();
    });

    // Start auto progress loop
    this.startBootSimulation();
  }

  startBootSimulation() {
    let currentQuoteIdx = 0;
    const interval = setInterval(() => {
      if (!this.isBooting) {
        clearInterval(interval);
        return;
      }

      // Smooth step progress
      this.bootProgress += 2.5 + Math.random() * 3.5;
      if (this.bootProgress >= 100) {
        this.bootProgress = 100;
        this.updateBootUI();
        clearInterval(interval);
        setTimeout(() => this.finishBoot(), 400);
        return;
      }

      // Cycle quotes based on percentage
      const quoteIndex = Math.min(
        Math.floor((this.bootProgress / 100) * this.bootQuotes.length),
        this.bootQuotes.length - 1
      );

      if (quoteIndex !== currentQuoteIdx) {
        currentQuoteIdx = quoteIndex;
        const q = this.bootQuotes[quoteIndex];
        const stepEl = document.getElementById('boot-quote-step');
        const textEl = document.getElementById('boot-quote-text');
        if (stepEl) stepEl.textContent = `[${q.step}]`;
        if (textEl) {
          textEl.style.opacity = '0';
          textEl.style.transform = 'translateY(4px)';
          setTimeout(() => {
            textEl.textContent = q.text;
            textEl.style.opacity = '1';
            textEl.style.transform = 'translateY(0)';
          }, 120);
        }
      }

      this.updateBootUI();
    }, 120);
  }

  updateBootUI() {
    const percent = Math.min(100, Math.round(this.bootProgress));
    const bar = document.getElementById('boot-progress-bar');
    const percentText = document.getElementById('boot-percent-text');
    const bytesText = document.getElementById('boot-bytes-text');
    const statusText = document.getElementById('boot-status-text');

    if (bar) bar.style.width = `${percent}%`;
    if (percentText) percentText.textContent = `${percent}%`;

    const downloadedMB = ((percent / 100) * 13.37).toFixed(2);
    if (bytesText) bytesText.textContent = `${downloadedMB} / 13.37 MB compiled`;

    if (statusText) {
      if (percent < 30) statusText.textContent = 'SCANNING HISTORICAL ARTIFACTS...';
      else if (percent < 60) statusText.textContent = 'WARPING 3D TIME MACHINE RAILS...';
      else if (percent < 90) statusText.textContent = 'SYNCHRONIZING RECRUITER GREEN SQUARES...';
      else statusText.textContent = 'ALL SYSTEMS READY! LAUNCHING...';
    }
  }

  finishBoot() {
    if (!this.isBooting) return;
    this.isBooting = false;

    soundFX.playBootReady();

    const loaderEl = document.getElementById('main-boot-loader');
    if (loaderEl) {
      loaderEl.classList.add('fade-out');
      setTimeout(() => {
        loaderEl.remove();
        if (typeof this.onComplete === 'function') {
          this.onComplete();
        }
      }, 700);
    }
  }

  /* =========================================================================
     2. INTER-SLIDE WARP TRANSIT OVERLAY (PAGES LOADING SCREEN)
     ========================================================================= */
  initTransitOverlay() {
    const transitEl = document.createElement('div');
    transitEl.id = 'inter-slide-transit';
    transitEl.className = 'inter-slide-transit';

    transitEl.innerHTML = `
      <div class="transit-warp-lines"></div>
      <div class="transit-card">
        <div class="transit-spinner-ring">
          <div class="ring r1"></div>
          <div class="ring r2"></div>
          <div class="ring r3"></div>
          <span class="transit-icon">⚡</span>
        </div>
        <div class="transit-terminal-line">
          <span class="prompt">$</span>
          <span id="transit-cmd-text" class="cmd-text">git checkout -b next-slide</span>
        </div>
        <div id="transit-joke-text" class="transit-joke">
          Transitioning between dimensions...
        </div>
      </div>
    `;

    document.body.appendChild(transitEl);
  }

  /**
   * Triggers the inter-slide holographic loading overlay
   * @param {Object} slide Target slide data object
   * @param {Function} midCallback Callback when the screen is fully obscured (to switch 3D stage and DOM)
   * @param {Function} endCallback Callback after transition finishes
   */
  transitToSlide(slide, midCallback, endCallback) {
    if (this.transitSpeed === 'instant') {
      soundFX.playWhoosh();
      if (midCallback) midCallback();
      if (endCallback) endCallback();
      return;
    }

    const transitEl = document.getElementById('inter-slide-transit');
    const cmdText = document.getElementById('transit-cmd-text');
    const jokeText = document.getElementById('transit-joke-text');

    if (!transitEl) {
      if (midCallback) midCallback();
      if (endCallback) endCallback();
      return;
    }

    // Default witty terminal messages based on slide id
    const transitDict = {
      'intro': {
        cmd: 'git init file-chaos-lab',
        joke: '🚨 Gathering 98 versions of final_final.py into an event horizon...'
      },
      'what-is-git': {
        cmd: 'git checkout -b feature/time-travel-local',
        joke: '⏳ Powering up infinite CTRL+Z time machine... Offline mode enabled.'
      },
      'what-is-github': {
        cmd: 'git remote add origin https://github.com/cloud-castle',
        joke: '☁️ Beaming project to cloud satellite before your coffee spills!'
      },
      'git-vs-github': {
        cmd: 'git diff --stat camera.local instagram.cloud',
        joke: '📸 Developing 35mm polaroids vs Instagram clout...'
      },
      'vocabulary': {
        cmd: 'git codex --load-spells 8',
        joke: '🧙‍♂️ Charging mana crystals for Repo, Push, Fork & PR...'
      },
      'handoff': {
        cmd: 'git push origin torch:member-2 --force-enthusiasm',
        joke: '🎤 Priming golden concert spotlight & tuning mic for Member 2!'
      }
    };

    const transitInfo = transitDict[slide?.id] || {
      cmd: `git checkout slide-${slide?.number || 'next'}`,
      joke: `Warping to Slide ${slide?.number || 'next'}...`
    };

    if (cmdText) cmdText.textContent = transitInfo.cmd;
    if (jokeText) jokeText.textContent = transitInfo.joke;

    soundFX.playWarp();

    // 1. Fade in transit overlay
    transitEl.classList.add('active');

    // 2. Midway: execute stage & DOM switch
    setTimeout(() => {
      if (midCallback) midCallback();
    }, 280);

    // 3. Fade out transit overlay
    setTimeout(() => {
      transitEl.classList.remove('active');
      if (endCallback) endCallback();
    }, 620);
  }
}
