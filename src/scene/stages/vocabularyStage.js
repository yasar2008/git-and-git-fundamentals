import * as THREE from 'three';
import { soundFX } from '../../audio/soundEffects.js';
import confetti from 'canvas-confetti';

export class VocabularyStage {
  constructor() {
    this.group = new THREE.Group();
    this.currentActor = 'vocab-repo';
    this.actors = {};
    this.plinth = null;
    this.plinthRing = null;
    this.init();
  }

  createPRStampTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 640;
    const ctx = canvas.getContext('2d');

    // GitHub PR Document
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 512, 640);

    // Document header
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(40, 40, 432, 60);

    ctx.font = 'bold 24px monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('PR #42: Feature -> Main', 60, 80);

    // Code lines
    ctx.fillStyle = '#cbd5e1';
    for (let i = 0; i < 8; i++) {
      ctx.fillRect(50, 140 + i * 35, 200 + (i % 3) * 100, 16);
    }

    // Huge Green APPROVED Stamp with border
    ctx.save();
    ctx.translate(256, 450);
    ctx.rotate(-0.2);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 12;
    ctx.strokeRect(-170, -50, 340, 100);
    ctx.font = '900 52px sans-serif';
    ctx.fillStyle = '#10b981';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('APPROVED ✅', 0, 0);
    ctx.restore();

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    return texture;
  }

  init() {
    // Holographic Base Plinth
    const plinthGeo = new THREE.CylinderGeometry(1.55, 1.85, 0.45, 32);
    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.9,
      roughness: 0.15
    });
    this.plinth = new THREE.Mesh(plinthGeo, plinthMat);
    this.plinth.position.set(0, -1.6, 0);
    this.group.add(this.plinth);

    // Glowing rim
    const rimGeo = new THREE.TorusGeometry(1.58, 0.04, 16, 64);
    const rimMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    this.plinthRing = new THREE.Mesh(rimGeo, rimMat);
    this.plinthRing.rotation.x = Math.PI / 2;
    this.plinthRing.position.y = 0.23;
    this.plinth.add(this.plinthRing);

    // Build Props for each vocabulary term
    this.buildRepoActor();
    this.buildCommitActor();
    this.buildPushRocketActor();
    this.buildPullTractorActor();
    this.buildCloneDuplicatorActor();
    this.buildBranchActor();
    this.buildGoldenForkActor();
    this.buildPRActor();

    this.showActor('vocab-repo');
  }

  // 1. REPO: Futuristic Glowing Vault Box
  buildRepoActor() {
    const group = new THREE.Group();
    const boxGeo = new THREE.BoxGeometry(1.4, 1.4, 1.4);
    const boxMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.85,
      roughness: 0.2
    });
    const box = new THREE.Mesh(boxGeo, boxMat);
    group.add(box);

    // Glowing wireframe
    const edgeGeo = new THREE.EdgesGeometry(boxGeo);
    const edgeMat = new THREE.LineBasicMaterial({ color: 0x06b6d4, linewidth: 2 });
    const wire = new THREE.LineSegments(edgeGeo, edgeMat);
    group.add(wire);

    // Front Vault Wheel
    const wheelGeo = new THREE.TorusGeometry(0.38, 0.06, 16, 32);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.95, roughness: 0.15 });
    const wheel = new THREE.Mesh(wheelGeo, wheelMat);
    wheel.position.z = 0.73;
    group.add(wheel);

    // Cross bars on wheel
    for (let c = 0; c < 3; c++) {
      const barGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.8, 8);
      const bar = new THREE.Mesh(barGeo, wheelMat);
      bar.rotation.z = (c * Math.PI) / 3;
      bar.position.z = 0.73;
      group.add(bar);
    }

    group.position.set(0, 0, 0);
    this.actors['vocab-repo'] = {
      group,
      update: (delta, time) => {
        wheel.rotation.z += delta * 1.8;
        group.rotation.y += delta * 0.5;
      }
    };
    this.group.add(group);
  }

  // 2. COMMIT: Snapshot Camera Prism
  buildCommitActor() {
    const group = new THREE.Group();
    const prismGeo = new THREE.OctahedronGeometry(1.05, 0);
    const prismMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.6,
      roughness: 0.1,
      metalness: 0.85
    });
    const prism = new THREE.Mesh(prismGeo, prismMat);
    group.add(prism);

    const ringGeo = new THREE.RingGeometry(1.35, 1.45, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    group.add(ring);

    group.position.set(0, 0, 0);
    this.actors['vocab-commit'] = {
      group,
      update: (delta, time) => {
        prism.rotation.x += delta * 1.3;
        prism.rotation.y += delta * 1.6;
        ring.rotation.z -= delta * 1.2;
        group.position.y = Math.sin(time * 2) * 0.12;
      }
    };
    this.group.add(group);
  }

  // 3. PUSH: Sleek 3D Rocket
  buildPushRocketActor() {
    const group = new THREE.Group();

    const bodyGeo = new THREE.CylinderGeometry(0.35, 0.45, 1.6, 24);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.6 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    group.add(body);

    const noseGeo = new THREE.ConeGeometry(0.35, 0.8, 24);
    const noseMat = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.4 });
    const nose = new THREE.Mesh(noseGeo, noseMat);
    nose.position.y = 1.2;
    group.add(nose);

    // Thruster flame
    const fireGeo = new THREE.ConeGeometry(0.32, 0.8, 16);
    const fireMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const fire = new THREE.Mesh(fireGeo, fireMat);
    fire.rotation.x = Math.PI;
    fire.position.y = -1.2;
    group.add(fire);

    group.position.set(0, 0, 0);
    this.actors['vocab-push'] = {
      group,
      fire,
      launching: false,
      launchY: 0,
      update: (delta, time) => {
        if (this.actors['vocab-push'].launching) {
          this.actors['vocab-push'].launchY += delta * 7;
          group.position.y = this.actors['vocab-push'].launchY;
          fire.scale.set(1 + Math.sin(time * 35) * 0.4, 1 + Math.cos(time * 35) * 0.5, 1);
          if (this.actors['vocab-push'].launchY > 9) {
            this.actors['vocab-push'].launchY = -3.5;
          }
        } else {
          group.position.y = Math.sin(time * 2) * 0.15;
          group.rotation.y += delta * 0.8;
          fire.scale.set(1 + Math.sin(time * 20) * 0.15, 1 + Math.cos(time * 20) * 0.15, 1);
        }
      }
    };
    this.group.add(group);
  }

  // 4. PULL: Tractor Beam
  buildPullTractorActor() {
    const group = new THREE.Group();

    const beamGeo = new THREE.ConeGeometry(1.4, 2.6, 32, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide
    });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.y = 0.5;
    group.add(beam);

    const crateGeo = new THREE.BoxGeometry(0.65, 0.65, 0.65);
    const crateMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      roughness: 0.2
    });
    const crate = new THREE.Mesh(crateGeo, crateMat);
    group.add(crate);

    group.position.set(0, 0, 0);
    this.actors['vocab-pull'] = {
      group,
      update: (delta, time) => {
        beam.rotation.y += delta * 1.5;
        const progress = (time * 0.8) % 1;
        crate.position.y = 1.4 - progress * 2.2;
        crate.rotation.y += delta * 2;
      }
    };
    this.group.add(group);
  }

  // 5. CLONE: Duplicator Chambers
  buildCloneDuplicatorActor() {
    const group = new THREE.Group();

    [-0.95, 0.95].forEach((x, idx) => {
      const padGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.12, 24);
      const padMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 });
      const pad = new THREE.Mesh(padGeo, padMat);
      pad.position.set(x, -0.6, 0);
      group.add(pad);

      const cubeGeo = new THREE.BoxGeometry(0.55, 0.55, 0.55);
      const cubeMat = new THREE.MeshStandardMaterial({
        color: idx === 0 ? 0x3b82f6 : 0x8b5cf6,
        emissive: idx === 0 ? 0x2563eb : 0x7c3aed,
        emissiveIntensity: 0.5
      });
      const cube = new THREE.Mesh(cubeGeo, cubeMat);
      cube.position.set(x, 0.1, 0);
      group.add(cube);
    });

    group.position.set(0, 0, 0);
    this.actors['vocab-clone'] = {
      group,
      update: (delta, time) => {
        group.rotation.y += delta * 0.4;
      }
    };
    this.group.add(group);
  }

  // 6. BRANCH: Parallel Dimension Timeline
  buildBranchActor() {
    const group = new THREE.Group();

    const trunkGeo = new THREE.CylinderGeometry(0.06, 0.06, 2.6, 16);
    const trunkMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.rotation.z = Math.PI / 2;
    trunk.position.set(0, -0.4, 0);
    group.add(trunk);

    const branchGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.8, 16);
    const branchMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const branch = new THREE.Mesh(branchGeo, branchMat);
    branch.rotation.z = Math.PI / 3;
    branch.position.set(0.2, 0.4, 0);
    group.add(branch);

    const n1 = new THREE.Mesh(new THREE.SphereGeometry(0.18), new THREE.MeshBasicMaterial({ color: 0x10b981 }));
    n1.position.set(-1.0, -0.4, 0);
    group.add(n1);

    const n2 = new THREE.Mesh(new THREE.SphereGeometry(0.18), new THREE.MeshBasicMaterial({ color: 0x06b6d4 }));
    n2.position.set(0.65, 0.9, 0);
    group.add(n2);

    group.position.set(0, 0, 0);
    this.actors['vocab-branch'] = {
      group,
      update: (delta, time) => {
        group.rotation.y = Math.sin(time * 1.5) * 0.25;
      }
    };
    this.group.add(group);
  }

  // 7. FORK: Giant Golden Fork
  buildGoldenForkActor() {
    const group = new THREE.Group();

    const handleGeo = new THREE.CylinderGeometry(0.06, 0.08, 1.8, 16);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.95,
      roughness: 0.15
    });
    const handle = new THREE.Mesh(handleGeo, goldMat);
    group.add(handle);

    const tineBaseGeo = new THREE.BoxGeometry(0.55, 0.1, 0.08);
    const tineBase = new THREE.Mesh(tineBaseGeo, goldMat);
    tineBase.position.y = 0.95;
    group.add(tineBase);

    for (let t = -0.22; t <= 0.23; t += 0.14) {
      const tineGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.65, 8);
      const tine = new THREE.Mesh(tineGeo, goldMat);
      tine.position.set(t, 1.35, 0);
      group.add(tine);
    }

    const codeBlockGeo = new THREE.BoxGeometry(0.55, 0.55, 0.55);
    const codeBlockMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      emissive: 0x6d28d9,
      roughness: 0.3
    });
    const codeBlock = new THREE.Mesh(codeBlockGeo, codeBlockMat);
    codeBlock.position.set(0, 1.5, 0);
    group.add(codeBlock);

    group.position.set(0, -0.4, 0);
    this.actors['vocab-fork'] = {
      group,
      update: (delta, time) => {
        group.rotation.y += delta * 1.3;
        group.position.y = -0.4 + Math.sin(time * 2.5) * 0.18;
      }
    };
    this.group.add(group);
  }

  // 8. PR: Rubber Stamp of Approval with Canvas Texture
  buildPRActor() {
    const group = new THREE.Group();

    const paperGeo = new THREE.PlaneGeometry(1.3, 1.6);
    const paperMat = new THREE.MeshBasicMaterial({
      map: this.createPRStampTexture(),
      side: THREE.DoubleSide
    });
    const paper = new THREE.Mesh(paperGeo, paperMat);
    paper.position.set(0, 0, 0);
    group.add(paper);

    const stampHandleGeo = new THREE.CylinderGeometry(0.12, 0.16, 0.7, 16);
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f });
    const stampHandle = new THREE.Mesh(stampHandleGeo, woodMat);
    stampHandle.position.set(0, 1.2, 0.4);
    group.add(stampHandle);

    const stampHeadGeo = new THREE.BoxGeometry(0.8, 0.2, 0.5);
    const rubberMat = new THREE.MeshStandardMaterial({ color: 0x10b981 });
    const stampHead = new THREE.Mesh(stampHeadGeo, rubberMat);
    stampHead.position.set(0, 0.8, 0.4);
    group.add(stampHead);

    group.position.set(0, 0, 0);
    this.actors['vocab-pr'] = {
      group,
      stampHandle,
      stampHead,
      stamping: false,
      update: (delta, time) => {
        group.rotation.y = Math.sin(time * 1.5) * 0.15;
      }
    };
    this.group.add(group);
  }

  showActor(actorId) {
    this.currentActor = actorId;
    Object.keys(this.actors).forEach((key) => {
      this.actors[key].group.visible = (key === actorId);
    });

    if (actorId === 'vocab-clone') soundFX.playClone();
    else if (actorId === 'vocab-branch') soundFX.playBranch();
    else if (actorId === 'vocab-pull') soundFX.playTractorBeam();
    else soundFX.playClick();
  }

  triggerRocketLaunch() {
    soundFX.playRocket();
    this.showActor('vocab-push');
    const pushActor = this.actors['vocab-push'];
    pushActor.launching = true;
    pushActor.launchY = 0;
    setTimeout(() => {
      pushActor.launching = false;
      pushActor.group.position.set(0, 0, 0);
    }, 2500);
  }

  triggerPRStamp() {
    this.showActor('vocab-pr');
    soundFX.playStamp();

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    const prActor = this.actors['vocab-pr'];
    prActor.stampHandle.position.z = 0.1;
    prActor.stampHead.position.z = 0.1;

    setTimeout(() => {
      prActor.stampHandle.position.z = 0.4;
      prActor.stampHead.position.z = 0.4;
    }, 380);
  }

  reset() {
    this.showActor('vocab-repo');
  }

  update(delta, time) {
    if (this.actors[this.currentActor]) {
      this.actors[this.currentActor].update(delta, time);
    }
  }
}
