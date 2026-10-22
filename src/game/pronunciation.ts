/**
 * Pronunciation Scoring & Phonetic Alignment Engine for German
 * Pure logic module for real-time speech evaluation.
 */

export interface TokenFeedback {
  expected: string;
  spoken?: string;
  matched: boolean;
  score: number; // 0 to 100
  feedback?: string;
}

export interface PronunciationResult {
  expectedText: string;
  recognizedText: string;
  accuracyScore: number; // 0 to 100
  grade: 'PERFEKT' | 'SEHR_GUT' | 'GUT' | 'WIEDERHOLEN';
  tokens: TokenFeedback[];
  feedbackTip: string;
}

/**
 * Normalizes German strings for resilient matching while handling umlauts.
 */
export function normalizeGerman(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'„“!]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Maps umlauts to ascii approximations to allow lenient matching
 */
export function foldGermanUmlauts(text: string): string {
  return normalizeGerman(text)
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss');
}

/**
 * Standard Levenshtein Distance
 */
export function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const matrix: number[][] = [];

  for (let i = 0; i <= m; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= n; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[m][n];
}

/**
 * Calculates similarity between two single words (0 to 100)
 */
export function calculateWordSimilarity(expected: string, spoken: string): number {
  const normExp = normalizeGerman(expected);
  const normSpk = normalizeGerman(spoken);

  if (normExp === normSpk) return 100;

  // Check with umlaut folding
  const foldExp = foldGermanUmlauts(expected);
  const foldSpk = foldGermanUmlauts(spoken);
  if (foldExp === foldSpk) return 95;

  const maxLen = Math.max(normExp.length, normSpk.length);
  if (maxLen === 0) return 100;

  const dist = levenshteinDistance(normExp, normSpk);
  const foldDist = levenshteinDistance(foldExp, foldSpk);
  const effectiveDist = Math.min(dist, foldDist);

  const ratio = (maxLen - effectiveDist) / maxLen;
  return Math.max(0, Math.round(ratio * 100));
}

/**
 * Evaluates spoken phrase against expected German text
 */
export function evaluateGermanPronunciation(
  expectedSentence: string,
  recognizedSpeech: string
): PronunciationResult {
  const normExpected = normalizeGerman(expectedSentence);
  const normSpoken = normalizeGerman(recognizedSpeech);

  const expWords = normExpected.split(' ').filter(Boolean);
  const spkWords = normSpoken.split(' ').filter(Boolean);

  if (expWords.length === 0) {
    return {
      expectedText: expectedSentence,
      recognizedText: recognizedSpeech,
      accuracyScore: 100,
      grade: 'PERFEKT',
      tokens: [],
      feedbackTip: 'Ausgezeichnet!'
    };
  }

  if (spkWords.length === 0) {
    return {
      expectedText: expectedSentence,
      recognizedText: '',
      accuracyScore: 0,
      grade: 'WIEDERHOLEN',
      tokens: expWords.map(w => ({ expected: w, matched: false, score: 0 })),
      feedbackTip: 'Keine Sprache erkannt. Bitte Mikrofon aktivieren und noch einmal sprechen!'
    };
  }

  // Token alignment
  let totalScore = 0;
  const tokens: TokenFeedback[] = [];

  // Match each expected word with the best candidate in the spoken stream within a small window
  let spkIdx = 0;

  for (let i = 0; i < expWords.length; i++) {
    const expWord = expWords[i];
    let bestScore = 0;
    let matchedWord = '';
    let bestSpkIdx = spkIdx;

    // Search ahead up to 2 positions
    for (let j = Math.max(0, spkIdx - 1); j < Math.min(spkWords.length, spkIdx + 3); j++) {
      const sim = calculateWordSimilarity(expWord, spkWords[j]);
      if (sim > bestScore) {
        bestScore = sim;
        matchedWord = spkWords[j];
        bestSpkIdx = j;
      }
    }

    if (bestScore >= 60) {
      spkIdx = bestSpkIdx + 1;
    }

    tokens.push({
      expected: expWord,
      spoken: matchedWord || undefined,
      matched: bestScore >= 65,
      score: bestScore
    });

    totalScore += bestScore;
  }

  const overallAccuracy = Math.round(totalScore / expWords.length);

  let grade: PronunciationResult['grade'] = 'WIEDERHOLEN';
  let feedbackTip = '';

  if (overallAccuracy >= 88) {
    grade = 'PERFEKT';
    feedbackTip = '🚀 Perfekte deutsche Aussprache! +500 km/h Turbo-Boost!';
  } else if (overallAccuracy >= 70) {
    grade = 'SEHR_GUT';
    feedbackTip = '🔥 Sehr gut gesprochen! Nitro-Tank voll aufgeladen!';
  } else if (overallAccuracy >= 50) {
    grade = 'GUT';
    feedbackTip = '👍 Gut gemacht! Achte auf die Betonung der Endungen.';
  } else {
    grade = 'WIEDERHOLEN';
    feedbackTip = 'Klicke auf den Lautsprecher, um die Aussprache nochmal anzuhören, und sprich deutlich ins Mikrofon!';
  }

  return {
    expectedText: expectedSentence,
    recognizedText: recognizedSpeech,
    accuracyScore: overallAccuracy,
    grade,
    tokens,
    feedbackTip
  };
}
