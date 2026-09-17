import * as THREE from 'three';
import { soundFX } from '../../audio/soundEffects.js';

export class TimeMachineStage {
  constructor() {
    this.group = new THREE.Group();
    this.buttonMesh = null;
    this.buttonBase = null;
    this.timelineNodes = [];
    this.shockwaveRings = [];
    this.vortexParticles = null;
    this.isPressed = false;
    this.undoActive = false;
    this.currentCommitIndex = 4;
    this.buttonVelocity = 0;
    this.buttonTargetY = 0.22;
    this.fluxRings = [];

    this.init();
  }

  createLabelTexture(text, color = '#38bdf8', bg = '#0f172a') {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = bg;
    ctx.roundRect ? ctx.roundRect(4, 4, 248, 56, 12) : ctx.fillRect(4, 4, 248, 56);
    ctx.fill();

    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.roundRect ? ctx.roundRect(4, 4, 248, 56, 12) : ctx.strokeRect(4, 4, 248, 56);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 128, 32);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    return texture;
  }

  init() {
    // 1. Futuristic Sci-Fi Console Pedestal
    const pedestalGeo = new THREE.CylinderGeometry(1.6, 2.0, 0.6, 32);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x0b1329,
      metalness: 0.9,
      roughness: 0.15
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.set(0, -1.6, 0);
    this.group.add(pedestal);

    // Glowing rim ring on pedestal
    const rimGeo = new THREE.TorusGeometry(1.65, 0.05, 16, 64);
    const rimMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.3;
    pedestal.add(rim);

    // 2. The Giant Tactile Arcade "CTRL+Z / UNDO" Button
    const btnBaseGeo = new THREE.CylinderGeometry(0.85, 0.95, 0.35, 32);
    const btnBaseMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.9,
      roughness: 0.1
    });
    this.buttonBase = new THREE.Mesh(btnBaseGeo, btnBaseMat);
    this.buttonBase.position.set(0, -1.15, 0);
    this.group.add(this.buttonBase);

    const btnCapGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.38, 32);
    const btnCapMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0xe11d48,
      emissiveIntensity: 0.5,
      roughness: 0.15,
      metalness: 0.4
    });
    this.buttonMesh = new THREE.Mesh(btnCapGeo, btnCapMat);
    this.buttonMesh.position.set(0, 0.22, 0);
    this.buttonBase.add(this.buttonMesh);

    // Glowing icon / symbol on button cap
    const symbolGeo = new THREE.RingGeometry(0.22, 0.38, 32, 1, 0, Math.PI * 1.6);
    const symbolMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const symbol = new THREE.Mesh(symbolGeo, symbolMat);
    symbol.rotation.x = -Math.PI / 2;
    symbol.position.y = 0.2;
    this.buttonMesh.add(symbol);

    // 3. Shockwave Rings (radiates on smash)
    for (let s = 0; s < 3; s++) {
      const shockGeo = new THREE.RingGeometry(0.8, 0.95, 32);
      const shockMat = new THREE.MeshBasicMaterial({
        color: 0xf43f5e,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0
      });
      const shock = new THREE.Mesh(shockGeo, shockMat);
      shock.rotation.x = -Math.PI / 2;
      shock.position.set(0, -1.1, 0);
      this.shockwaveRings.push(shock);
      this.group.add(shock);
    }

    // 4. 3D Glowing Timeline Track (Horizontal Curve)
    const curvePoints = [];
    for (let i = 0; i < 5; i++) {
      const x = (i - 2) * 1.35;
      const y = 0.5 + Math.sin(i * 0.8) * 0.25;
      const z = -0.5 - Math.cos(i * 0.8) * 0.4;
      curvePoints.push(new THREE.Vector3(x, y, z));
    }

    const curve = new THREE.CatmullRomCurve3(curvePoints);
    const tubeGeo = new THREE.TubeGeometry(curve, 48, 0.045, 12, false);
    const tubeMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.8 });
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    this.group.add(tube);

    // Commit Nodes on the timeline
    const commitLabels = ['v1.0 Init', 'v1.1 Working', 'v1.2 Nice Auth', 'v1.3 Bug Occurred!', 'v1.4 Total Chaos 💀'];
    curvePoints.forEach((pt, i) => {
      const nodeGeo = new THREE.SphereGeometry(0.2, 24, 24);
      const isBad = i >= 3;
      const color = isBad ? 0xef4444 : 0x10b981;
      const nodeMat = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.6,
        roughness: 0.2
      });
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.copy(pt);
      node.userData = {
        origY: pt.y,
        label: commitLabels[i],
        index: i,
        isActive: i === 4
      };

      // Outer glowing halo ring
      const ringGeo = new THREE.RingGeometry(0.26, 0.32, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      node.add(ring);

      // 3D Floating commit tag
      const tagMat = new THREE.MeshBasicMaterial({
        map: this.createLabelTexture(commitLabels[i], isBad ? '#ef4444' : '#10b981'),
        transparent: true,
        side: THREE.DoubleSide
      });
      const tagGeo = new THREE.PlaneGeometry(1.2, 0.3);
      const tagMesh = new THREE.Mesh(tagGeo, tagMat);
      tagMesh.position.set(0, 0.45, 0);
      node.add(tagMesh);

      this.timelineNodes.push(node);
      this.group.add(node);
    });

    // 5. Time Vortex Swirling Particle Rings
    const particleCount = 220;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 6;
      const radius = 0.8 + (i / particleCount) * 1.8;
      const x = Math.cos(angle) * radius;
      const y = (i / particleCount) * 2.8 - 0.9;
      const z = Math.sin(angle) * radius;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      colors[i * 3] = 0.1 + 0.8 * (i / particleCount);
      colors[i * 3 + 1] = 0.8 - 0.4 * (i / particleCount);
      colors[i * 3 + 2] = 1.0;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.9
    });

    this.vortexParticles = new THREE.Points(particleGeo, particleMat);
    this.group.add(this.vortexParticles);
  }

  pressUndoButton() {
    this.isPressed = true;
    this.undoActive = true;
    soundFX.playUndo();

    // Button squash physics
    this.buttonTargetY = 0.03;
    if (this.buttonMesh) {
      this.buttonMesh.material.emissiveIntensity = 1.6;
    }

    // Fire expanding shockwaves
    this.shockwaveRings.forEach((shock, idx) => {
      setTimeout(() => {
        shock.scale.set(0.2, 0.2, 0.2);
        shock.material.opacity = 0.9;
      }, idx * 60);
    });

    // Rewind commit node pointer backwards
    this.currentCommitIndex = (this.currentCommitIndex - 1 + this.timelineNodes.length) % this.timelineNodes.length;

    this.timelineNodes.forEach((node, i) => {
      const active = i === this.currentCommitIndex;
      node.scale.set(active ? 1.6 : 1.0, active ? 1.6 : 1.0, active ? 1.6 : 1.0);
      node.material.emissiveIntensity = active ? 1.2 : 0.4;
    });

    // Bounce button back up
    setTimeout(() => {
      this.buttonTargetY = 0.22;
      if (this.buttonMesh) {
        this.buttonMesh.material.emissiveIntensity = 0.5;
      }
      this.isPressed = false;
      this.undoActive = false;
    }, 280);
  }

  warpTimeline() {
    soundFX.playWarp();
    this.timelineNodes.forEach((node, i) => {
      setTimeout(() => {
        node.scale.set(1.8, 1.8, 1.8);
        setTimeout(() => node.scale.set(1.0, 1.0, 1.0), 220);
      }, i * 80);
    });
  }

  reset() {
    this.currentCommitIndex = 4;
    this.timelineNodes.forEach((node, i) => {
      node.scale.set(1, 1, 1);
      node.material.emissiveIntensity = 0.6;
    });
  }

  update(delta, time) {
    // Smooth spring bounce for button
    if (this.buttonMesh) {
      this.buttonMesh.position.y += (this.buttonTargetY - this.buttonMesh.position.y) * delta * 15;
    }

    // Shockwave ring expansion
    this.shockwaveRings.forEach((shock) => {
      if (shock.material.opacity > 0.01) {
        shock.scale.addScalar(delta * 6);
        shock.material.opacity -= delta * 2.2;
      }
    });

    // Vortex particle rotation
    if (this.vortexParticles) {
      const rotSpeed = this.undoActive ? -delta * 5 : delta * 0.9;
      this.vortexParticles.rotation.y += rotSpeed;
    }

    // Gentle node bobbing
    this.timelineNodes.forEach((node, i) => {
      node.position.y = node.userData.origY + Math.sin(time * 3 + i) * 0.06;
    });
  }
}
