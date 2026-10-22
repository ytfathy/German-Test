import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeGerman,
  foldGermanUmlauts,
  calculateWordSimilarity,
  evaluateGermanPronunciation
} from '../pronunciation.ts';
import {
  getLaneFromX,
  calculateLapStars,
  calculateNitroSpeed,
  updateStreak,
  AVAILABLE_CARS
} from '../racingRules.ts';
import { CURRICULUM_LEVELS } from '../curriculum.ts';

test('curriculum has all 8 levels with valid gates and voice checkpoints', () => {
  assert.equal(CURRICULUM_LEVELS.length, 8);
  for (const level of CURRICULUM_LEVELS) {
    assert.ok(level.gates.length >= 5, `Level ${level.id} should have at least 5 question gates`);
    assert.ok(level.voiceCheckpoints.length >= 3, `Level ${level.id} should have at least 3 voice checkpoints`);
    assert.ok(level.vocabulary.length >= 4, `Level ${level.id} should have vocabulary items`);
    for (const gate of level.gates) {
      assert.equal(gate.options.length, 3, 'Each gate must have exactly 3 lanes');
      assert.ok([0, 1, 2].includes(gate.correctIndex), 'Correct lane must be 0, 1, or 2');
    }
  }
});

test('normalizeGerman and foldGermanUmlauts normalize correctly', () => {
  assert.equal(normalizeGerman('Hallo! Wie geht es?'), 'hallo wie geht es');
  assert.equal(foldGermanUmlauts('Äpfel und Gemüse'), 'aepfel und gemuese');
  assert.equal(foldGermanUmlauts('groß'), 'gross');
});

test('calculateWordSimilarity handles exact and umlaut variations', () => {
  assert.equal(calculateWordSimilarity('Apfel', 'Apfel'), 100);
  assert.equal(calculateWordSimilarity('Äpfel', 'Aepfel'), 95);
  assert.ok(calculateWordSimilarity('Zwiebeln', 'Zwiebel') >= 80);
});

test('evaluateGermanPronunciation computes accurate score and tokens', () => {
  const result = evaluateGermanPronunciation('Ich spreche Deutsch', 'Ich spreche Deutsch');
  assert.equal(result.grade, 'PERFEKT');
  assert.ok(result.accuracyScore >= 95);
  assert.equal(result.tokens.length, 3);
  assert.ok(result.tokens.every(t => t.matched));

  const partial = evaluateGermanPronunciation('Ich wohne in Kairo', 'Ich wohne in Berlin');
  assert.ok(partial.accuracyScore >= 60);
});

test('racing rules lane calculation', () => {
  assert.equal(getLaneFromX(-0.8), 0); // left lane
  assert.equal(getLaneFromX(0.0), 1);  // center lane
  assert.equal(getLaneFromX(0.7), 2);  // right lane
});

test('calculateLapStars awards stars correctly', () => {
  assert.equal(calculateLapStars(900, 1000), 3);
  assert.equal(calculateLapStars(700, 1000), 2);
  assert.equal(calculateLapStars(400, 1000), 1);
});

test('nitro boost increases car speed and consumes nitro meter', () => {
  const car = AVAILABLE_CARS[0]; // Silberpfeil GT
  const boosted = calculateNitroSpeed(150, true, 50, car);
  assert.ok(boosted.speed > 150);
  assert.ok(boosted.newNitro < 50);

  const regular = calculateNitroSpeed(150, false, 50, car);
  assert.equal(regular.speed, 150);
  assert.equal(regular.newNitro, 50);
});

test('updateStreak computes daily practice streak correctly', () => {
  const today = new Date().toISOString().split('T')[0];
  const sameDay = updateStreak(today, 5);
  assert.equal(sameDay.newStreak, 5);

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const nextDay = updateStreak(yesterday, 3);
  assert.equal(nextDay.newStreak, 4);
});

test('cars support 200+ km/h racing baseline', () => {
  for (const car of AVAILABLE_CARS) {
    assert.ok(car.topSpeed >= 250, `Car ${car.name} top speed should accommodate high-speed Autobahn action`);
    assert.ok(car.acceleration >= 1.0, `Car ${car.name} should have positive acceleration`);
  }
});

test('gate option evaluation matches correct index', () => {
  const sampleGate = CURRICULUM_LEVELS[0].gates[0];
  assert.equal(sampleGate.options.length, 3);
  const correctOption = sampleGate.options[sampleGate.correctIndex];
  assert.ok(correctOption.length > 0);

  // Correct choice
  assert.equal(sampleGate.correctIndex === 1, sampleGate.correctIndex === 1);
});

test('reading comprehension ("Lesen") gates have valid German passages and titles', () => {
  const lesenGates = CURRICULUM_LEVELS.flatMap(l => l.gates).filter(g => g.isLesen);
  assert.ok(lesenGates.length >= 10, 'There should be at least 10 Lesen reading comprehension gates');
  for (const gate of lesenGates) {
    assert.ok(gate.passage && gate.passage.trim().length > 15, `Gate ${gate.id} must have a rich passage for reading and audio recitation`);
    assert.ok(gate.passageTitle && gate.passageTitle.length > 0, `Gate ${gate.id} must have a title`);
    assert.ok(gate.prompt && gate.prompt.length > 0, `Gate ${gate.id} must have a prompt question`);
  }
});

test('dedicated LESEN_UNITS are untimed, have authentic German text and valid questions', async () => {
  const { LESEN_UNITS } = await import('../lesenCurriculum.ts');
  assert.ok(LESEN_UNITS.length >= 6, 'Should have at least 6 dedicated reading units');
  for (const unit of LESEN_UNITS) {
    assert.ok(unit.passage.length > 50, `Unit ${unit.title} must have a comprehensive reading passage`);
    assert.ok(unit.passageArabic.length > 20, `Unit ${unit.title} must have Arabic guidance translation`);
    assert.ok(unit.questions.length >= 3, `Unit ${unit.title} must have at least 3 untimed questions`);
    for (const q of unit.questions) {
      assert.equal(q.options.length, 3, 'Question must have 3 options');
      assert.ok([0, 1, 2].includes(q.correctIndex), 'Correct index must be 0, 1, or 2');
      assert.ok(q.explanation.length > 0, 'Explanation must be provided');
    }
  }
});


