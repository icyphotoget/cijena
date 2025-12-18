import type { QuestionnaireAnswers } from '../screens/QuestionnaireScreen';
import type { Recommendation } from './recommendation';

const OLLAMA_URL = process.env.EXPO_PUBLIC_OLLAMA_URL || 'http://localhost:11434';
const MODEL = process.env.EXPO_PUBLIC_OLLAMA_MODEL || 'llama3.1:8b';

export type AiResponse = {
  summary: string;
  tips: string[];
  ranked: Array<{ id: string; why: string }>; // mapirano na postojeće preporuke
  alternatives?: string[];
};

function buildPrompt(
  answers: QuestionnaireAnswers,
  recs: Recommendation[]
) {
  // šaljemo samo bitna polja, kratko
  const candidates = recs.map(r => ({
    id: r.perfume.id,
    brand: r.perfume.brand,
    name: r.perfume.name,
    notes: r.perfume.notes,
    intensity: r.perfume.intensity,
    longevity: r.perfume.longevity,
    score: r.score
  }));

  return `
Ti si parfemski savjetnik. Korisnik želi preporuku parfema.

KORISNIK:
- prilika: ${answers.occasion}
- sezona: ${answers.season}
- doba dana: ${answers.timeOfDay}
- jačina: ${answers.intensity}
- voli note: ${answers.preferredNotes.join(', ') || '—'}
- izbjegava note: ${answers.avoidNotes.join(', ') || '—'}
- budžet: ${answers.budgetEur ? answers.budgetEur + ' EUR' : 'nije zadano'}

KANDIDATI (od našeg algoritma):
${JSON.stringify(candidates)}

ZADATAK:
1) Napiši kratki sažetak (1-2 rečenice).
2) Daj 3-6 praktičnih tipova (bullet).
3) Vrati ranked listu za svaku preporuku: id + "why" (1-2 rečenice).
4) (Opcionalno) alternatives: 1-3 alternativna stila/nota (ne brendovi).

FORMAT: VRATI ISKLJUČIVO VALIDAN JSON bez ikakvog dodatnog teksta.
Shema:
{
  "summary": "string",
  "tips": ["..."],
  "ranked": [{"id":"string","why":"string"}],
  "alternatives": ["..."]
}
`;
}

export async function getAiAdvice(
  answers: QuestionnaireAnswers,
  recs: Recommendation[]
): Promise<AiResponse> {
  const prompt = buildPrompt(answers, recs);

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        model: MODEL,
        prompt,
        stream: false,
        options: { temperature: 0.4 }
      }),
    });

    if (!res.ok) throw new Error(`Ollama HTTP ${res.status}`);
    const data = await res.json();

    // Ollama vraća { response: "..." }
    const text: string = data?.response ?? '';
    const parsed = JSON.parse(text);

    // minimalna validacija
    if (!parsed?.summary || !Array.isArray(parsed?.tips) || !Array.isArray(parsed?.ranked)) {
      throw new Error('AI JSON shape invalid');
    }

    return parsed as AiResponse;
  } finally {
    clearTimeout(t);
  }
}
