import { calculerScores, determinerCodeHolland, RIASEC_QUESTIONS, ScoresRiasec } from './riasec-data';

describe('riasec-data', () => {
  it('RIASEC_QUESTIONS contient exactement 60 questions, 10 par dimension', () => {
    expect(RIASEC_QUESTIONS.length).toBe(60);
    for (const dim of ['R', 'I', 'A', 'S', 'E', 'C'] as const) {
      expect(RIASEC_QUESTIONS.filter(q => q.dimension === dim).length).toBe(10);
    }
  });

  it("chaque question a un id unique de 1 à 60", () => {
    const ids = RIASEC_QUESTIONS.map(q => q.id).sort((a, b) => a - b);
    expect(ids).toEqual(Array.from({ length: 60 }, (_, i) => i + 1));
  });

  describe('calculerScores', () => {
    it('additionne les réponses par dimension', () => {
      const reponses: Record<number, number> = {};
      RIASEC_QUESTIONS.forEach(q => { reponses[q.id] = q.dimension === 'R' ? 5 : 1; });
      const scores = calculerScores(reponses);
      expect(scores.R).toBe(50);
      expect(scores.I).toBe(10);
    });

    it('traite les réponses manquantes comme 0', () => {
      const scores = calculerScores({});
      expect(scores).toEqual({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 });
    });
  });

  describe('determinerCodeHolland', () => {
    it('retourne les 3 lettres aux scores les plus hauts, par ordre décroissant', () => {
      const scores: ScoresRiasec = { R: 10, I: 50, A: 40, S: 20, E: 30, C: 15 };
      expect(determinerCodeHolland(scores)).toBe('IAE');
    });

    it("utilise l'ordre canonique R-I-A-S-E-C en cas d'égalité", () => {
      const scores: ScoresRiasec = { R: 30, I: 30, A: 30, S: 10, E: 10, C: 10 };
      expect(determinerCodeHolland(scores)).toBe('RIA');
    });
  });
});
