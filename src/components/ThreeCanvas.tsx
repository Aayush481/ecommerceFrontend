'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export const ThreeCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    // 1. Browser capability check & reduced-motion query validation
    const checkWebGLSupport = () => {
      try {
        const canvas = document.createElement('canvas');
        return !!(
          window.WebGLRenderingContext && 
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
        );
      } catch (e) {
        return false;
      }
    };

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!checkWebGLSupport() || isReducedMotion) {
      setWebglSupported(false);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // 2. Mobile screen ranges check
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;
    const isMobile = window.innerWidth < 768;

    // 3. WebGL Scene & Camera Initializer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 6;

    // Skip antialiasing on mobile to reduce processing overhead
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2));
    container.appendChild(renderer.domElement);

    // 4. Subdivisions optimization: light mesh count on mobile screens
    const subdivisions = isMobile ? 24 : 64;
    const geometry = new THREE.IcosahedronGeometry(1.8, subdivisions);
    
    const material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uColorTerracotta: { value: new THREE.Color('#B35C37') },
        uColorGold: { value: new THREE.Color('#D4AF37') },
        uColorDark: { value: new THREE.Color('#0A0D0B') }
      },
      vertexShader: `
        uniform float uTime;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying float vDisplacement;

        float getRipples(vec3 p) {
          float waveX = sin(p.x * 2.2 + uTime * 0.6) * cos(p.y * 1.8 - uTime * 0.4);
          float waveY = sin(p.y * 2.5 - uTime * 0.7) * cos(p.z * 2.0 + uTime * 0.5);
          float waveZ = sin(p.z * 1.8 + uTime * 0.4) * cos(p.x * 2.5 - uTime * 0.6);
          return (waveX + waveY + waveZ) * 0.12;
        }

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          
          float displacement = getRipples(position);
          vDisplacement = displacement;
          
          vec3 newPosition = position + normal * displacement;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColorTerracotta;
        uniform vec3 uColorGold;
        uniform vec3 uColorDark;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying float vDisplacement;

        void main() {
          float intensity = pow(1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 3.0);
          vec3 baseColor = mix(uColorDark, uColorTerracotta, intensity);
          vec3 sheenColor = mix(baseColor, uColorGold, vDisplacement * 2.0 + 0.5);
          vec3 finalColor = mix(sheenColor, uColorGold, intensity * 0.9);
          gl_FragColor = vec4(finalColor, 0.7 + intensity * 0.3);
        }
      `
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xffffff, 1.5, 50);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    // 6. Intersection Observer: Pause offscreen drawing loops
    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // 7. Loop execution
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      // Stop calculations if offscreen
      if (!isVisible) return;
      
      const elapsedTime = clock.getElapsedTime();
      material.uniforms.uTime.value = elapsedTime;
      
      mesh.rotation.y = elapsedTime * 0.06;
      mesh.rotation.x = elapsedTime * 0.04;
      
      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 9. Clean disposal on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Silent CSS gradient fallback when WebGL or motion support is missing
  if (!webglSupported) {
    return (
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden z-0 opacity-20 bg-gradient-to-tr from-[#B35C37]/35 via-transparent to-[#D4AF37]/35 blur-3xl animate-pulse"
      />
    );
  }

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden z-0 opacity-45 mix-blend-screen"
    />
  );
};
