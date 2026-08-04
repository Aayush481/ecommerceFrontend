'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

export const DressScrollAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webglSupported, setWebglSupported] = useState(true);
  const [isLargeScreen, setIsLargeScreen] = useState<boolean | null>(null);

  useEffect(() => {
    const handleResizeCheck = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    handleResizeCheck();
    window.addEventListener('resize', handleResizeCheck);
    return () => {
      window.removeEventListener('resize', handleResizeCheck);
    };
  }, []);

  useEffect(() => {
    if (!isLargeScreen) return;

    // 1. Detect WebGL support using a dummy canvas
    const dummyCanvas = document.createElement('canvas');
    const gl = dummyCanvas.getContext('webgl') || dummyCanvas.getContext('experimental-webgl');
    if (!gl) {
      setWebglSupported(false);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    // 2. Setup Three.js Scene
    const scene = new THREE.Scene();
    
    // Perspective Camera matching viewport projection
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const dressGroup = new THREE.Group();
    scene.add(dressGroup);

    // 3. Create Fallback Plane Mesh
    const planeGeo = new THREE.PlaneGeometry(1, 1);
    const dressMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTexture: { value: new THREE.Texture() },
        uDissolve: { value: 0.0 },
        uTime: { value: 0.0 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform float uDissolve;
        uniform float uTime;
        varying vec2 vUv;
        
        void main() {
          vec4 texColor = texture2D(uTexture, vUv);
          if (texColor.a < 0.1) discard;
          gl_FragColor = vec4(texColor.rgb, texColor.a * (1.0 - uDissolve));
        }
      `
    });

    const dressMesh = new THREE.Mesh(planeGeo, dressMaterial);
    dressGroup.add(dressMesh);

    // Load original fallback texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      '/red_dress.jpg',
      (texture) => {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;
        dressMaterial.uniforms.uTexture.value = texture;
      }
    );

    // 4. Async loading of actual 3D GLB Model with Draco compression support
    let modelScene: THREE.Group | null = null;
    let modelBaseScale = 1.0;
    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
    gltfLoader.setDRACOLoader(dracoLoader);

    gltfLoader.load(
      '/woman_3d_model.glb',
      (gltf) => {
        const model = gltf.scene;

        // Auto-center and fit coordinates to standard plane space
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        // Center pivot
        model.position.set(-center.x, -center.y, -center.z);

        const wrapper = new THREE.Group();
        wrapper.add(model);

        // Compute base scale factor to fit normalized 1.0 height bounds
        modelBaseScale = 1.0 / (size.y || 1.0);
        wrapper.scale.set(modelBaseScale, modelBaseScale, modelBaseScale);

        // Enable transparency support on all model child meshes
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            materials.forEach((mat) => {
              mat.transparent = true;
              mat.depthWrite = true;
            });
          }
        });

        // Hide fallback image plane, attach model to the group
        dressMesh.visible = false;
        dressGroup.add(wrapper);
        modelScene = wrapper;
      },
      undefined,
      (err) => {
        console.warn('Failed loading 3D woman GLB asset. Operating under fallback image-card plane.', err);
      }
    );

    // 5. Lighting Configuration (Bright luxury three-point lighting)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 2.0);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 3.0);
    dirLight1.position.set(4, 6, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffe8cc, 1.5);
    dirLight2.position.set(-4, 4, -3);
    scene.add(dirLight2);

    // 5.5. Background Parallax Light Orbs (rendered behind the model in WebGL)
    const bgGroup = new THREE.Group();
    scene.add(bgGroup);

    // Warm gold light spot
    const bgGeo1 = new THREE.PlaneGeometry(12, 12);
    const bgCanvas1 = document.createElement('canvas');
    bgCanvas1.width = 256;
    bgCanvas1.height = 256;
    const ctx1 = bgCanvas1.getContext('2d');
    if (ctx1) {
      const grad = ctx1.createRadialGradient(128, 128, 0, 128, 128, 128);
      grad.addColorStop(0, 'rgba(212, 175, 55, 0.12)'); // warm gold glow
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx1.fillStyle = grad;
      ctx1.fillRect(0, 0, 256, 256);
    }
    const bgTex1 = new THREE.CanvasTexture(bgCanvas1);
    const bgMat1 = new THREE.MeshBasicMaterial({
      map: bgTex1,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const bgMesh1 = new THREE.Mesh(bgGeo1, bgMat1);
    bgMesh1.position.set(-2, 2, -3); // offset top left
    bgGroup.add(bgMesh1);

    // Terracotta light spot
    const bgGeo2 = new THREE.PlaneGeometry(15, 15);
    const bgCanvas2 = document.createElement('canvas');
    bgCanvas2.width = 256;
    bgCanvas2.height = 256;
    const ctx2 = bgCanvas2.getContext('2d');
    if (ctx2) {
      const grad = ctx2.createRadialGradient(128, 128, 0, 128, 128, 128);
      grad.addColorStop(0, 'rgba(179, 92, 55, 0.08)'); // warm terracotta glow
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx2.fillStyle = grad;
      ctx2.fillRect(0, 0, 256, 256);
    }
    const bgTex2 = new THREE.CanvasTexture(bgCanvas2);
    const bgMat2 = new THREE.MeshBasicMaterial({
      map: bgTex2,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const bgMesh2 = new THREE.Mesh(bgGeo2, bgMat2);
    bgMesh2.position.set(3, -3, -4); // offset bottom right
    bgGroup.add(bgMesh2);

    // Helper: Map 2D Element Screen Center to 3D Coordinates
    const get3DPosition = (rect: DOMRect) => {
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      
      const ndcX = (x / window.innerWidth) * 2 - 1;
      const ndcY = -(y / window.innerHeight) * 2 + 1;
      
      const vector = new THREE.Vector3(ndcX, ndcY, 0.5);
      vector.unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      
      const distance = -camera.position.z / dir.z;
      return camera.position.clone().add(dir.multiplyScalar(distance));
    };

    const getElements = () => {
      const startEl = document.getElementById('hero-dress-image-container');
      const targetEl = document.getElementById('category-card-summer-dresses');
      return { startEl, targetEl };
    };

    // Cubic-bezier(0.25, 1, 0.5, 1) solver for high-end luxury easing trajectory
    const cubicBezier = (x: number): number => {
      const x1 = 0.25;
      const x2 = 0.5;
      let t = x;
      // Solve for t corresponding to x(t) = x using Newton's method
      for (let i = 0; i < 8; i++) {
        const currentX = 3 * (1 - t) * (1 - t) * t * x1 + 3 * (1 - t) * t * t * x2 + t * t * t;
        const diff = currentX - x;
        if (Math.abs(diff) < 0.001) break;
        const slope = 3 * (1 - t) * (1 - t) * x1 + 6 * (1 - t) * t * (x2 - x1) + 3 * t * t * (1 - x2);
        if (slope === 0) break;
        t -= diff / slope;
      }
      // Compute y(t)
      const y1 = 1.0;
      const y2 = 1.0;
      return 3 * (1 - t) * (1 - t) * t * y1 + 3 * (1 - t) * t * t * y2 + t * t * t;
    };

    // Highlight glow intensity calculator (pulses once between progress 0.05 and 0.45)
    const getPulseGlow = (p: number): number => {
      if (p > 0.05 && p < 0.45) {
        return Math.sin(((p - 0.05) / 0.40) * Math.PI);
      }
      return 0.0;
    };

    // Easing timeline variables for slow, smooth momentum
    let targetProgress = 0;
    let currentProgress = 0;

    // Scroll Listener just sets target
    const handleScroll = () => {
      const { startEl, targetEl } = getElements();
      if (!startEl || !targetEl) return;

      const startRect = startEl.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();

      const startCenterY = window.scrollY + startRect.top + startRect.height / 2;
      const targetCenterY = window.scrollY + targetRect.top + targetRect.height / 2;
      
      const scrollRange = targetCenterY - startCenterY;
      if (scrollRange <= 0) return;

      const currentScroll = window.scrollY;
      let progress = (currentScroll - 50) / (scrollRange - 150);
      progress = Math.max(0, Math.min(1, progress));
      
      targetProgress = progress;
    };

    // Update scene variables based on current interpolated progress
    const updateSceneForProgress = (p: number) => {
      const { startEl, targetEl } = getElements();
      if (!startEl || !targetEl) return;

      // Shift background ambient light gradients for WebGL parallax depth
      bgMesh1.position.y = 2.0 - p * 4.0;
      bgMesh2.position.y = -3.0 - p * 3.0;

      const pulseGlow = getPulseGlow(p);

      const startRect = startEl.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();

      // Compute scroll range dynamically
      const startCenterY = window.scrollY + startRect.top + startRect.height / 2;
      const targetCenterY = window.scrollY + targetRect.top + targetRect.height / 2;
      const scrollRange = targetCenterY - startCenterY;

      // Calculate the virtual scroll position corresponding to progress p,
      // blending into actual scroll position as p approaches 1.0 to keep locked on fast scrolls.
      let scrollAtP = 0;
      if (p === 0) {
        scrollAtP = 0;
      } else if (p >= 1.0) {
        scrollAtP = window.scrollY;
      } else {
        const virtualScroll = p * (scrollRange - 150) + 50;
        if (p > 0.99) {
          const blend = (p - 0.99) / 0.01;
          scrollAtP = THREE.MathUtils.lerp(virtualScroll, window.scrollY, blend);
        } else {
          scrollAtP = virtualScroll;
        }
      }

      // Absolute Y document positions (which are constant at any scroll)
      const startAbsY = window.scrollY + startRect.top;
      const targetAbsY = window.scrollY + targetRect.top;

      // Viewport-relative coordinates corresponding to progress p
      const startRectAtP = {
        left: startRect.left,
        top: startAbsY - scrollAtP,
        width: startRect.width,
        height: startRect.height
      } as DOMRect;

      const targetRectAtP = {
        left: targetRect.left,
        top: targetAbsY - scrollAtP,
        width: targetRect.width,
        height: targetRect.height
      } as DOMRect;

      const start3D = get3DPosition(startRectAtP);
      const target3D = get3DPosition(targetRectAtP);

      const visibleHeight = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
      const visibleWidth = visibleHeight * camera.aspect;

      const startWidth3D = startRect.width * (visibleWidth / window.innerWidth);
      const startHeight3D = startRect.height * (visibleHeight / window.innerHeight);

      const targetWidth3D = targetRect.width * (visibleWidth / window.innerWidth);
      const targetHeight3D = targetRect.height * (visibleHeight / window.innerHeight);

      // Calculate opacities based on progress p
      let heroImageOpacity = 1.0;
      let modelOpacity = 0.0;

      if (p === 0) {
        heroImageOpacity = 1.0;
        modelOpacity = 0.0;
        dressGroup.visible = false;
        
        targetEl.style.opacity = '1';
        const targetImg = document.getElementById('category-card-img-summer-dresses');
        if (targetImg) targetImg.style.opacity = '1';

        // Set initial 3D positions and scales at rest
        dressGroup.position.copy(start3D);
        dressMesh.scale.set(startWidth3D, startHeight3D, 1.0);
        if (modelScene) {
          const modelScale = modelBaseScale * startHeight3D * 1.04;
          modelScene.scale.set(modelScale, modelScale, modelScale);
        }
      } else {
        // If the 3D GLB model has not loaded yet, bypass the 3D animation
        // and keep the static 2D hero image and target card image visible.
        if (!modelScene) {
          heroImageOpacity = 1.0;
          modelOpacity = 0.0;
          dressGroup.visible = false;
          
          const targetImg = document.getElementById('category-card-img-summer-dresses');
          if (targetImg) targetImg.style.opacity = '1';
          
          startEl.style.opacity = '1';
          return;
        }

        dressGroup.visible = p < 0.99;

        // Position interpolation
        dressGroup.position.copy(THREE.Vector3.prototype.lerpVectors(start3D, target3D, p));

        // Size and scale calculations
        const width = THREE.MathUtils.lerp(startWidth3D, targetWidth3D, p);
        const height = THREE.MathUtils.lerp(startHeight3D, targetHeight3D, p);

        // Scale fallback plane
        dressMesh.scale.set(width, height, 1.0);

        // Scale 3D model UNIFORMLY based on height (with 1.04 size padding)
        if (modelScene) {
          const modelScale = modelBaseScale * height * 1.04;
          modelScene.scale.set(modelScale, modelScale, modelScale);
        }

        // Easing-in region (0.0 to 0.12): 2D photo fades out, 3D model fades in smoothly
        if (p < 0.12) {
          const easeInProgress = p / 0.12;
          heroImageOpacity = 1.0 - easeInProgress;
          modelOpacity = easeInProgress;
        }
        // Middle region (0.12 to 0.95): 2D photo is hidden, 3D model is fully visible
        else if (p <= 0.95) {
          heroImageOpacity = 0.0;
          modelOpacity = 1.0;
        }
        // Easing-out region (0.95 to 0.99): 3D model fades out to 0
        else {
          heroImageOpacity = 0.0;
          const easeOutProgress = Math.min(1.0, (p - 0.95) / 0.04);
          modelOpacity = 1.0 - easeOutProgress;
        }

        // Reveal Target Card Image when model reaches it
        const targetImg = document.getElementById('category-card-img-summer-dresses');
        if (targetImg) {
          if (p > 0.95) {
            const fadeInProgress = Math.min(1, (p - 0.95) / 0.04);
            targetImg.style.opacity = fadeInProgress.toString();
          } else {
            targetImg.style.opacity = '0';
          }
        }

        // Card / Model Rotation (smoothly spins as it floats down)
        dressGroup.rotation.y = p * Math.PI * 2.0;
        dressGroup.rotation.x = p * Math.PI * 0.2;
      }

      // Apply the computed opacities:
      startEl.style.opacity = heroImageOpacity.toString();

      // Fallback plane mesh opacity
      dressMaterial.uniforms.uDissolve.value = 1.0 - modelOpacity;

      // GLB model child meshes opacity & glow pulse
      if (modelScene) {
        modelScene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            materials.forEach((mat) => {
              mat.transparent = true;
              mat.opacity = modelOpacity;
              
              if ((mat as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
                const stdMat = mat as THREE.MeshStandardMaterial;
                stdMat.emissive.setRGB(
                  0.83 * pulseGlow * 0.5,
                  0.68 * pulseGlow * 0.5,
                  0.21 * pulseGlow * 0.5
                );
              }
            });
          }
        });
      }
    };

    // Loop execution
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      const elapsedTime = clock.getElapsedTime();
      dressMaterial.uniforms.uTime.value = elapsedTime;

      // Easing momentum logic: smoothly lerp currentProgress to targetProgress
      // A factor of 0.09 makes it a little bit fast but still smooth!
      currentProgress += (targetProgress - currentProgress) * 0.09;
      
      // Snap to prevent infinite asymptotic tail and trigger p === 0 condition cleanly
      if (Math.abs(targetProgress - currentProgress) < 0.001) {
        currentProgress = targetProgress;
      }
      
      // Apply the luxury cubic-bezier curve to the timeline progress
      const easedProgress = cubicBezier(currentProgress);
      
      // Update scene geometries/materials using easedProgress
      updateSceneForProgress(easedProgress);

      // Subtle float oscillation at rest (scroll progress is close to 0)
      if (currentProgress < 0.01) {
        // Oscillation on Y
        dressGroup.position.y += Math.sin(elapsedTime * 2.0) * 0.0004;
        
        // Slow rotation on Y and subtle rock on X
        if (modelScene) {
          modelScene.rotation.y = elapsedTime * 0.25;
          modelScene.rotation.x = Math.sin(elapsedTime * 0.8) * 0.04;
        } else {
          dressGroup.rotation.y = elapsedTime * 0.25;
          dressGroup.rotation.x = Math.sin(elapsedTime * 0.8) * 0.04;
        }
      } else {
        // Reset local modelScene rotation back to 0 so scroll path rotation controls it
        if (modelScene) {
          modelScene.rotation.set(0, 0, 0);
        }
      }
      
      renderer.render(scene, camera);
    };

    setTimeout(() => {
      handleScroll();
    }, 150);

    window.addEventListener('scroll', handleScroll, { passive: true });
    animate();

    // Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      handleScroll();
    };

    window.addEventListener('resize', handleResize);

    // Clean disposal on unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      dracoLoader.dispose();
      renderer.dispose();
      planeGeo.dispose();
      dressMaterial.dispose();
    };
  }, [isLargeScreen]);

  if (!webglSupported || !isLargeScreen) return null;

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-[100] overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};
