import * as THREE from 'three';
import { soundFX } from '../../audio/soundEffects.js';

export class CameraStage {
  constructor() {
    this.group = new THREE.Group();
    this.cameraGroup = null;
    this.lensMesh = null;
    this.shutterBtn = null;
    this.flashLight = null;
    this.flashQuad = null;
    this.galleryGroup = null;
    this.polaroids = [];
    this.ejectedPhotos = [];
    this.hearts = [];
    this.snapCounter = 0;

    this.init();
  }

  createPolaroidTexture(caption, likes = '342') {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 640;
    const ctx = canvas.getContext('2d');

    // Classic Polaroid White Board
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 512, 640);

    // Inner Code Snapshot Viewport
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(32, 32, 448, 448);

    // Terminal header dots inside photo
    ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(56, 56, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f59e0b'; ctx.beginPath(); ctx.arc(80, 56, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#10b981'; ctx.beginPath(); ctx.arc(104, 56, 8, 0, Math.PI * 2); ctx.fill();

    // Code lines simulation
    ctx.font = 'bold 22px monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('function createLegend() {', 50, 110);
    ctx.fillStyle = '#a855f7';
    ctx.fillText('  const git = "Camera 📷";', 70, 150);
    ctx.fillText('  const github = "Instagram 📸";', 70, 190);
    ctx.fillStyle = '#22c55e';
    ctx.fillText('  return { offline: true };', 70, 230);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('}', 50, 270);

    // Camera viewfinder crosshair watermark
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(180, 290, 150, 150);
    ctx.font = '28px sans-serif';
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('📷 SNAPSHOT', 190, 375);

    // Bottom Caption Area (Handwritten feel)
    ctx.font = 'bold 26px sans-serif';
    ctx.fillStyle = '#1e293b';
    ctx.fillText(caption, 40, 530);

    // Instagram Like & Star info
    ctx.font = 'bold 22px sans-serif';
    ctx.fillStyle = '#ec4899';
    ctx.fillText(`❤️ ${likes} likes  ⭐ 98 stars`, 40, 585);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    return texture;
  }

  init() {
    // 1. Retro 3D Camera (The "Git" Tool)
    this.cameraGroup = new THREE.Group();
    this.cameraGroup.position.set(-2.2, 0, 0);

    // Camera Body
    const bodyGeo = new THREE.BoxGeometry(1.65, 1.15, 0.75);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.6,
      metalness: 0.3
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    this.cameraGroup.add(body);

    // Brushed Silver Top Plate
    const topPlateGeo = new THREE.BoxGeometry(1.68, 0.22, 0.78);
    const silverMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.95,
      roughness: 0.12
    });
    const topPlate = new THREE.Mesh(topPlateGeo, silverMat);
    topPlate.position.set(0, 0.68, 0);
    this.cameraGroup.add(topPlate);

    // Mechanical Zoom Lens Barrel
    const lensGeo = new THREE.CylinderGeometry(0.44, 0.48, 0.65, 32);
    const lensMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.85,
      roughness: 0.25
    });
    this.lensMesh = new THREE.Mesh(lensGeo, lensMat);
    this.lensMesh.rotation.x = Math.PI / 2;
    this.lensMesh.position.set(0, 0, 0.58);
    this.cameraGroup.add(this.lensMesh);

    // Glass Optic lens
    const glassGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.06, 32);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transmission: 0.92,
      opacity: 1,
      roughness: 0.05,
      ior: 1.55
    });
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.rotation.x = Math.PI / 2;
    glass.position.set(0, 0, 0.92);
    this.cameraGroup.add(glass);

    // Shutter Button
    const shutterGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.16, 16);
    const shutterMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      metalness: 0.8,
      roughness: 0.2
    });
    this.shutterBtn = new THREE.Mesh(shutterGeo, shutterMat);
    this.shutterBtn.position.set(-0.52, 0.85, 0);
    this.cameraGroup.add(this.shutterBtn);

    // Flash Reflector & Bulb
    const flashReflGeo = new THREE.BoxGeometry(0.36, 0.26, 0.22);
    const flashRefl = new THREE.Mesh(flashReflGeo, silverMat);
    flashRefl.position.set(0.52, 0.85, 0.1);
    this.cameraGroup.add(flashRefl);

    this.flashLight = new THREE.PointLight(0xffffff, 0, 20);
    this.flashLight.position.set(0.52, 0.85, 0.35);
    this.cameraGroup.add(this.flashLight);

    // Glowing Flash screen burst plane
    const burstGeo = new THREE.PlaneGeometry(8, 8);
    const burstMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    });
    this.flashQuad = new THREE.Mesh(burstGeo, burstMat);
    this.flashQuad.position.set(0, 0, 1.2);
    this.cameraGroup.add(this.flashQuad);

    this.group.add(this.cameraGroup);

    // 2. Instagram Gallery Wall (The "GitHub" Cloud Feed)
    this.galleryGroup = new THREE.Group();
    this.galleryGroup.position.set(2.0, 0, 0);

    const initialPosts = [
      { y: 1.1, z: -0.4, rotZ: 0.08, caption: 'Commit #1: "Hello World"', likes: '248' },
      { y: 0.0, z: 0.2, rotZ: -0.06, caption: 'Commit #2: "Fixed CSS navbar"', likes: '512' },
      { y: -1.1, z: -0.2, rotZ: 0.06, caption: 'Commit #3: "Demo Ready! 🚀"', likes: '999+' }
    ];

    initialPosts.forEach((post) => {
      const polaroid = this.createPolaroidMesh(post.caption, post.likes);
      polaroid.position.set(0, post.y, post.z);
      polaroid.rotation.z = post.rotZ;
      polaroid.rotation.y = -0.35;
      this.polaroids.push(polaroid);
      this.galleryGroup.add(polaroid);
    });

    this.group.add(this.galleryGroup);
  }

  createPolaroidMesh(caption, likes = '999') {
    const group = new THREE.Group();
    const texture = this.createPolaroidTexture(caption, likes);

    const frameGeo = new THREE.BoxGeometry(1.25, 1.55, 0.03);
    const materials = [
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 }),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 }),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 }),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 }),
      new THREE.MeshStandardMaterial({ map: texture, roughness: 0.2 }),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 })
    ];
    const frame = new THREE.Mesh(frameGeo, materials);
    group.add(frame);

    return group;
  }

  snapPhoto() {
    this.snapCounter++;
    soundFX.playCameraShutter();

    // Shutter depression
    if (this.shutterBtn) {
      this.shutterBtn.position.y = 0.78;
      setTimeout(() => (this.shutterBtn.position.y = 0.85), 180);
    }

    // Lens extension snap
    if (this.lensMesh) {
      this.lensMesh.position.z = 0.72;
      setTimeout(() => (this.lensMesh.position.z = 0.58), 220);
    }

    // Flash Burst
    if (this.flashLight) {
      this.flashLight.intensity = 25;
      setTimeout(() => (this.flashLight.intensity = 0), 120);
    }
    if (this.flashQuad) {
      this.flashQuad.material.opacity = 0.95;
      setTimeout(() => (this.flashQuad.material.opacity = 0), 140);
    }

    // Eject new 3D Polaroid from camera
    const newPolaroid = this.createPolaroidMesh(`Commit #${this.snapCounter + 3}: "Live Snapshot"`, '1.4k');
    newPolaroid.position.copy(this.cameraGroup.position);
    newPolaroid.position.z += 0.9;
    newPolaroid.scale.set(0.25, 0.25, 0.25);

    newPolaroid.userData = {
      progress: 0,
      startPos: newPolaroid.position.clone(),
      targetPos: new THREE.Vector3(2.0, (Math.random() - 0.5) * 1.6, (Math.random() - 0.5) * 0.7)
    };

    this.ejectedPhotos.push(newPolaroid);
    this.group.add(newPolaroid);
  }

  likeFeed() {
    soundFX.playBoing();

    // Erupt floating neon hearts and golden stars
    for (let i = 0; i < 8; i++) {
      const isStar = i % 2 === 0;
      const geo = isStar ? new THREE.TetrahedronGeometry(0.14) : new THREE.DodecahedronGeometry(0.12, 1);
      const color = isStar ? 0xf59e0b : 0xf43f5e;
      const emissive = isStar ? 0xfbbf24 : 0xff0055;

      const mat = new THREE.MeshStandardMaterial({
        color: color,
        emissive: emissive,
        emissiveIntensity: 0.9
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        2.0 + (Math.random() - 0.5) * 1.6,
        (Math.random() - 0.5) * 1.4,
        (Math.random() - 0.5) * 0.6
      );
      mesh.userData = {
        vy: 1.6 + Math.random() * 1.4,
        vx: (Math.random() - 0.5) * 0.8,
        life: 1.2
      };
      this.hearts.push(mesh);
      this.group.add(mesh);
    }
  }

  reset() {
    this.ejectedPhotos.forEach((p) => this.group.remove(p));
    this.ejectedPhotos = [];
    this.hearts.forEach((h) => this.group.remove(h));
    this.hearts = [];
  }

  update(delta, time) {
    if (this.cameraGroup) {
      this.cameraGroup.rotation.y = 0.25 + Math.sin(time * 1.5) * 0.06;
      this.cameraGroup.position.y = Math.sin(time * 2) * 0.08;
    }

    if (this.galleryGroup) {
      this.galleryGroup.position.y = Math.sin(time * 1.8 + 1) * 0.08;
      this.polaroids.forEach((p, i) => {
        p.rotation.x = Math.sin(time * 2 + i) * 0.05;
      });
    }

    // Animate ejected photos flying into gallery
    for (let i = this.ejectedPhotos.length - 1; i >= 0; i--) {
      const p = this.ejectedPhotos[i];
      p.userData.progress += delta * 2.0;
      const t = Math.min(p.userData.progress, 1);

      p.position.lerpVectors(p.userData.startPos, p.userData.targetPos, t);
      p.scale.lerp(new THREE.Vector3(1, 1, 1), t);
      p.rotation.y = THREE.MathUtils.lerp(0, -0.35, t);

      if (t >= 1) {
        this.polaroids.push(p);
        this.ejectedPhotos.splice(i, 1);
      }
    }

    // Animate floating hearts and stars
    for (let i = this.hearts.length - 1; i >= 0; i--) {
      const h = this.hearts[i];
      h.position.y += h.userData.vy * delta;
      h.position.x += h.userData.vx * delta;
      h.rotation.x += delta * 4;
      h.rotation.y += delta * 4;
      h.userData.life -= delta * 1.1;
      h.scale.multiplyScalar(0.97);

      if (h.userData.life <= 0) {
        this.group.remove(h);
        this.hearts.splice(i, 1);
      }
    }
  }
}
