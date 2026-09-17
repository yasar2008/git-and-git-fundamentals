import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ChaosStage } from './stages/chaosStage.js';
import { TimeMachineStage } from './stages/timeMachineStage.js';
import { CloudStage } from './stages/cloudStage.js';
import { CameraStage } from './stages/cameraStage.js';
import { VocabularyStage } from './stages/vocabularyStage.js';
import { HandoffStage } from './stages/handoffStage.js';

export class SceneManager {
  constructor(canvasContainer) {
    this.container = canvasContainer;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.clock = new THREE.Clock();

    this.stages = {};
    this.currentStageIndex = 1;
    this.isFreeCamera = false;

    // Camera viewpoints for each slide (offset so 3D scene sits in the open right viewport area)
    this.cameraTargets = {
      1: { pos: new THREE.Vector3(-1.3, 0.4, 5.5), lookAt: new THREE.Vector3(0.35, 0, 0) },
      2: { pos: new THREE.Vector3(-1.3, 0.8, 4.8), lookAt: new THREE.Vector3(0.35, -0.2, 0) },
      3: { pos: new THREE.Vector3(-1.3, 1.2, 5.8), lookAt: new THREE.Vector3(0.35, 0.5, 0) },
      4: { pos: new THREE.Vector3(-1.3, 0.4, 5.2), lookAt: new THREE.Vector3(0.35, 0, 0) },
      5: { pos: new THREE.Vector3(-1.3, 0.6, 5.0), lookAt: new THREE.Vector3(0.35, -0.2, 0) },
      6: { pos: new THREE.Vector3(-1.3, 0.5, 5.6), lookAt: new THREE.Vector3(0.35, 0.2, 0) },
      7: { pos: new THREE.Vector3(-1.3, 0.5, 5.5), lookAt: new THREE.Vector3(0.35, 0.2, 0) }
    };

    this.camCurrentPos = new THREE.Vector3(-1.3, 0.4, 5.5);
    this.camCurrentLookAt = new THREE.Vector3(0.35, 0, 0);

    // Mouse parallax tracking
    this.mouseTarget = new THREE.Vector2(0, 0);
    this.mousePos = new THREE.Vector2(0, 0);

    this.backgroundParticles = null;
    this.cyberGrid = null;
    this.init();
  }

  init() {
    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x070b14, 0.038);

    // 2. Camera
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    this.camera.position.copy(this.camCurrentPos);
    this.camera.lookAt(this.camCurrentLookAt);

    // 3. WebGLRenderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.container.appendChild(this.renderer.domElement);

    // 4. OrbitControls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0.35, 0, 0);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxDistance = 15;
    this.controls.minDistance = 2;
    this.controls.enabled = false;

    // 5. Atmospheric Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    this.scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 2.2);
    dirLight1.position.set(5, 8, 5);
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x8b5cf6, 2.0);
    dirLight2.position.set(-5, -3, -3);
    this.scene.add(dirLight2);

    // 6. Cyber Grid Floor
    this.createCyberGrid();

    // 7. Cyber Particle Field
    this.createBackgroundParticles();

    // 8. Instantiate Stages
    this.stages[1] = new ChaosStage();
    this.stages[2] = new TimeMachineStage();
    this.stages[3] = new CloudStage();
    this.stages[4] = new CameraStage();
    this.stages[5] = new VocabularyStage();
    this.stages[6] = new HandoffStage();

    for (let i = 1; i <= 6; i++) {
      this.scene.add(this.stages[i].group);
      this.stages[i].group.visible = (i === 1);
    }

    // 9. Event Listeners
    window.addEventListener('resize', () => this.onWindowResize());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));

    // 10. Start Render Loop
    this.animate();
  }

  createCyberGrid() {
    const grid = new THREE.GridHelper(40, 50, 0x38bdf8, 0x1e293b);
    grid.position.y = -2.2;
    grid.material.opacity = 0.35;
    grid.material.transparent = true;
    this.cyberGrid = grid;
    this.scene.add(grid);
  }

  createBackgroundParticles() {
    const count = 450;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 35;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 22 - 2;

      col[i * 3] = 0.2 + Math.random() * 0.4;
      col[i * 3 + 1] = 0.6 + Math.random() * 0.4;
      col[i * 3 + 2] = 0.95;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.085,
      vertexColors: true,
      transparent: true,
      opacity: 0.65
    });

    this.backgroundParticles = new THREE.Points(geo, mat);
    this.scene.add(this.backgroundParticles);
  }

  onMouseMove(e) {
    this.mouseTarget.x = (e.clientX / window.innerWidth - 0.5) * 2;
    this.mouseTarget.y = (e.clientY / window.innerHeight - 0.5) * 2;
  }

  setSlide(slideIndex) {
    if (slideIndex < 1 || slideIndex > 7) return;
    this.currentStageIndex = slideIndex;

    const activeStage = slideIndex === 7 ? 6 : slideIndex;
    for (let i = 1; i <= 6; i++) {
      if (this.stages[i]) {
        this.stages[i].group.visible = (i === activeStage);
        if (i !== activeStage && typeof this.stages[i].reset === 'function') {
          this.stages[i].reset();
        }
      }
    }
  }

  setFreeCamera(enable) {
    this.isFreeCamera = enable;
    this.controls.enabled = enable;
    if (!enable) {
      const target = this.cameraTargets[this.currentStageIndex];
      if (target) {
        this.camCurrentPos.copy(target.pos);
        this.camCurrentLookAt.copy(target.lookAt);
      }
    }
  }

  onWindowResize() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  triggerStageAction(actionId) {
    const stage1 = this.stages[1];
    const stage2 = this.stages[2];
    const stage3 = this.stages[3];
    const stage4 = this.stages[4];
    const stage5 = this.stages[5];
    const stage6 = this.stages[6];

    switch (actionId) {
      // Stage 1
      case 'chaos-add-file':
        stage1.spawnExtraFile();
        break;
      case 'chaos-panic':
        stage1.triggerPanic();
        break;
      case 'chaos-order':
        stage1.triggerOrder();
        break;

      // Stage 2
      case 'git-smash-undo':
        stage2.pressUndoButton();
        break;
      case 'git-warp-timeline':
        stage2.warpTimeline();
        break;

      // Stage 3
      case 'cloud-beam':
        stage3.beamCode();
        break;
      case 'cloud-coffee':
        stage3.spillCoffee();
        break;

      // Stage 4
      case 'snap-photo':
        stage4.snapPhoto();
        break;
      case 'like-feed':
        stage4.likeFeed();
        break;

      // Stage 5
      case 'vocab-rocket':
      case 'vocab-push':
        stage5.triggerRocketLaunch();
        break;
      case 'vocab-fork-demo':
      case 'vocab-fork':
        stage5.showActor('vocab-fork');
        break;
      case 'vocab-pr-stamp':
      case 'vocab-pr':
        stage5.triggerPRStamp();
        break;
      case 'vocab-repo':
      case 'vocab-commit':
      case 'vocab-pull':
      case 'vocab-clone':
      case 'vocab-branch':
        stage5.showActor(actionId);
        break;

      // Stage 6
      case 'handoff-mic':
        stage6.passTheMic();
        break;
      case 'handoff-confetti':
      case 'quiz-confetti':
        stage6.fireConfetti();
        break;
      case 'quiz-applause':
        stage6.passTheMic();
        break;
      default:
        console.log('Action triggered:', actionId);
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    // Mouse parallax smoothing
    this.mousePos.lerp(this.mouseTarget, delta * 3.5);

    // Background particle drift & cyber grid wave
    if (this.backgroundParticles) {
      this.backgroundParticles.rotation.y = time * 0.025;
      this.backgroundParticles.rotation.x = Math.sin(time * 0.012) * 0.05;
    }
    if (this.cyberGrid) {
      this.cyberGrid.position.z = (time * 0.5) % 1.6;
    }

    // Update active stage
    const activeStage = this.stages[this.currentStageIndex];
    if (activeStage && typeof activeStage.update === 'function') {
      activeStage.update(delta, time);
    }

    // Camera smooth rail interpolation with parallax when NOT in free orbit mode
    if (!this.isFreeCamera) {
      const targetConfig = this.cameraTargets[this.currentStageIndex];
      if (targetConfig) {
        // Parallax offsets (subtle tilt)
        const pX = this.mousePos.x * 0.35;
        const pY = -this.mousePos.y * 0.25;

        const desiredPos = targetConfig.pos.clone().add(new THREE.Vector3(pX, pY, 0));
        const desiredLookAt = targetConfig.lookAt.clone().add(new THREE.Vector3(pX * 0.2, pY * 0.2, 0));

        this.camCurrentPos.lerp(desiredPos, delta * 3.2);
        this.camCurrentLookAt.lerp(desiredLookAt, delta * 3.2);

        this.camera.position.copy(this.camCurrentPos);
        this.camera.lookAt(this.camCurrentLookAt);
      }
    } else {
      this.controls.update();
    }

    this.renderer.render(this.scene, this.camera);
  }
}
