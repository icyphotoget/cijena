import perfumes from '../data/perfumes.json';
import type { QuestionnaireAnswers } from '../screens/QuestionnaireScreen';

type Perfume = typeof perfumes[number];

export type Recommendation = {
  perfume: Perfume;
  score: number;
  reasons: string[];
};

export function recommendPerfumes(
  answers: QuestionnaireAnswers,
  limit = 3
): Recommendation[] {
  const scored = perfumes.map((p) => {
    let score = 0;
    const reasons: string[] = [];

    if (p.season.includes(answers.season)) {
      score += 2;
      reasons.push('odgovara sezoni');
    }

    if (p.occasion.includes(answers.occasion)) {
      score += 3;
      reasons.push('odgovara prilici');
    }

    if (p.intensity === answers.intensity) {
      score += 2;
      reasons.push('odgovarajuća jačina');
    }

    const likedNotes = p.notes.filter(n =>
      answers.preferredNotes.includes(n)
    );
    if (likedNotes.length > 0) {
      score += likedNotes.length;
      reasons.push(`sadrži note koje voliš (${likedNotes.join(', ')})`);
    }

    const avoidedNotes = p.notes.filter(n =>
      answers.avoidNotes.includes(n)
    );
    if (avoidedNotes.length > 0) {
      score -= avoidedNotes.length * 2;
      reasons.push(`sadrži note koje izbjegavaš (${avoidedNotes.join(', ')})`);
    }

    return { perfume: p, score, reasons };
  });

  return scored
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
