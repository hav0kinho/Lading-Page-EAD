"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export const GitCommitGraph3D: React.FC<{ className?: string }> = ({ className = "" }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Verificar preferência de movimento reduzido (WCAG 2.3.3)
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 1. Inicializar Cena, Câmera e Renderizador
    const scene = new THREE.Scene();
    const width = currentMount.clientWidth || 800;
    const height = currentMount.clientHeight || 600;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 12;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2));
      currentMount.appendChild(renderer.domElement);
    } catch {
      // Fallback para ambientes sem WebGL (ex: JSDOM nos testes)
      return;
    }

    // 2. Luzes
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x8a2be2, 3.8, 50);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const cyanLight = new THREE.PointLight(0x00ced1, 2.8, 50);
    cyanLight.position.set(-5, -5, 5);
    scene.add(cyanLight);

    // 3. Estrutura do Grafo de Commits (Branches e Nós)
    const commitGroup = new THREE.Group();
    scene.add(commitGroup);

    // Posições de nós de commits
    const commitPositions = [
      // Branch Main
      new THREE.Vector3(-6, 0, 0),
      new THREE.Vector3(-3, 0, 0),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(3, 0, 0),
      new THREE.Vector3(6, 0, 0),
      // Feature Branch 1 (Superior)
      new THREE.Vector3(-3, 0, 0),
      new THREE.Vector3(-1.5, 2, 1),
      new THREE.Vector3(1.5, 2, 1),
      new THREE.Vector3(3, 0, 0),
      // Feature Branch 2 (Inferior)
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(1.5, -2, -1),
      new THREE.Vector3(4.5, -2, -1),
      new THREE.Vector3(6, 0, 0),
    ];

    const sphereGeometry = new THREE.SphereGeometry(0.35, 24, 24);
    const purpleMaterial = new THREE.MeshStandardMaterial({
      color: 0x8a2be2,
      emissive: 0x5a189a,
      emissiveIntensity: 0.65,
      roughness: 0.2,
      metalness: 0.85,
    });
    const cyanMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ced1,
      emissive: 0x008b8b,
      emissiveIntensity: 0.65,
      roughness: 0.2,
      metalness: 0.85,
    });

    const spheres: THREE.Mesh[] = [];
    commitPositions.forEach((pos, index) => {
      const material = index % 3 === 0 ? cyanMaterial : purpleMaterial;
      const sphere = new THREE.Mesh(sphereGeometry, material);
      sphere.position.copy(pos);
      commitGroup.add(sphere);
      spheres.push(sphere);
    });

    // Curvas das Branches do Git Flow
    const branchCurves = [
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-6, 0, 0),
        new THREE.Vector3(-3, 0, 0),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(3, 0, 0),
        new THREE.Vector3(6, 0, 0),
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-3, 0, 0),
        new THREE.Vector3(-1.5, 2, 1),
        new THREE.Vector3(1.5, 2, 1),
        new THREE.Vector3(3, 0, 0),
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(1.5, -2, -1),
        new THREE.Vector3(4.5, -2, -1),
        new THREE.Vector3(6, 0, 0),
      ]),
    ];

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x8a2be2,
      transparent: true,
      opacity: 0.45,
    });

    const lines = branchCurves.map((curve) => {
      const curvePoints = curve.getPoints(50);
      const geometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
      const line = new THREE.Line(geometry, lineMaterial);
      commitGroup.add(line);
      return { geometry, line };
    });

    // 4. Materiais Wireframe para os Cubos
    const wirePurpleMat = new THREE.MeshBasicMaterial({
      color: 0xc084fc,
      wireframe: true,
      transparent: true,
      opacity: 0.75,
    });

    const wireCyanMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.75,
    });

    // 5. Cubos que Viajam pelas Arestas (Fluxo de Dados/Energia Git)
    const flowCubeGeo = new THREE.BoxGeometry(0.24, 0.24, 0.24);
    const flowWireGeo = new THREE.BoxGeometry(0.28, 0.28, 0.28);
    const flowCubes: THREE.Mesh[] = [];

    branchCurves.forEach((curve, branchIndex) => {
      const cubesPerBranch = 3;
      for (let i = 0; i < cubesPerBranch; i++) {
        const isCyan = (branchIndex + i) % 2 === 0;
        const mat = isCyan ? cyanMaterial : purpleMaterial;
        const wireMat = isCyan ? wireCyanMat : wirePurpleMat;

        const cube = new THREE.Mesh(flowCubeGeo, mat);
        const wire = new THREE.Mesh(flowWireGeo, wireMat);
        cube.add(wire);

        const initialProgress = (i / cubesPerBranch) + branchIndex * 0.12;
        cube.userData = {
          curve,
          progress: initialProgress % 1,
          speed: 0.0022 + (i % 2) * 0.0006,
        };

        const pt = curve.getPointAt(cube.userData.progress);
        cube.position.copy(pt);
        commitGroup.add(cube);
        flowCubes.push(cube);
      }
    });

    // 6. Cubos Flutuantes Afastados nas Extremidades (Moldura Espacial)
    const cubesGroup = new THREE.Group();
    scene.add(cubesGroup);

    const ambientCubeConfigs = [
      { pos: new THREE.Vector3(-10.2, 3.2, -2.5), size: 0.85, color: "purple", rotSpeed: { x: 0.008, y: 0.011 } },
      { pos: new THREE.Vector3(-9.5, -3.5, 0.5), size: 0.7, color: "cyan", rotSpeed: { x: -0.009, y: 0.007 } },
      { pos: new THREE.Vector3(10.0, 3.4, -2.0), size: 0.9, color: "cyan", rotSpeed: { x: 0.007, y: -0.01 } },
      { pos: new THREE.Vector3(9.6, -3.2, 1.0), size: 0.75, color: "purple", rotSpeed: { x: -0.008, y: 0.008 } },
      { pos: new THREE.Vector3(-11.5, -0.2, -4.0), size: 0.65, color: "cyan", rotSpeed: { x: 0.009, y: 0.006 } },
      { pos: new THREE.Vector3(11.2, 0.4, -3.5), size: 0.7, color: "purple", rotSpeed: { x: -0.007, y: 0.01 } },
    ];

    const ambientCubeGeometries: THREE.BoxGeometry[] = [];
    const ambientWireGeometries: THREE.BoxGeometry[] = [];
    const ambientCubeMeshes: THREE.Mesh[] = [];

    ambientCubeConfigs.forEach((cfg) => {
      const geo = new THREE.BoxGeometry(cfg.size, cfg.size, cfg.size);
      ambientCubeGeometries.push(geo);

      const mat = cfg.color === "purple" ? purpleMaterial : cyanMaterial;
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(cfg.pos);
      mesh.userData = { rotSpeed: cfg.rotSpeed };

      const wireGeo = new THREE.BoxGeometry(cfg.size * 1.06, cfg.size * 1.06, cfg.size * 1.06);
      ambientWireGeometries.push(wireGeo);
      const wireMat = cfg.color === "purple" ? wirePurpleMat : wireCyanMat;
      const wireMesh = new THREE.Mesh(wireGeo, wireMat);
      mesh.add(wireMesh);

      cubesGroup.add(mesh);
      ambientCubeMeshes.push(mesh);
    });

    // 7. Partículas estelares de fundo
    const particlesCount = 140;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      particlePositions[i] = (Math.random() - 0.5) * 38;
    }
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xa855f7,
      size: 0.08,
      transparent: true,
      opacity: 0.5,
    });
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // 8. Interação com o Mouse
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

    // 9. Responsividade no Redimensionamento
    const handleResize = () => {
      if (!currentMount || !renderer) return;
      const newWidth = currentMount.clientWidth || 800;
      const newHeight = currentMount.clientHeight || 600;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);

      if (prefersReducedMotion) {
        renderer.render(scene, camera);
      }
    };
    window.addEventListener("resize", handleResize);

    // 10. Loop de Animação ou Quadro Estático
    let animationFrameId: number | null = null;
    if (prefersReducedMotion) {
      if (renderer) {
        renderer.render(scene, camera);
      }
    } else {
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        targetX += (mouseX - targetX) * 0.04;
        targetY += (mouseY - targetY) * 0.04;

        // Movimento do Grafo de commits
        commitGroup.rotation.y = targetX * 0.6;
        commitGroup.rotation.x = -targetY * 0.4;
        commitGroup.rotation.z += 0.001;

        // Cubos de dados viajando pelas arestas do Git Flow (fluxo de energia)
        flowCubes.forEach((cube) => {
          cube.userData.progress += cube.userData.speed;
          if (cube.userData.progress > 1) {
            cube.userData.progress -= 1;
          }
          const pt = cube.userData.curve.getPointAt(cube.userData.progress);
          cube.position.copy(pt);
          cube.rotation.x += 0.035;
          cube.rotation.y += 0.04;
        });

        // Movimento em paralaxe dos cubos afastados na moldura
        cubesGroup.rotation.y = targetX * 0.35;
        cubesGroup.rotation.x = -targetY * 0.25;

        ambientCubeMeshes.forEach((mesh) => {
          mesh.rotation.x += mesh.userData.rotSpeed.x;
          mesh.rotation.y += mesh.userData.rotSpeed.y;
        });

        particleSystem.rotation.y += 0.0005;

        if (renderer) {
          renderer.render(scene, camera);
        }
      };
      animate();
    }

    // 11. Descarte rigoroso de recursos (Memory leak prevention)
    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      sphereGeometry.dispose();
      purpleMaterial.dispose();
      cyanMaterial.dispose();
      lineMaterial.dispose();
      lines.forEach((l) => l.geometry.dispose());

      flowCubeGeo.dispose();
      flowWireGeo.dispose();

      ambientCubeGeometries.forEach((g) => g.dispose());
      ambientWireGeometries.forEach((g) => g.dispose());
      wirePurpleMat.dispose();
      wireCyanMat.dispose();

      particleGeometry.dispose();
      particleMaterial.dispose();

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
      className={`absolute inset-0 pointer-events-none overflow-hidden opacity-80 ${className}`}
    />
  );
};

export default GitCommitGraph3D;
