<template>
  <div class="container">
    <div ref="sceneContainer" class="scene-container"></div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default {
  name: 'App',
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      controls: null,
      lights: [],
      mirrorDepth: 20,
      gridSize: 10,
      animationId: null
    }
  },
  mounted() {
    this.initThree();
    this.createMirrorEffect();
    this.animate();
    window.addEventListener('resize', this.onWindowResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
    cancelAnimationFrame(this.animationId);
    this.renderer.dispose();
    this.controls.dispose();
  },
  methods: {
    initThree() {
      // Create scene
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x000000);
      
      // Create camera
      this.camera = new THREE.PerspectiveCamera(
        75, 
        window.innerWidth / window.innerHeight, 
        0.1, 
        1000
      );
      this.camera.position.z = 5;
      
      // Create renderer
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.$refs.sceneContainer.appendChild(this.renderer.domElement);
      
      // Add controls
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.minDistance = 3;
      this.controls.maxDistance = 10;
    },
    createMirrorEffect() {
      // Create the outer box
      const boxGeometry = new THREE.BoxGeometry(4, 4, 4);
      const boxMaterials = [
        new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.2 }),
        new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.2 }),
        new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.2 }),
        new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.2 }),
        new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.2 }),
        new THREE.MeshBasicMaterial({ color: 0x000000 })
      ];
      const box = new THREE.Mesh(boxGeometry, boxMaterials);
      box.position.set(0, 0, 0);
      this.scene.add(box);
      
      // Create the light grid points
      for (let z = 0; z > -this.mirrorDepth; z -= 1) {
        for (let x = -this.gridSize / 2; x < this.gridSize / 2; x += 1) {
          for (let y = -this.gridSize / 2; y < this.gridSize / 2; y += 1) {
            // Create light point
            const pointGeometry = new THREE.SphereGeometry(0.05, 8, 8);
            const pointMaterial = new THREE.MeshBasicMaterial({ 
              color: 0xffffff,
              transparent: true,
              opacity: 1 + (z / this.mirrorDepth)
            });
            const point = new THREE.Mesh(pointGeometry, pointMaterial);
            point.position.set(x * 0.4, y * 0.4, z);
            this.scene.add(point);
            this.lights.push(point);
          }
        }
      }
      
      // Add ambient light
      const ambientLight = new THREE.AmbientLight(0x404040);
      this.scene.add(ambientLight);
      
      // Add directional light
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(1, 1, 1);
      this.scene.add(directionalLight);
    },
    animate() {
      this.animationId = requestAnimationFrame(this.animate);
      
      // Update controls
      this.controls.update();
      
      // Animate lights
      const time = Date.now() * 0.001;
      this.lights.forEach((light, index) => {
        const z = light.position.z;
        const factor = 1 + (z / this.mirrorDepth);
        light.material.opacity = factor * (0.7 + 0.3 * Math.sin(time + index * 0.1));
        light.scale.setScalar(0.05 + 0.03 * Math.sin(time * 0.5 + index * 0.05));
      });
      
      // Render scene
      this.renderer.render(this.scene, this.camera);
    },
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }
}
</script>

<style>
.container {
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #000;
}

.scene-container {
  width: 100%;
  height: 100%;
}
</style>
