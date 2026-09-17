import * as THREE from 'three';
import { soundFX } from '../../audio/soundEffects.js';

export class CloudStage {
  constructor() {
    this.group = new THREE.Group();
    this.cloudIsland = null;
    this.orbitLaptops = [];
    this.dataPackets = [];
    this.shieldMesh = null;
    this.coffeeCup = null;
    this.coffeeSplashParticles = null;
    this.octocatHalo = null;
    this.isCoffeeDisaster = false;
    this.laserBeams = [];
    this.satelliteDish = null;

    this.init();
  }

  createRecruiterTag() {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 80;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#0f172a';
    ctx.roundRect ? ctx.roundRect(4, 4, 292, 72, 16) : ctx.fillRect(4, 4, 292, 72);
    ctx.fill();

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.roundRect ? ctx.roundRect(4, 4, 292, 72, 16) : ctx.strokeRect(4, 4, 292, 72);
    ctx.stroke();

    // 4 mini green squares
    ctx.fillStyle = '#10b981';
    for (let i = 0; i < 4; i++) {
      ctx.fillRect(18 + i * 22, 28, 16, 16);
    }

    ctx.font = 'bold 20px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('9999+ Commits', 120, 48);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    return texture;
  }

  init() {
    // 1. Stylized Floating Low-Poly Cloud Island
    this.cloudIsland = new THREE.Group();
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.15,
      metalness: 0.1,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.25
    });

    const puffGeometries = [
      { r: 1.15, x: 0, y: 0.2, z: 0 },
      { r: 0.9, x: 0.95, y: 0.1, z: 0.2 },
      { r: 0.85, x: -0.95, y: 0.1, z: -0.2 },
      { r: 0.8, x: 0.4, y: 0.65, z: -0.3 },
      { r: 0.75, x: -0.4, y: 0.55, z: 0.3 },
      { r: 0.7, x: 0.65, y: -0.2, z: -0.5 },
      { r: 0.7, x: -0.75, y: -0.1, z: 0.5 }
    ];

    puffGeometries.forEach((puff) => {
      const geo = new THREE.DodecahedronGeometry(puff.r, 2);
      const mesh = new THREE.Mesh(geo, cloudMat);
      mesh.position.set(puff.x, puff.y, puff.z);
      this.cloudIsland.add(mesh);
    });

    this.cloudIsland.position.set(0, 0.5, 0);
    this.group.add(this.cloudIsland);

    // 2. Spinning Satellite Dish on top of the cloud
    const dishGroup = new THREE.Group();
    const poleGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.8, 12);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8 });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.y = 0.4;
    dishGroup.add(pole);

    const bowlGeo = new THREE.SphereGeometry(0.35, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.4);
    const bowlMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, metalness: 0.9 });
    const bowl = new THREE.Mesh(bowlGeo, bowlMat);
    bowl.position.set(0, 0.8, 0);
    bowl.rotation.x = Math.PI * 0.75;
    dishGroup.add(bowl);

    dishGroup.position.set(0, 1.0, 0);
    this.satelliteDish = dishGroup;
    this.cloudIsland.add(dishGroup);

    // 3. Glowing Octocat Halo Rings
    const ringGeo = new THREE.TorusGeometry(1.65, 0.05, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.85 });
    this.octocatHalo = new THREE.Mesh(ringGeo, ringMat);
    this.octocatHalo.rotation.x = Math.PI / 2.5;
    this.octocatHalo.position.set(0, 0.7, 0);
    this.group.add(this.octocatHalo);

    // Recruiter Green Squares 3D badge
    const tagMat = new THREE.MeshBasicMaterial({ map: this.createRecruiterTag(), transparent: true, side: THREE.DoubleSide });
    const tagGeo = new THREE.PlaneGeometry(1.5, 0.4);
    const tagMesh = new THREE.Mesh(tagGeo, tagMat);
    tagMesh.position.set(0, 2.3, 0);
    this.cloudIsland.add(tagMesh);

    // 4. Cloud Energy Safe Shield (Forcefield)
    const shieldGeo = new THREE.SphereGeometry(2.1, 32, 24);
    const shieldMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      wireframe: true,
      transparent: true,
      opacity: 0.0
    });
    this.shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
    this.shieldMesh.position.set(0, 0.5, 0);
    this.group.add(this.shieldMesh);

    // 5. Orbiting Student Laptops (2 Laptops)
    const laptopConfigs = [
      { angle: 0, color: 0x06b6d4, label: 'Member 1 Laptop' },
      { angle: Math.PI, color: 0xec4899, label: 'Member 2 Laptop' }
    ];

    laptopConfigs.forEach((cfg) => {
      const laptopGroup = new THREE.Group();

      const baseGeo = new THREE.BoxGeometry(0.85, 0.06, 0.65);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 });
      const base = new THREE.Mesh(baseGeo, baseMat);
      laptopGroup.add(base);

      const screenGeo = new THREE.BoxGeometry(0.85, 0.58, 0.04);
      const screenMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
      const screen = new THREE.Mesh(screenGeo, screenMat);
      screen.position.set(0, 0.3, -0.3);
      screen.rotation.x = -0.28;
      laptopGroup.add(screen);

      const displayGeo = new THREE.PlaneGeometry(0.76, 0.5);
      const displayMat = new THREE.MeshBasicMaterial({ color: cfg.color });
      const display = new THREE.Mesh(displayGeo, displayMat);
      display.position.set(0, 0.3, -0.27);
      display.rotation.x = -0.28;
      laptopGroup.add(display);

      laptopGroup.userData = {
        angle: cfg.angle,
        radius: 2.85,
        displayMat: displayMat,
        origColor: cfg.color
      };

      this.orbitLaptops.push(laptopGroup);
      this.group.add(laptopGroup);
    });

    // 6. Floating Coffee Cup
    const cupGeo = new THREE.CylinderGeometry(0.2, 0.15, 0.38, 16);
    const cupMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3 });
    this.coffeeCup = new THREE.Mesh(cupGeo, cupMat);
    this.coffeeCup.position.set(2.8, -0.3, 0);
    this.group.add(this.coffeeCup);

    // Coffee splash particle system
    const splashCount = 40;
    const splashGeo = new THREE.BufferGeometry();
    const splashPos = new Float32Array(splashCount * 3);
    for (let s = 0; s < splashCount * 3; s++) splashPos[s] = 0;
    splashGeo.setAttribute('position', new THREE.BufferAttribute(splashPos, 3));
    const splashMat = new THREE.PointsMaterial({
      color: 0x78350f, // Deep coffee brown
      size: 0.12,
      transparent: true,
      opacity: 0
    });
    this.coffeeSplashParticles = new THREE.Points(splashGeo, splashMat);
    this.group.add(this.coffeeSplashParticles);
  }

  beamCode() {
    soundFX.playRocket();

    for (let i = 0; i < 8; i++) {
      const cubeGeo = new THREE.BoxGeometry(0.16, 0.16, 0.16);
      const cubeMat = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        emissive: 0x34d399,
        emissiveIntensity: 0.9
      });
      const cube = new THREE.Mesh(cubeGeo, cubeMat);

      const srcLaptop = this.orbitLaptops[0];
      cube.position.copy(srcLaptop.position);
      cube.userData = {
        progress: 0,
        speed: 1.5 + Math.random() * 0.7,
        startPos: srcLaptop.position.clone(),
        targetPos: new THREE.Vector3(0, 0.7 + (Math.random() - 0.5) * 0.4, 0)
      };

      this.dataPackets.push(cube);
      this.group.add(cube);
    }
  }

  spillCoffee() {
    this.isCoffeeDisaster = true;
    soundFX.playAlarm();

    // Tilt coffee cup over
    this.coffeeCup.position.set(2.4, 0.65, 0);
    this.coffeeCup.rotation.z = Math.PI * 0.65;

    // Trigger brown coffee splash particles
    if (this.coffeeSplashParticles) {
      const pos = this.coffeeSplashParticles.geometry.attributes.position.array;
      for (let i = 0; i < pos.length / 3; i++) {
        pos[i * 3] = 2.4 + (Math.random() - 0.5) * 0.8;
        pos[i * 3 + 1] = 0.5 + (Math.random() - 0.5) * 0.6;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
      }
      this.coffeeSplashParticles.geometry.attributes.position.needsUpdate = true;
      this.coffeeSplashParticles.material.opacity = 1.0;
    }

    // Laptop screen flashes red "DEAD"
    const victimLaptop = this.orbitLaptops[0];
    victimLaptop.userData.displayMat.color.setHex(0xff0000);

    // Forcefield shines bright green!
    if (this.shieldMesh) {
      this.shieldMesh.material.opacity = 0.85;
      this.shieldMesh.material.color.setHex(0x10b981);
    }

    setTimeout(() => {
      soundFX.playBootReady();
      if (this.shieldMesh) this.shieldMesh.material.opacity = 0.0;
      if (this.coffeeSplashParticles) this.coffeeSplashParticles.material.opacity = 0.0;
      this.coffeeCup.rotation.z = 0;
      this.coffeeCup.position.set(2.8, -0.3, 0);
      victimLaptop.userData.displayMat.color.setHex(victimLaptop.userData.origColor);
      this.isCoffeeDisaster = false;
    }, 3200);
  }

  reset() {
    this.isCoffeeDisaster = false;
    if (this.shieldMesh) this.shieldMesh.material.opacity = 0;
    if (this.coffeeSplashParticles) this.coffeeSplashParticles.material.opacity = 0;
    this.coffeeCup.rotation.z = 0;
    this.coffeeCup.position.set(2.8, -0.3, 0);
    this.orbitLaptops.forEach((l) => l.userData.displayMat.color.setHex(l.userData.origColor));
  }

  update(delta, time) {
    if (this.cloudIsland) {
      this.cloudIsland.position.y = 0.5 + Math.sin(time * 1.5) * 0.12;
      this.cloudIsland.rotation.y += delta * 0.25;
    }

    if (this.satelliteDish) {
      this.satelliteDish.rotation.y += delta * 1.2;
    }

    if (this.octocatHalo) {
      this.octocatHalo.rotation.z += delta * 0.7;
    }

    // Shield pulsating when active
    if (this.shieldMesh && this.shieldMesh.material.opacity > 0) {
      this.shieldMesh.rotation.y += delta * 1.5;
      this.shieldMesh.rotation.x += delta * 0.8;
    }

    // Orbit laptops
    this.orbitLaptops.forEach((laptop) => {
      laptop.userData.angle += delta * 0.45;
      const a = laptop.userData.angle;
      const r = laptop.userData.radius;
      laptop.position.x = Math.cos(a) * r;
      laptop.position.z = Math.sin(a) * r;
      laptop.position.y = Math.sin(time * 2 + a) * 0.18;
      laptop.lookAt(0, 0.5, 0);
    });

    // Update flying data packets
    for (let i = this.dataPackets.length - 1; i >= 0; i--) {
      const pkt = this.dataPackets[i];
      pkt.userData.progress += delta * pkt.userData.speed;
      pkt.position.lerpVectors(pkt.userData.startPos, pkt.userData.targetPos, pkt.userData.progress);
      pkt.rotation.x += delta * 6;
      pkt.rotation.y += delta * 6;

      if (pkt.userData.progress >= 1) {
        this.group.remove(pkt);
        this.dataPackets.splice(i, 1);
      }
    }
  }
}
