"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export const Quiz3DElement: React.FC<{ className?: string }> = ({ className = "" }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const width = currentMount.clientWidth || 180;
    const height = currentMount.clientHeight || 180;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 4.2;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2));
      currentMount.appendChild(renderer.domElement);
    } catch {
      return;
    }

    // Luzes
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const purpleLight = new THREE.PointLight(0x8a2be2, 4, 15);
    purpleLight.position.set(2, 3, 3);
    scene.add(purpleLight);

    const cyanLight = new THREE.PointLight(0x00ced1, 3, 15);
    cyanLight.position.set(-2, -3, 2);
    scene.add(cyanLight);

    // Grupo Central
    const holoGroup = new THREE.Group();
    scene.add(holoGroup);

    // 1. Núcleo Icosaedro Holográfico
    const coreGeometry = new THREE.IcosahedronGeometry(1.0, 0);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x8a2be2,
      emissive: 0x5a189a,
      emissiveIntensity: 0.8,
      roughness: 0.15,
      metalness: 0.9,
      wireframe: false,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    holoGroup.add(coreMesh);

    // 2. Wireframe Externo com brilho Ciano
    const wireGeometry = new THREE.IcosahedronGeometry(1.15, 0);
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ced1,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    });
    const wireMesh = new THREE.Mesh(wireGeometry, wireMaterial);
    holoGroup.add(wireMesh);

    // 3. Anel Orbital
    const ringGeometry = new THREE.TorusGeometry(1.6, 0.03, 16, 64);
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0x8a2be2,
      emissiveIntensity: 0.5,
      roughness: 0.3,
    });
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh.rotation.x = Math.PI / 3;
    holoGroup.add(ringMesh);

    // 4. Segundo Anel Perpendicular
    const ringGeometry2 = new THREE.TorusGeometry(1.8, 0.02, 16, 64);
    const ringMaterial2 = new THREE.MeshBasicMaterial({
      color: 0x00ced1,
      transparent: true,
      opacity: 0.4,
    });
    const ringMesh2 = new THREE.Mesh(ringGeometry2, ringMaterial2);
    ringMesh2.rotation.y = Math.PI / 3;
    holoGroup.add(ringMesh2);

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = currentMount.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      mouseX = (x / rect.width) * 2;
      mouseY = -(y / rect.height) * 2;
    };

    if (!prefersReducedMotion) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    let animationFrameId: number | null = null;
    if (prefersReducedMotion) {
      if (renderer) renderer.render(scene, camera);
    } else {
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        holoGroup.rotation.y += 0.012 + targetX * 0.02;
        holoGroup.rotation.x += 0.008 - targetY * 0.02;

        ringMesh.rotation.z += 0.015;
        ringMesh2.rotation.x += 0.01;

        if (renderer) renderer.render(scene, camera);
      };
      animate();
    }

    return () => {
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);

      coreGeometry.dispose();
      coreMaterial.dispose();
      wireGeometry.dispose();
      wireMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      ringGeometry2.dispose();
      ringMaterial2.dispose();

      if (renderer) {
        renderer.dispose();
        if (currentMount.contains(renderer.domElement)) {
          currentMount.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className={`relative flex items-center justify-center cursor-pointer select-none ${className}`}
    />
  );
};

export default Quiz3DElement;
