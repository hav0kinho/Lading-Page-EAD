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
