import * as THREE from 'three';
import { soundFX } from '../../audio/soundEffects.js';

export class ChaosStage {
  constructor() {
    this.group = new THREE.Group();
    this.items = [];
    this.isPanicking = false;
    this.isOrdered = false;
    this.beacon = null;
    this.beaconLight = null;
    this.beaconBeam = null;
    this.shockwaveRing = null;
    this.orderParticles = null;
    this.extraFileCounter = 0;

    this.init();
  }

  createFileTexture(name, bgColor = '#1e293b', textColor = '#ffffff') {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Folder / File background
    ctx.fillStyle = bgColor;
    ctx.roundRect ? ctx.roundRect(0, 0, 512, 256, 24) : ctx.fillRect(0, 0, 512, 256);
    ctx.fill();

    // Top tab or accent line
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(20, 20, 160, 12);

    // Text icon
    ctx.font = 'bold 36px monospace';
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('📄 FILE', 30, 80);

    // File name
    ctx.font = 'bold 32px monospace';
    ctx.fillStyle = textColor;
    ctx.fillText(name, 30, 150);

    // Hazard stamp
    ctx.font = '22px monospace';
    ctx.fillStyle = '#ef4444';
    ctx.fillText('⚠️ UNVERSIONED CHAOS', 30, 205);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    return texture;
  }

  init() {
    const fileNames = [
      'project1.py',
      'project_final.py',
      'project_REAL_final.py',
      'project_FINAL_v2.py',
      'final_for_mom.zip',
      'really_final_pls.js',
      'HELP_FINAL_v99.docx'
    ];

    const colors = ['#dc2626', '#d97706', '#2563eb', '#7c3aed', '#db2777', '#059669', '#ea580c'];

    fileNames.forEach((name, i) => {
      this.createFileMesh(name, colors[i % colors.length], i, fileNames.length);
    });

    // Add crumpled paper balls floating around
    for (let j = 0; j < 8; j++) {
      const paperGeo = new THREE.DodecahedronGeometry(0.3 + Math.random() * 0.25, 1);
      const paperMat = new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.85,
        flatShading: true
      });
      const paper = new THREE.Mesh(paperGeo, paperMat);
      paper.position.set(
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4
      );
      paper.userData = {
        targetPos: paper.position.clone(),
        origPos: paper.position.clone(),
        rotSpeed: { x: Math.random() * 2, y: Math.random() * 2, z: Math.random() * 2 },
        floatSpeed: 0.8 + Math.random() * 1.5,
        floatOffset: Math.random() * Math.PI * 2
      };
      this.items.push(paper);
      this.group.add(paper);
    }

    // Emergency Panic Beacon on sleek cyber pedestal
    const beaconBaseGeo = new THREE.CylinderGeometry(0.55, 0.7, 0.45, 24);
    const beaconBaseMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.2 });
    const beaconBase = new THREE.Mesh(beaconBaseGeo, beaconBaseMat);
    beaconBase.position.set(0, -1.9, 0);

    const domeGeo = new THREE.SphereGeometry(0.38, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const domeMat = new THREE.MeshStandardMaterial({
      color: 0xff1e1e,
      emissive: 0xff0000,
      emissiveIntensity: 0.7,
      transparent: true,
      opacity: 0.9
    });
    this.beacon = new THREE.Mesh(domeGeo, domeMat);
    this.beacon.position.y = 0.22;
    beaconBase.add(this.beacon);

    // Glowing rotating volumetric cone beam
    const beamGeo = new THREE.ConeGeometry(1.2, 5, 16, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xff2222,
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide
    });
    this.beaconBeam = new THREE.Mesh(beamGeo, beamMat);
    this.beaconBeam.position.y = 2.5;
    this.beaconBeam.rotation.x = Math.PI;
    this.beacon.add(this.beaconBeam);

    this.beaconLight = new THREE.PointLight(0xff0000, 2.5, 12);
    this.beaconLight.position.set(0, -1.5, 0);
    this.group.add(beaconBase);
    this.group.add(this.beaconLight);

    // Order Shockwave Ring
    const ringGeo = new THREE.RingGeometry(0.2, 0.4, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0
    });
    this.shockwaveRing = new THREE.Mesh(ringGeo, ringMat);
    this.shockwaveRing.rotation.x = -Math.PI / 2;
    this.shockwaveRing.position.y = -1.2;
    this.group.add(this.shockwaveRing);
  }

  createFileMesh(name, colorHex, i, total) {
    const width = 1.45;
    const height = 0.95;
    const depth = 0.16;

    const texture = this.createFileTexture(name, '#0f172a');
    const materials = [
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 }),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 }),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 }),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 }),
      new THREE.MeshStandardMaterial({ map: texture, roughness: 0.3, emissive: 0x1e293b, emissiveIntensity: 0.2 }),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 })
    ];

    const geometry = new THREE.BoxGeometry(width, height, depth);
    const mesh = new THREE.Mesh(geometry, materials);

    // Colored glowing border edge
    const edges = new THREE.EdgesGeometry(geometry);
    const lineMat = new THREE.LineBasicMaterial({ color: new THREE.Color(colorHex), linewidth: 2 });
    const wireframe = new THREE.LineSegments(edges, lineMat);
    mesh.add(wireframe);

    // Orbit distribution
    const angle = (i / total) * Math.PI * 2 + Math.random() * 0.4;
    const radius = 2.4 + Math.random() * 1.4;
    const y = (Math.random() - 0.5) * 2.6;

    mesh.position.set(
      Math.cos(angle) * radius,
      y,
      Math.sin(angle) * radius
    );

    mesh.rotation.set(
      (Math.random() - 0.5) * 0.8,
      (Math.random() - 0.5) * 0.8,
      (Math.random() - 0.5) * 0.8
    );

    mesh.userData = {
      origPos: mesh.position.clone(),
      targetPos: mesh.position.clone(),
      origRot: mesh.rotation.clone(),
      rotSpeed: {
        x: (Math.random() - 0.5) * 1.5,
        y: (Math.random() - 0.5) * 1.5,
        z: (Math.random() - 0.5) * 1.5
      },
      floatSpeed: 1.2 + Math.random(),
      floatOffset: Math.random() * Math.PI * 2,
      name: name,
      isExtra: false
    };

    this.items.push(mesh);
    this.group.add(mesh);
    return mesh;
  }

  spawnExtraFile() {
    this.extraFileCounter++;
    const funnyNames = [
      `FINAL_v${this.extraFileCounter + 99}_REAL.py`,
      `mom_says_submit_now_v${this.extraFileCounter}.zip`,
      `pls_god_compile_${this.extraFileCounter}.js`,
      `HELP_ME_PROFESSOR_${this.extraFileCounter}.docx`
    ];
    const name = funnyNames[(this.extraFileCounter - 1) % funnyNames.length];
    soundFX.playBoing();

    const mesh = this.createFileMesh(name, '#f43f5e', this.items.length, 12);
    mesh.position.set(
      (Math.random() - 0.5) * 3,
      4.0, // Drop from above
      (Math.random() - 0.5) * 3
    );
    mesh.userData.targetPos.set(
      (Math.random() - 0.5) * 4,
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 3
    );
  }

  triggerPanic() {
    this.isPanicking = true;
    this.isOrdered = false;
    soundFX.playAlarm();

    // Aggressively scatter outward
    this.items.forEach((item) => {
      const dir = item.position.clone().normalize().multiplyScalar(4.5 + Math.random() * 2.5);
      item.userData.targetPos = dir;
      item.userData.rotSpeed.x *= 3;
      item.userData.rotSpeed.y *= 3;
    });

    setTimeout(() => {
      this.isPanicking = false;
      this.items.forEach((item) => {
        if (!this.isOrdered) {
          item.userData.targetPos.copy(item.userData.origPos);
        }
      });
    }, 2800);
  }

  triggerOrder() {
    this.isOrdered = true;
    this.isPanicking = false;
    soundFX.playWhoosh();
    soundFX.playBootReady();

    // Shockwave expansion animation
    if (this.shockwaveRing) {
      this.shockwaveRing.scale.set(0.1, 0.1, 0.1);
      this.shockwaveRing.material.opacity = 1.0;
    }

    // Tidy up into an elegant glowing spiral / DNA double-column
    this.items.forEach((item, idx) => {
      const angle = idx * 0.7;
      const radius = 1.6;
      const y = -1.3 + (idx * 0.32);
      item.userData.targetPos.set(
        Math.cos(angle) * radius,
        y,
        Math.sin(angle) * radius
      );
      item.rotation.set(0, -angle + Math.PI / 2, 0);
    });
  }

  reset() {
    this.isPanicking = false;
    this.isOrdered = false;
    this.items.forEach((item) => {
      if (item.userData.origPos) {
        item.userData.targetPos.copy(item.userData.origPos);
        item.position.copy(item.userData.origPos);
      }
      if (item.userData.origRot) {
        item.rotation.copy(item.userData.origRot);
      }
    });
  }

  update(delta, time) {
    // Beacon rotation & pulse
    if (this.beacon) {
      const beaconSpeed = this.isPanicking ? 14 : 3;
      this.beacon.rotation.y += delta * beaconSpeed;

      if (this.isPanicking) {
        this.beaconLight.intensity = 4.0 + Math.sin(time * 25) * 3;
        this.beaconBeam.material.opacity = 0.5 + Math.sin(time * 25) * 0.3;
      } else {
        this.beaconLight.intensity = 1.2 + Math.sin(time * 3) * 0.6;
        this.beaconBeam.material.opacity = 0.15 + Math.sin(time * 3) * 0.1;
      }
    }

    // Shockwave ring expansion
    if (this.shockwaveRing && this.shockwaveRing.material.opacity > 0.01) {
      this.shockwaveRing.scale.addScalar(delta * 12);
      this.shockwaveRing.material.opacity -= delta * 1.5;
    }

    // Smooth movement interpolation
    this.items.forEach((item) => {
      const u = item.userData;
      if (!u.targetPos) return;

      // Spring lerp towards target position
      item.position.lerp(u.targetPos, delta * 3.5);

      if (this.isPanicking) {
        item.rotation.x += (Math.random() - 0.5) * 0.5;
        item.rotation.y += (Math.random() - 0.5) * 0.5;
        item.position.x += (Math.random() - 0.5) * 0.15;
        item.position.y += (Math.random() - 0.5) * 0.15;
      } else if (!this.isOrdered) {
        // Natural gentle bobbing and floating
        item.rotation.x += u.rotSpeed.x * delta * 0.5;
        item.rotation.y += u.rotSpeed.y * delta * 0.5;
        item.position.y = u.targetPos.y + Math.sin(time * u.floatSpeed + u.floatOffset) * 0.25;
      } else {
        // Harmonious revolving carousel
        item.rotation.y += delta * 0.8;
      }
    });
  }
}
