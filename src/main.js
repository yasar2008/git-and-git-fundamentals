import './style.css';
import { slidesData } from './data/slidesData.js';
import { SceneManager } from './scene/sceneManager.js';
import { soundFX } from './audio/soundEffects.js';
import { LoadingManager } from './ui/loadingManager.js';
import confetti from 'canvas-confetti';

class PresentationApp {
  constructor() {
    this.currentSlideIndex = 1;
    this.totalSlides = slidesData.length;
    this.sceneManager = null;
    this.loadingManager = null;

    // Card sub-tab state ('concept' | 'terminal' | 'tips' | 'quiz')
    this.currentCardTab = 'concept';

    // Card minimize / expand state
    this.cardMinimized = false;

    // Quiz states: { [slideNumber]: { selectedIndex, answered, isCorrect } }
    this.quizStates = {};

    // Pop Quiz Arena selected question (1 to 6)
    this.selectedArenaQuestion = 1;

    // Timer state
    this.timerSeconds = 0;
    this.timerInterval = null;
    this.timerRunning = false;

    // Speaker notes drawer state & teleprompter
    this.notesOpen = false;
    this.teleprompterActive = false;
    this.teleprompterInterval = null;

    // Free camera state
    this.isFreeCamera = false;

    // Modals state
    this.helpOpen = false;
    this.terminalOpen = false;
    this.qaOpen = false;

    // Simulated Git repository for Terminal Lab
    this.simulatedRepo = {
      initialized: true,
      branch: 'main',
      stagedFiles: [],
      untrackedFiles: ['index.html', 'app.js', 'style.css'],
      commits: [
        { hash: 'a1c4e92', msg: 'feat: initialize project structure' },
        { hash: '8f2b311', msg: 'fix: resolve mobile layout viewport' }
      ]
    };

    this.init();
  }

  init() {
    // 1. Setup HTML Layout Skeleton
    const appEl = document.getElementById('app');
    appEl.innerHTML = `
      <div id="deck-progress-bar" class="deck-progress-bar"></div>
      <div id="camera-flash-overlay" class="camera-flash-overlay"></div>
      <div id="comic-toast-container" class="comic-toast-container"></div>
      <div id="webgl-container"></div>
      <div class="ambient-glow"></div>
      <div class="presentation-ui">
        <!-- TOP HEADER -->
        <header class="top-header">
          <div class="header-left">
            <div class="presenter-pill">
              <span class="dot"></span>
              <span id="presenter-tag">Member 1</span>
            </div>
            <div class="topic-title">Git & GitHub Fundamentals</div>
          </div>

          <div class="header-center">
            <div class="timer-box">
              <span class="timer-icon">⏱️</span>
              <span id="timer-display">00:00</span>
              <button id="timer-toggle-btn" class="timer-btn" title="Start/Pause Timer">▶</button>
              <button id="timer-reset-btn" class="timer-btn" title="Reset Timer">↺</button>
            </div>
          </div>

          <div class="header-right">
            <div class="header-btn-group primary-group">
              <button id="header-quiz-btn" class="icon-btn highlight-quiz-btn" title="Open Whole-Page Pop Quiz Arena (Press P)">
                <span>🎯</span>
                <span class="btn-label">Pop Quiz</span>
              </button>
              <button id="terminal-lab-btn" class="icon-btn highlight-btn" title="Open Interactive Git Terminal Lab (Press L)">
                <span>💻</span>
                <span class="btn-label">Terminal Lab</span>
              </button>
              <button id="qa-toggle-btn" class="icon-btn" title="Audience Q&A Cheat Sheet (Press Q)">
                <span>❓</span>
                <span class="btn-label">Q&A Sheet</span>
              </button>
            </div>

            <div class="header-divider"></div>

            <div class="header-btn-group tool-group">
              <button id="card-toggle-btn" class="icon-btn" title="Toggle Slide Card Minimize / Expand (Press H)">
                <span id="card-toggle-icon">🗕</span>
                <span id="card-toggle-text" class="btn-label">Card</span>
              </button>
              <button id="transit-toggle-btn" class="icon-btn" title="Toggle Slide Transit Animation Mode">
                <span>⚡</span>
                <span id="transit-mode-text" class="btn-label">Cinematic</span>
              </button>
              <button id="camera-mode-btn" class="icon-btn" title="Toggle Free 3D Orbit Camera (Press C)">
                <span>🕹️</span>
                <span id="camera-mode-text" class="btn-label">Orbit 3D</span>
              </button>
              <button id="sound-toggle-btn" class="icon-btn" title="Toggle Sound FX (Press M)">
                <span id="sound-icon">🔊</span>
                <span class="btn-label">Audio</span>
              </button>
              <button id="notes-toggle-btn" class="icon-btn" title="Speaker Notes (Press N)">
                <span>🎙️</span>
                <span class="btn-label">Notes</span>
              </button>
              <button id="help-toggle-btn" class="icon-btn" title="Keyboard Shortcuts (Press ?)">
                <span>⌨️</span>
                <span class="btn-label">Help</span>
              </button>
              <a id="header-pdf-btn" href="./Git_and_GitHub_Fundamentals_Member_1.pdf" target="_blank" download="Git_and_GitHub_Fundamentals_Member_1.pdf" class="icon-btn" title="Download Printable PDF Handbook (Slides 1-7, Concepts, Commands & Solutions)">
                <span>📄</span>
                <span class="btn-label">PDF</span>
              </a>
              <button id="fullscreen-btn" class="icon-btn icon-only" title="Toggle Fullscreen (Press F)">
                <span>⛶</span>
              </button>
            </div>
          </div>
        </header>

        <!-- SLIDE CONTENT VIEWPORT -->
        <main class="slide-viewport">
          <div id="slide-card-container" class="slide-card"></div>
        </main>

        <!-- BOTTOM CONTROLS -->
        <footer class="bottom-controls">
          <div class="nav-buttons nav-left">
            <button id="prev-btn" class="nav-btn">
              <span>←</span>
              <span>Previous</span>
            </button>
            <span class="nav-shortcut-hint"><span class="kbd">←</span></span>
          </div>

          <div class="slide-pills" id="slide-pills-container"></div>

          <div class="nav-buttons nav-right">
            <div id="nav-mic-btn-container"></div>
            <span class="nav-shortcut-hint"><span class="kbd">Space / →</span></span>
            <button id="next-btn" class="nav-btn primary">
              <span>Next</span>
              <span>→</span>
            </button>
          </div>
        </footer>

        <!-- SPEAKER NOTES DRAWER -->
        <aside id="speaker-notes-drawer" class="speaker-notes-drawer">
          <div class="notes-header">
            <div class="notes-title">
              <span>🎙️</span>
              <span>Speaker Notes (Member 1)</span>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
              <a href="./Git_and_GitHub_Fundamentals_Member_1.pdf" target="_blank" download="Git_and_GitHub_Fundamentals_Member_1.pdf" class="icon-btn" style="padding:4px 8px; font-size:0.75rem; text-decoration:none; color:var(--accent-cyan);" title="Download Printable PDF Handbook">
                📄 PDF
              </a>
              <button id="teleprompter-btn" class="icon-btn" style="padding:4px 8px; font-size:0.75rem;" title="Auto-scroll Teleprompter">
                ▶ Scroll
              </button>
              <button id="close-notes-btn" class="close-notes-btn">&times;</button>
            </div>
          </div>
          <div id="notes-content-body" class="notes-content"></div>
        </aside>

        <!-- SHORTCUTS MODAL -->
        <div id="shortcuts-modal-overlay" class="shortcuts-modal-overlay">
          <div class="shortcuts-modal-card">
            <div class="shortcuts-modal-header">
              <div class="shortcuts-modal-title">⌨️ Keyboard & Gesture Shortcuts</div>
              <button id="close-help-btn" class="close-notes-btn">&times;</button>
            </div>
            <div class="shortcuts-grid">
              <div class="shortcut-row"><span>Next Slide</span> <span class="kbd">Space / →</span></div>
              <div class="shortcut-row"><span>Previous Slide</span> <span class="kbd">←</span></div>
              <div class="shortcut-row"><span>Jump to Slide 1 - 6</span> <span class="kbd">1 - 6</span></div>
              <div class="shortcut-row"><span>Minimize / Expand Slide Card</span> <span class="kbd">H</span></div>
              <div class="shortcut-row"><span>Interactive Terminal Lab</span> <span class="kbd">L or \`</span></div>
              <div class="shortcut-row"><span>Audience Q&A Cheat Sheet</span> <span class="kbd">Q</span></div>
              <div class="shortcut-row"><span>Speaker Notes / Teleprompter</span> <span class="kbd">N</span></div>
              <div class="shortcut-row"><span>Mute / Unmute Audio</span> <span class="kbd">M</span></div>
              <div class="shortcut-row"><span>Toggle Orbit 3D Camera</span> <span class="kbd">C</span></div>
              <div class="shortcut-row"><span>Toggle Transit Speed</span> <span class="kbd">T</span></div>
              <div class="shortcut-row"><span>Toggle Fullscreen</span> <span class="kbd">F</span></div>
              <div class="shortcut-row"><span>Open / Close Help</span> <span class="kbd">?</span></div>
              <div class="shortcut-row" style="margin-top:6px; border-top:1px solid rgba(255,255,255,0.1); padding-top:8px;"><span>Printable PDF Handbook</span> <a href="./Git_and_GitHub_Fundamentals_Member_1.pdf" target="_blank" download="Git_and_GitHub_Fundamentals_Member_1.pdf" class="kbd" style="color:var(--accent-cyan); text-decoration:none; font-weight:700;">📄 Download PDF ⬇</a></div>
            </div>
          </div>
        </div>

        <!-- TERMINAL LAB MODAL -->
        <div id="terminal-lab-overlay" class="terminal-lab-overlay">
          <div class="terminal-lab-card">
            <div class="terminal-lab-header">
              <div class="terminal-lab-title">
                <span class="term-dot red"></span>
                <span class="term-dot yellow"></span>
                <span class="term-dot green"></span>
                <span style="margin-left:8px; font-weight:700;">Git Interactive Terminal Simulator</span>
                <span class="terminal-badge">Live Sandbox</span>
              </div>
              <button id="close-terminal-btn" class="close-notes-btn">&times;</button>
            </div>
            <div class="terminal-quick-chips">
              <span class="chips-label">Quick Commands:</span>
              <button class="term-chip" data-cmd="git status">git status</button>
              <button class="term-chip" data-cmd="git add .">git add .</button>
              <button class="term-chip" data-cmd='git commit -m "feat: login form"'>git commit -m "..."</button>
              <button class="term-chip" data-cmd="git log --oneline">git log</button>
              <button class="term-chip" data-cmd="git branch">git branch</button>
              <button class="term-chip" data-cmd="git push origin main">git push</button>
              <button class="term-chip" data-cmd="git pull origin main">git pull</button>
              <button class="term-chip" data-cmd="clear">clear</button>
            </div>
            <div id="terminal-output" class="terminal-output">
              <div class="term-line welcome-line">✨ Welcome to the Member 1 Git Terminal Sandbox!</div>
              <div class="term-line muted-line">Type any git command or click the quick pills above. Type <code>help</code> for options.</div>
              <div class="term-line muted-line">Repository root: <code>/student/git-demo/.git</code> (Branch: <span class="branch-tag">main</span>)</div>
              <div class="term-line divider-line">------------------------------------------------------------</div>
            </div>
            <div class="terminal-input-row">
              <span class="term-prompt">student@dev-laptop:~/project$</span>
              <input type="text" id="terminal-input" class="terminal-input" placeholder="type 'git status' or 'help'..." autocomplete="off" spellcheck="false" />
              <button id="terminal-submit-btn" class="term-submit-btn">Run ↵</button>
            </div>
          </div>
        </div>

        <!-- AUDIENCE Q&A CHEAT SHEET MODAL -->
        <div id="qa-modal-overlay" class="qa-modal-overlay">
          <div class="qa-modal-card">
            <div class="qa-modal-header">
              <div class="qa-modal-title">
                <span>❓</span>
                <span>Member 1 Q&A Master Sheet (Top Student Questions)</span>
              </div>
              <button id="close-qa-btn" class="close-notes-btn">&times;</button>
            </div>
            <div class="qa-list">
              <div class="qa-item">
                <div class="qa-q">1. What happens if I accidentally commit my password or secret API key?</div>
                <div class="qa-a">
                  <strong>Answer:</strong> Git stores every past commit forever! Deleting the key in a new commit is NOT enough because anyone can inspect past commits. You must:
                  1. Immediately revoke and regenerate the API key online.
                  2. Add <code>.env</code> to your <code>.gitignore</code> file.
                  3. Use tools like <code>git filter-repo</code> or BFG Repo-Cleaner to scrub the secret from history.
                </div>
              </div>
              <div class="qa-item">
                <div class="qa-q">2. How do I fix a merge conflict if my code clashes with my partner?</div>
                <div class="qa-a">
                  <strong>Answer:</strong> Don't panic! A merge conflict just means you and your teammate edited the exact same line of code. Git pauses and writes conflict markers:
                  <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</code> (your code), <code>=======</code>, and <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt; partner-branch</code>. Open the file in VS Code, pick which change to keep, save the file, and run <code>git commit</code>. Member 2 will demonstrate this live!
                </div>
              </div>
              <div class="qa-item">
                <div class="qa-q">3. Is Git completely free? Does GitHub cost anything for students?</div>
                <div class="qa-a">
                  <strong>Answer:</strong> Git is 100% free and open-source under the GPLv2 license. GitHub is completely free for unlimited public and private repositories. Plus, as students, you get the <strong>GitHub Student Developer Pack</strong> with free GitHub Copilot and $200k+ in free developer tooling!
                </div>
              </div>
              <div class="qa-item">
                <div class="qa-q">4. Should I use the Terminal (CLI) or a GUI like GitHub Desktop / VS Code?</div>
                <div class="qa-a">
                  <strong>Answer:</strong> Start with the CLI (terminal)! Learning terminal commands builds the true mental model of Git. Once you understand the concepts, GUI tools in VS Code or GitHub Desktop become convenient accelerators rather than confusing black boxes.
                </div>
              </div>
              <div class="qa-item">
                <div class="qa-q">5. What is the difference between "git fetch" and "git pull"?</div>
                <div class="qa-a">
                  <strong>Answer:</strong> <code>git fetch</code> downloads new commits from GitHub without merging them into your working files (safe inspection). <code>git pull</code> runs both <code>git fetch</code> AND <code>git merge</code> automatically in one step.
                </div>
              </div>
              <div class="qa-item">
                <div class="qa-q">6. Why do some people say "master" branch and others say "main"?</div>
                <div class="qa-a">
                  <strong>Answer:</strong> Prior to October 2020, Git default branches were called <code>master</code>. In 2020, GitHub and the open-source community adopted <code>main</code> as the standard default name for clarity and inclusivity. Both function identically.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // 2. Initialize 3D Scene Manager
    const container = document.getElementById('webgl-container');
    this.sceneManager = new SceneManager(container);

    // 3. Initialize Loading Manager (Funny Main Bootloader + Inter-slide Transit)
    this.loadingManager = new LoadingManager({
      onComplete: () => {
        // When bootloader finishes, show initial slide
        this.renderSlide(1);
      }
    });

    // 4. Build Slide Navigation Pills
    this.buildSlidePills();

    // 5. Bind UI Event Handlers
    this.bindEvents();

    // 6. Setup 3D Card Hover Tilt
    this.setupCardTilt();

    // 7. Start presentation timer
    this.startTimer();
  }

  setupCardTilt() {
    const card = document.getElementById('slide-card-container');
    if (!card) return;

    card.addEventListener('mousemove', (e) => {
      if (this.cardMinimized) return; // Do not tilt when minimized
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -3;
      const rotateY = ((x - centerX) / centerX) * 3;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(0)`;
    });

    card.addEventListener('mouseleave', () => {
      if (this.cardMinimized) return;
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  }

  buildSlidePills() {
    const container = document.getElementById('slide-pills-container');
    if (!container) return;
    container.innerHTML = '';
    slidesData.forEach((slide) => {
      const pill = document.createElement('button');
      pill.className = `slide-pill ${slide.number === 1 ? 'active' : ''} ${slide.number === 7 ? 'quiz-pill-special' : ''}`;
      if (slide.number === 7) {
        pill.innerHTML = '🎯';
        pill.title = 'Slide 7. Grand Pop Quiz Arena Page';
      } else {
        pill.textContent = slide.number;
        pill.title = `${slide.number}. ${slide.title}`;
      }
      pill.addEventListener('click', () => {
        this.goToSlide(slide.number);
      });
      container.appendChild(pill);
    });
  }

  updatePills() {
    const pills = document.querySelectorAll('.slide-pill');
    pills.forEach((pill, idx) => {
      if (idx + 1 === this.currentSlideIndex) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });

    // Update top progress bar
    const bar = document.getElementById('deck-progress-bar');
    if (bar) {
      const pct = (this.currentSlideIndex / this.totalSlides) * 100;
      bar.style.width = `${pct}%`;
    }
  }

  renderSlide(slideNumber) {
    const slide = slidesData[slideNumber - 1];
    if (!slide) return;

    this.currentSlideIndex = slideNumber;
    this.sceneManager.setSlide(slideNumber);
    this.updatePills();

    // Reset card tab to concept on new slide
    this.currentCardTab = 'concept';

    // Update Nav Buttons
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const navMicContainer = document.getElementById('nav-mic-btn-container');

    if (prevBtn) prevBtn.disabled = slideNumber === 1;

    if (navMicContainer) {
      if (slideNumber === 6) {
        navMicContainer.innerHTML = `
          <button id="nav-pass-mic-btn" class="nav-btn pass-mic-nav-btn action-trigger-btn" data-action="handoff-mic" title="Pass The Mic to Member 2! (Drumroll, Spotlight & Confetti)">
            <span>🎤 Pass The Mic!</span>
          </button>
        `;
        const micBtn = navMicContainer.querySelector('#nav-pass-mic-btn');
        if (micBtn) {
          micBtn.addEventListener('click', () => {
            this.triggerFunnyAction('handoff-mic', micBtn);
          });
        }
      } else {
        navMicContainer.innerHTML = '';
      }
    }

    if (nextBtn) {
      if (slideNumber === this.totalSlides) {
        nextBtn.innerHTML = `<span>Celebration</span> <span>🎉</span>`;
      } else if (slideNumber === 6) {
        nextBtn.innerHTML = `<span>Pop Quiz</span> <span>🎯 →</span>`;
      } else {
        nextBtn.innerHTML = `<span>Next</span> <span>→</span>`;
      }
    }

    // Render Slide Card with smooth entrance animation
    const card = document.getElementById('slide-card-container');
    if (card) {
      card.style.opacity = '0';
      card.style.transform = 'translateY(12px)';

      setTimeout(() => {
        if (slide.id === 'pop-quiz-arena') {
          card.classList.add('quiz-arena-mode');
        } else {
          card.classList.remove('quiz-arena-mode');
        }

        card.innerHTML = this.getSlideHTML(slide);
        if (this.cardMinimized) {
          card.classList.add('minimized');
          card.style.transform = 'none';
        } else {
          card.classList.remove('minimized');
          card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        }
        this.attachSlideActionListeners(slide);
        card.style.opacity = '1';
      }, 120);
    }

    // Update Speaker Notes
    this.updateSpeakerNotes(slide);
  }

  getPopQuizArenaHTML(slide) {
    const questions = [
      { num: 1, title: 'What is Git?', icon: '🧠', category: 'Intro & Hook', ...slidesData[0].popQuiz },
      { num: 2, title: 'Architecture', icon: '⚙️', category: '3 States of Git', ...slidesData[1].popQuiz },
      { num: 3, title: 'GitHub Cloud', icon: '🌟', category: 'Student Superpowers', ...slidesData[2].popQuiz },
      { num: 4, title: 'Git vs GitHub', icon: '📷', category: 'Mental Models', ...slidesData[3].popQuiz },
      { num: 5, title: 'Team Lifecycle', icon: '🔄', category: '3-Step Rhythm', ...slidesData[4].popQuiz },
      { num: 6, title: 'Best Practices', icon: '🏆', category: 'Engineering Mindset', ...slidesData[5].popQuiz }
    ];

    const currentQIdx = Math.max(0, Math.min(5, (this.selectedArenaQuestion || 1) - 1));
    const currentQ = questions[currentQIdx];

    // Compute live stats across all 6 questions
    let totalAnswered = 0;
    let totalCorrect = 0;
    questions.forEach((q) => {
      const state = this.quizStates[q.num];
      if (state && state.answered) {
        totalAnswered++;
        if (state.isCorrect) totalCorrect++;
      }
    });

    const pct = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
    const allCompleted = totalAnswered === 6;

    // Build Question Navigator Tabs (Q1 to Q6)
    const questionsNav = questions.map((q, idx) => {
      const state = this.quizStates[q.num];
      const isCurrent = idx === currentQIdx;
      let statusIcon = '';
      let statusClass = 'unanswered';
      if (state && state.answered) {
        statusIcon = state.isCorrect ? '✓' : '✗';
        statusClass = state.isCorrect ? 'correct' : 'retry';
      }
      return `
        <button class="arena-q-tab ${isCurrent ? 'active' : ''} ${statusClass}" data-q-num="${q.num}" title="Jump to Question ${q.num}: ${q.title}">
          <span class="arena-q-tab-num">Q${q.num}</span>
          <span class="arena-q-tab-title">${q.title}</span>
          ${statusIcon ? `<span class="arena-q-tab-status">${statusIcon}</span>` : ''}
        </button>
      `;
    }).join('');

    const qState = this.quizStates[currentQ.num];
    const isAnswered = qState && qState.answered;
    const selectedIdx = qState?.selectedIndex;
    const isCorrect = qState?.isCorrect;

    return `
      <div class="card-header-section arena-header-section">
        <div class="card-header-top">
          <div class="slide-badge">Slide 7 of ${this.totalSlides} • Whole-Page Pop Quiz Arena</div>
          <button id="card-minimize-btn" class="card-minimize-btn" title="Minimize Card to View 3D Scene (Press H)">
            <span class="min-btn-icon">🗕</span>
          </button>
        </div>

        <div class="arena-title-bar">
          <div class="arena-title-info">
            <h1 class="slide-title">🎯 Pop Quiz Arena</h1>
            <p class="slide-subtitle">Mastery Knowledge Challenge across all 6 Git & GitHub topics</p>
          </div>
          <div class="arena-score-badge">
            <div class="score-metric-box">
              <span class="metric-label">Score</span>
              <span class="metric-val" id="arena-score-count">${totalCorrect} / 6</span>
            </div>
            <div class="score-metric-box">
              <span class="metric-label">Accuracy</span>
              <span class="metric-val">${pct}%</span>
            </div>
          </div>
        </div>

        <!-- Horizontal Question Selector (Q1 through Q6) -->
        <div class="arena-questions-bar" role="tablist">
          ${questionsNav}
        </div>
      </div>

      <div class="tab-panel-viewport arena-scroll-area">
        <div class="arena-question-card">
          <div class="arena-q-heading">
            <span class="arena-q-badge">${currentQ.icon} Question ${currentQ.num} of 6</span>
            <span class="arena-q-topic-tag">${currentQ.category}</span>
          </div>

          <h3 class="arena-q-prompt">${currentQ.question}</h3>

          <div class="quiz-options-grid arena-options-grid">
            ${currentQ.options.map((opt, idx) => {
              let stateClass = '';
              if (isAnswered) {
                if (idx === currentQ.correctIndex) stateClass = 'correct';
                else if (idx === selectedIdx) stateClass = 'wrong';
                else stateClass = 'disabled';
              }
              return `
                <button class="quiz-option-btn arena-opt-btn ${stateClass}" data-option-idx="${idx}" data-q-num="${currentQ.num}" ${isAnswered ? 'disabled' : ''}>
                  <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
                  <span class="option-text">${opt}</span>
                  ${isAnswered && idx === currentQ.correctIndex ? '<span class="status-icon">✓</span>' : ''}
                  ${isAnswered && idx === selectedIdx && idx !== currentQ.correctIndex ? '<span class="status-icon">✗</span>' : ''}
                </button>
              `;
            }).join('')}
          </div>

          ${isAnswered ? `
            <div class="quiz-explanation-box arena-explanation-box ${isCorrect ? 'success' : 'retry'}">
              <div class="explanation-title">
                ${isCorrect ? '🎉 Brilliant! That is 100% correct!' : '💡 Key Concept Takeaway:'}
              </div>
              <div class="explanation-desc">${currentQ.explanation}</div>
              <div class="arena-explanation-footer">
                <button class="quiz-reset-btn" id="arena-reset-single-btn" data-q-num="${currentQ.num}">Try Question ${currentQ.num} Again ↺</button>
                ${currentQ.num < 6 ? `
                  <button class="action-trigger-btn arena-next-btn" id="arena-next-q-btn" data-next-q="${currentQ.num + 1}">
                    <span>Next Question (Q${currentQ.num + 1}) →</span>
                  </button>
                ` : `
                  <button class="action-trigger-btn arena-next-btn" id="arena-celebrate-btn">
                    <span>🏆 Celebrate & View Results!</span>
                  </button>
                `}
              </div>
            </div>
          ` : ''}

          ${allCompleted ? `
            <div class="arena-completion-banner">
              <div class="completion-trophy">🏆</div>
              <div class="completion-content">
                <h4>${totalCorrect === 6 ? 'Legendary Git Grandmaster! 100% Score!' : (totalCorrect >= 4 ? 'Great Job! Strong Git & GitHub Foundation!' : 'Good Effort! Review & Play Again!')}</h4>
                <p>You completed all 6 questions with <strong>${totalCorrect} out of 6 correct (${pct}% accuracy)</strong>.</p>
              </div>
              <div class="completion-actions">
                <button class="action-trigger-btn" id="arena-confetti-btn">🎉 Celebration Blast</button>
                <button class="quiz-reset-btn" id="arena-reset-all-btn">Reset All Questions ↺</button>
              </div>
            </div>
          ` : ''}
        </div>
      </div>

      <div class="card-footer-section">
        <div class="humor-tag">${slide.humorTag}</div>
        <div class="actions-section">
          ${slide.interactiveActions.map(act => `
            <button class="action-trigger-btn" data-action="${act.id}" title="${act.hint}">
              <span>${act.label}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- MINIMIZED FLOATING BAR -->
      <div class="card-minimized-bar" id="card-minimized-bar" title="Click to Expand Pop Quiz Page (Press H)">
        <div class="min-bar-left">
          <span class="min-dot"></span>
          <span class="min-slide-tag">Slide 7</span>
          <span class="min-slide-title">🎯 Grand Pop Quiz Arena</span>
        </div>
        <button class="card-expand-btn" id="card-expand-btn" title="Expand Pop Quiz Page (Press H)">
          <span>🗖</span>
          <span>Expand Quiz Page</span>
        </button>
      </div>
    `;
  }

  getSlideHTML(slide) {
    if (slide.id === 'pop-quiz-arena') {
      return this.getPopQuizArenaHTML(slide);
    }

    const quizState = this.quizStates[slide.number];
    const isAnswered = quizState && quizState.answered;

    // Build Tab Navigation Header - 3 Core Content Tabs + Dedicated Quiz Page Quick Launch
    const tabsNav = `
      <div class="card-tabs-nav">
        <div class="content-tabs-cluster" role="tablist">
          <button class="card-tab-btn ${this.currentCardTab === 'concept' ? 'active' : ''}" data-tab="concept" title="Core Explanations & Visual Models">
            <span class="tab-emoji">📖</span> <span>Concept</span>
          </button>
          <button class="card-tab-btn ${this.currentCardTab === 'terminal' ? 'active' : ''}" data-tab="terminal" title="Real Terminal Commands & Code Examples">
            <span class="tab-emoji">💻</span> <span>Commands & Code</span>
          </button>
          <button class="card-tab-btn ${this.currentCardTab === 'tips' ? 'active' : ''}" data-tab="tips" title="Pro Tips, Best Practices & Pitfalls">
            <span class="tab-emoji">💡</span> <span>Pro Tips</span>
          </button>
        </div>

        <div class="quiz-tab-wrapper">
          <button class="card-tab-btn jump-to-quiz-page-btn quiz-tab-pill" data-jump-q="${slide.number}" title="Take the Pop Quiz for Topic ${slide.number} on the dedicated Quiz Page!">
            <span class="quiz-pill-sparkle">🎯</span>
            <span class="quiz-pill-text">Quiz Page</span>
            <span class="quiz-pill-badge ${isAnswered ? (quizState.isCorrect ? 'correct' : 'retry') : 'ready'}">
              ${isAnswered ? (quizState.isCorrect ? '✓ Done' : '⚠️ Retry') : 'Q' + slide.number}
            </span>
          </button>
        </div>
      </div>
    `;

    // 1. CONCEPT TAB CONTENT
    let conceptBody = '';
    if (slide.id === 'intro') {
      conceptBody = `
        <div class="concept-intro-block">
          <p class="slide-text"><strong>${slide.hook.question}</strong></p>
          <div class="file-chaos-list">
            ${slide.hook.files.map(f => `<div class="file-item"><span>📁</span> <code>${f}</code></div>`).join('')}
          </div>
          <p class="slide-text" style="font-size:0.9rem;">${slide.hook.caption}</p>
        </div>

        <div class="catastrophes-grid">
          <div class="section-micro-title">💥 The 4 Catastrophes of Unversioned Code:</div>
          <div class="catastrophes-boxes">
            ${slide.coreConcept.fourCatastrophes.map(c => `
              <div class="catastrophe-card">
                <span class="catastrophe-icon">${c.icon}</span>
                <div>
                  <div class="catastrophe-title">${c.title}</div>
                  <div class="catastrophe-desc">${c.desc}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else if (slide.id === 'what-is-git') {
      conceptBody = `
        <div class="definition-callout">
          <strong>Definition:</strong> ${slide.definition}
        </div>

        <div class="superpowers-grid">
          <div class="section-micro-title">⚡ The 3 Superpowers of Local Git:</div>
          ${slide.coreConcept.threeSuperpowers.map(sp => `
            <div class="superpower-card">
              <div class="superpower-icon">${sp.icon}</div>
              <div class="superpower-info">
                <h4>${sp.title}</h4>
                <p>${sp.desc}</p>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="git-architecture-flow">
          <div class="section-micro-title">⚙️ The 3 States of Git (Under the Hood):</div>
          <div class="arch-steps-row">
            ${slide.coreConcept.architectureSteps.map(st => `
              <div class="arch-step-box">
                <div class="arch-step-badge">${st.badge}</div>
                <div class="arch-step-title">${st.step}</div>
                <div class="arch-step-code"><code>${st.tag}</code></div>
                <div class="arch-step-desc">${st.desc}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else if (slide.id === 'what-is-github') {
      conceptBody = `
        <div class="definition-callout">
          <strong>Definition:</strong> ${slide.definition}
        </div>

        <div class="benefits-grid">
          <div class="section-micro-title">🌟 Why GitHub is Vital for Student Developers:</div>
          <div class="benefits-two-col">
            ${slide.coreConcept.studentBenefits.map(b => `
              <div class="benefit-card">
                <div class="superpower-icon">${b.icon}</div>
                <div class="superpower-info">
                  <h4>${b.title}</h4>
                  <p>${b.desc}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="student-superpack-banner">
          <div class="superpack-title">${slide.coreConcept.studentSuperpack.title}</div>
          <div class="superpack-desc">${slide.coreConcept.studentSuperpack.benefits}</div>
        </div>
      `;
    } else if (slide.id === 'git-vs-github') {
      conceptBody = `
        <p class="slide-text"><strong>${slide.analogyIntro}</strong></p>

        <div class="comparison-matrix-table">
          <div class="matrix-header">
            <span class="col-feature">Feature</span>
            <span class="col-git">Git (Local Engine 📷)</span>
            <span class="col-github">GitHub (Cloud Social 📸)</span>
          </div>
          ${slide.coreConcept.comparisonMatrix.map(row => `
            <div class="matrix-row">
              <span class="col-feature"><span class="matrix-badge">${row.badge}</span> ${row.feature}</span>
              <span class="col-git">${row.git}</span>
              <span class="col-github">${row.github}</span>
            </div>
          `).join('')}
        </div>

        <div class="analogies-carousel-section">
          <div class="section-micro-title">💡 4 Mental Models to Remember Forever:</div>
          <div class="analogies-grid-cards">
            ${slide.coreConcept.fourAnalogies.map(a => `
              <div class="analogy-card-mini">
                <div class="analogy-mini-title">${a.title}</div>
                <div class="analogy-mini-git">${a.gitDesc}</div>
                <div class="analogy-mini-gh">${a.githubDesc}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else if (slide.id === 'vocabulary') {
      conceptBody = `
        <p class="slide-text" style="font-size:0.9rem">${slide.intro}</p>

        <div class="lifecycle-banner">
          <div class="lifecycle-title">🔄 The 3-Phase Teamwork Lifecycle:</div>
          <div class="lifecycle-steps">
            ${slide.coreConcept.phases.map(p => `
              <div class="lifecycle-step">
                <span class="lifecycle-badge">${p.tools}</span>
                <span class="lifecycle-name">${p.phase}</span>
                <span class="lifecycle-desc">${p.desc}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="vocab-grid">
          ${slide.vocabularyList.map((v, i) => `
            <div class="vocab-card ${i === 0 ? 'active' : ''}" data-vocab="${v.actionKey}">
              <div class="vocab-card-header">
                <span class="vocab-name">${v.term}</span>
                <span class="vocab-tag">${v.tag}</span>
              </div>
              <div class="vocab-cmd"><code>${v.command}</code></div>
              <div class="vocab-desc">${v.desc}</div>
              <div class="vocab-protip">💡 ${v.proTip}</div>
            </div>
          `).join('')}
        </div>
      `;
    } else if (slide.id === 'handoff') {
      conceptBody = `
        <div class="handoff-box">
          <div class="handoff-quote">${slide.quote}</div>
        </div>

        <div class="golden-rules-section">
          <div class="section-micro-title">👑 ${slide.coreConcept.headline}</div>
          <div class="golden-rules-grid">
            ${slide.coreConcept.fourRules.map(r => `
              <div class="golden-rule-item">
                <div class="rule-num">${r.num}</div>
                <div class="rule-body">
                  <div class="rule-title">${r.title}</div>
                  <div class="rule-desc">${r.desc}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="member2-teaser-box">
          <div class="teaser-title">${slide.coreConcept.member2Teaser.title}</div>
          <div class="teaser-list">
            ${slide.coreConcept.member2Teaser.points.map(pt => `<div class="teaser-pt">${pt}</div>`).join('')}
          </div>
        </div>

        <div class="handoff-cta-card">
          <div class="handoff-cta-text">
            <div class="handoff-cta-heading">🎤 Ready to pass the presentation torch?</div>
            <div class="handoff-cta-sub">Cue the stage spotlight and pass the mic to Member 2!</div>
          </div>
          <button class="pass-the-mic-btn action-trigger-btn" data-action="handoff-mic" title="Cue Drumroll, Spotlight sweep, Confetti & Fanfare!">
            <span>🎤 Pass The Mic!</span>
          </button>
        </div>
      `;
    }

    // 2. TERMINAL & CODE TAB CONTENT
    const terminalBody = `
      <div class="terminal-tab-content">
        <div class="terminal-tab-headline">${slide.terminalSection.headline}</div>
        <p class="slide-text" style="font-size:0.88rem; margin-bottom:8px;">${slide.terminalSection.explanation}</p>

        <div class="code-block-container">
          <div class="code-block-header">
            <div class="window-dots">
              <span class="dot-red"></span>
              <span class="dot-yellow"></span>
              <span class="dot-green"></span>
            </div>
            <span class="code-title">Terminal / Bash Session</span>
            <button class="copy-code-btn" data-code="${encodeURIComponent(slide.terminalSection.codeSnippet)}">
              <span>📋</span>
              <span class="copy-text">Copy Code</span>
            </button>
          </div>
          <pre class="code-pre"><code>${this.escapeHTML(slide.terminalSection.codeSnippet)}</code></pre>
        </div>

        <div class="commands-table-section">
          <div class="section-micro-title">⚡ Command Syntax Reference:</div>
          <div class="commands-list">
            ${slide.terminalSection.commands.map(c => `
              <div class="cmd-row">
                <code class="cmd-syntax">${c.cmd}</code>
                <span class="cmd-desc">${c.desc}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // 3. PRO TIPS & WAR STORIES TAB CONTENT
    const tipsBody = `
      <div class="tips-tab-content">
        <div class="protip-card golden">
          <div class="tip-header">
            <span class="tip-icon">🌟</span>
            <span class="tip-label">Member 1 Golden Rule:</span>
          </div>
          <div class="tip-body">${slide.proTips.goldenRule}</div>
        </div>

        <div class="protip-card story">
          <div class="tip-header">
            <span class="tip-icon">🔥</span>
            <span class="tip-label">Real Student War Story:</span>
          </div>
          <div class="tip-body">${slide.proTips.studentWarStory}</div>
        </div>

        <div class="protip-card warning">
          <div class="tip-header">
            <span class="tip-icon">⚠️</span>
            <span class="tip-label">Common Student Pitfall (Avoid!):</span>
          </div>
          <div class="tip-body">${slide.proTips.pitfall}</div>
        </div>
      </div>
    `;

    // Contextual 3D Actions Bar (Always visible at bottom of card)
    let actionsFooter = '';
    if (slide.id === 'handoff') {
      actionsFooter = `
        <div class="humor-tag">${slide.humorTag}</div>
        <div class="handoff-mic-hero-container">
          <button id="pass-the-mic-btn" class="pass-the-mic-hero-btn action-trigger-btn" data-action="handoff-mic" title="Cue Drumroll, Spotlight Sweep, Confetti & Fanfare!">
            <span class="mic-glow-icon">🎤</span>
            <span class="mic-hero-texts">
              <span class="mic-hero-main">PASS THE MIC TO MEMBER 2!</span>
              <span class="mic-hero-sub">🥁 Cue Drumroll • 🔦 Spotlight Sweep • 🎊 Confetti Fanfare</span>
            </span>
            <span class="mic-party-icon">🎉</span>
          </button>
        </div>
        <div class="actions-section handoff-secondary-actions">
          <button class="action-trigger-btn jump-to-quiz-page-btn highlight-quiz-btn" data-jump-q="${slide.number}" title="Take the Pop Quiz for Topic ${slide.number} on the dedicated Quiz Page!">
            <span>🎯 Take Topic ${slide.number} Quiz Page →</span>
          </button>
          <button class="action-trigger-btn" data-action="handoff-confetti" title="Celebrate a flawless presentation">
            <span>🎊 More Confetti!</span>
          </button>
        </div>
      `;
    } else {
      actionsFooter = `
        <div class="humor-tag">${slide.humorTag}</div>
        <div class="actions-section">
          <button class="action-trigger-btn jump-to-quiz-page-btn highlight-quiz-btn" data-jump-q="${slide.number}" title="Take the Pop Quiz for Topic ${slide.number} on the dedicated Quiz Page!">
            <span>🎯 Take Topic ${slide.number} Quiz Page →</span>
          </button>
          ${slide.interactiveActions.map(act => `
            <button class="action-trigger-btn" data-action="${act.id}" title="${act.hint}">
              <span>${act.label}</span>
            </button>
          `).join('')}
        </div>
      `;
    }

    return `
      <div class="card-header-section">
        <div class="card-header-top">
          <div class="slide-badge">Slide ${slide.number} of ${this.totalSlides} • ${slide.category}</div>
          <button id="card-minimize-btn" class="card-minimize-btn" title="Minimize Card to View 3D Scene (Press H)">
            <span class="min-btn-icon">🗕</span>
          </button>
        </div>
        <h1 class="slide-title">${slide.title}</h1>
        <h3 class="slide-subtitle">${slide.subtitle}</h3>
        ${tabsNav}
      </div>

      <div class="tab-panel-viewport">
        <div class="tab-panel ${this.currentCardTab === 'concept' ? 'active' : ''}" id="panel-concept">${conceptBody}</div>
        <div class="tab-panel ${this.currentCardTab === 'terminal' ? 'active' : ''}" id="panel-terminal">${terminalBody}</div>
        <div class="tab-panel ${this.currentCardTab === 'tips' ? 'active' : ''}" id="panel-tips">${tipsBody}</div>
      </div>

      <div class="card-footer-section">
        ${actionsFooter}
      </div>

      <!-- MINIMIZED FLOATING BAR (Displayed when .slide-card.minimized) -->
      <div class="card-minimized-bar" id="card-minimized-bar" title="Click to Expand Presentation Card (Press H)">
        <div class="min-bar-left">
          <span class="min-dot"></span>
          <span class="min-slide-tag">Slide ${slide.number}</span>
          <span class="min-slide-title">${slide.title}</span>
        </div>
        <button class="card-expand-btn" id="card-expand-btn" title="Expand Presentation Card (Press H)">
          <span>🗖</span>
          <span>Expand Card</span>
        </button>
      </div>
    `;
  }

  escapeHTML(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  attachSlideActionListeners(slide) {
    // 1. Tab navigation buttons
    const tabBtns = document.querySelectorAll('.card-tab-btn');
    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        if (tab && tab !== this.currentCardTab) {
          this.currentCardTab = tab;
          soundFX.playWhipWhoosh();
          this.triggerScreenEffect('boing-bounce');
          this.updateCardTabs(slide);
        }
      });
    });

    // 2. 3D Stage action triggers with funny sound & motion
    const actionBtns = document.querySelectorAll('.action-trigger-btn');
    actionBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const actionId = btn.getAttribute('data-action');
        if (actionId) {
          this.triggerFunnyAction(actionId, btn);
        }
      });
    });

    // 3. Vocabulary card interactive selection
    if (slide.id === 'vocabulary') {
      const vocabCards = document.querySelectorAll('.vocab-card');
      vocabCards.forEach((card) => {
        card.addEventListener('click', () => {
          vocabCards.forEach(c => c.classList.remove('active'));
          card.classList.add('active');
          const vocabKey = card.getAttribute('data-vocab');
          this.triggerFunnyAction(vocabKey, card);
        });
      });
    }

    // 4. Copy code buttons
    const copyBtns = document.querySelectorAll('.copy-code-btn');
    copyBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const encodedCode = btn.getAttribute('data-code');
        if (encodedCode) {
          const rawCode = decodeURIComponent(encodedCode);
          navigator.clipboard.writeText(rawCode).then(() => {
            soundFX.playCartoonPop();
            this.showComicToast('CODE COPIED TO CLIPBOARD! 📋', '📋', 'magic');
            const textSpan = btn.querySelector('.copy-text');
            if (textSpan) textSpan.textContent = 'Copied! ✓';
            btn.classList.add('copied');
            setTimeout(() => {
              if (textSpan) textSpan.textContent = 'Copy Code';
              btn.classList.remove('copied');
            }, 2000);
          }).catch(() => {});
        }
      });
    });

    // 5. Jump to Pop Quiz Page buttons
    const jumpBtns = document.querySelectorAll('.jump-to-quiz-page-btn');
    jumpBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const qNum = parseInt(btn.getAttribute('data-jump-q'), 10) || 1;
        this.selectedArenaQuestion = qNum;
        soundFX.playCartoonPop();
        this.goToSlide(7);
      });
    });

    // 6. Arena Question Switcher Tabs (Q1 to Q6)
    const arenaQTabs = document.querySelectorAll('.arena-q-tab');
    arenaQTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const qNum = parseInt(tab.getAttribute('data-q-num'), 10);
        if (qNum) {
          this.selectedArenaQuestion = qNum;
          soundFX.playWhipWhoosh();
          this.updateCardTabs(slide);
        }
      });
    });

    // 7. Arena Option Buttons
    const arenaOptBtns = document.querySelectorAll('.arena-opt-btn');
    arenaOptBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const optIdx = parseInt(btn.getAttribute('data-option-idx'), 10);
        const qNum = parseInt(btn.getAttribute('data-q-num'), 10) || this.selectedArenaQuestion || 1;
        this.handleArenaQuizAnswer(qNum, optIdx, slide);
      });
    });

    // 8. Arena Next Question & Reset Buttons
    document.getElementById('arena-next-q-btn')?.addEventListener('click', (e) => {
      const nextQ = parseInt(e.currentTarget.getAttribute('data-next-q'), 10) || 1;
      this.selectedArenaQuestion = nextQ;
      soundFX.playWhipWhoosh();
      this.updateCardTabs(slide);
    });

    document.getElementById('arena-reset-single-btn')?.addEventListener('click', (e) => {
      const qNum = parseInt(e.currentTarget.getAttribute('data-q-num'), 10) || this.selectedArenaQuestion;
      delete this.quizStates[qNum];
      soundFX.playCartoonPop();
      this.updateCardTabs(slide);
    });

    document.getElementById('arena-reset-all-btn')?.addEventListener('click', () => {
      this.quizStates = {};
      this.selectedArenaQuestion = 1;
      soundFX.playCartoonPop();
      this.showComicToast('ALL QUIZ QUESTIONS RESET! ↺', '↺', 'magic');
      this.updateCardTabs(slide);
    });

    const fireCelebration = () => {
      soundFX.playCheer();
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } });
      this.showComicToast('GIT GRANDMASTER CELEBRATION! 🏆', '🏆', 'magic');
    };
    document.getElementById('arena-confetti-btn')?.addEventListener('click', fireCelebration);
    document.getElementById('arena-celebrate-btn')?.addEventListener('click', fireCelebration);

    // 9. Card minimize / expand buttons
    document.getElementById('card-minimize-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleCardMinimize();
    });
    document.getElementById('card-minimized-bar')?.addEventListener('click', () => {
      this.toggleCardMinimize();
    });
    document.getElementById('card-expand-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleCardMinimize();
    });
  }

  handleArenaQuizAnswer(qNum, selectedIdx, slide) {
    const targetSlide = slidesData[qNum - 1];
    if (!targetSlide || !targetSlide.popQuiz) return;
    const quiz = targetSlide.popQuiz;
    const isCorrect = (selectedIdx === quiz.correctIndex);

    this.quizStates[qNum] = {
      answered: true,
      selectedIndex: selectedIdx,
      isCorrect: isCorrect
    };

    if (isCorrect) {
      soundFX.playCorrect();
      this.triggerScreenEffect('jelly-jump');
      this.showComicToast('BOOM! 🎯 100% ACCURATE!', '🎉', 'quiz-correct');
      confetti({
        particleCount: 65,
        spread: 75,
        origin: { y: 0.65 }
      });
    } else {
      soundFX.playWrong();
      this.triggerScreenEffect('head-shake');
      this.showComicToast('OOF! ❌ CLOSE, TRY AGAIN!', '⚠️', 'quiz-wrong');
    }

    this.updateCardTabs(slide);
  }

  showComicToast(text, emoji = '✨', type = 'magic') {
    const container = document.getElementById('comic-toast-container');
    if (!container) return;

    const bubble = document.createElement('div');
    bubble.className = `comic-sound-bubble comic-${type}`;
    const rot = (Math.random() - 0.5) * 12;
    bubble.style.transform = `rotate(${rot}deg)`;
    bubble.innerHTML = `
      <span class="comic-emoji">${emoji}</span>
      <span class="comic-text">${text}</span>
    `;

    container.appendChild(bubble);

    setTimeout(() => {
      bubble.remove();
    }, 1800);
  }

  triggerScreenEffect(effectName) {
    const card = document.getElementById('slide-card-container');
    const flash = document.getElementById('camera-flash-overlay');

    if (effectName === 'camera-flash' && flash) {
      flash.classList.add('flashing');
      setTimeout(() => flash.classList.remove('flashing'), 180);
    }

    if (!card) return;

    // Remove any previous effect classes first
    card.classList.remove(
      'screen-panic-rumble',
      'card-boing-bounce',
      'card-retro-rewind',
      'card-stamp-impact',
      'card-head-shake',
      'card-jelly-jump',
      'coffee-splat-ripple',
      'rocket-rumble'
    );

    // Force DOM reflow
    void card.offsetWidth;

    if (effectName === 'panic-rumble') {
      card.classList.add('screen-panic-rumble');
      setTimeout(() => card.classList.remove('screen-panic-rumble'), 1200);
    } else if (effectName === 'boing-bounce') {
      card.classList.add('card-boing-bounce');
      setTimeout(() => card.classList.remove('card-boing-bounce'), 600);
    } else if (effectName === 'retro-rewind') {
      card.classList.add('card-retro-rewind');
      setTimeout(() => card.classList.remove('card-retro-rewind'), 800);
    } else if (effectName === 'stamp-slam') {
      card.classList.add('card-stamp-impact');
      setTimeout(() => card.classList.remove('card-stamp-impact'), 600);
    } else if (effectName === 'coffee-splat') {
      card.classList.add('coffee-splat-ripple');
      setTimeout(() => card.classList.remove('coffee-splat-ripple'), 800);
    } else if (effectName === 'rocket-rumble') {
      card.classList.add('rocket-rumble');
      setTimeout(() => card.classList.remove('rocket-rumble'), 900);
    } else if (effectName === 'head-shake') {
      card.classList.add('card-head-shake');
      setTimeout(() => card.classList.remove('card-head-shake'), 600);
    } else if (effectName === 'jelly-jump') {
      card.classList.add('card-jelly-jump');
      setTimeout(() => card.classList.remove('card-jelly-jump'), 600);
    }
  }

  triggerFunnyAction(actionId, btn) {
    // 1. Tell 3D Scene to perform action
    this.sceneManager.triggerStageAction(actionId);

    // 2. Play matching sounds & funny motion comic toasts
    switch (actionId) {
      case 'chaos-panic':
        soundFX.playAlarm();
        this.triggerScreenEffect('panic-rumble');
        this.showComicToast('AAAAAH! 🚨 FILE EXPLOSION PANIC!', '🚨', 'panic');
        break;

      case 'chaos-add-file':
        soundFX.playBoing();
        this.triggerScreenEffect('boing-bounce');
        this.showComicToast('📄 +1 CHAOTIC FILE DROPPED!', '📂', 'boing');
        break;

      case 'chaos-order':
        soundFX.playFanfare();
        this.triggerScreenEffect('boing-bounce');
        this.showComicToast('✨ SINGULARITY RESTORES GIT ORDER!', '🌟', 'magic');
        break;

      case 'git-smash-undo':
        soundFX.playUndo();
        this.triggerScreenEffect('retro-rewind');
        this.showComicToast('SMASHED CTRL+Z! (REVERTED TO 2:00 AM)', '⏪', 'undo');
        break;

      case 'git-warp-timeline':
        soundFX.playWarp();
        this.triggerScreenEffect('retro-rewind');
        this.showComicToast('WARPING TIME MACHINE NODES!', '⏳', 'warp');
        break;

      case 'cloud-beam':
        soundFX.playRocket();
        this.triggerScreenEffect('rocket-rumble');
        this.showComicToast('BEAMING CODE TO CLOUD STORAGE!', '☁️', 'beam');
        break;

      case 'cloud-coffee':
        soundFX.playSplat();
        this.triggerScreenEffect('coffee-splat');
        this.showComicToast('COFFEE SPILLED! ☕ (CLOUD IS SAFE!)', '☕', 'coffee');
        break;

      case 'snap-photo':
        soundFX.playCameraShutter();
        this.triggerScreenEffect('camera-flash');
        const hash = Math.random().toString(16).substring(2, 8);
        this.showComicToast(`CHEESE! 📸 SNAPSHOT #${hash} TAKEN!`, '📷', 'camera');
        break;

      case 'like-feed':
        soundFX.playSpark();
        this.triggerScreenEffect('jelly-jump');
        this.showComicToast('+1 STAR & HEART ON GITHUB!', '⭐', 'star');
        break;

      case 'vocab-rocket':
      case 'vocab-push':
        soundFX.playRocket();
        this.triggerScreenEffect('rocket-rumble');
        this.showComicToast('ROCKET PUSH UP TO GITHUB MAIN!', '🚀', 'rocket');
        break;

      case 'vocab-fork-demo':
      case 'vocab-fork':
        soundFX.playClone();
        this.triggerScreenEffect('boing-bounce');
        this.showComicToast('GOLDEN FORK CLONED REPO!', '🍴', 'fork');
        break;

      case 'vocab-pr-stamp':
      case 'vocab-pr':
        soundFX.playStamp();
        this.triggerScreenEffect('stamp-slam');
        this.showComicToast('PULL REQUEST APPROVED & MERGED! ✅', '✅', 'stamp');
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
        break;

      case 'vocab-repo':
        soundFX.playCartoonPop();
        this.triggerScreenEffect('boing-bounce');
        this.showComicToast('THE VAULT: REPO ACTOR ACTIVE!', '📦', 'magic');
        break;

      case 'vocab-commit':
        soundFX.playStamp();
        this.triggerScreenEffect('stamp-slam');
        this.showComicToast('PERMANENT SNAPSHOT STAMPED!', '📸', 'stamp');
        break;

      case 'vocab-pull':
        soundFX.playTractorBeam();
        this.triggerScreenEffect('retro-rewind');
        this.showComicToast('TRACTOR BEAM: PULLING UPDATES!', '🚜', 'beam');
        break;

      case 'vocab-clone':
        soundFX.playClone();
        this.triggerScreenEffect('boing-bounce');
        this.showComicToast('DUPLICATOR: CLONING FULL PROJECT!', '👥', 'magic');
        break;

      case 'vocab-branch':
        soundFX.playBranch();
        this.triggerScreenEffect('boing-bounce');
        this.showComicToast('PARALLEL UNIVERSE: BRANCH CREATED!', '🌿', 'magic');
        break;

      case 'handoff-mic':
        soundFX.playDrumroll();
        this.triggerScreenEffect('stamp-slam');
        this.showComicToast('MEMBER 2, TAKE THE MIC! 🎤', '🎉', 'mic');
        setTimeout(() => soundFX.playFanfare(), 650);
        confetti({
          particleCount: 100,
          spread: 90,
          origin: { y: 0.5 }
        });
        break;

      case 'handoff-confetti':
      case 'quiz-confetti':
        soundFX.playFanfare();
        this.triggerScreenEffect('jelly-jump');
        this.showComicToast('CONFETTI CELEBRATION! 🎊', '🎉', 'confetti');
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.6 }
        });
        break;

      case 'quiz-applause':
        soundFX.playCheer();
        this.triggerScreenEffect('boing-bounce');
        this.showComicToast('AUDIENCE CHEER & APPLAUSE! 👏', '👏', 'magic');
        break;

      case 'quiz-reset-all':
        this.quizStates = {};
        this.selectedArenaQuestion = 1;
        soundFX.playCartoonPop();
        this.showComicToast('ALL QUIZ QUESTIONS RESET! ↺', '↺', 'magic');
        this.updateCardTabs(slidesData[6]);
        break;

      default:
        soundFX.playClick();
        break;
    }
  }

  updateCardTabs(slide) {
    const card = document.getElementById('slide-card-container');
    if (!card) return;
    card.innerHTML = this.getSlideHTML(slide);
    if (this.cardMinimized) {
      card.classList.add('minimized');
      card.style.transform = 'none';
    } else {
      card.classList.remove('minimized');
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    }
    this.attachSlideActionListeners(slide);
  }

  handleQuizAnswer(slide, selectedIdx) {
    const quiz = slide.popQuiz;
    const isCorrect = (selectedIdx === quiz.correctIndex);

    this.quizStates[slide.number] = {
      answered: true,
      selectedIndex: selectedIdx,
      isCorrect: isCorrect
    };

    if (isCorrect) {
      soundFX.playCorrect();
      this.triggerScreenEffect('jelly-jump');
      this.showComicToast('BOOM! 🎯 100% ACCURATE!', '🎉', 'quiz-correct');
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.65 }
      });
    } else {
      soundFX.playWrong();
      this.triggerScreenEffect('head-shake');
      this.showComicToast('OOF! ❌ CLOSE, TRY AGAIN!', '⚠️', 'quiz-wrong');
    }

    this.updateCardTabs(slide);
  }

  updateSpeakerNotes(slide) {
    const notesBody = document.getElementById('notes-content-body');
    if (!notesBody) return;
    notesBody.innerHTML = slide.speakerNotes.map(n => `
      <div class="note-line">${n}</div>
    `).join('');
  }

  goToSlide(slideNumber) {
    if (slideNumber < 1 || slideNumber > this.totalSlides) return;
    if (slideNumber === this.currentSlideIndex) return;

    const targetSlide = slidesData[slideNumber - 1];

    // Trigger funny & high-tech inter-slide loading transition
    this.loadingManager.transitToSlide(targetSlide, () => {
      this.renderSlide(slideNumber);
    });
  }

  nextSlide() {
    soundFX.playWhipWhoosh();
    if (this.currentSlideIndex < this.totalSlides) {
      this.goToSlide(this.currentSlideIndex + 1);
    } else {
      this.triggerFunnyAction('handoff-mic');
    }
  }

  prevSlide() {
    soundFX.playWhipWhoosh();
    if (this.currentSlideIndex > 1) {
      this.goToSlide(this.currentSlideIndex - 1);
    }
  }

  toggleTerminalLab() {
    this.terminalOpen = !this.terminalOpen;
    const modal = document.getElementById('terminal-lab-overlay');
    const btn = document.getElementById('terminal-lab-btn');
    if (this.terminalOpen) {
      modal?.classList.add('open');
      btn?.classList.add('active');
      soundFX.playClick();
      const input = document.getElementById('terminal-input');
      setTimeout(() => input?.focus(), 100);
    } else {
      modal?.classList.remove('open');
      btn?.classList.remove('active');
    }
  }

  toggleQAModal() {
    this.qaOpen = !this.qaOpen;
    const modal = document.getElementById('qa-modal-overlay');
    const btn = document.getElementById('qa-toggle-btn');
    if (this.qaOpen) {
      modal?.classList.add('open');
      btn?.classList.add('active');
      soundFX.playClick();
    } else {
      modal?.classList.remove('open');
      btn?.classList.remove('active');
    }
  }

  executeTerminalCommand(rawCmd) {
    const outputEl = document.getElementById('terminal-output');
    if (!outputEl) return;

    const cmd = rawCmd.trim();
    if (!cmd) return;

    // Echo command
    const echoLine = document.createElement('div');
    echoLine.className = 'term-line echo-line';
    echoLine.innerHTML = `<span class="term-prompt">student@dev-laptop:~/project$</span> <strong>${this.escapeHTML(cmd)}</strong>`;
    outputEl.appendChild(echoLine);

    soundFX.playTerminalKey();

    const lower = cmd.toLowerCase();

    if (lower === 'clear') {
      outputEl.innerHTML = '';
      return;
    }

    if (lower === 'help') {
      this.appendTermLine(outputEl, `Available simulated commands:
  • git status              - View working tree & staging status
  • git init                - Reinitialize Git repository
  • git add .               - Stage all modified files
  • git commit -m "&lt;msg&gt;"   - Record permanent snapshot with hash
  • git log / --oneline     - Inspect commit history graph
  • git branch              - List branches
  • git push origin main    - Upload commits to GitHub
  • git pull origin main    - Download updates from GitHub
  • clear                   - Clear terminal screen`);
      return;
    }

    if (lower === 'git status') {
      if (this.simulatedRepo.stagedFiles.length === 0 && this.simulatedRepo.untrackedFiles.length === 0) {
        this.appendTermLine(outputEl, `On branch ${this.simulatedRepo.branch}\nnothing to commit, working tree clean (All files saved & versioned!)`);
      } else {
        let text = `On branch ${this.simulatedRepo.branch}\n`;
        if (this.simulatedRepo.stagedFiles.length > 0) {
          text += `Changes to be committed:\n  (use "git restore --staged <file>..." to unstage)\n`;
          this.simulatedRepo.stagedFiles.forEach(f => {
            text += `\t<span style="color:#10b981;">new file:   ${f}</span>\n`;
          });
        }
        if (this.simulatedRepo.untrackedFiles.length > 0) {
          text += `Untracked files:\n  (use "git add <file>..." to include in what will be committed)\n`;
          this.simulatedRepo.untrackedFiles.forEach(f => {
            text += `\t<span style="color:#ef4444;">${f}</span>\n`;
          });
        }
        this.appendTermLine(outputEl, text);
      }
      return;
    }

    if (lower === 'git init') {
      this.appendTermLine(outputEl, `Reinitialized existing Git repository in /workspace/project/.git/ (HEAD is at main)`);
      return;
    }

    if (lower === 'git add .' || lower.startsWith('git add ')) {
      if (this.simulatedRepo.untrackedFiles.length === 0) {
        this.appendTermLine(outputEl, `All files are already staged for commit.`);
      } else {
        this.simulatedRepo.stagedFiles.push(...this.simulatedRepo.untrackedFiles);
        this.simulatedRepo.untrackedFiles = [];
        this.appendTermLine(outputEl, `✓ Staged ${this.simulatedRepo.stagedFiles.length} file(s) into index. Ready for "git commit -m"!`);
      }
      return;
    }

    if (lower.startsWith('git commit')) {
      if (this.simulatedRepo.stagedFiles.length === 0) {
        this.appendTermLine(outputEl, `Nothing to commit, working tree clean. Stage files with "git add ." first!`);
      } else {
        const hash = Math.random().toString(16).substring(2, 9);
        const msgMatch = cmd.match(/-m\s+["']?([^"']+)["']?/);
        const commitMsg = msgMatch ? msgMatch[1] : 'checkpoint update';

        this.simulatedRepo.commits.unshift({ hash, msg: commitMsg });
        const count = this.simulatedRepo.stagedFiles.length;
        this.simulatedRepo.stagedFiles = [];

        this.appendTermLine(outputEl, `[${this.simulatedRepo.branch} ${hash}] ${commitMsg}\n ${count} file(s) changed, 48 insertions(+)\nSnapshot permanently saved in local .git database!`);

        confetti({
          particleCount: 30,
          spread: 40,
          origin: { y: 0.6 }
        });
      }
      return;
    }

    if (lower === 'git log' || lower === 'git log --oneline') {
      let logStr = '';
      this.simulatedRepo.commits.forEach((c) => {
        logStr += `<span style="color:#38bdf8;">${c.hash}</span> <span style="color:#f8fafc;">${c.msg}</span>\n`;
      });
      this.appendTermLine(outputEl, logStr.trim());
      return;
    }

    if (lower === 'git branch' || lower === 'git branch -a') {
      this.appendTermLine(outputEl, `* <span style="color:#10b981;">main</span>\n  feature-auth\n  remotes/origin/main`);
      return;
    }

    if (lower.startsWith('git push')) {
      this.appendTermLine(outputEl, `Enumerating objects: 12, done.\nCounting objects: 100% (12/12), done.\nWriting objects: 100% (12/12), 3.4 KiB, done.\nTo https://github.com/student/project.git\n   a1c4e92..${this.simulatedRepo.commits[0].hash}  main -> main\n🚀 Successfully beamed commits to GitHub cloud!`);
      soundFX.playRocket();
      return;
    }

    if (lower.startsWith('git pull')) {
      this.appendTermLine(outputEl, `remote: Enumerating objects: 4, done.\nremote: Total 4 (delta 2), reused 4\nUnpacking objects: 100% (4/4), done.\nFrom https://github.com/student/project\n   main       -> origin/main\nAlready up to date. Zero merge conflicts.`);
      soundFX.playTractorBeam();
      return;
    }

    // Default error
    this.appendTermLine(outputEl, `git: '${cmd}' is not a recognized command. Type <code>help</code> for suggestions.`);
  }

  appendTermLine(outputEl, text) {
    const line = document.createElement('div');
    line.className = 'term-line result-line';
    line.innerHTML = text.replace(/\n/g, '<br/>');
    outputEl.appendChild(line);
    outputEl.scrollTop = outputEl.scrollHeight;
  }

  toggleFreeCamera() {
    this.isFreeCamera = !this.isFreeCamera;
    this.sceneManager.setFreeCamera(this.isFreeCamera);
    const btn = document.getElementById('camera-mode-btn');
    const txt = document.getElementById('camera-mode-text');
    if (this.isFreeCamera) {
      btn?.classList.add('active');
      if (txt) txt.textContent = 'Free Cam (On)';
    } else {
      btn?.classList.remove('active');
      if (txt) txt.textContent = 'Orbit 3D';
    }
  }

  toggleTransitMode() {
    const isCinematic = this.loadingManager.transitSpeed === 'cinematic';
    this.loadingManager.transitSpeed = isCinematic ? 'instant' : 'cinematic';
    const txt = document.getElementById('transit-mode-text');
    if (txt) {
      txt.textContent = this.loadingManager.transitSpeed === 'cinematic' ? 'Cinematic' : 'Instant';
    }
    soundFX.playClick();
  }

  toggleAudio() {
    const muted = soundFX.toggleMute();
    const icon = document.getElementById('sound-icon');
    if (muted) {
      if (icon) icon.textContent = '🔇';
    } else {
      if (icon) icon.textContent = '🔊';
      soundFX.playClick();
    }
  }

  toggleNotes() {
    this.notesOpen = !this.notesOpen;
    const drawer = document.getElementById('speaker-notes-drawer');
    const btn = document.getElementById('notes-toggle-btn');
    if (this.notesOpen) {
      drawer?.classList.add('open');
      btn?.classList.add('active');
    } else {
      drawer?.classList.remove('open');
      btn?.classList.remove('active');
      this.stopTeleprompter();
    }
  }

  toggleTeleprompter() {
    this.teleprompterActive = !this.teleprompterActive;
    const btn = document.getElementById('teleprompter-btn');
    const drawer = document.getElementById('speaker-notes-drawer');

    if (this.teleprompterActive) {
      if (btn) btn.textContent = '⏸ Pause';
      soundFX.playClick();
      this.teleprompterInterval = setInterval(() => {
        if (drawer) {
          drawer.scrollTop += 1;
        }
      }, 40);
    } else {
      this.stopTeleprompter();
    }
  }

  stopTeleprompter() {
    this.teleprompterActive = false;
    const btn = document.getElementById('teleprompter-btn');
    if (btn) btn.textContent = '▶ Scroll';
    if (this.teleprompterInterval) {
      clearInterval(this.teleprompterInterval);
      this.teleprompterInterval = null;
    }
  }

  toggleHelp() {
    this.helpOpen = !this.helpOpen;
    const modal = document.getElementById('shortcuts-modal-overlay');
    if (this.helpOpen) {
      modal?.classList.add('open');
      soundFX.playClick();
    } else {
      modal?.classList.remove('open');
    }
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }

  toggleCardMinimize() {
    this.cardMinimized = !this.cardMinimized;
    const card = document.getElementById('slide-card-container');
    const toggleBtn = document.getElementById('card-toggle-btn');
    const toggleIcon = document.getElementById('card-toggle-icon');
    const toggleText = document.getElementById('card-toggle-text');

    if (this.cardMinimized) {
      card?.classList.add('minimized');
      if (card) card.style.transform = 'none';
      toggleBtn?.classList.add('active');
      if (toggleIcon) toggleIcon.textContent = '🗖';
      if (toggleText) toggleText.textContent = 'Show Card';
      soundFX.playCartoonPop();
      this.showComicToast('CARD MINIMIZED! 👁️ FULL 3D SCENE FOCUS', '👁️', 'magic');
    } else {
      card?.classList.remove('minimized');
      if (card) card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      toggleBtn?.classList.remove('active');
      if (toggleIcon) toggleIcon.textContent = '🗕';
      if (toggleText) toggleText.textContent = 'Card';
      soundFX.playWhipWhoosh();
      this.showComicToast('CARD RESTORED! 📖', '📖', 'magic');
    }
  }

  startTimer() {
    this.timerRunning = true;
    this.timerInterval = setInterval(() => {
      if (this.timerRunning) {
        this.timerSeconds++;
        this.updateTimerDisplay();
      }
    }, 1000);
  }

  toggleTimer() {
    this.timerRunning = !this.timerRunning;
    const btn = document.getElementById('timer-toggle-btn');
    if (btn) btn.textContent = this.timerRunning ? '⏸' : '▶';
  }

  resetTimer() {
    this.timerSeconds = 0;
    this.updateTimerDisplay();
  }

  updateTimerDisplay() {
    const display = document.getElementById('timer-display');
    if (!display) return;
    const mins = Math.floor(this.timerSeconds / 60).toString().padStart(2, '0');
    const secs = (this.timerSeconds % 60).toString().padStart(2, '0');
    display.textContent = `${mins}:${secs}`;
  }

  bindEvents() {
    // Navigation buttons
    document.getElementById('prev-btn')?.addEventListener('click', () => this.prevSlide());
    document.getElementById('next-btn')?.addEventListener('click', () => this.nextSlide());

    // Header buttons
    document.getElementById('header-quiz-btn')?.addEventListener('click', () => {
      soundFX.playCartoonPop();
      this.goToSlide(7);
    });
    document.getElementById('card-toggle-btn')?.addEventListener('click', () => this.toggleCardMinimize());
    document.getElementById('terminal-lab-btn')?.addEventListener('click', () => this.toggleTerminalLab());
    document.getElementById('close-terminal-btn')?.addEventListener('click', () => this.toggleTerminalLab());
    document.getElementById('qa-toggle-btn')?.addEventListener('click', () => this.toggleQAModal());
    document.getElementById('close-qa-btn')?.addEventListener('click', () => this.toggleQAModal());

    document.getElementById('transit-toggle-btn')?.addEventListener('click', () => this.toggleTransitMode());
    document.getElementById('camera-mode-btn')?.addEventListener('click', () => this.toggleFreeCamera());
    document.getElementById('sound-toggle-btn')?.addEventListener('click', () => this.toggleAudio());
    document.getElementById('notes-toggle-btn')?.addEventListener('click', () => this.toggleNotes());
    document.getElementById('close-notes-btn')?.addEventListener('click', () => this.toggleNotes());
    document.getElementById('teleprompter-btn')?.addEventListener('click', () => this.toggleTeleprompter());
    document.getElementById('help-toggle-btn')?.addEventListener('click', () => this.toggleHelp());
    document.getElementById('close-help-btn')?.addEventListener('click', () => this.toggleHelp());
    document.getElementById('shortcuts-modal-overlay')?.addEventListener('click', (e) => {
      if (e.target.id === 'shortcuts-modal-overlay') this.toggleHelp();
    });
    document.getElementById('fullscreen-btn')?.addEventListener('click', () => this.toggleFullscreen());

    // Timer buttons
    document.getElementById('timer-toggle-btn')?.addEventListener('click', () => this.toggleTimer());
    document.getElementById('timer-reset-btn')?.addEventListener('click', () => this.resetTimer());

    // Terminal input handling
    const termInput = document.getElementById('terminal-input');
    const termSubmit = document.getElementById('terminal-submit-btn');
    if (termInput && termSubmit) {
      const submitCmd = () => {
        const val = termInput.value;
        if (val.trim()) {
          this.executeTerminalCommand(val);
          termInput.value = '';
        }
      };

      termSubmit.addEventListener('click', submitCmd);
      termInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') submitCmd();
      });
    }

    // Terminal quick chips
    const chips = document.querySelectorAll('.term-chip');
    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const cmd = chip.getAttribute('data-cmd');
        if (cmd) {
          this.executeTerminalCommand(cmd);
        }
      });
    });

    // Close modals on overlay click
    document.getElementById('terminal-lab-overlay')?.addEventListener('click', (e) => {
      if (e.target.id === 'terminal-lab-overlay') this.toggleTerminalLab();
    });
    document.getElementById('qa-modal-overlay')?.addEventListener('click', (e) => {
      if (e.target.id === 'qa-modal-overlay') this.toggleQAModal();
    });

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      // Don't trigger if typing in terminal or an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        if (e.key === 'Escape') {
          if (this.terminalOpen) this.toggleTerminalLab();
        }
        return;
      }

      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        this.nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.prevSlide();
      } else if (e.key === 'h' || e.key === 'H') {
        this.toggleCardMinimize();
      } else if (e.key === 'p' || e.key === 'P') {
        soundFX.playCartoonPop();
        this.goToSlide(7);
      } else if (e.key === 'f' || e.key === 'F') {
        this.toggleFullscreen();
      } else if (e.key === 'n' || e.key === 'N') {
        this.toggleNotes();
      } else if (e.key === 'm' || e.key === 'M') {
        this.toggleAudio();
      } else if (e.key === 'c' || e.key === 'C') {
        this.toggleFreeCamera();
      } else if (e.key === 't' || e.key === 'T') {
        this.toggleTransitMode();
      } else if (e.key === 'l' || e.key === 'L' || e.key === '`') {
        this.toggleTerminalLab();
      } else if (e.key === 'q' || e.key === 'Q') {
        this.toggleQAModal();
      } else if (e.key === '?' || e.key === '/') {
        this.toggleHelp();
      } else if (e.key === 'Escape') {
        if (this.terminalOpen) this.toggleTerminalLab();
        if (this.qaOpen) this.toggleQAModal();
        if (this.helpOpen) this.toggleHelp();
        if (this.notesOpen) this.toggleNotes();
      } else if (e.key >= '1' && e.key <= '7') {
        this.goToSlide(parseInt(e.key, 10));
      }
    });
  }
}

// Instantiate presentation app once DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  new PresentationApp();
});
