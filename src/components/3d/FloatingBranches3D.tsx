"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export const FloatingBranches3D: React.FC<{ className?: string }> = ({ className = "" }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const width = currentMount.clientWidth || 800;
    const height = currentMount.clientHeight || 500;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 15;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2));
      currentMount.appendChild(renderer.domElement);
    } catch {
      return;
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const purpleLight = new THREE.PointLight(0x8a2be2, 3, 40);
    purpleLight.position.set(5, 5, 5);
    scene.add(purpleLight);

    const cyanLight = new THREE.PointLight(0x00ced1, 2, 40);
    cyanLight.position.set(-5, -5, 5);
    scene.add(cyanLight);

    const group = new THREE.Group();
    scene.add(group);

    // Nós 3D flutuantes (cubos e esferas de commits)
    const nodeCount = 14;
    const nodeGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    const sphereGeo = new THREE.SphereGeometry(0.25, 16, 16);

    const purpleMat = new THREE.MeshStandardMaterial({
      color: 0x8a2be2,
      emissive: 0x4a148c,
      emissiveIntensity: 0.5,
      roughness: 0.2,
      metalness: 0.8,
    });

    const cyanMat = new THREE.MeshStandardMaterial({
      color: 0x00ced1,
      emissive: 0x006064,
      emissiveIntensity: 0.5,
      roughness: 0.2,
      metalness: 0.8,
    });

    const nodes: THREE.Mesh[] = [];
    const positions: THREE.Vector3[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const geo = i % 2 === 0 ? nodeGeometry : sphereGeo;
      const mat = i % 3 === 0 ? cyanMat : purpleMat;
      const mesh = new THREE.Mesh(geo, mat);

      const x = ((i % 5) - 2) * 4.5 + (Math.random() - 0.5) * 2;
      const y = (Math.floor(i / 5) - 1) * 3.5 + (Math.random() - 0.5) * 1.5;
      const z = (Math.random() - 0.5) * 6;

      const pos = new THREE.Vector3(x, y, z);
      mesh.position.copy(pos);
      group.add(mesh);
      nodes.push(mesh);
      positions.push(pos);
    }

    // Linhas conectando nós adjacentes
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x8a2be2,
      transparent: true,
      opacity: 0.25,
    });

    const lineGeometries: THREE.BufferGeometry[] = [];
    for (let i = 0; i < positions.length - 1; i += 2) {
      const points = [positions[i], positions[i + 1]];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(lineGeo, lineMaterial);
      group.add(line);
      lineGeometries.push(lineGeo);
    }

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / (window.innerWidth || 1)) * 2 - 1;
      mouseY = -(event.clientY / (window.innerHeight || 1)) * 2 + 1;
    };

    if (!prefersReducedMotion) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    const handleResize = () => {
      if (!currentMount || !renderer) return;
      const newWidth = currentMount.clientWidth || 800;
      const newHeight = currentMount.clientHeight || 500;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      if (prefersReducedMotion) renderer.render(scene, camera);
    };
    window.addEventListener("resize", handleResize);

    let animationFrameId: number | null = null;
    if (prefersReducedMotion) {
      if (renderer) renderer.render(scene, camera);
    } else {
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        targetX += (mouseX - targetX) * 0.03;
        targetY += (mouseY - targetY) * 0.03;

        group.rotation.y = targetX * 0.35 + 0.0005;
        group.rotation.x = -targetY * 0.25;

        nodes.forEach((n, idx) => {
          n.rotation.x += 0.005 * (idx % 2 === 0 ? 1 : -1);
          n.rotation.y += 0.008;
        });

        if (renderer) renderer.render(scene, camera);
      };
      animate();
    }

    return () => {
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      nodeGeometry.dispose();
      sphereGeo.dispose();
      purpleMat.dispose();
      cyanMat.dispose();
      lineMaterial.dispose();
      lineGeometries.forEach((g) => g.dispose());

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
      className={`absolute inset-0 pointer-events-none overflow-hidden opacity-50 ${className}`}
    />
  );
};

export default FloatingBranches3D;
