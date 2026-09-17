// Comprehensive presentation data extracted & enhanced for Git & GitHub Fundamentals
// Tailored for Member 1 of the student presentation team

export const slidesData = [
  {
    id: 'intro',
    number: 1,
    category: 'Introduction & Hook',
    title: 'Git & GitHub Fundamentals',
    subtitle: "A Beginner's Guide for Student Developers",
    presenterRole: 'Presented by Member 1 (The Foundation)',
    hook: {
      question: 'Have you ever saved files like this?',
      files: [
        'project1.py',
        'project_final.py',
        'project_REAL_final.py',
        'project_FINAL_FOR_MOM.py',
        'really_final_v4_PLEASE_WORK.zip'
      ],
      caption: 'It gets super messy super fast. Git and GitHub were created to eliminate this exact nightmare forever.'
    },
    coreConcept: {
      headline: 'The Problem: Unversioned Code Chaos',
      description: 'Without version control, every edit is a gamble. One accidental delete, bad copy-paste, or midnight refactor can destroy weeks of hard work with zero recovery path.',
      fourCatastrophes: [
        {
          icon: '🧠',
          title: 'The "Which One Worked?" Amnesia',
          desc: 'Was `final_v2.py` the one with working login, or was that `final_REAL.py`? Nobody remembers 48 hours later.'
        },
        {
          icon: '💥',
          title: 'The Group Partner Collision',
          desc: 'Teammates emailing zip files over WhatsApp or Discord. Partner A overwrites Partner B\'s 500 lines without knowing.'
        },
        {
          icon: '☕',
          title: 'The Hardware & Coffee Disaster',
          desc: 'A spilled drink or crashed SSD the night before submission means your entire semester project vanishes into thin air.'
        },
        {
          icon: '🕵️',
          title: 'The "It Worked Yesterday" Mystery',
          desc: 'Your code broke at 3:00 AM. You have no idea which line changed or who touched it because there is zero history.'
        }
      ]
    },
    terminalSection: {
      headline: 'The Solution: Cryptographic History Snapshots',
      explanation: 'Instead of creating 50 renamed files, Git tracks your project inside a single clean folder. Every checkpoint has a unique SHA hash ID, author name, and timestamp.',
      codeSnippet: `# The Old Chaotic Way:
# project_final_really_final_v3.zip  <-- GPA Hazard!

# The Professional Git Way:
$ git log --oneline
a1c4e92 feat: complete user authentication and jwt tokens
8f2b311 fix: resolve crash when submitting empty cart form
3d7e540 docs: update api schema and readme instructions
019a8bc feat: initialize database models and express server`,
      commands: [
        { cmd: 'git log --oneline', desc: 'Display a clean, one-line timeline of every checkpoint saved in your project.' },
        { cmd: 'git status', desc: 'Inspect exactly which files have been modified, created, or staged for saving.' }
      ]
    },
    proTips: {
      goldenRule: 'Treat your codebase like a professional time-lapse. Never make duplicate "backup" folders on your desktop!',
      studentWarStory: 'Hackathon 2024: A team emailed a zip file at 11:58 PM. The submission form closed while it was uploading. With Git + GitHub, one \`git push\` takes 1.2 seconds.',
      pitfall: 'Anti-pattern: Naming branches or folders \`test_final_done\`. Use clear version control practices instead.'
    },
    popQuiz: {
      question: 'Why is keeping multiple zip backups like "project_final_v2.zip" dangerous for teams?',
      options: [
        'Zip files take up too much RAM on modern laptops',
        'You cannot tell what changed, and teammates easily overwrite each other\'s work',
        'Python and JavaScript compilers refuse to read unzipped files',
        'GitHub charges a $5 fee for every zip file on your desktop'
      ],
      correctIndex: 1,
      explanation: 'Zip files are black boxes! You have no line-by-line diff, no attribution of who wrote what, and manual merging is prone to disastrous file overwrites.'
    },
    humorTag: '🚨 GPA Hazard: 98% of students have an "old_backup_v2_final" folder on their desktop right now',
    keyTakeaway: 'No more confusing zip files or ruined code. We track history like professionals.',
    speakerNotes: [
      '🎤 "Hello everyone! Welcome to our Git & GitHub presentation."',
      '🎤 "Let\'s start with a quick show of hands: How many of you have a desktop folder named \`final_final_v2_FINAL.py\`? [Pause for audience laughter & nods]."',
      '🎤 "We laugh because we have all suffered through it: emailing zip files over WhatsApp, losing code at 2:00 AM, or having a partner overwrite 400 lines."',
      '🎤 "Today, I (Member 1) am going to lay down the rock-solid foundation: WHAT Git is, WHAT GitHub is, how they differ, and the 8 magic words you will use every day, before Member 2 takes over to show you live terminal action!"'
    ],
    interactiveActions: [
      { id: 'chaos-add-file', label: '➕ Spawn "final_v99.py"', icon: 'file-plus', hint: 'Add even more chaotic files to the 3D void' },
      { id: 'chaos-panic', label: '🚨 Panic Mode', icon: 'zap', hint: 'Simulate file explosion chaos' },
      { id: 'chaos-order', label: '✨ Enter Git Order', icon: 'shield-check', hint: 'Singularity organizes the chaos into a clean Git tree' }
    ]
  },
  {
    id: 'what-is-git',
    number: 2,
    category: 'Core Tool #1',
    title: '1. What is Git?',
    subtitle: 'The "Undo" Button & Developer Time Machine',
    presenterRole: 'Member 1: Local Machine Master',
    definition: 'Git is a free, open-source Distributed Version Control System (DVCS) installed directly on your local computer. It tracks every single character modification across your entire codebase over time.',
    coreConcept: {
      headline: 'The 3 Superpowers of Git',
      threeSuperpowers: [
        {
          icon: '⏱️',
          title: 'Pixel-Perfect Change Tracking',
          desc: 'Git records who made changes, exactly which lines were added or deleted, and when. You never have to guess what broke your build.'
        },
        {
          icon: '🧪',
          title: 'Fearless Experimentation',
          desc: 'Create an isolated parallel branch to test a crazy new algorithm or library. If it fails, delete the branch with zero impact on your working code.'
        },
        {
          icon: '⏳',
          title: 'Instant Time Travel (True Undo)',
          desc: 'Made a catastrophic mistake? Git lets you revert a single file or your entire repository back to any previous commit in milliseconds.'
        }
      ],
      architectureHeadline: 'The 3 States of Git (How Git Works Under the Hood)',
      architectureSteps: [
        {
          step: '1. Working Directory',
          tag: 'Untracked / Modified',
          desc: 'Your actual project files where you write code, edit CSS, and test in your browser.',
          badge: 'Local Workspace'
        },
        {
          step: '2. Staging Area (Index)',
          tag: 'git add <file>',
          desc: 'The preparation stage. Like lining up people for a group photograph before taking the snapshot.',
          badge: 'Photo Lineup'
        },
        {
          step: '3. Local Git Repository',
          tag: 'git commit -m "..."',
          desc: 'The permanent record. The snapshot is stamped into the `.git` database with a cryptographic SHA hash.',
          badge: 'Permanent Vault'
        }
      ]
    },
    terminalSection: {
      headline: 'The Essential Local Git Workflow',
      explanation: 'Every local Git workflow follows this predictable, reliable 4-step loop:',
      codeSnippet: `# 1. Initialize a new local Git repository
$ git init
Initialized empty Git repository in /workspace/my-app/.git/

# 2. Check repository status
$ git status
Untracked files:
  (use "git add <file>..." to include in what will be committed)
        index.html
        app.js

# 3. Stage changes for the snapshot
$ git add .

# 4. Save permanent snapshot with a clear message
$ git commit -m "feat: setup initial navbar and responsive grid layout"
[main (root-commit) 4e82b19] feat: setup initial navbar and responsive grid layout
 2 files changed, 142 insertions(+)`,
      commands: [
        { cmd: 'git init', desc: 'Creates the hidden `.git` folder that holds your local repository database.' },
        { cmd: 'git status', desc: 'Shows modified files, staged files, and untracked files in your working directory.' },
        { cmd: 'git add .', desc: 'Stages all new and modified files into the preparation index for the next commit.' },
        { cmd: 'git commit -m "msg"', desc: 'Permanently records the staged changes as a new commit node in history.' },
        { cmd: 'git restore <file>', desc: 'Discards local changes in working directory, reverting back to the last commit.' }
      ]
    },
    proTips: {
      goldenRule: 'Make atomic commits! A commit should represent one logical unit of work (e.g., "Add login form validation") rather than 10 unrelated changes.',
      studentWarStory: 'Mid-Hackathon 3:00 AM: An accidental regex replaced 40 files with gibberish. With Git, running \`git restore .\` restored all 40 files in 0.04 seconds. Crisis averted.',
      pitfall: 'Never commit \`node_modules\`, \`dist/\`, \`.env\` (with secret API keys!), or \`.DS_Store\`. Always create a \`.gitignore\` file first!'
    },
    popQuiz: {
      question: 'Do you need an active internet connection to create commits and inspect history with Git?',
      options: [
        'Yes, Git must ping GitHub servers on every commit',
        'No, Git runs 100% locally on your computer with zero internet required',
        'Only if your project contains more than 50 files',
        'Yes, because commit hashes are generated by AWS cloud servers'
      ],
      correctIndex: 1,
      explanation: 'Git is 100% distributed and local! The entire history and database live directly inside your local `.git` directory. You can code on a plane or during a campus Wi-Fi outage.'
    },
    humorTag: '🕹️ Like having infinite CTRL+Z across sessions, with a photographic memory and an undo tree',
    keyTakeaway: 'Git runs 100% locally on your computer. No internet required to save history!',
    speakerNotes: [
      '🎤 "Rule number one to engrave in your mind: Git lives right on your machine."',
      '🎤 "Even if campus Wi-Fi drops dead in the middle of a hackathon, Git is faithfully tracking every line."',
      '🎤 "Notice the three states: Working Directory, Staging Area, and Commit. Think of the Staging Area as posing for a photo, and the Commit as snapping the picture!"',
      '🎤 "If something breaks at 3:00 AM, you are never trapped. Git lets you warp backward through time in one command."'
    ],
    interactiveActions: [
      { id: 'git-smash-undo', label: '🎮 Smash CTRL+Z / Undo', icon: 'history', hint: 'Press the 3D Arcade Button to trigger instant rewind' },
      { id: 'git-warp-timeline', label: '⏳ Warp Timeline', icon: 'fast-forward', hint: 'Scrub through past commit nodes on the 3D timeline' }
    ]
  },
  {
    id: 'what-is-github',
    number: 3,
    category: 'Cloud Platform #2',
    title: '2. What is GitHub?',
    subtitle: 'The Cloud Castle & Developer Social Network',
    presenterRole: 'Member 1: The Cloud Dimension',
    definition: 'GitHub is a cloud-based hosting platform built for software developers. It hosts your remote Git repositories online, providing team collaboration tools, issue tracking, automated CI/CD pipelines, and your public engineering portfolio.',
    coreConcept: {
      headline: 'Why GitHub is Essential for Student Developers',
      studentBenefits: [
        {
          icon: '🛡️',
          title: 'Unbreakable Cloud Backup',
          desc: 'Your code is securely stored across worldwide data centers. Stolen laptop, broken SSD, or coffee spill? Run \`git clone\` on any machine and resume working in 60 seconds.'
        },
        {
          icon: '🤝',
          title: 'Frictionless Team Collaboration',
          desc: 'Multiple developers work simultaneously on different branches. GitHub handles Pull Requests, inline code review discussions, and merges without stepping on toes.'
        },
        {
          icon: '💼',
          title: 'Your Living Developer Resume',
          desc: 'Tech recruiters value a link to your GitHub profile more than an inflated resume. It shows real proof that you write clean code, write documentation, and contribute.'
        },
        {
          icon: '🚀',
          title: 'Free Hosting with GitHub Pages',
          desc: 'You can host your portfolio websites, documentation, and web apps directly from a repository for free under \`<username>.github.io\`.'
        }
      ],
      studentSuperpack: {
        title: '🎓 The GitHub Student Developer Pack',
        benefits: 'As a verified student, you get free GitHub Copilot (AI pair programmer), free domains, cloud credits on Azure & DigitalOcean, and premium developer tools valued at over $200,000!'
      }
    },
    terminalSection: {
      headline: 'Connecting Local Git to Cloud GitHub',
      explanation: 'Once your local repository is initialized, connecting it to GitHub takes three simple terminal commands:',
      codeSnippet: `# 1. Link your local repository to your remote GitHub repository URL
$ git remote add origin https://github.com/student-dev/cool-project.git

# 2. Rename your default branch to 'main'
$ git branch -M main

# 3. Push your local commits up to GitHub (with upstream tracking)
$ git push -u origin main
Enumerating objects: 15, done.
Counting objects: 100% (15/15), done.
Compressing objects: 100% (12/12), done.
Writing objects: 100% (15/15), 4.2 KiB | 2.1 MiB/s, done.
To https://github.com/student-dev/cool-project.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.`,
      commands: [
        { cmd: 'git remote -v', desc: 'List all connected remote cloud repository URLs (origin).' },
        { cmd: 'git push origin main', desc: 'Upload your local commits up to GitHub remote repository.' },
        { cmd: 'git pull origin main', desc: 'Download updates pushed by teammates from GitHub to your laptop.' },
        { cmd: 'git clone <url>', desc: 'Download a complete remote repository with full history to your laptop.' }
      ]
    },
    proTips: {
      goldenRule: 'Make your GitHub README shine! A project with a great README, screenshots, and setup instructions stands out 10x more to hiring managers than raw code alone.',
      studentWarStory: 'A student was asked in a Google interview: "Show me a project you built." Instead of describing it, they pulled up their GitHub repo with clean commit messages and live GitHub Pages demo. They got the internship.',
      pitfall: 'Never push private \`.env\` files or API secrets (OpenAI keys, Stripe tokens) to a public GitHub repo. Bots scrape GitHub within seconds!'
    },
    popQuiz: {
      question: 'Can you use Git without having a GitHub account?',
      options: [
        'No, Git requires a verified GitHub username and token to function',
        'Yes! Git is completely standalone and can be used 100% offline without GitHub',
        'Only on Linux operating systems',
        'Yes, but only for up to 30 days before licensing expires'
      ],
      correctIndex: 1,
      explanation: 'Yes! Git is an independent open-source tool created in 2005. GitHub came along in 2008 as a cloud platform to host Git repositories. You can use Git entirely on its own!'
    },
    humorTag: '💼 Tech recruiters love vibrant green commit squares more than a 4.0 GPA',
    keyTakeaway: 'Git is the camera; GitHub is where you back up and showcase the album.',
    speakerNotes: [
      '🎤 "Now, do not confuse Git with GitHub! GitHub is the cloud platform."',
      '🎤 "If your laptop takes a swim in coffee the night before your submission deadline, GitHub saves your semester."',
      '🎤 "Plus, as students, your GitHub profile is your living portfolio. Recruiters can see your commits, your code cleanliness, and how you collaborate."',
      '🎤 "And don\'t forget to claim your free GitHub Student Developer Pack with free GitHub Copilot and cloud credits!"'
    ],
    interactiveActions: [
      { id: 'cloud-beam', label: '☁️ Beam Code to Cloud', icon: 'upload-cloud', hint: 'Send glowing commit blocks up to the 3D cloud' },
      { id: 'cloud-coffee', label: '☕ Laptop Coffee Disaster', icon: 'alert-triangle', hint: 'Laptop dies, but Cloud keeps files 100% safe!' }
    ]
  },
  {
    id: 'git-vs-github',
    number: 4,
    category: 'The Great Comparison',
    title: '3. Git vs. GitHub (The Difference)',
    subtitle: 'The Ultimate Camera vs. Instagram Analogy',
    presenterRole: 'Member 1: Analogy Specialist',
    analogyIntro: 'It is easy for beginners to confuse them, but just remember this simple comparison matrix & mental models:',
    coreConcept: {
      headline: 'The 5 Key Differences At A Glance',
      comparisonMatrix: [
        {
          feature: 'Where it runs',
          git: 'Locally on your computer / laptop',
          github: 'On cloud servers in the cloud (web)',
          badge: 'Environment'
        },
        {
          feature: 'Internet needed?',
          git: 'No. 100% offline functionality',
          github: 'Yes. Requires internet connection',
          badge: 'Connectivity'
        },
        {
          feature: 'Interface',
          git: 'Command Line (CLI) & terminal / IDE plugins',
          github: 'Sleek web browser interface & API',
          badge: 'UI / UX'
        },
        {
          feature: 'Primary purpose',
          git: 'Track file changes, diffs & timeline snapshots',
          github: 'Team sharing, cloud backup & code reviews',
          badge: 'Core Role'
        },
        {
          feature: 'Created by',
          git: 'Linus Torvalds (creator of Linux, 2005)',
          github: 'Founded in 2008 (acquired by Microsoft 2018)',
          badge: 'Origin'
        }
      ],
      fourAnalogies: [
        {
          title: 'The Camera vs. Instagram',
          gitDesc: '📷 The Camera: Takes photos locally on your SD card.',
          githubDesc: '📸 Instagram: The social platform where you upload and share the photos.'
        },
        {
          title: 'Single-Player Save vs. Multiplayer Lobby',
          gitDesc: '💾 Offline Save Slot: Saves your progress on your local hard drive.',
          githubDesc: '🌐 Multiplayer Server: Cloud lobby where you team up with friends.'
        },
        {
          title: 'Kitchen Cooking vs. Restaurant Dining',
          gitDesc: '🍳 The Kitchen: Where you chop vegetables and prepare the recipe.',
          githubDesc: '🍽️ The Restaurant: Where you plate the dish and serve it to customers.'
        },
        {
          title: 'Private Journal vs. Public Library',
          gitDesc: '📝 Personal Notebook: You jot down your private thoughts and notes.',
          githubDesc: '📚 Public Library: Where books are published for the world to discover.'
        }
      ]
    },
    terminalSection: {
      headline: 'Seeing the Difference in Terminal Commands',
      explanation: 'Notice how local commands talk to Git, while network commands talk to GitHub:',
      codeSnippet: `# LOCAL GIT COMMANDS (No internet required):
$ git init                    # Git creates local repo
$ git add main.py             # Git stages file locally
$ git commit -m "add login"   # Git creates local commit node
$ git log --oneline           # Git queries local .git database
$ git diff                    # Git compares lines on disk

# CLOUD GITHUB COMMANDS (Internet required):
$ git push origin main        # Transmits commits up to GitHub
$ git pull origin main        # Downloads teammates' commits from GitHub
$ git clone <url>             # Downloads a GitHub repository to local drive`,
      commands: [
        { cmd: 'git commit', desc: 'Purely local: Takes a snapshot on your computer. Does NOT upload anything.' },
        { cmd: 'git push', desc: 'Network action: Sends your local commits up to GitHub.' }
      ]
    },
    proTips: {
      goldenRule: 'Remember: Committing is NOT pushing! When you \`git commit\`, your work is safely recorded locally, but your teammates cannot see it until you \`git push\`.',
      studentWarStory: 'Exam Project submission: A student ran \`git commit\` at 11:50 PM, thought it was submitted, but forgot to run \`git push\`. The professor saw an empty repo. Always verify on GitHub.com!',
      pitfall: 'Don\'t think you are safe just by committing locally. If your hard drive crashes before you \`git push\`, your commits die with the laptop!'
    },
    popQuiz: {
      question: 'Which of the following statements is 100% TRUE?',
      options: [
        'Running "git commit" automatically uploads your code to GitHub.com',
        'You can have Git installed on your laptop without ever creating a GitHub account',
        'Git was invented by Microsoft when they bought GitHub in 2018',
        'GitHub cannot host projects unless they are written in JavaScript'
      ],
      correctIndex: 1,
      explanation: 'Spot on! Git is an open-source tool you can use offline forever without a GitHub account. \`git commit\` only saves locally; you must run \`git push\` to upload to GitHub.'
    },
    humorTag: '📸 You wouldn\'t confuse your Nikon camera with Instagram, right?',
    keyTakeaway: 'Git captures the moments; GitHub shares them with the world.',
    speakerNotes: [
      '🎤 "If you remember ONE slide from my entire presentation today, remember this one!"',
      '🎤 "Git is the camera in your hand. GitHub is Instagram where you post those photos."',
      '🎤 "You can use a camera all day in a forest with zero internet and take beautiful snapshots. But Instagram is just a website waiting for your photos!"',
      '🎤 "Also remember: When you type \`git commit\`, you have only taken the photo. You haven\'t uploaded it until you type \`git push\`!"'
    ],
    interactiveActions: [
      { id: 'snap-photo', label: '📸 Snap Code Photo (Flash!)', icon: 'camera', hint: 'Camera fires bright flash & spits 3D polaroid' },
      { id: 'like-feed', label: '❤️ Like & Star Repo', icon: 'heart', hint: 'Spawn floating hearts and GitHub stars in 3D' }
    ]
  },
  {
    id: 'vocabulary',
    number: 5,
    category: 'Essential Vocabulary',
    title: '4. Essential Vocabulary',
    subtitle: 'The 8 Magic Git Spells for Teamwork',
    presenterRole: 'Member 1: The Codex Keeper',
    intro: 'You will hear these 8 terms constantly in software engineering, hackathons, and tech interviews:',
    vocabularyList: [
      {
        term: 'Repository (Repo)',
        code: 'repo / .git',
        tag: 'The Vault',
        desc: 'Your project folder containing all code files, assets, and full cryptographic revision history.',
        actionKey: 'vocab-repo',
        command: 'git init',
        proTip: 'A repo can be local on your machine or remote on GitHub.'
      },
      {
        term: 'Commit',
        code: 'git commit -m "..."',
        tag: 'The Snapshot',
        desc: 'A permanent checkpoint of your project at an exact moment, tagged with a unique 40-character SHA hash.',
        actionKey: 'vocab-commit',
        command: 'git commit -m "feat: login form"',
        proTip: 'Write commit messages in present imperative tense ("Add feature", not "Added feature").'
      },
      {
        term: 'Push',
        code: 'git push',
        tag: 'The Rocket',
        desc: 'Uploading committed changes from your local repository up to a remote repository on GitHub.',
        actionKey: 'vocab-push',
        command: 'git push origin main',
        proTip: 'Always test that your code compiles before pushing to a shared branch.'
      },
      {
        term: 'Pull',
        code: 'git pull',
        tag: 'The Tractor Beam',
        desc: 'Downloading and integrating new updates from GitHub down into your local working directory.',
        actionKey: 'vocab-pull',
        command: 'git pull origin main',
        proTip: 'Run \`git pull\` every morning before you begin typing code to prevent merge conflicts!'
      },
      {
        term: 'Clone',
        code: 'git clone <url>',
        tag: 'The Duplicator',
        desc: 'Downloading an exact replica of an existing remote repository onto your computer for the first time.',
        actionKey: 'vocab-clone',
        command: 'git clone https://github.com/...',
        proTip: 'You only clone ONCE. Afterward, you use \`git pull\` to fetch updates.'
      },
      {
        term: 'Branch',
        code: 'git branch / checkout',
        tag: 'Parallel Universe',
        desc: 'An isolated line of development. Build a feature safely without risking the stability of \`main\`.',
        actionKey: 'vocab-branch',
        command: 'git checkout -b feature-chat',
        proTip: 'Never code directly on the \`main\` branch in a team project!'
      },
      {
        term: 'Fork',
        code: 'GitHub Fork Button',
        tag: 'The Copycat',
        desc: 'Creating your own personal copy of someone else\'s GitHub repository under your own account to freely modify.',
        actionKey: 'vocab-fork',
        command: 'Fork via GitHub Web UI',
        proTip: 'Open-source contributions always start by forking the original repository.'
      },
      {
        term: 'Pull Request (PR)',
        code: 'PR / Code Review',
        tag: 'The Peace Treaty',
        desc: 'A proposal asking repository maintainers to review your branch changes and merge them into the main project.',
        actionKey: 'vocab-pr',
        command: 'Open via GitHub Web UI',
        proTip: 'PRs allow teammates to inspect code diffs and leave comments before anything breaks production.'
      }
    ],
    coreConcept: {
      headline: 'The Teamwork Lifecycle in 3 Phases',
      phases: [
        {
          phase: 'Phase A: Project Setup',
          tools: 'Clone or Fork',
          desc: 'Get the code onto your local machine with full history.'
        },
        {
          phase: 'Phase B: Daily Feature Work',
          tools: 'Branch ➡️ Add ➡️ Commit',
          desc: 'Isolate your feature, stage atomic changes, and create checkpoints.'
        },
        {
          phase: 'Phase C: Collaboration & Release',
          tools: 'Pull ➡️ Push ➡️ Pull Request',
          desc: 'Stay in sync with teammates and submit code for peer review.'
        }
      ]
    },
    terminalSection: {
      headline: 'Quick Command Cheat Sheet',
      explanation: 'The 6 commands you will type every single day as a developer:',
      codeSnippet: `# The Standard Daily Developer Cycle:
$ git pull origin main          # 1. Start day: get teammates' latest code
$ git checkout -b feature-auth  # 2. Create your isolated feature branch
# ... write code, fix bugs ...
$ git add .                     # 3. Stage your modified files
$ git commit -m "feat: auth"    # 4. Save your checkpoint
$ git push origin feature-auth  # 5. Push branch to GitHub
# 6. Go to GitHub and click "Open Pull Request"!`,
      commands: [
        { cmd: 'git pull origin main', desc: 'Syncs latest team code to your local machine.' },
        { cmd: 'git checkout -b <name>', desc: 'Creates and switches to a brand new isolated branch.' },
        { cmd: 'git branch -a', desc: 'Lists all local and remote branches in the project.' },
        { cmd: 'git merge <branch>', desc: 'Merges another branch into your current active branch.' }
      ]
    },
    proTips: {
      goldenRule: 'Golden Rule of Teamwork: Never commit directly to \`main\`! Always create a feature branch (\`git checkout -b my-feature\`) and merge through a Pull Request.',
      studentWarStory: 'In a 4-person software engineering capstone, everyone worked on \`main\`. At 10:00 PM before demo day, 14 conflicting commits corrupted the repo. Branching prevents 100% of this.',
      pitfall: 'Don\'t run \`git clone\` every day to get updates! Once cloned, simply run \`git pull\`.'
    },
    popQuiz: {
      question: 'Which command do you use to download updates to an existing project on your laptop?',
      options: [
        'git clone',
        'git pull',
        'git fork',
        'git push'
      ],
      correctIndex: 1,
      explanation: 'Use \`git pull\`! \`git clone\` is only used once to download a project initially. For everyday updates, \`git pull\` pulls down the newest commits.'
    },
    humorTag: '🧙‍♂️ Once you master these 8 words, you speak senior developer fluent!',
    keyTakeaway: 'Click any vocabulary word to activate its live 3D demonstration in the lab!',
    speakerNotes: [
      '🎤 "Here are the 8 fundamental magic spells of Git and GitHub."',
      '🎤 "Notice terms like Repo, Commit, Push, Pull, Branch, Fork, and Pull Request."',
      '🎤 "Remember the daily cycle: Pull first so you have the latest updates, create a branch for your feature, commit your work, push your branch, and open a Pull Request."',
      '🎤 "Now that you have the mental model and vocabulary down, it is time for live action!"'
    ],
    interactiveActions: [
      { id: 'vocab-rocket', label: '🚀 Rocket Push', icon: 'send', hint: 'Launch code box into orbit with fiery exhaust' },
      { id: 'vocab-fork-demo', label: '🍴 Golden Fork', icon: 'utensils', hint: 'Grab a repo with a giant glowing fork' },
      { id: 'vocab-pr-stamp', label: '✅ PR Approved!', icon: 'check-circle-2', hint: 'Stamp PR with green approval badge & confetti' }
    ]
  },
  {
    id: 'handoff',
    number: 6,
    category: 'Grand Finale & Handoff',
    title: 'Passing The Torch! 🎤',
    subtitle: 'Member 1 Wrap-up ➡️ Member 2 Spotlight',
    presenterRole: 'Member 1: The Grand Handoff',
    quote: '"Now, I\'ll pass it over to the next member to show you exactly how we use these in action!"',
    coreConcept: {
      headline: "Member 1's Master Summary: The 4 Golden Rules",
      fourRules: [
        {
          num: '01',
          title: 'Git is Local, GitHub is Cloud',
          desc: 'Git tracks your version history offline on your laptop; GitHub is where you back up, share, and collaborate.'
        },
        {
          num: '02',
          title: 'Commit Early, Commit Often',
          desc: 'Save small, atomic commits with clear messages instead of giant monolithic dumps at midnight.'
        },
        {
          num: '03',
          title: 'Branch Before You Break',
          desc: 'Keep \`main\` production-ready. Always develop features and experiments on dedicated feature branches.'
        },
        {
          num: '04',
          title: 'Pull Before You Push',
          desc: 'Always fetch your teammates\' updates before pushing yours to minimize merge conflict headaches.'
        }
      ],
      member2Teaser: {
        title: '🎯 What Member 2 is About to Show You Live:',
        points: [
          '⚡ Live Terminal Demo: Initializing a repository from scratch',
          '🌿 Branching in real-time: Switching contexts with zero downtime',
          '🥊 Resolving a Merge Conflict live on screen without panic',
          '🚀 Submitting and merging a real Pull Request on GitHub'
        ]
      }
    },
    terminalSection: {
      headline: 'The Ready-for-Action Terminal Starter',
      explanation: 'These are the initial configuration commands every developer sets up once on a new computer:',
      codeSnippet: `# One-time global configuration on your computer:
$ git config --global user.name "Your Name"
$ git config --global user.email "student@university.edu"
$ git config --global init.defaultBranch main

# Verify your configuration:
$ git config --list --show-origin`,
      commands: [
        { cmd: 'git config --global user.name "..."', desc: 'Sets the author name associated with all your future commits.' },
        { cmd: 'git config --global user.email "..."', desc: 'Sets your email (use your GitHub registered email to get green squares!).' }
      ]
    },
    proTips: {
      goldenRule: 'Setup your GitHub email in Git config! If your local Git email matches your GitHub account, all your commits will be attributed to your profile with green squares.',
      studentWarStory: 'A student made 200 commits for an open-source project, but their Git email was configured as \`user@localhost\`. None showed on their GitHub profile until they reconfigured their config. Do it on day one!',
      pitfall: 'Don\'t panic when you see your first merge conflict! Member 2 will demonstrate how simple they actually are to resolve.'
    },
    popQuiz: {
      question: 'Which of the following describes the most professional Git workflow?',
      options: [
        'Commit everything directly to main at 3:00 AM without testing',
        'Create a feature branch, make atomic commits, test, push, and open a Pull Request',
        'Email zip files to your team lead and let them merge files manually',
        'Delete the .git folder whenever something breaks and start fresh'
      ],
      correctIndex: 1,
      explanation: 'Feature branches + atomic commits + Pull Requests are the universal gold standard in modern professional software engineering worldwide!'
    },
    humorTag: '🔥 Member 1 survived without a single merge conflict!',
    keyTakeaway: 'Sit back, grab popcorn, and watch Member 2 demonstrate Git in live action!',
    speakerNotes: [
      '🎤 "And that brings us to the conclusion of the core fundamentals!"',
      '🎤 "You now have the complete mental model: WHY we use Git to kill unversioned file chaos, HOW Git operates locally as a time machine, HOW GitHub backs up and showcases your portfolio in the cloud, and the 8 vocabulary words that run the tech industry."',
      '🎤 "Now, I\'ll pass it over to the next member to show you exactly how we use these in live terminal action! [Click the big Pass The Mic button and take a bow!]"'
    ],
    interactiveActions: [
      { id: 'handoff-mic', label: '🎉 PASS THE MIC TO MEMBER 2!', icon: 'mic', hint: 'Drumroll, Spotlight sweep, Confetti & Fanfare!' },
      { id: 'handoff-confetti', label: '🎊 More Confetti!', icon: 'sparkles', hint: 'Celebrate a flawless presentation' }
    ]
  },
  {
    id: 'pop-quiz-arena',
    number: 7,
    category: 'Interactive Arena',
    title: '🎯 Grand Pop Quiz Arena',
    subtitle: 'Test Your Mastery Across All 6 Git & GitHub Topics!',
    presenterRole: 'Interactive Class Knowledge Check',
    humorTag: '🏆 100% Score = Free Coffee & Immunity from Merge Conflicts!',
    keyTakeaway: 'Mastering these 6 concepts turns you from a code beginner into a confident engineer!',
    interactiveActions: [
      { id: 'quiz-confetti', label: '🎉 Confetti Celebration', hint: 'Celebrate correct answers!' },
      { id: 'quiz-applause', label: '👏 Audience Cheer', hint: 'Play applause sound effect' },
      { id: 'quiz-reset-all', label: '↺ Reset All Scores', hint: 'Start fresh from Question 1' }
    ],
    speakerNotes: [
      '🎤 "Welcome to the Grand Pop Quiz Arena! This is our dedicated whole-page challenge to test your Git & GitHub mastery."',
      '🎤 "We have 6 interactive questions covering every single topic from today\'s presentation."',
      '🎤 "Ask the audience or take a show of hands for options A, B, C, or D."',
      '🎤 "Click an option to see instant explanation, score counter, and celebratory confetti!"'
    ]
  }
];
