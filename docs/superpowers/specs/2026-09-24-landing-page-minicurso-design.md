# Especificação de Design: Landing Page para Minicurso EaD

**Projeto:** Landing Page do Minicurso EaD - "GitHub para Educadores"  
**Autor do Conteúdo:** Ruallyson Felype Travassos de Moura  
**Disciplina:** EaD - Educação à Distância  
**Data:** 2026-09-24  
**Status:** Aprovado para Planejamento de Implementação  
**Plataforma de Deploy:** Vercel  

---

## 1. Visão Geral e Objetivos

O projeto consiste no desenvolvimento de uma landing page moderna, responsiva, visualmente impressionante e funcional no formato Single Page Application (SPA), voltada para a divulgação de um minicurso gratuito sobre avaliação formativa com GitHub no contexto de Educação à Distância.

### Metas Principais:
1. **Engajamento Imediato:** Apresentar uma Seção Hero impactante com visual escuro elegante, tipografia refinada e uma cena 3D interativa de grafo de commits do Git desenvolvida com Three.js.
2. **Clareza Pedagógica:** Estruturar claramente o público-alvo, os pré-requisitos e os objetivos instrucionais em cartões visuais com animações progressivas (stagger).
3. **Consumo Direto de Mídia:** Incorporar o player do YouTube de forma responsiva (16:9) e acessível, com sinalização clara de legendas revisadas.
4. **Interatividade e Avaliação:** Conectar o estudante a uma avaliação formativa externa (Google Forms/Genially) com feedback imediato.
5. **Autoria e Referências Acadêmicas:** Exibir créditos formais e referências de alto impacto sobre Avaliação Formativa e Commits Semânticos (Conventional Commits).

---

## 2. Pilha Tecnológica (Tech Stack)

* **Framework Base:** Next.js (App Router) com TypeScript
  * *Motivo:* Framework recomendado pela Vercel, suporte nativo a otimização de fontes (`next/font`), renderização de alta performance e metadados SEO/OG automáticos.
* **Estilização e Design System:** Tailwind CSS
  * *Paleta:* Fundo escuro azul-noite (`#0D1117`), texto claro legível (`#F0F0F0`), destaques em roxo vibrante (`#8A2BE2`) com variações de violeta e sombras em glow.
  * *Tipografia:* Títulos em **Poppins** (SemiBold / Bold) e textos em **Inter** (Regular / Medium).
* **Gráficos 3D:** Three.js
  * Implementação modular de um grafo de commits 3D interativo com nós reflexivos, branches conectadas e reação sutil ao cursor do mouse.
  * Importação dinâmica via `next/dynamic` com `ssr: false` para zero bloqueio do carregamento inicial.
* **Ícones:** Lucide React (ícones limpos para Git, reprodução, avaliação e links externos).
* **Testes e Qualidade:** Jest / React Testing Library ou Vitest, TypeScript Type-Checking (`tsc --noEmit`).

---

## 3. Arquitetura e Estrutura de Arquivos

```text
/
├── docs/
│   └── superpowers/
│       └── specs/
│           └── 2026-09-24-landing-page-minicurso-design.md
├── public/
│   ├── favicon.ico
│   └── images/
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Configuração de fontes, meta tags SEO/OpenGraph e tema escuro
│   │   ├── page.tsx           # Composição das seções da Landing Page
│   │   └── globals.css        # Reset, variáveis CSS e utilitários de animação/glow
│   ├── components/
│   │   ├── 3d/
│   │   │   └── GitCommitGraph3D.tsx  # Canvas Three.js interativo (nós de commit, branches e partículas)
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx       # Título direto, subtítulo, botão CTA com scroll suave e 3D
│   │   │   ├── IntroSection.tsx      # Público-alvo e conhecimentos prévios (Cards com glassmorphism)
│   │   │   ├── ObjectivesSection.tsx # Grid com 4 objetivos instrucionais e animação stagger
│   │   │   ├── VideoSection.tsx      # Player do YouTube embutido (responsivo 16:9) e aviso de acessibilidade
│   │   │   ├── QuizSection.tsx       # Card de convite para o teste prático de fixação
│   │   │   └── FooterSection.tsx     # Autor (Ruallyson), disciplina EaD e links de referências
│   │   └── ui/
│   │       ├── Button.tsx            # Botão interativo com variantes (primário com glow roxo, secundário)
│   │       └── Card.tsx              # Container modular escuro com borda translúcida sutil
│   └── config/
│       └── content.ts         # Arquivo único de configuração de textos, links, vídeo e referências
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.mjs
```

---

## 4. Detalhamento dos Componentes e Conteúdo

### 4.1. Central de Conteúdo (`src/config/content.ts`)
Para garantir máxima facilidade de manutenção futura pelo autor:
* **Título do Hero:** `"GitHub para Educadores: Como Acompanhar a Evolução de Projetos de Alunos"`
* **Subtítulo:** `"Aprenda a utilizar o GitHub como uma poderosa ferramenta pedagógica para acompanhar projetos e fornecer feedback contínuo e eficaz."`
* **Botão CTA:** `"Assista ao Minicurso Gratuito"` apontando para `#minicurso` via scroll suave.
* **Vídeo ID/URL:** URL padrão do YouTube (configurado com ID de placeholder e fallback demonstrativo).
* **Link de Avaliação:** Link configurável com placeholder para Google Forms ou Genially.
* **Autor:** `"Ruallyson Felype Travassos de Moura"`, disciplina `"EaD - Educação à Distância"`.
* **Referências Inclusas:**
  1. *Hadji, Charles (2001)* – *A Avaliação Desmistificada: Fundamentos da Avaliação Formativa*.
  2. *Conventional Commits Specification (v1.0.0)* – Diretrizes para histórico de commits padronizado.
  3. *GitHub Education (2024)* – Guia prático de acompanhamento e feedback formativo com pull requests e issues.

### 4.2. Seção 1: Hero (`HeroSection.tsx`)
* Fundo escuro imersivo com a cena 3D `GitCommitGraph3D` posicionada em camada traseira com opacidade equilibrada.
* Tag de identificação: `"Minicurso EaD • Gratuito"`.
* Título com destaque gradiente roxo e branco em tipografia Poppins SemiBold.
* Botão primário estilizado com sombra roxa difusa (`box-shadow: 0 0 25px rgba(138, 43, 226, 0.45)`) e ícone de play.
* Rolagem suave nativa para o player de vídeo.

### 4.3. Cena 3D (`GitCommitGraph3D.tsx`)
* Instancia uma cena Three.js contendo:
  - Nós esféricos dispostos no espaço simulando commits em múltiplas branches.
  - Conexões tubulares/linhas luminosas entre os nós indicando o fluxo de histórico Git.
  - Partículas orbitais no ambiente.
* Interação: A câmera e rotação do grafo reagem suavemente ao vetor normalizado do mouse `(x, y)` via interpolação linear (`lerp`).
* Ciclo de Vida: Desmontagem limpa de geometrias e materiais no `useEffect` para evitar vazamentos de memória (memory leaks). Suporte a redução de movimento.

### 4.4. Seção 2: Introdução (`IntroSection.tsx`)
* Dois blocos de destaque lado a lado (em desktop) ou empilhados (em mobile):
  - **Público-Alvo:** Destinado a professores, orientadores e educadores de Ensino Médio, Técnico e Superior que desejam aprimorar a avaliação contínua.
  - **Conhecimentos Prévios:** Conceitos pedagógicos básicos e gestão de turmas. Git/GitHub é diferencial, mas não pré-requisito.

### 4.5. Seção 3: Objetivos de Aprendizagem (`ObjectivesSection.tsx`)
* Título: `"Ao final deste minicurso, você será capaz de:"`
* Grid de 4 competências com ícones temáticos (CheckCircle, GitCommit, MessageSquare, Tag):
  1. Compreender os princípios da avaliação formativa em ambientes digitais;
  2. Utilizar a estrutura de commits semânticos para diagnosticar o progresso do aluno;
  3. Aplicar técnicas de feedback pontual diretamente em código e documentação;
  4. Estruturar entregas parciais utilizando releases e tags.

### 4.6. Seção 4: O Minicurso (`VideoSection.tsx`)
* Identificador `#minicurso` para destino da ancoragem suave do Hero.
* Container com aspect ratio 16:9, borda sutil e sombra violeta.
* Embed do player oficial do YouTube com parâmetros de privacidade aprimorada (`youtube-nocookie.com`).
* Tag informativa de acessibilidade: `"Legendas em português revisadas e disponíveis no player"`.

### 4.7. Seção 5: Avaliação Interativa (`QuizSection.tsx`)
* Chamada para reforço de aprendizado com feedback imediato.
* Botão `"Iniciar Avaliação"` abrindo em nova aba com `target="_blank"` e `rel="noopener noreferrer"`.

### 4.8. Seção 6: Autor e Referências (`FooterSection.tsx`)
* Bloco de autoria destacando Ruallyson Felype Travassos de Moura e a disciplina de EaD.
* Lista de links externos para artigos recomendados com resumos concisos de cada obra.
* Rodapé institucional e links de retorno ao topo.

---

## 5. Requisitos Não-Funcionais e Acessibilidade

1. **Acessibilidade (WCAG 2.1 AA):**
   - Relação de contraste mínima de 4.5:1 para textos em relação ao fundo `#0D1117`.
   - Foco visual nítido para navegação por teclado (`Tab`).
   - Atributos `aria-label` apropriados em todos os botões e links de navegação.
2. **Performance e Carregamento:**
   - Carregamento assíncrono da biblioteca Three.js.
   - Fontes servidas localmente por meio de `next/font/google`.
   - Compatibilidade total com geração estática para entrega imediata na CDN da Vercel.
3. **Responsividade:**
   - Visualização otimizada para dispositivos móveis (< 640px), tablets (640px - 1024px) e desktops (> 1024px).

---

## 6. Verificação e Testes

* **Validação de Tipos:** `npx tsc --noEmit` sem erros.
* **Compilação de Produção:** `npm run build` gerando bundle estático sem alertas impeditivos.
* **Testes Automatizados:** Testes com Jest/React Testing Library validando:
  - Renderização dos títulos principais e nome do autor;
  - Presença dos 4 objetivos de aprendizagem;
  - Presença dos atributos acessíveis e de segurança em links externos e no player.
