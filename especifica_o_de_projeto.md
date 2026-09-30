# Especificação de Projeto para IA de Desenvolvimento Web

**Objetivo Primário:** Criar uma landing page moderna, visualmente impressionante e funcional para um minicurso EaD. O site deve ser hospedado na Vercel.

Tecnologias Recomendadas:

*   **Framework:** Next.js ou Astro (foco em performance).
*   **Estilização:** Tailwind CSS para agilidade e design moderno.
*   **Animações:** Framer Motion ou GSAP para animações de entrada e interações suaves.
*   **Elementos 3D:** Three.js ou Spline para criar um elemento visual impactante no cabeçalho.

---

## 1. Conteúdo e Estrutura da Landing Page

A página deve ser um site de página única (Single Page Application) com as seguintes seções, em ordem:

### Seção 1: Cabeçalho (Hero Section)

*   **Objetivo:** Capturar a atenção do visitante imediatamente com um design sofisticado.
*   **Título (Escolha um):**
    1.  `Estratégias de Avaliação Formativa em Ambientes Digitais: Acompanhando a Aprendizagem com GitHub`
    2.  `GitHub para Educadores: Como Acompanhar a Evolução de Projetos de Alunos`
*   **Subtítulo:** `Aprenda a utilizar o GitHub como uma poderosa ferramenta pedagógica para acompanhar projetos e fornecer feedback contínuo e eficaz.`
*   **Botão (Call-to-Action):** `Assista ao Minicurso Gratuito` (deve ter uma rolagem suave para a Seção 4).
*   **Diretriz Visual:**
    *   **Elemento 3D:** Implementar um objeto 3D sutil e interativo no plano de fundo. Sugestão: uma visualização abstrata de um grafo de commits ou formas geométricas que reagem suavemente ao movimento do mouse.
    *   **Animação:** Textos e botão devem surgir com uma animação elegante (ex: fade-in e leve slide-up).

### Seção 2: Introdução

*   **Objetivo:** Conectar-se com o público-alvo e definir as expectativas.
*   **Público-Alvo:** `Este minicurso foi desenhado para **professores, orientadores e educadores** que desejam modernizar seu processo de avaliação e acompanhar de perto a evolução de projetos estudantis (Ensino Médio, Técnico e Superior).`
*   **Conhecimentos Prévios:** `Familiaridade com os conceitos básicos de educação e gestão de turmas. Conhecimento prévio de Git/GitHub é um diferencial, mas não obrigatório para compreender a estratégia.`
*   **Animação:** A seção inteira deve surgir com um efeito de fade-in conforme o usuário rola a página.

### Seção 3: Objetivos de Aprendizagem

*   **Objetivo:** Deixar claro o valor e o conhecimento que será adquirido.
*   **Título:** `Ao final deste minicurso, você será capaz de:`
*   **Lista de Objetivos:**
    *   `Compreender os princípios da avaliação formativa em ambientes digitais.`
    *   `Utilizar a estrutura de commits semânticos do GitHub para analisar o progresso de um aluno.`
    *   `Aplicar técnicas de feedback pontual diretamente no código ou documentação.`
    *   `Estruturar um processo de entregas parciais usando os recursos de "Releases" e "Tags" do GitHub.`
*   **Animação:** Aplicar um efeito "stagger" para que cada item da lista apareça em sequência.

### Seção 4: O Minicurso (Vídeo Principal)

*   **Objetivo:** Apresentar o conteúdo educacional de forma acessível.
*   **Título:** `O Minicurso`
*   **Elemento Central:** Incorporar o player do YouTube (responsivo) com o vídeo do minicurso.
*   **Requisito de Acessibilidade:** O vídeo deve ter legendas revisadas.

### Seção 5: Avaliação Interativa

*   **Objetivo:** Engajar o usuário e reforçar o aprendizado.
*   **Título:** `Teste seu Conhecimento`
*   **Texto de Apoio:** `Agora que você concluiu o vídeo, que tal testar o que aprendeu? Nossa avaliação interativa oferece feedback instantâneo para reforçar os conceitos.`
*   **Botão:** `Iniciar Avaliação` (o link deve abrir o formulário do Genially/Google Forms em uma nova aba).

### Seção 6: Autor e Referências

*   **Objetivo:** Fornecer os créditos e material para aprofundamento.
*   **Autor:** `Minicurso desenvolvido por **Ruallyson Felype Travassos de Moura** como projeto para a disciplina **'EaD - Educação à Distância'**.`
*   **Referências:** `Para aprofundar seus estudos, recomendamos os seguintes materiais:`
    *   Ação para a IA: Busque e adicione 2-3 links de artigos de alta qualidade sobre "Avaliação Formativa" e "Conventional Commits" (padrão de commits semânticos).

---

## 2. Diretrizes Gerais de Design e UX

*   **Paleta de Cores:**
    *   Fundo: Um tom escuro e sofisticado, como azul-noite (`#0D1117`) ou cinza-chumbo (`#1A1A1A`).
    *   Texto: Branco ou cinza claro (`#F0F0F0`) para garantir legibilidade.
    *   Destaque (Botões, links): Roxo vibrante (`#8A2BE2`) ou um verde-água (`#00CED1`) para contraste e identidade.

*   **Tipografia:**
    *   Títulos: `Poppins` ou `Montserrat` (peso: `SemiBold`).
    *   Texto: `Inter` ou `Lato` (peso: `Regular`).

*   **Layout e UX:**
    *   O design deve ser limpo, com amplo uso de espaço em branco.
    *   A página deve ser totalmente responsiva, com uma experiência de uso impecável em desktops, tablets e celulares.
    *   As animações devem ser fluidas e não devem atrapalhar o desempenho do site.

***

Este documento contém tudo o que a IA precisa para executar a tarefa. Espero que ajude no seu projeto!
Há mais alguma coisa em que posso te auxiliar?