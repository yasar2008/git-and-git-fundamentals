import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { slidesData } from './src/data/slidesData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const qaItems = [
  {
    q: '1. What happens if I accidentally commit my password or secret API key?',
    a: `<strong>Answer:</strong> Git stores every past commit forever! Deleting the key in a new commit is NOT enough because anyone can inspect past commits in your git log. You must:<br/>
    1. Immediately revoke and regenerate the API key online in your service dashboard.<br/>
    2. Add <code>.env</code> and config files containing secrets to your <code>.gitignore</code> file.<br/>
    3. Use tools like <code>git filter-repo</code> or BFG Repo-Cleaner to scrub the secret from all past commit history.`
  },
  {
    q: '2. How do I fix a merge conflict if my code clashes with my partner?',
    a: `<strong>Answer:</strong> Don't panic! A merge conflict just means you and your teammate edited the exact same line of code. Git pauses and writes conflict markers:<br/>
    <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</code> (your local code), <code>=======</code>, and <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt; partner-branch</code>.<br/>
    Open the file in VS Code, choose which version to accept (or combine both), save the file, run <code>git add .</code>, and finish with <code>git commit</code>. Member 2 demonstrates this in live action!`
  },
  {
    q: '3. Is Git completely free? Does GitHub cost anything for students?',
    a: `<strong>Answer:</strong> Git is 100% free and open-source under the GNU General Public License v2. GitHub is completely free for unlimited public and private repositories. Plus, as enrolled students, you qualify for the <strong>GitHub Student Developer Pack</strong> which unlocks free GitHub Copilot, domains, cloud credits, and over $200k+ in professional engineering tools!`
  },
  {
    q: '4. Should I use the Terminal (CLI) or a GUI like GitHub Desktop / VS Code?',
    a: `<strong>Answer:</strong> Start with the CLI (Terminal)! Practicing fundamental commands builds the true mental model of Git's 3 states. Once you grasp the underlying engine, visual tools in VS Code or GitHub Desktop become helpful accelerators rather than confusing black boxes.`
  },
  {
    q: '5. What is the difference between "git fetch" and "git pull"?',
    a: `<strong>Answer:</strong> <code>git fetch</code> downloads new commits and branches from GitHub into your local repository without modifying your working files (safe inspection). <code>git pull</code> runs both <code>git fetch</code> AND <code>git merge</code> automatically in a single step, updating your active branch immediately.`
  },
  {
    q: '6. Why do some people say "master" branch and others say "main"?',
    a: `<strong>Answer:</strong> Prior to October 2020, Git's default initial branch name was called <code>master</code>. In 2020, GitHub and the global open-source community transitioned to <code>main</code> as the standard default branch name for clarity and modern conventions. Both operate identically in the Git engine.`
  }
];

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Git & GitHub Fundamentals — Complete Presentation Handbook (Member 1)</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Outfit:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

    @page {
      size: A4 portrait;
      margin: 16mm 14mm 18mm 14mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #ffffff;
      color: #1e293b;
      font-size: 9.8pt;
      line-height: 1.5;
    }

    .page-break {
      page-break-before: always;
      break-before: page;
    }

    .no-break {
      page-break-inside: avoid;
      break-inside: avoid;
    }

    /* COVER PAGE */
    .cover-container {
      height: 100%;
      min-height: 250mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 24mm 16mm;
      border: 3px solid #0284c7;
      border-radius: 16px;
      background: linear-gradient(145deg, #070b14 0%, #0f172a 50%, #1e1b4b 100%);
      color: #f8fafc;
      page-break-after: always;
      break-after: page;
    }

    .cover-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(56, 189, 248, 0.2);
      border: 1px solid #38bdf8;
      color: #38bdf8;
      padding: 6px 16px;
      border-radius: 999px;
      font-family: 'Outfit', sans-serif;
      font-weight: 700;
      font-size: 11pt;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      align-self: flex-start;
    }

    .cover-hero {
      margin-top: 20mm;
      margin-bottom: 20mm;
    }

    .cover-title {
      font-family: 'Outfit', sans-serif;
      font-size: 34pt;
      font-weight: 900;
      line-height: 1.15;
      color: #ffffff;
      margin-bottom: 8mm;
      letter-spacing: -0.5px;
    }

    .cover-title span {
      background: linear-gradient(90deg, #38bdf8, #818cf8, #f472b6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .cover-subtitle {
      font-size: 15pt;
      font-weight: 600;
      color: #94a3b8;
      line-height: 1.4;
      margin-bottom: 12mm;
    }

    .cover-features-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 6mm;
    }

    .cover-feature-box {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 10px;
      padding: 12px 16px;
    }

    .cover-feature-box h4 {
      font-family: 'Outfit', sans-serif;
      font-size: 11pt;
      font-weight: 700;
      color: #38bdf8;
      margin-bottom: 3px;
    }

    .cover-feature-box p {
      font-size: 8.8pt;
      color: #cbd5e1;
      line-height: 1.35;
    }

    .cover-footer {
      border-top: 1px solid rgba(255, 255, 255, 0.15);
      padding-top: 8mm;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    .cover-meta h5 {
      font-family: 'Outfit', sans-serif;
      font-size: 11pt;
      font-weight: 700;
      color: #fbbf24;
      margin-bottom: 2px;
    }

    .cover-meta p {
      font-size: 9pt;
      color: #94a3b8;
    }

    .cover-date {
      font-family: 'JetBrains Mono', monospace;
      font-size: 8.5pt;
      color: #94a3b8;
      text-align: right;
    }

    /* HEADER & FOOTER ON CONTENT PAGES */
    .section-header {
      border-bottom: 2px solid #0284c7;
      padding-bottom: 6px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    .section-header-left h2 {
      font-family: 'Outfit', sans-serif;
      font-size: 17pt;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.2;
    }

    .section-header-left p {
      font-size: 9.5pt;
      color: #0284c7;
      font-weight: 600;
      margin-top: 2px;
    }

    .slide-badge-pill {
      display: inline-block;
      padding: 3px 10px;
      background: #e0f2fe;
      border: 1px solid #7dd3fc;
      border-radius: 999px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 8pt;
      font-weight: 700;
      color: #0369a1;
      text-transform: uppercase;
    }

    /* CARDS & CONTAINERS */
    .card-grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 14px;
    }

    .card-grid-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-bottom: 14px;
    }

    .card-grid-4 {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      margin-bottom: 14px;
    }

    .info-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 12px;
    }

    .info-card.danger {
      background: #fff1f2;
      border-color: #fecdd3;
    }

    .info-card.danger h4 {
      color: #be123c;
    }

    .info-card.success {
      background: #f0fdf4;
      border-color: #bbf7d0;
    }

    .info-card.success h4 {
      color: #15803d;
    }

    .info-card.accent {
      background: #f0f9ff;
      border-color: #bae6fd;
    }

    .info-card.accent h4 {
      color: #0369a1;
    }

    .info-card.warning {
      background: #fffbeb;
      border-color: #fde68a;
    }

    .info-card.warning h4 {
      color: #b45309;
    }

    .info-card h4 {
      font-family: 'Outfit', sans-serif;
      font-size: 10pt;
      font-weight: 700;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .info-card p {
      font-size: 8.8pt;
      color: #475569;
      line-height: 1.4;
    }

    /* CODE BLOCKS */
    .terminal-box {
      background: #090e1a;
      border-radius: 10px;
      border: 1px solid #1e293b;
      margin: 12px 0;
      overflow: hidden;
    }

    .terminal-titlebar {
      background: #0f172a;
      padding: 6px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #1e293b;
    }

    .terminal-dots {
      display: flex;
      gap: 5px;
    }

    .dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
    }
    .dot-red { background: #ef4444; }
    .dot-yellow { background: #eab308; }
    .dot-green { background: #22c55e; }

    .terminal-title {
      font-family: 'JetBrains Mono', monospace;
      font-size: 8pt;
      color: #94a3b8;
    }

    .terminal-body {
      padding: 10px 14px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 8.5pt;
      line-height: 1.45;
      color: #38bdf8;
      white-space: pre-wrap;
    }

    .terminal-body .comment {
      color: #64748b;
    }

    /* COMMAND SYNTAX TABLE */
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0 14px 0;
      font-size: 8.8pt;
    }

    table.data-table th {
      background: #f1f5f9;
      color: #0f172a;
      text-align: left;
      padding: 8px 10px;
      font-family: 'Outfit', sans-serif;
      font-weight: 700;
      border-bottom: 2px solid #cbd5e1;
    }

    table.data-table td {
      padding: 7px 10px;
      border-bottom: 1px solid #e2e8f0;
      vertical-align: top;
    }

    table.data-table tr:nth-child(even) td {
      background: #fafafa;
    }

    code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 8.4pt;
      background: #f1f5f9;
      padding: 2px 6px;
      border-radius: 4px;
      color: #0284c7;
      border: 1px solid #e2e8f0;
    }

    .terminal-box code {
      background: transparent;
      border: none;
      color: inherit;
    }

    /* PRO TIPS & HIGHLIGHT CALLOUTS */
    .pro-tip-banner {
      background: linear-gradient(90deg, #fef3c7, #ffedd5);
      border-left: 4px solid #f59e0b;
      padding: 10px 14px;
      border-radius: 0 8px 8px 0;
      margin: 10px 0 14px 0;
    }

    .pro-tip-banner strong {
      color: #92400e;
      font-family: 'Outfit', sans-serif;
    }

    .pro-tip-banner p {
      font-size: 8.8pt;
      color: #78350f;
      margin-top: 2px;
    }

    .handoff-banner {
      background: linear-gradient(135deg, #fef08a 0%, #fdba74 50%, #f472b6 100%);
      border: 2px solid #ea580c;
      padding: 14px 18px;
      border-radius: 12px;
      margin: 12px 0;
    }

    .handoff-banner h3 {
      font-family: 'Outfit', sans-serif;
      font-size: 13pt;
      font-weight: 900;
      color: #7c2d12;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .handoff-banner p {
      font-size: 9pt;
      color: #7c2d12;
      font-weight: 500;
    }

    /* POP QUIZ CARDS */
    .quiz-card {
      background: #faf5ff;
      border: 1px solid #e9d5ff;
      border-radius: 10px;
      padding: 12px 14px;
      margin-bottom: 12px;
      page-break-inside: avoid;
    }

    .quiz-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }

    .quiz-badge {
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
      font-size: 8pt;
      background: #f3e8ff;
      color: #7e22ce;
      padding: 2px 8px;
      border-radius: 999px;
      border: 1px solid #d8b4fe;
    }

    .quiz-topic {
      font-size: 8pt;
      font-weight: 600;
      color: #6b21a8;
    }

    .quiz-question {
      font-family: 'Outfit', sans-serif;
      font-weight: 700;
      font-size: 10.5pt;
      color: #1e1b4b;
      margin-bottom: 8px;
    }

    .quiz-options-list {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
      margin-bottom: 8px;
    }

    .quiz-opt {
      padding: 6px 10px;
      border-radius: 6px;
      font-size: 8.5pt;
      border: 1px solid #e2e8f0;
      background: #ffffff;
      color: #334155;
    }

    .quiz-opt.correct {
      border-color: #22c55e;
      background: #f0fdf4;
      color: #15803d;
      font-weight: 700;
    }

    .quiz-explanation {
      background: #ffffff;
      border-left: 3px solid #7e22ce;
      padding: 6px 10px;
      font-size: 8.5pt;
      color: #4b5563;
      border-radius: 0 6px 6px 0;
    }

    /* VOCABULARY DETAIL BOX */
    .vocab-item {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 10px 12px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 6px;
    }

    .vocab-item-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .vocab-name {
      font-family: 'Outfit', sans-serif;
      font-weight: 800;
      font-size: 11pt;
      color: #0f172a;
    }

    .vocab-tag {
      font-size: 7.8pt;
      font-weight: 700;
      color: #0284c7;
      background: #e0f2fe;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .vocab-desc {
      font-size: 8.5pt;
      color: #475569;
      line-height: 1.35;
    }

    .vocab-tip {
      font-size: 7.8pt;
      color: #0369a1;
      background: #f0f9ff;
      padding: 4px 6px;
      border-radius: 4px;
      border-top: 1px dashed #bae6fd;
    }

    /* Q&A ITEMS */
    .qa-box {
      margin-bottom: 10px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px 12px;
    }

    .qa-q {
      font-family: 'Outfit', sans-serif;
      font-weight: 700;
      font-size: 9.8pt;
      color: #0f172a;
      margin-bottom: 4px;
    }

    .qa-a {
      font-size: 8.8pt;
      color: #475569;
      line-height: 1.45;
    }
  </style>
</head>
<body>

  <!-- ================= COVER PAGE ================= -->
  <div class="cover-container">
    <div>
      <div class="cover-badge">🚀 Member 1 Visual Presentation Master Handbook</div>
      <div class="cover-hero">
        <h1 class="cover-title">Git &amp; GitHub<br><span>Fundamentals</span></h1>
        <p class="cover-subtitle">The Complete Analogy-Driven, Visual &amp; Practical Field Guide for Student Developers</p>

        <div class="cover-features-grid">
          <div class="cover-feature-box">
            <h4>💡 Intuitive Mental Models</h4>
            <p>Video game checkpoints, photographic cameras vs. Instagram, and unversioned file chaos.</p>
          </div>
          <div class="cover-feature-box">
            <h4>⚙️ Local Git Architecture</h4>
            <p>Working directory, staging blueprint, commit snapshots, and 100% offline time-travel.</p>
          </div>
          <div class="cover-feature-box">
            <h4>☁️ GitHub Cloud Ecosystem</h4>
            <p>Cloud backups, GitHub Student Pack ($200k+ free tools), PR workflows, and developer portfolios.</p>
          </div>
          <div class="cover-feature-box">
            <h4>🎯 Complete Knowledge Bank</h4>
            <p>8 Essential power words, command tables, 6 Pop Quiz Arena solutions, and audience Q&amp;A cheat sheet.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="cover-footer">
      <div class="cover-meta">
        <h5>Presented by Member 1</h5>
        <p>Topic: Git &amp; GitHub Fundamentals &bull; Foundations Module</p>
      </div>
      <div class="cover-date">
        Git Set Code &bull; 3D Deck Companion<br>
        Published September 2026
      </div>
    </div>
  </div>

  <!-- ================= TABLE OF CONTENTS ================= -->
  <div class="page-break"></div>
  <div class="section-header">
    <div class="section-header-left">
      <h2>Table of Contents</h2>
      <p>Executive Overview of All 7 Presentation Modules</p>
    </div>
    <span class="slide-badge-pill">Overview</span>
  </div>

  <table class="data-table" style="margin-top: 15px; font-size: 9.5pt;">
    <thead>
      <tr>
        <th style="width: 15%;">Chapter</th>
        <th style="width: 35%;">Title</th>
        <th style="width: 50%;">Core Student Takeaway &amp; Key Concept</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Chapter 1</strong></td>
        <td><strong>Why Do We Need Git?</strong></td>
        <td>The 4 Catastrophes of unversioned code (<code>final_v99.py</code>) and the Checkpoint Analogy.</td>
      </tr>
      <tr>
        <td><strong>Chapter 2</strong></td>
        <td><strong>What is Git? (Local Engine)</strong></td>
        <td>Distributed version control, 3 superpowers, and the 3 States of Git (Working, Staging, Commit).</td>
      </tr>
      <tr>
        <td><strong>Chapter 3</strong></td>
        <td><strong>What is GitHub? (Cloud Hub)</strong></td>
        <td>Cloud collaboration, open-source networking, student developer pack, and cloud backup.</td>
      </tr>
      <tr>
        <td><strong>Chapter 4</strong></td>
        <td><strong>Git vs. GitHub Comparison</strong></td>
        <td>Camera vs. Instagram, definitive comparison matrix, and 4 unforgettable mental models.</td>
      </tr>
      <tr>
        <td><strong>Chapter 5</strong></td>
        <td><strong>8 Essential Vocabulary Words</strong></td>
        <td>Repo, Commit, Push, Pull, Clone, Branch, Fork, and PR with exact syntax and pro tips.</td>
      </tr>
      <tr>
        <td><strong>Chapter 6</strong></td>
        <td><strong>Passing the Torch! (Handoff)</strong></td>
        <td>Member 1's 4 Golden Rules, global Git configuration setup, and preview of Member 2's live terminal demo.</td>
      </tr>
      <tr>
        <td><strong>Chapter 7</strong></td>
        <td><strong>Grand Pop Quiz Arena</strong></td>
        <td>Complete 6-topic knowledge challenge questions, multiple-choice options, answers, and deep explanations.</td>
      </tr>
      <tr>
        <td><strong>Appendix</strong></td>
        <td><strong>Audience Q&amp;A Cheat Sheet</strong></td>
        <td>6 most common student questions: secret keys, merge conflicts, fetch vs. pull, and career best practices.</td>
      </tr>
    </tbody>
  </table>

  <!-- ================= CHAPTER 1 ================= -->
  <div class="page-break"></div>
  <div class="section-header">
    <div class="section-header-left">
      <h2>Chapter 1: Why Do We Need Git &amp; GitHub?</h2>
      <p>The Universal Struggle Every Developer Faces &bull; Hook &amp; Problem Statement</p>
    </div>
    <span class="slide-badge-pill">Slide 1 of 7</span>
  </div>

  <div class="pro-tip-banner">
    <strong>🤔 The Hook Question:</strong> Have you ever saved a project like this?
    <p><code>final_v1.py</code> &bull; <code>final_v2_really_final.py</code> &bull; <code>final_v3_fixed_omg.py</code> &bull; <code>project_final_final_submission_FINAL.py</code></p>
  </div>

  <h3 style="font-family:'Outfit', sans-serif; font-size:12pt; margin-bottom:8px; color:#0f172a;">💥 The 4 Catastrophes of Unversioned Code</h3>
  <div class="card-grid-2">
    ${slidesData[0].coreConcept.fourCatastrophes.map(c => `
      <div class="info-card danger no-break">
        <h4>${c.icon} ${escapeHtml(c.title)}</h4>
        <p>${escapeHtml(c.desc)}</p>
      </div>
    `).join('')}
  </div>

  <div class="info-card accent no-break" style="margin-bottom: 12px;">
    <h4>🎮 The Game Checkpoint Analogy</h4>
    <p>Imagine playing an 80-hour RPG where you can only have <em>one single save slot</em> that constantly overwrites itself. If you fall off a cliff or hit a bug, your entire character is wiped out forever. <strong>Git is your unlimited save-point system</strong>: make a checkpoint before entering any dungeon (branching), and rewind back in time instantly if your code breaks.</p>
  </div>

  <div class="terminal-box no-break">
    <div class="terminal-titlebar">
      <div class="terminal-dots"><span class="dot dot-red"></span><span class="dot dot-yellow"></span><span class="dot dot-green"></span></div>
      <span class="terminal-title">Terminal &bull; First-Time Initialization</span>
    </div>
    <div class="terminal-body"><span class="comment"># Navigate to your chaotic project directory and take control:</span>
$ cd my-student-project
$ git init
$ git status</div>
  </div>

  <div class="pro-tip-banner no-break">
    <strong>🌟 Member 1 Golden Rule:</strong> ${slidesData[0].proTips.goldenRule}
    <p><strong>🔥 Student War Story:</strong> ${slidesData[0].proTips.studentWarStory}</p>
  </div>

  <!-- ================= CHAPTER 2 ================= -->
  <div class="page-break"></div>
  <div class="section-header">
    <div class="section-header-left">
      <h2>Chapter 2: What is Git?</h2>
      <p>The Local Engine &bull; Distributed Version Control System (DVCS)</p>
    </div>
    <span class="slide-badge-pill">Slide 2 of 7</span>
  </div>

  <div class="info-card accent no-break" style="margin-bottom: 12px;">
    <h4>📖 Official Definition</h4>
    <p>${escapeHtml(slidesData[1].definition)}</p>
  </div>

  <h3 style="font-family:'Outfit', sans-serif; font-size:12pt; margin-bottom:8px; color:#0f172a;">⚡ The 3 Superpowers of Local Git</h3>
  <div class="card-grid-3">
    ${slidesData[1].coreConcept.threeSuperpowers.map(sp => `
      <div class="info-card success no-break">
        <h4>${sp.icon} ${escapeHtml(sp.title)}</h4>
        <p>${escapeHtml(sp.desc)}</p>
      </div>
    `).join('')}
  </div>

  <h3 style="font-family:'Outfit', sans-serif; font-size:12pt; margin-bottom:8px; color:#0f172a;">⚙️ The 3 States of Git (Under the Hood)</h3>
  <div class="card-grid-3">
    ${slidesData[1].coreConcept.architectureSteps.map(step => `
      <div class="info-card no-break">
        <span class="slide-badge-pill" style="font-size:7pt; margin-bottom:4px;">${step.badge}</span>
        <h4>${escapeHtml(step.step)}</h4>
        <p style="margin: 4px 0;"><code>${step.tag}</code></p>
        <p>${escapeHtml(step.desc)}</p>
      </div>
    `).join('')}
  </div>

  <div class="terminal-box no-break">
    <div class="terminal-titlebar">
      <div class="terminal-dots"><span class="dot dot-red"></span><span class="dot dot-yellow"></span><span class="dot dot-green"></span></div>
      <span class="terminal-title">Terminal &bull; Real Lifecycle Sequence</span>
    </div>
    <div class="terminal-body">${escapeHtml(slidesData[1].terminalSection.codeSnippet)}</div>
  </div>

  <table class="data-table no-break">
    <thead>
      <tr>
        <th style="width: 35%;">Command Syntax</th>
        <th style="width: 65%;">Action &amp; Description</th>
      </tr>
    </thead>
    <tbody>
      ${slidesData[1].terminalSection.commands.map(cmd => `
        <tr>
          <td><code>${escapeHtml(cmd.cmd)}</code></td>
          <td>${escapeHtml(cmd.desc)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <!-- ================= CHAPTER 3 ================= -->
  <div class="page-break"></div>
  <div class="section-header">
    <div class="section-header-left">
      <h2>Chapter 3: What is GitHub?</h2>
      <p>The Cloud Collaboration Hub &bull; Where Developers Build Together</p>
    </div>
    <span class="slide-badge-pill">Slide 3 of 7</span>
  </div>

  <div class="info-card accent no-break" style="margin-bottom: 12px;">
    <h4>📖 Official Definition</h4>
    <p>${escapeHtml(slidesData[2].definition)}</p>
  </div>

  <h3 style="font-family:'Outfit', sans-serif; font-size:12pt; margin-bottom:8px; color:#0f172a;">🌟 Why GitHub is Vital for Student Developers</h3>
  <div class="card-grid-2">
    ${slidesData[2].coreConcept.studentBenefits.map(b => `
      <div class="info-card no-break">
        <h4>${b.icon} ${escapeHtml(b.title)}</h4>
        <p>${escapeHtml(b.desc)}</p>
      </div>
    `).join('')}
  </div>

  <div class="pro-tip-banner no-break">
    <strong>🎁 ${escapeHtml(slidesData[2].coreConcept.studentSuperpack.title)}:</strong>
    <p>${escapeHtml(slidesData[2].coreConcept.studentSuperpack.benefits)}</p>
  </div>

  <div class="terminal-box no-break">
    <div class="terminal-titlebar">
      <div class="terminal-dots"><span class="dot dot-red"></span><span class="dot dot-yellow"></span><span class="dot dot-green"></span></div>
      <span class="terminal-title">Terminal &bull; Linking Local Git to GitHub Cloud</span>
    </div>
    <div class="terminal-body">${escapeHtml(slidesData[2].terminalSection.codeSnippet)}</div>
  </div>

  <!-- ================= CHAPTER 4 ================= -->
  <div class="page-break"></div>
  <div class="section-header">
    <div class="section-header-left">
      <h2>Chapter 4: Git vs. GitHub</h2>
      <p>The Definitive Comparison &amp; Mental Models</p>
    </div>
    <span class="slide-badge-pill">Slide 4 of 7</span>
  </div>

  <div class="pro-tip-banner">
    <strong>💡 The Core Insight:</strong> ${escapeHtml(slidesData[3].analogyIntro)}
  </div>

  <h3 style="font-family:'Outfit', sans-serif; font-size:12pt; margin-bottom:8px; color:#0f172a;">📊 Technical Comparison Matrix</h3>
  <table class="data-table no-break">
    <thead>
      <tr>
        <th style="width: 25%;">Dimension</th>
        <th style="width: 35%;">Git (Local Engine 📷)</th>
        <th style="width: 40%;">GitHub (Cloud Social 📸)</th>
      </tr>
    </thead>
    <tbody>
      ${slidesData[3].coreConcept.comparisonMatrix.map(row => `
        <tr>
          <td><strong>${escapeHtml(row.feature)}</strong></td>
          <td>${escapeHtml(row.git)}</td>
          <td>${escapeHtml(row.github)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <h3 style="font-family:'Outfit', sans-serif; font-size:12pt; margin-top:14px; margin-bottom:8px; color:#0f172a;">💡 4 Unforgettable Mental Models</h3>
  <div class="card-grid-2">
    ${slidesData[3].coreConcept.fourAnalogies.map(a => `
      <div class="info-card no-break">
        <h4>${escapeHtml(a.title)}</h4>
        <p><strong>Git:</strong> ${escapeHtml(a.gitDesc)}</p>
        <p style="margin-top:4px;"><strong>GitHub:</strong> ${escapeHtml(a.githubDesc)}</p>
      </div>
    `).join('')}
  </div>

  <!-- ================= CHAPTER 5 ================= -->
  <div class="page-break"></div>
  <div class="section-header">
    <div class="section-header-left">
      <h2>Chapter 5: Essential Vocabulary</h2>
      <p>The 8 Industry Power Words Every Developer Must Know</p>
    </div>
    <span class="slide-badge-pill">Slide 5 of 7</span>
  </div>

  <div class="pro-tip-banner">
    <strong>🔄 The 3-Phase Teamwork Lifecycle:</strong>
    ${slidesData[4].coreConcept.phases.map(p => `&bull; <strong>${p.phase}</strong> (${p.tools}): ${p.desc} `).join('')}
  </div>

  <h3 style="font-family:'Outfit', sans-serif; font-size:12pt; margin-bottom:8px; color:#0f172a;">📚 The 8 Power Words Reference</h3>
  <div class="card-grid-2">
    ${slidesData[4].vocabularyList.map(v => `
      <div class="vocab-item no-break">
        <div class="vocab-item-top">
          <span class="vocab-name">${escapeHtml(v.term)}</span>
          <span class="vocab-tag">${escapeHtml(v.tag)}</span>
        </div>
        <p class="vocab-desc">${escapeHtml(v.desc)}</p>
        <div><code>${escapeHtml(v.command)}</code></div>
        <div class="vocab-tip">💡 Pro Tip: ${escapeHtml(v.proTip)}</div>
      </div>
    `).join('')}
  </div>

  <!-- ================= CHAPTER 6 ================= -->
  <div class="page-break"></div>
  <div class="section-header">
    <div class="section-header-left">
      <h2>Chapter 6: Passing The Torch! (The Grand Handoff)</h2>
      <p>Member 1 Master Summary &bull; Member 2 Live Demo Preview</p>
    </div>
    <span class="slide-badge-pill">Slide 6 of 7</span>
  </div>

  <div class="handoff-banner no-break">
    <h3>🎤 Member 1's Live Presentation Quote</h3>
    <p>${escapeHtml(slidesData[5].quote)}</p>
  </div>

  <h3 style="font-family:'Outfit', sans-serif; font-size:12pt; margin-bottom:8px; color:#0f172a;">👑 Member 1's 4 Golden Rules</h3>
  <div class="card-grid-2">
    ${slidesData[5].coreConcept.fourRules.map(r => `
      <div class="info-card accent no-break">
        <h4>Rule ${r.num}: ${escapeHtml(r.title)}</h4>
        <p>${escapeHtml(r.desc)}</p>
      </div>
    `).join('')}
  </div>

  <h3 style="font-family:'Outfit', sans-serif; font-size:12pt; margin-top:12px; margin-bottom:8px; color:#0f172a;">🎯 What Member 2 is About to Show You Live</h3>
  <div class="info-card success no-break" style="margin-bottom: 12px;">
    <ul style="padding-left: 18px; font-size: 9pt; color: #15803d; line-height: 1.6;">
      ${slidesData[5].coreConcept.member2Teaser.points.map(pt => `<li><strong>${escapeHtml(pt)}</strong></li>`).join('')}
    </ul>
  </div>

  <div class="terminal-box no-break">
    <div class="terminal-titlebar">
      <div class="terminal-dots"><span class="dot dot-red"></span><span class="dot dot-yellow"></span><span class="dot dot-green"></span></div>
      <span class="terminal-title">Terminal &bull; First-Time Global Git Setup</span>
    </div>
    <div class="terminal-body">${escapeHtml(slidesData[5].terminalSection.codeSnippet)}</div>
  </div>

  <!-- ================= CHAPTER 7 ================= -->
  <div class="page-break"></div>
  <div class="section-header">
    <div class="section-header-left">
      <h2>Chapter 7: Grand Pop Quiz Arena</h2>
      <p>The Complete 6-Topic Mastery Knowledge Bank &amp; Solutions</p>
    </div>
    <span class="slide-badge-pill">Slide 7 of 7</span>
  </div>

  ${slidesData.slice(0, 6).map((s, idx) => `
    <div class="quiz-card no-break">
      <div class="quiz-header">
        <span class="quiz-badge">Question ${idx + 1} of 6</span>
        <span class="quiz-topic">${escapeHtml(s.title)} &bull; ${escapeHtml(s.category)}</span>
      </div>
      <div class="quiz-question">${escapeHtml(s.popQuiz.question)}</div>
      <div class="quiz-options-list">
        ${s.popQuiz.options.map((opt, oIdx) => `
          <div class="quiz-opt ${oIdx === s.popQuiz.correctIndex ? 'correct' : ''}">
            <strong>${String.fromCharCode(65 + oIdx)}.</strong> ${escapeHtml(opt)}
            ${oIdx === s.popQuiz.correctIndex ? ' <em>(Correct ✓)</em>' : ''}
          </div>
        `).join('')}
      </div>
      <div class="quiz-explanation">
        <strong>💡 Key Conceptual Takeaway:</strong> ${escapeHtml(s.popQuiz.explanation)}
      </div>
    </div>
  `).join('')}

  <!-- ================= AUDIENCE Q&A ================= -->
  <div class="page-break"></div>
  <div class="section-header">
    <div class="section-header-left">
      <h2>Appendix: Audience Q&amp;A Cheat Sheet</h2>
      <p>The Top 6 Real-World Questions Asked by Student Developers</p>
    </div>
    <span class="slide-badge-pill">Master Cheat Sheet</span>
  </div>

  ${qaItems.map(item => `
    <div class="qa-box no-break">
      <div class="qa-q">${item.q}</div>
      <div class="qa-a">${item.a}</div>
    </div>
  `).join('')}

  <div class="pro-tip-banner no-break" style="margin-top: 20px;">
    <strong>🎉 End of Member 1 Presentation Handbook:</strong>
    <p>You now possess the complete theoretical and practical fundamentals of Git and GitHub. Keep this handbook as your reference guide throughout your student software engineering journey!</p>
  </div>

</body>
</html>`;
}

async function main() {
  const htmlContent = buildHtml();
  const htmlPath = path.join(__dirname, 'presentation_handbook.html');
  const pdfPath = path.join(__dirname, 'Git_and_GitHub_Fundamentals_Member_1.pdf');

  fs.writeFileSync(htmlPath, htmlContent, 'utf8');
  console.log(`✓ HTML generated at: ${htmlPath}`);

  const edgePaths = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
  ];

  let edgeExecutable = edgePaths.find(p => fs.existsSync(p));
  if (!edgeExecutable) {
    throw new Error('Microsoft Edge executable not found on system.');
  }

  console.log(`✓ Using Edge at: ${edgeExecutable}`);
  console.log(`⏳ Converting HTML to PDF...`);

  // Run Edge headless print-to-pdf
  const cmd = `"${edgeExecutable}" --headless --disable-gpu --run-all-compositor-stages-before-draw --no-pdf-header-footer --print-to-pdf="${pdfPath}" "${htmlPath}"`;
  execSync(cmd, { stdio: 'inherit' });

  if (fs.existsSync(pdfPath)) {
    const stats = fs.statSync(pdfPath);
    console.log(`🎉 PDF generated successfully!`);
    console.log(`📁 Path: ${pdfPath}`);
    console.log(`📊 Size: ${(stats.size / 1024).toFixed(1)} KB`);
  } else {
    throw new Error('PDF file was not created.');
  }
}

main().catch(err => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
