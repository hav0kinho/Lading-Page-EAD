# Implementação da Landing Page - "GitHub para Educadores"

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir uma landing page moderna, responsiva, com cena 3D interativa em Three.js e seções pedagógicas completas para o minicurso EaD "GitHub para Educadores", pronta para deploy na Vercel.

**Architecture:** Single Page Application (SPA) construída com Next.js (App Router), estilizada com Tailwind CSS seguindo estética dark mode (#0D1117 com realce em roxo vibrante #8A2BE2). A cena 3D (grafo de commits interativo) é isolada e carregada no cliente sem bloquear a renderização. Todo o conteúdo textual, URLs de vídeo, formulários e referências acadêmicas ficam centralizados em `src/config/content.ts`.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, Three.js, Lucide React, Vitest e React Testing Library.

**Spec:** `docs/superpowers/specs/2026-09-24-landing-page-minicurso-design.md`

## Global Constraints

- Cor de fundo base: `#0D1117` (GitHub Dark).
- Cor de destaque/acento: Roxo vibrante `#8A2BE2` com variações violeta `#A855F7` e efeitos glow.
- Título do Hero: `"GitHub para Educadores: Como Acompanhar a Evolução de Projetos de Alunos"`.
- Subtítulo do Hero: `"Aprenda a utilizar o GitHub como uma poderosa ferramenta pedagógica para acompanhar projetos e fornecer feedback contínuo e eficaz."`.
- Botão CTA: `"Assista ao Minicurso Gratuito"` com rolagem suave (`smooth scroll`) para a Seção 4 (`#minicurso`).
- Nome do Autor nos créditos: `"Ruallyson Felype Travassos de Moura"`, disciplina `"EaD - Educação à Distância"`.
- Suporte a `prefers-reduced-motion` no componente 3D e animações.
- Relação de contraste mínima WCAG 2.1 AA (4.5:1) em textos.
- Todos os links externos com `target="_blank"` e `rel="noopener noreferrer"`.

## Review Focus

1. **Falha na renderização WebGL do Three.js (dispositivos sem aceleração de hardware):** O componente 3D deve possuir tratamento de erro / fallback elegante sem quebrar o restante da página.
2. **Rolagem do botão CTA quando o elemento destino ainda não carregou:** A função de scroll deve verificar se o elemento `#minicurso` existe antes de executar a navegação suave.
3. **Redimensionamento de tela com aspect-ratio do vídeo (16:9):** O container do player do YouTube deve manter a proporção exata sem cortes em mobile (< 640px) ou desktop (> 1024px).
4. **Vazamento de memória (Memory Leak) na cena Three.js:** O hook de ciclo de vida (`useEffect`) deve descartar explicitamente geometrias, materiais, texturas e cancelar o `requestAnimationFrame` na desmontagem.
5. **Acessibilidade e navegação por teclado:** Botões e links devem ter foco visível e atributos `aria-label` adequados para leitores de tela.

---

### Task 1: Inicialização do Projeto Next.js, Tailwind CSS e Dependências

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tailwind.config.ts`
- Create: `postcss.config.mjs`
- Create: `next.config.mjs`
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`

**Interfaces:**
- Consumes: N/A
- Produces: Ambiente de build (`npm run build`), testes (`npm run test`) e tipagem (`npx tsc --noEmit`).

- [ ] **Step 1: Criar package.json com scripts e dependências do projeto**

```json
{
  "name": "landing-page-minicurso-github-educadores",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "three": "^0.170.0",
    "lucide-react": "^0.468.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.5"
  },
  "devDependencies": {
    "@types/node": "^22.10.1",
    "@types/react": "^19.0.1",
    "@types/react-dom": "^19.0.1",
    "@types/three": "^0.170.0",
    "@testing-library/react": "^16.1.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@vitejs/plugin-react": "^4.3.4",
    "vitest": "^2.1.8",
    "jsdom": "^25.0.1",
    "typescript": "^5.7.2",
    "tailwindcss": "^3.4.16",
    "postcss": "^8.4.49",
    "autoprefixer": "^10.4.20"
  }
}
```

- [ ] **Step 2: Criar tsconfig.json, tailwind.config.ts, postcss.config.mjs, next.config.mjs, vitest.config.ts**

Criar `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

Criar `tailwind.config.ts`:
```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0D1117",
        surface: "#161B22",
        "surface-border": "#30363D",
        primary: {
          DEFAULT: "#8A2BE2",
          hover: "#9d44e8",
          glow: "rgba(138, 43, 226, 0.45)",
        },
        accent: {
          DEFAULT: "#A855F7",
          cyan: "#00CED1",
        },
        text: {
          main: "#F0F0F0",
          muted: "#8B949E",
        },
      },
      fontFamily: {
        heading: ["var(--font-poppins)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 25px rgba(138, 43, 226, 0.4)",
        "glow-lg": "0 0 45px rgba(138, 43, 226, 0.55)",
      },
    },
  },
  plugins: [],
};
export default config;
```

Criar `postcss.config.mjs`:
```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

Criar `next.config.mjs`:
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
```

Criar `vitest.config.ts` e `src/test/setup.ts`:
```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

```ts
// src/test/setup.ts
import "@testing-library/jest-dom";
```

- [ ] **Step 3: Instalar as dependências via npm**

Run: `npm install`
Expected: Instalação bem-sucedida das dependências com `package-lock.json` gerado.

- [ ] **Step 4: Verificar tipagem e ambiente inicial**

Run: `npx tsc --noEmit`
Expected: PASS (sem erros).

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json tsconfig.json tailwind.config.ts postcss.config.mjs next.config.mjs vitest.config.ts src/test/setup.ts
git commit -m "chore: inicializar projeto nextjs, tailwind e vitest"
```

---

### Task 2: Central de Conteúdo e Tipos de Dados

**Files:**
- Create: `src/config/content.ts`
- Test: `src/config/__tests__/content.test.ts`

**Interfaces:**
- Produces: `SITE_CONTENT` com todas as constantes do minicurso (Hero, Intro, Objetivos, Vídeo, Quiz, Autor, Referências).

- [ ] **Step 1: Escrever teste de validação do arquivo de conteúdo**

```ts
// src/config/__tests__/content.test.ts
import { describe, it, expect } from "vitest";
import { SITE_CONTENT } from "../content";

describe("SITE_CONTENT", () => {
  it("contém os dados obrigatórios da especificação", () => {
    expect(SITE_CONTENT.hero.title).toBe(
      "GitHub para Educadores: Como Acompanhar a Evolução de Projetos de Alunos"
    );
    expect(SITE_CONTENT.hero.ctaText).toBe("Assista ao Minicurso Gratuito");
    expect(SITE_CONTENT.hero.ctaTargetId).toBe("minicurso");

    expect(SITE_CONTENT.objectives.items).toHaveLength(4);
    expect(SITE_CONTENT.author.name).toBe("Ruallyson Felype Travassos de Moura");
    expect(SITE_CONTENT.author.course).toBe("EaD - Educação à Distância");
    expect(SITE_CONTENT.references.items.length).toBeGreaterThanOrEqual(3);
  });

  it("garante links válidos para o vídeo e avaliação", () => {
    expect(SITE_CONTENT.video.youtubeEmbedUrl).toContain("youtube");
    expect(SITE_CONTENT.quiz.formUrl).toBeDefined();
  });
});
```

- [ ] **Step 2: Executar o teste para garantir que falha**

Run: `npm run test src/config/__tests__/content.test.ts`
Expected: FAIL com módulo não encontrado.

- [ ] **Step 3: Implementar `src/config/content.ts`**

```ts
// src/config/content.ts
export const SITE_CONTENT = {
  meta: {
    title: "GitHub para Educadores | Minicurso EaD",
    description:
      "Aprenda a utilizar o GitHub como uma poderosa ferramenta pedagógica para acompanhar projetos de alunos e fornecer feedback contínuo e formativo.",
  },
  hero: {
    badge: "Minicurso EaD • Gratuito",
    title: "GitHub para Educadores: Como Acompanhar a Evolução de Projetos de Alunos",
    subtitle:
      "Aprenda a utilizar o GitHub como uma poderosa ferramenta pedagógica para acompanhar projetos e fornecer feedback contínuo e eficaz.",
    ctaText: "Assista ao Minicurso Gratuito",
    ctaTargetId: "minicurso",
  },
  intro: {
    title: "Sobre o Minicurso",
    targetAudience: {
      title: "Público-Alvo",
      description:
        "Este minicurso foi desenhado para professores, orientadores e educadores que desejam modernizar seu processo de avaliação e acompanhar de perto a evolução de projetos estudantis (Ensino Médio, Técnico e Superior).",
    },
    prerequisites: {
      title: "Conhecimentos Prévios",
      description:
        "Familiaridade com os conceitos básicos de educação e gestão de turmas. Conhecimento prévio de Git/GitHub é um diferencial, mas não obrigatório para compreender a estratégia.",
    },
  },
  objectives: {
    title: "Ao final deste minicurso, você será capaz de:",
    items: [
      {
        id: "obj-1",
        title: "Princípios da Avaliação Formativa",
        description: "Compreender os princípios da avaliação formativa em ambientes digitais.",
      },
      {
        id: "obj-2",
        title: "Análise com Commits Semânticos",
        description: "Utilizar a estrutura de commits semânticos do GitHub para analisar o progresso de um aluno.",
      },
      {
        id: "obj-3",
        title: "Feedback Pontual e Assertivo",
        description: "Aplicar técnicas de feedback pontual diretamente no código ou documentação.",
      },
      {
        id: "obj-4",
        title: "Entregas Parciais com Releases",
        description: "Estruturar um processo de entregas parciais usando os recursos de 'Releases' e 'Tags' do GitHub.",
      },
    ],
  },
  video: {
    sectionId: "minicurso",
    title: "O Minicurso",
    subtitle: "Assista à aula completa e descubra como integrar o fluxo do GitHub à sua rotina pedagógica.",
    // Link de placeholder configurável para o YouTube (ID oficial ou de demonstração)
    youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    accessibilityNote: "Vídeo com legendas revisadas em português disponíveis no player.",
  },
  quiz: {
    title: "Teste seu Conhecimento",
    description:
      "Agora que você concluiu o vídeo, que tal testar o que aprendeu? Nossa avaliação interativa oferece feedback instantâneo para reforçar os conceitos.",
    buttonText: "Iniciar Avaliação",
    formUrl: "https://forms.google.com",
    badge: "Feedback Instantâneo",
  },
  author: {
    name: "Ruallyson Felype Travassos de Moura",
    course: "EaD - Educação à Distância",
    institution: "Projeto de Extensão Universitária",
    bio: "Desenvolvedor e pesquisador interessado em metodologias ativas, práticas pedagógicas inovadoras e tecnologias abertas aplicadas à educação.",
  },
  references: {
    title: "Referências e Material de Aprofundamento",
    items: [
      {
        id: "ref-1",
        title: "A Avaliação Desmistificada",
        author: "HADJI, Charles",
        year: "2001",
        description: "Fundamentos teóricos sobre avaliação formativa e feedback contínuo na aprendizagem ativa.",
        url: "https://www.scielo.br",
      },
      {
        id: "ref-2",
        title: "Conventional Commits Specification (v1.0.0)",
        author: "Conventional Commits Community",
        year: "2020",
        description: "Convenção para mensagens de commit padronizadas, essencial para rastrear o raciocínio do estudante.",
        url: "https://www.conventionalcommits.org/pt-br/v1.0.0/",
      },
      {
        id: "ref-3",
        title: "GitHub Classroom & Education Guides",
        author: "GitHub Education",
        year: "2024",
        description: "Guia oficial de boas práticas pedagógicas no acompanhamento de repositórios estudantis.",
        url: "https://education.github.com",
      },
    ],
  },
};
```

- [ ] **Step 4: Executar o teste e garantir que passa**

Run: `npm run test src/config/__tests__/content.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/config/content.ts src/config/__tests__/content.test.ts
git commit -m "feat: criar modulo de conteudo centralizado e testes de integridade"
```

---

### Task 3: Componentes Visuais Base (Button e Card)

**Files:**
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/Card.tsx`
- Test: `src/components/ui/__tests__/Button.test.tsx`
- Test: `src/components/ui/__tests__/Card.test.tsx`

**Interfaces:**
- Produces: `<Button variant="primary"|"secondary" asChild? ... />`
- Produces: `<Card glow? ... />`

- [ ] **Step 1: Escrever testes para Button e Card**

```tsx
// src/components/ui/__tests__/Button.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Button } from "../Button";

describe("Button component", () => {
  it("renderiza o texto e lida com clique", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Clique Aqui</Button>);
    const button = screen.getByRole("button", { name: "Clique Aqui" });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renderiza como link quando fornecido href", () => {
    render(<Button href="https://exemplo.com">Link Externo</Button>);
    const link = screen.getByRole("link", { name: "Link Externo" });
    expect(link).toHaveAttribute("href", "https://exemplo.com");
  });
});
```

```tsx
// src/components/ui/__tests__/Card.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Card } from "../Card";

describe("Card component", () => {
  it("renderiza o conteúdo e aplica classes de superfície escura", () => {
    render(<Card><span>Conteúdo do Card</span></Card>);
    expect(screen.getByText("Conteúdo do Card")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Executar testes para verificar falha**

Run: `npm run test src/components/ui/__tests__`
Expected: FAIL com componentes ausentes.

- [ ] **Step 3: Implementar `Button.tsx` e `Card.tsx`**

```tsx
// src/components/ui/Button.tsx
import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  href?: string;
  target?: string;
  rel?: string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  href,
  target,
  rel,
  className = "",
  children,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const sizeClasses = {
    sm: "px-4 py-2 text-sm gap-2",
    md: "px-6 py-3 text-base gap-2.5",
    lg: "px-8 py-4 text-lg gap-3",
  }[size];

  const variantClasses = {
    primary:
      "bg-primary hover:bg-primary-hover text-white shadow-glow hover:shadow-glow-lg active:scale-[0.98] border border-purple-400/30",
    secondary:
      "bg-surface hover:bg-surface-border text-text-main border border-surface-border hover:border-purple-500/50",
    outline:
      "bg-transparent hover:bg-purple-950/30 text-purple-300 border border-purple-500/50 hover:border-purple-400",
  }[variant];

  const finalClassName = `${baseClasses} ${sizeClasses} ${variantClasses} ${className}`;

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={target === "_blank" ? (rel || "noopener noreferrer") : rel}
        className={finalClassName}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={finalClassName} {...props}>
      {children}
    </button>
  );
};
```

```tsx
// src/components/ui/Card.tsx
import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  glow = false,
  className = "",
  children,
  ...props
}) => {
  const glowClass = glow
    ? "border-purple-500/40 shadow-glow"
    : "border-surface-border hover:border-purple-500/30";

  return (
    <div
      className={`rounded-2xl bg-surface/80 backdrop-blur-md border p-6 md:p-8 transition-all duration-300 ${glowClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
```

- [ ] **Step 4: Executar testes para verificar sucesso**

Run: `npm run test src/components/ui/__tests__`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/Button.tsx src/components/ui/Card.tsx src/components/ui/__tests__/
git commit -m "feat: criar componentes de interface Button e Card com testes"
```

---

### Task 4: Componente 3D - Grafo de Commits com Three.js

**Files:**
- Create: `src/components/3d/GitCommitGraph3D.tsx`
- Test: `src/components/3d/__tests__/GitCommitGraph3D.test.tsx`

**Interfaces:**
- Produces: `<GitCommitGraph3D className? />`
- Segue boas práticas: limpa geometrias, materiais e listeners no `useEffect`, respeita `prefers-reduced-motion` e lida com indisponibilidade de WebGL.

- [ ] **Step 1: Escrever teste de renderização e resiliência para o Canvas 3D**

```tsx
// src/components/3d/__tests__/GitCommitGraph3D.test.tsx
import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import GitCommitGraph3D from "../GitCommitGraph3D";

describe("GitCommitGraph3D", () => {
  it("renderiza o container do canvas sem disparar exceção", () => {
    const { container } = render(<GitCommitGraph3D />);
    expect(container.querySelector("canvas, div")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Executar teste para verificar falha**

Run: `npm run test src/components/3d/__tests__`
Expected: FAIL (módulo não encontrado).

- [ ] **Step 3: Implementar `GitCommitGraph3D.tsx` com Three.js completo e seguro**

```tsx
// src/components/3d/GitCommitGraph3D.tsx
"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export const GitCommitGraph3D: React.FC<{ className?: string }> = ({ className = "" }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Verificar preferência de movimento reduzido
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 1. Inicializar Cena, Câmera e Renderizador
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 12;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      currentMount.appendChild(renderer.domElement);
    } catch {
      // Fallback para ambientes sem WebGL
      return;
    }

    // 2. Luzes
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x8a2be2, 3, 50);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const cyanLight = new THREE.PointLight(0x00ced1, 2, 50);
    cyanLight.position.set(-5, -5, 5);
    scene.add(cyanLight);

    // 3. Estrutura do Grafo de Commits (Branches e Nós)
    const commitGroup = new THREE.Group();
    scene.add(commitGroup);

    // Posições simuladas de commits em 3 branches conectadas
    const commitPositions = [
      // Branch Main
      new THREE.Vector3(-6, 0, 0),
      new THREE.Vector3(-3, 0, 0),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(3, 0, 0),
      new THREE.Vector3(6, 0, 0),
      // Feature Branch 1
      new THREE.Vector3(-3, 0, 0),
      new THREE.Vector3(-1.5, 2, 1),
      new THREE.Vector3(1.5, 2, 1),
      new THREE.Vector3(3, 0, 0),
      // Feature Branch 2
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(1.5, -2, -1),
      new THREE.Vector3(4.5, -2, -1),
      new THREE.Vector3(6, 0, 0),
    ];

    const sphereGeometry = new THREE.SphereGeometry(0.35, 24, 24);
    const purpleMaterial = new THREE.MeshStandardMaterial({
      color: 0x8a2be2,
      emissive: 0x5a189a,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.8,
    });
    const cyanMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ced1,
      emissive: 0x008b8b,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.8,
    });

    const spheres: THREE.Mesh[] = [];
    commitPositions.forEach((pos, index) => {
      const material = index % 3 === 0 ? cyanMaterial : purpleMaterial;
      const sphere = new THREE.Mesh(sphereGeometry, material);
      sphere.position.copy(pos);
      commitGroup.add(sphere);
      spheres.push(sphere);
    });

    // Linhas de conexão (Branches)
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x8a2be2,
      transparent: true,
      opacity: 0.45,
      linewidth: 2,
    });

    const createBranchLine = (points: THREE.Vector3[]) => {
      const curve = new THREE.CatmullRomCurve3(points);
      const curvePoints = curve.getPoints(50);
      const geometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
      const line = new THREE.Line(geometry, lineMaterial);
      commitGroup.add(line);
      return { geometry, line };
    };

    const lines = [
      createBranchLine([
        new THREE.Vector3(-6, 0, 0),
        new THREE.Vector3(-3, 0, 0),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(3, 0, 0),
        new THREE.Vector3(6, 0, 0),
      ]),
      createBranchLine([
        new THREE.Vector3(-3, 0, 0),
        new THREE.Vector3(-1.5, 2, 1),
        new THREE.Vector3(1.5, 2, 1),
        new THREE.Vector3(3, 0, 0),
      ]),
      createBranchLine([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(1.5, -2, -1),
        new THREE.Vector3(4.5, -2, -1),
        new THREE.Vector3(6, 0, 0),
      ]),
    ];

    // Partículas estelares de fundo
    const particlesCount = 120;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      particlePositions[i] = (Math.random() - 0.5) * 35;
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

    // 4. Interação com o Mouse
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    if (!prefersReducedMotion) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    // 5. Responsividade no Redimensionamento
    const handleResize = () => {
      if (!currentMount || !renderer) return;
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // 6. Loop de Animação
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!prefersReducedMotion) {
        targetX += (mouseX - targetX) * 0.04;
        targetY += (mouseY - targetY) * 0.04;
        commitGroup.rotation.y = targetX * 0.6;
        commitGroup.rotation.x = -targetY * 0.4;
      }

      // Rotação suave contínua
      commitGroup.rotation.z += 0.001;
      particleSystem.rotation.y += 0.0005;

      renderer.render(scene, camera);
    };
    animate();

    // 7. Limpeza rigorosa para evitar Memory Leaks
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      sphereGeometry.dispose();
      purpleMaterial.dispose();
      cyanMaterial.dispose();
      lineMaterial.dispose();
      lines.forEach((l) => l.geometry.dispose());
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
      className={`absolute inset-0 pointer-events-none overflow-hidden opacity-75 ${className}`}
    />
  );
};

export default GitCommitGraph3D;
```

- [ ] **Step 4: Executar os testes**

Run: `npm run test src/components/3d/__tests__`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/3d/GitCommitGraph3D.tsx src/components/3d/__tests__/
git commit -m "feat: implementar componente 3D do grafo de commits com Three.js e ciclo de vida limpo"
```

---

### Task 5: Hero Section com 3D e Rolagem Suave

**Files:**
- Create: `src/components/sections/HeroSection.tsx`
- Test: `src/components/sections/__tests__/HeroSection.test.tsx`

**Interfaces:**
- Consumes: `SITE_CONTENT.hero`, `GitCommitGraph3D`, `Button`
- Produces: `<HeroSection />`

- [ ] **Step 1: Escrever teste para HeroSection**

```tsx
// src/components/sections/__tests__/HeroSection.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { HeroSection } from "../HeroSection";
import { SITE_CONTENT } from "@/config/content";

describe("HeroSection", () => {
  it("renderiza título, subtítulo e botão CTA com conteúdo correto", () => {
    render(<HeroSection />);
    expect(screen.getByText(SITE_CONTENT.hero.badge)).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(SITE_CONTENT.hero.title);
    expect(screen.getByText(SITE_CONTENT.hero.subtitle)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: SITE_CONTENT.hero.ctaText })).toBeInTheDocument();
  });

  it("chama scrollIntoView ao clicar no botão CTA", () => {
    const scrollIntoViewMock = vi.fn();
    const targetEl = document.createElement("div");
    targetEl.id = SITE_CONTENT.hero.ctaTargetId;
    targetEl.scrollIntoView = scrollIntoViewMock;
    document.body.appendChild(targetEl);

    render(<HeroSection />);
    const ctaButton = screen.getByRole("button", { name: SITE_CONTENT.hero.ctaText });
    fireEvent.click(ctaButton);

    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: "smooth" });
    document.body.removeChild(targetEl);
  });
});
```

- [ ] **Step 2: Executar teste para verificar falha**

Run: `npm run test src/components/sections/__tests__/HeroSection.test.tsx`
Expected: FAIL

- [ ] **Step 3: Implementar `HeroSection.tsx`**

```tsx
// src/components/sections/HeroSection.tsx
"use client";

import React from "react";
import dynamic from "next/dynamic";
import { SITE_CONTENT } from "@/config/content";
import { Button } from "@/components/ui/Button";
import { Play, Sparkles } from "lucide-react";

const GitCommitGraph3D = dynamic(() => import("@/components/3d/GitCommitGraph3D"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-background/50" />,
});

export const HeroSection: React.FC = () => {
  const { hero } = SITE_CONTENT;

  const handleScrollToTarget = () => {
    const targetElement = document.getElementById(hero.ctaTargetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="relative min-h-[92vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 pt-20 pb-16">
      {/* Elemento 3D interativo ao fundo */}
      <GitCommitGraph3D />

      {/* Gradientes decorativos para atmosfera tech */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-primary/20 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-10 w-[300px] h-[200px] bg-accent-cyan/15 blur-[120px] pointer-events-none rounded-full" />

      {/* Conteúdo Central do Hero */}
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Badge superior */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-purple-300 text-xs sm:text-sm font-medium mb-6 shadow-sm backdrop-blur-sm animate-fade-in">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>{hero.badge}</span>
        </div>

        {/* Título Principal com destaque */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-heading tracking-tight text-text-main leading-tight sm:leading-tight mb-6">
          GitHub para Educadores:{" "}
          <span className="bg-gradient-to-r from-purple-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
            Como Acompanhar a Evolução de Projetos de Alunos
          </span>
        </h1>

        {/* Subtítulo */}
        <p className="text-base sm:text-xl text-text-muted max-w-2xl mx-auto font-body mb-10 leading-relaxed">
          {hero.subtitle}
        </p>

        {/* Botão Call to Action */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button
            size="lg"
            onClick={handleScrollToTarget}
            aria-label={hero.ctaText}
            className="group"
          >
            <Play className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
            <span>{hero.ctaText}</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
```

- [ ] **Step 4: Executar teste para verificar sucesso**

Run: `npm run test src/components/sections/__tests__/HeroSection.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/HeroSection.tsx src/components/sections/__tests__/HeroSection.test.tsx
git commit -m "feat: implementar HeroSection com animacao, 3D e navegacao suave"
```

---

### Task 6: Seções de Introdução e Objetivos de Aprendizagem

**Files:**
- Create: `src/components/sections/IntroSection.tsx`
- Create: `src/components/sections/ObjectivesSection.tsx`
- Test: `src/components/sections/__tests__/IntroSection.test.tsx`
- Test: `src/components/sections/__tests__/ObjectivesSection.test.tsx`

**Interfaces:**
- Consumes: `SITE_CONTENT.intro`, `SITE_CONTENT.objectives`, `Card`
- Produces: `<IntroSection />`, `<ObjectivesSection />`

- [ ] **Step 1: Escrever testes para IntroSection e ObjectivesSection**

```tsx
// src/components/sections/__tests__/IntroSection.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { IntroSection } from "../IntroSection";
import { SITE_CONTENT } from "@/config/content";

describe("IntroSection", () => {
  it("renderiza o público-alvo e conhecimentos prévios", () => {
    render(<IntroSection />);
    expect(screen.getByText(SITE_CONTENT.intro.targetAudience.title)).toBeInTheDocument();
    expect(screen.getByText(SITE_CONTENT.intro.prerequisites.title)).toBeInTheDocument();
  });
});
```

```tsx
// src/components/sections/__tests__/ObjectivesSection.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ObjectivesSection } from "../ObjectivesSection";
import { SITE_CONTENT } from "@/config/content";

describe("ObjectivesSection", () => {
  it("renderiza os 4 objetivos de aprendizagem com seus títulos", () => {
    render(<ObjectivesSection />);
    expect(screen.getByRole("heading", { name: SITE_CONTENT.objectives.title })).toBeInTheDocument();
    SITE_CONTENT.objectives.items.forEach((item) => {
      expect(screen.getByText(item.title)).toBeInTheDocument();
    });
  });
});
```

- [ ] **Step 2: Executar testes para verificar falha**

Run: `npm run test src/components/sections/__tests__/IntroSection.test.tsx src/components/sections/__tests__/ObjectivesSection.test.tsx`
Expected: FAIL

- [ ] **Step 3: Implementar `IntroSection.tsx` e `ObjectivesSection.tsx`**

```tsx
// src/components/sections/IntroSection.tsx
import React from "react";
import { SITE_CONTENT } from "@/config/content";
import { Card } from "@/components/ui/Card";
import { Users, GraduationCap } from "lucide-react";

export const IntroSection: React.FC = () => {
  const { intro } = SITE_CONTENT;

  return (
    <section id="sobre" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-4xl font-bold font-heading text-text-main">
          {intro.title}
        </h2>
        <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="flex flex-col gap-4 border-purple-500/20 hover:border-purple-500/50">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-purple-300">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold font-heading text-text-main">
            {intro.targetAudience.title}
          </h3>
          <p className="text-text-muted leading-relaxed font-body">
            {intro.targetAudience.description}
          </p>
        </Card>

        <Card className="flex flex-col gap-4 border-purple-500/20 hover:border-purple-500/50">
          <div className="w-12 h-12 rounded-xl bg-accent-cyan/15 flex items-center justify-center text-cyan-300">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold font-heading text-text-main">
            {intro.prerequisites.title}
          </h3>
          <p className="text-text-muted leading-relaxed font-body">
            {intro.prerequisites.description}
          </p>
        </Card>
      </div>
    </section>
  );
};
```

```tsx
// src/components/sections/ObjectivesSection.tsx
import React from "react";
import { SITE_CONTENT } from "@/config/content";
import { Card } from "@/components/ui/Card";
import { CheckCircle2, GitCommit, MessageSquareCode, Tags } from "lucide-react";

const icons = [CheckCircle2, GitCommit, MessageSquareCode, Tags];

export const ObjectivesSection: React.FC = () => {
  const { objectives } = SITE_CONTENT;

  return (
    <section id="objetivos" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <span className="text-xs uppercase tracking-wider text-purple-400 font-semibold">
          Competências Desenvolvidas
        </span>
        <h2 className="text-2xl sm:text-4xl font-bold font-heading text-text-main mt-2">
          {objectives.title}
        </h2>
        <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {objectives.items.map((item, index) => {
          const Icon = icons[index % icons.length];
          return (
            <Card
              key={item.id}
              className="group hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-purple-400 mb-5 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold font-heading text-text-main mb-2">
                  {item.title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed font-body">
                  {item.description}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-surface-border text-xs text-purple-400 font-medium">
                Módulo 0{index + 1}
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
```

- [ ] **Step 4: Executar testes para verificar sucesso**

Run: `npm run test src/components/sections/__tests__/IntroSection.test.tsx src/components/sections/__tests__/ObjectivesSection.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/IntroSection.tsx src/components/sections/ObjectivesSection.tsx src/components/sections/__tests__/
git commit -m "feat: implementar secoes IntroSection e ObjectivesSection com testes"
```

---

### Task 7: Player de Vídeo Responsivo e Avaliação Interativa

**Files:**
- Create: `src/components/sections/VideoSection.tsx`
- Create: `src/components/sections/QuizSection.tsx`
- Test: `src/components/sections/__tests__/VideoSection.test.tsx`
- Test: `src/components/sections/__tests__/QuizSection.test.tsx`

**Interfaces:**
- Consumes: `SITE_CONTENT.video`, `SITE_CONTENT.quiz`, `Button`, `Card`
- Produces: `<VideoSection />`, `<QuizSection />`

- [ ] **Step 1: Escrever testes para VideoSection e QuizSection**

```tsx
// src/components/sections/__tests__/VideoSection.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { VideoSection } from "../VideoSection";
import { SITE_CONTENT } from "@/config/content";

describe("VideoSection", () => {
  it("renderiza o player do youtube com iframe acessível e nota de legendas", () => {
    render(<VideoSection />);
    const iframe = screen.getByTitle("Player do Minicurso");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute("src", SITE_CONTENT.video.youtubeEmbedUrl);
    expect(screen.getByText(SITE_CONTENT.video.accessibilityNote)).toBeInTheDocument();
  });
});
```

```tsx
// src/components/sections/__tests__/QuizSection.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { QuizSection } from "../QuizSection";
import { SITE_CONTENT } from "@/config/content";

describe("QuizSection", () => {
  it("renderiza botão de avaliação com target blank e rel seguro", () => {
    render(<QuizSection />);
    const button = screen.getByRole("link", { name: new RegExp(SITE_CONTENT.quiz.buttonText, "i") });
    expect(button).toHaveAttribute("href", SITE_CONTENT.quiz.formUrl);
    expect(button).toHaveAttribute("target", "_blank");
    expect(button).toHaveAttribute("rel", "noopener noreferrer");
  });
});
```

- [ ] **Step 2: Executar testes para verificar falha**

Run: `npm run test src/components/sections/__tests__/VideoSection.test.tsx src/components/sections/__tests__/QuizSection.test.tsx`
Expected: FAIL

- [ ] **Step 3: Implementar `VideoSection.tsx` e `QuizSection.tsx`**

```tsx
// src/components/sections/VideoSection.tsx
import React from "react";
import { SITE_CONTENT } from "@/config/content";
import { Subtitles } from "lucide-react";

export const VideoSection: React.FC = () => {
  const { video } = SITE_CONTENT;

  return (
    <section
      id={video.sectionId}
      className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto scroll-mt-10"
    >
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-4xl font-bold font-heading text-text-main">
          {video.title}
        </h2>
        <p className="text-text-muted mt-2 font-body max-w-xl mx-auto">
          {video.subtitle}
        </p>
        <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full" />
      </div>

      {/* Moldura do Vídeo com Proporção 16:9 */}
      <div className="relative rounded-2xl overflow-hidden border border-purple-500/30 bg-surface shadow-glow">
        <div className="relative w-full aspect-video">
          <iframe
            src={video.youtubeEmbedUrl}
            title="Player do Minicurso"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        </div>
      </div>

      {/* Nota de Acessibilidade */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs sm:text-sm text-text-muted">
        <Subtitles className="w-4 h-4 text-purple-400" />
        <span>{video.accessibilityNote}</span>
      </div>
    </section>
  );
};
```

```tsx
// src/components/sections/QuizSection.tsx
import React from "react";
import { SITE_CONTENT } from "@/config/content";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ExternalLink, HelpCircle } from "lucide-react";

export const QuizSection: React.FC = () => {
  const { quiz } = SITE_CONTENT;

  return (
    <section id="avaliacao" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <Card
        glow
        className="text-center py-12 px-6 sm:px-12 flex flex-col items-center bg-gradient-to-b from-surface to-surface/90 border-purple-500/40"
      >
        <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-purple-300 mb-6 shadow-glow">
          <HelpCircle className="w-8 h-8" />
        </div>

        <span className="text-xs uppercase tracking-wider text-purple-400 font-semibold mb-2">
          {quiz.badge}
        </span>

        <h2 className="text-2xl sm:text-4xl font-bold font-heading text-text-main mb-4">
          {quiz.title}
        </h2>

        <p className="text-text-muted text-base sm:text-lg max-w-2xl font-body mb-8 leading-relaxed">
          {quiz.description}
        </p>

        <Button
          size="lg"
          href={quiz.formUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group"
        >
          <span>{quiz.buttonText}</span>
          <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Button>
      </Card>
    </section>
  );
};
```

- [ ] **Step 4: Executar testes para verificar sucesso**

Run: `npm run test src/components/sections/__tests__/VideoSection.test.tsx src/components/sections/__tests__/QuizSection.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/VideoSection.tsx src/components/sections/QuizSection.tsx src/components/sections/__tests__/
git commit -m "feat: implementar secoes VideoSection e QuizSection com testes"
```

---

### Task 8: Autor, Referências Acadêmicas e Montagem Completa da Página

**Files:**
- Create: `src/components/sections/FooterSection.tsx`
- Create: `src/app/globals.css`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Test: `src/components/sections/__tests__/FooterSection.test.tsx`
- Test: `src/app/__tests__/page.test.tsx`

**Interfaces:**
- Consumes: Todas as seções criadas anteriormente
- Produces: Página Single Page Application completa pronta para renderização.

- [ ] **Step 1: Escrever testes para FooterSection e page.tsx**

```tsx
// src/components/sections/__tests__/FooterSection.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { FooterSection } from "../FooterSection";
import { SITE_CONTENT } from "@/config/content";

describe("FooterSection", () => {
  it("renderiza o nome do autor, disciplina e lista de referências", () => {
    render(<FooterSection />);
    expect(screen.getByText(new RegExp(SITE_CONTENT.author.name, "i"))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(SITE_CONTENT.author.course, "i"))).toBeInTheDocument();

    SITE_CONTENT.references.items.forEach((ref) => {
      expect(screen.getByText(ref.title)).toBeInTheDocument();
    });
  });
});
```

```tsx
// src/app/__tests__/page.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Home from "../page";

describe("Home Page SPA", () => {
  it("renderiza todas as seções principais da página", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Sobre o Minicurso/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Ao final deste minicurso/i })).toBeInTheDocument();
    expect(screen.getByTitle("Player do Minicurso")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Executar testes para verificar falha**

Run: `npm run test src/components/sections/__tests__/FooterSection.test.tsx src/app/__tests__/page.test.tsx`
Expected: FAIL

- [ ] **Step 3: Implementar `FooterSection.tsx`, `globals.css`, `layout.tsx` e `page.tsx`**

```tsx
// src/components/sections/FooterSection.tsx
import React from "react";
import { SITE_CONTENT } from "@/config/content";
import { Card } from "@/components/ui/Card";
import { BookOpen, ExternalLink, UserCheck } from "lucide-react";

export const FooterSection: React.FC = () => {
  const { author, references } = SITE_CONTENT;

  return (
    <footer id="creditos" className="border-t border-surface-border bg-surface/50 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-12">
        {/* Bloco do Autor */}
        <Card className="border-purple-500/30 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-purple-300 shrink-0 shadow-glow">
            <UserCheck className="w-8 h-8" />
          </div>
          <div className="text-center sm:text-left">
            <span className="text-xs uppercase tracking-wider text-purple-400 font-semibold">
              Desenvolvimento e Autoria
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-text-main mt-1">
              {author.name}
            </h3>
            <p className="text-purple-300 text-sm font-medium mt-0.5">
              Projeto desenvolvido para a disciplina: <span className="text-text-main font-semibold">{author.course}</span>
            </p>
            <p className="text-text-muted text-sm mt-3 leading-relaxed font-body">
              {author.bio}
            </p>
          </div>
        </Card>

        {/* Referências Recomendadas */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="w-5 h-5 text-purple-400" />
            <h3 className="text-xl font-bold font-heading text-text-main">
              {references.title}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {references.items.map((ref) => (
              <a
                key={ref.id}
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-5 rounded-xl bg-surface border border-surface-border hover:border-purple-500/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-text-main group-hover:text-purple-300 transition-colors text-sm">
                      {ref.title}
                    </h4>
                    <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-purple-300 shrink-0" />
                  </div>
                  <p className="text-xs text-purple-400 mt-1 font-mono">
                    {ref.author} ({ref.year})
                  </p>
                  <p className="text-xs text-text-muted mt-3 leading-relaxed">
                    {ref.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-surface-border pt-8 text-center text-xs text-text-muted">
          <p>© {new Date().getFullYear()} {author.name}. Minicurso EaD - Avaliação Formativa com GitHub.</p>
        </div>
      </div>
    </footer>
  );
};
```

```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #0D1117;
  --foreground: #F0F0F0;
}

body {
  background-color: var(--background);
  color: var(--foreground);
  overflow-x: hidden;
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  html, body {
    scroll-behavior: auto !important;
  }
}
```

```tsx
// src/app/layout.tsx
import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { SITE_CONTENT } from "@/config/content";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: SITE_CONTENT.meta.title,
  description: SITE_CONTENT.meta.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${poppins.variable} ${inter.variable}`}>
      <body className="bg-background text-text-main font-body antialiased selection:bg-primary selection:text-white">
        {children}
      </body>
    </html>
  );
}
```

```tsx
// src/app/page.tsx
import React from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { IntroSection } from "@/components/sections/IntroSection";
import { ObjectivesSection } from "@/components/sections/ObjectivesSection";
import { VideoSection } from "@/components/sections/VideoSection";
import { QuizSection } from "@/components/sections/QuizSection";
import { FooterSection } from "@/components/sections/FooterSection";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      <HeroSection />
      <IntroSection />
      <ObjectivesSection />
      <VideoSection />
      <QuizSection />
      <FooterSection />
    </main>
  );
}
```

- [ ] **Step 4: Executar suite de testes completa**

Run: `npm run test`
Expected: PASS (todos os testes passando)

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/FooterSection.tsx src/app/ src/components/sections/__tests__/FooterSection.test.tsx
git commit -m "feat: implementar FooterSection e composicao final da SPA em page.tsx"
```

---

### Task 9: Validação Final, Acessibilidade, Typecheck e Build de Produção

**Files:**
- Test: Executar `npm run test`
- Check: Executar `npm run typecheck`
- Build: Executar `npm run build`

**Interfaces:**
- Produces: Artefatos de build na pasta `.next/` prontos para deploy na Vercel sem nenhum erro.

- [ ] **Step 1: Executar typecheck completo**

Run: `npx tsc --noEmit`
Expected: Saída limpa com zero erros de compilação TypeScript.

- [ ] **Step 2: Executar todos os testes automatizados unitários e de integração**

Run: `npm run test`
Expected: 100% dos testes passando.

- [ ] **Step 3: Compilar o build de produção do Next.js**

Run: `npm run build`
Expected: Build concluído com sucesso, gerando as páginas estáticas otimizadas para a Vercel.

- [ ] **Step 4: Commit das atualizações finais**

```bash
git add .
git commit -m "chore: concluir validacao de build e testes da landing page"
```
