import * as THREE from 'three';
import { soundFX } from '../../audio/soundEffects.js';
import confetti from 'canvas-confetti';

export class HandoffStage {
  constructor() {
    this.group = new THREE.Group();
    this.micGroup = null;
    this.stagePlatform = null;
    this.spotlights = [];
    this.audioWaveRings = [];
    this.bannerMesh = null;
    this.sparkles = null;
    this.isPassing = false;
    this.passProgress = 0;

    this.init();
  }

  createBannerTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#0f172a';
    ctx.roundRect ? ctx.roundRect(4, 4, 504, 120, 20) : ctx.fillRect(4, 4, 504, 120);
    ctx.fill();

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    ctx.roundRect ? ctx.roundRect(4, 4, 504, 120, 20) : ctx.strokeRect(4, 4, 504, 120);
    ctx.stroke();

    ctx.font = 'bold 36px sans-serif';
    ctx.fillStyle = '#f59e0b';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🎤 MEMBER 2 SPOTLIGHT ➡️', 256, 64);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    return texture;
  }

  init() {
    // 1. Sleek Concentric Circular Stage Platform
    this.stagePlatform = new THREE.Group();
    this.stagePlatform.position.set(0, -1.8, 0);

    const baseGeo = new THREE.CylinderGeometry(2.4, 2.6, 0.4, 48);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      metalness: 0.9,
      roughness: 0.15
    });
    const base = new THREE.Mesh(baseGeo, baseMat);
    this.stagePlatform.add(base);

    // Glowing stage rings
    [1.8, 2.3].forEach((radius, i) => {
      const ringGeo = new THREE.TorusGeometry(radius, 0.045, 16, 64);
      const ringMat = new THREE.MeshBasicMaterial({ color: i === 0 ? 0x06b6d4 : 0x8b5cf6 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.21;
      this.stagePlatform.add(ring);
    });

    this.group.add(this.stagePlatform);

    // 2. The Golden Presentation Microphone
    this.micGroup = new THREE.Group();
    this.micGroup.position.set(0, 0, 0);

    // Mic Handle (Polished Gold)
    const handleGeo = new THREE.CylinderGeometry(0.12, 0.08, 1.1, 24);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.95,
      roughness: 0.12
    });
    const handle = new THREE.Mesh(handleGeo, goldMat);
    this.micGroup.add(handle);

    // Mic Grille (Silver mesh)
    const grilleGeo = new THREE.SphereGeometry(0.26, 24, 24);
    const grilleMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.9,
      roughness: 0.25
    });
    const grille = new THREE.Mesh(grilleGeo, grilleMat);
    grille.position.y = 0.7;
    this.micGroup.add(grille);

    // Glowing soundwave rings
    for (let r = 0; r < 4; r++) {
      const waveGeo = new THREE.RingGeometry(0.4 + r * 0.28, 0.45 + r * 0.28, 32);
      const waveMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.45 - r * 0.1
      });
      const wave = new THREE.Mesh(waveGeo, waveMat);
      wave.rotation.x = Math.PI / 2;
      wave.position.y = 0.7;
      this.audioWaveRings.push(wave);
      this.micGroup.add(wave);
    }

    // 3D Banner floating above mic
    const bannerGeo = new THREE.PlaneGeometry(2.4, 0.6);
    const bannerMat = new THREE.MeshBasicMaterial({
      map: this.createBannerTexture(),
      transparent: true,
      side: THREE.DoubleSide
    });
    this.bannerMesh = new THREE.Mesh(bannerGeo, bannerMat);
    this.bannerMesh.position.set(0, 2.0, 0);
    this.group.add(this.bannerMesh);

    // Golden Sparkles around mic
    const sparkCount = 60;
    const sparkGeo = new THREE.BufferGeometry();
    const sparkPos = new Float32Array(sparkCount * 3);
    for (let s = 0; s < sparkCount; s++) {
      const a = Math.random() * Math.PI * 2;
      const rad = 0.6 + Math.random() * 0.8;
      sparkPos[s * 3] = Math.cos(a) * rad;
      sparkPos[s * 3 + 1] = (Math.random() - 0.5) * 1.5 + 0.5;
      sparkPos[s * 3 + 2] = Math.sin(a) * rad;
    }
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
    const sparkMat = new THREE.PointsMaterial({
      color: 0xfbbf24,
      size: 0.08,
      transparent: true,
      opacity: 0.85
    });
    this.sparkles = new THREE.Points(sparkGeo, sparkMat);
    this.micGroup.add(this.sparkles);

    this.group.add(this.micGroup);

    // 3. Dynamic Sweeping Spotlights
    const spot1 = new THREE.SpotLight(0x06b6d4, 6, 14, Math.PI / 5, 0.35, 1);
    spot1.position.set(-3.5, 4.5, 3);
    spot1.target = this.micGroup;
    this.group.add(spot1);
    this.spotlights.push(spot1);

    const spot2 = new THREE.SpotLight(0xec4899, 6, 14, Math.PI / 5, 0.35, 1);
    spot2.position.set(3.5, 4.5, 3);
    spot2.target = this.micGroup;
    this.group.add(spot2);
    this.spotlights.push(spot2);
  }

  passTheMic() {
    this.isPassing = true;
    this.passProgress = 0;

    soundFX.playDrumroll();

    setTimeout(() => {
      soundFX.playFanfare();
      try {
        confetti({
          particleCount: 160,
          spread: 110,
          origin: { y: 0.5 }
        });
        setTimeout(() => {
          confetti({
            particleCount: 100,
            angle: 60,
            spread: 85,
            origin: { x: 0 }
          });
          confetti({
            particleCount: 100,
            angle: 120,
            spread: 85,
            origin: { x: 1 }
          });
        }, 300);
      } catch (e) {}
    }, 1200);

    setTimeout(() => {
      this.isPassing = false;
      this.micGroup.position.set(0, 0, 0);
      this.micGroup.rotation.set(0, 0, 0);
    }, 4500);
  }

  fireConfetti() {
    soundFX.playFanfare();
    try {
      confetti({
        particleCount: 140,
        spread: 95,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  }

  reset() {
    this.isPassing = false;
    this.passProgress = 0;
    this.micGroup.position.set(0, 0, 0);
    this.micGroup.rotation.set(0, 0, 0);
  }

  update(delta, time) {
    if (this.bannerMesh) {
      this.bannerMesh.position.y = 2.0 + Math.sin(time * 2) * 0.08;
    }

    if (this.sparkles) {
      this.sparkles.rotation.y += delta * 1.5;
    }

    if (!this.isPassing) {
      this.micGroup.position.y = Math.sin(time * 2.5) * 0.15;
      this.micGroup.rotation.y += delta * 0.8;
      this.micGroup.rotation.z = Math.sin(time * 2) * 0.08;
    } else {
      this.passProgress += delta * 0.65;
      const t = this.passProgress;
      this.micGroup.position.x = Math.sin(t * Math.PI) * 2.8;
      this.micGroup.position.y = Math.sin(t * Math.PI) * 2.0;
      this.micGroup.rotation.z += delta * 12;
      this.micGroup.rotation.y += delta * 8;
    }

    // Expanding soundwave rings
    this.audioWaveRings.forEach((ring, i) => {
      const scale = 1 + ((time * 1.4 + i * 0.25) % 1) * 0.8;
      ring.scale.set(scale, scale, scale);
      ring.material.opacity = Math.max(0, 0.5 - ((time * 1.4 + i * 0.25) % 1) * 0.5);
    });

    // Sweeping concert spotlights
    if (this.spotlights.length >= 2) {
      this.spotlights[0].position.x = -3.5 + Math.sin(time * 2.2) * 1.8;
      this.spotlights[1].position.x = 3.5 - Math.sin(time * 2.2) * 1.8;
    }
  }
}
