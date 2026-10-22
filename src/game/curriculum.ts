/**
 * German Curriculum for Autobahn Deutsch
 * Derived directly from provided course materials:
 * - PB3 und das Gemüse (Jane Cadwallader)
 * - German Quarter School Worksheets & HW
 * - Schoology Quizzes (Questions 01-20)
 */

export interface QuestionGate {
  id: string;
  type: 'speed_gate' | 'true_false' | 'fill_blank';
  prompt: string;
  context?: string; // e.g. reading passage snippet
  isLesen?: boolean; // Set to true when question requires reading comprehension ("Lesen")
  passageTitle?: string; // e.g. "📖 PB3 & das Raumschiff"
  passage?: string; // The German text passage that the student reads and listens to
  options: [string, string, string]; // 3 lanes: Left, Center, Right
  correctIndex: 0 | 1 | 2;
  explanation: string;
}

export interface VoiceCheckpoint {
  id: string;
  germanText: string;
  englishTranslation: string;
  phoneticGuide: string;
  pronunciationTip: string;
  targetWordHighlights?: string[];
  audioSpeed?: number;
}

export interface LevelCurriculum {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  theme: 'story_intro' | 'market_colors' | 'highway_chase' | 'greetings_intro' | 'lenas_life' | 'modal_hobbies' | 'verbs_pronouns' | 'grand_prix';
  trackStyle: {
    skyColorTop: string;
    skyColorBottom: string;
    roadColor: string;
    curbColorLight: string;
    curbColorDark: string;
    fogColor: string;
    weather: 'clear' | 'rain' | 'sunset' | 'night' | 'rainbow';
    scenery: 'mountains' | 'city' | 'village' | 'highway' | 'fields';
  };
  summary: string;
  storySnippet?: string;
  vocabulary: Array<{ german: string; english: string; article?: 'der' | 'die' | 'das' }>;
  gates: QuestionGate[];
  voiceCheckpoints: VoiceCheckpoint[];
  targetLaps: number;
}

export const CURRICULUM_LEVELS: LevelCurriculum[] = [
  {
    id: 1,
    slug: 'level-1-pb3-raumschiff',
    title: 'Level 1: PB3 & das Raumschiff',
    subtitle: 'Alex, das Fenster & Besuch von Planet P3',
    theme: 'story_intro',
    trackStyle: {
      skyColorTop: '#1e293b',
      skyColorBottom: '#475569',
      roadColor: '#334155',
      curbColorLight: '#f59e0b',
      curbColorDark: '#b45309',
      fogColor: '#334155',
      weather: 'rain',
      scenery: 'city'
    },
    summary: 'Alex ist in seinem Zimmer. Es regnet und ist windig. Aus einem grauen Raumschiff kommen PB3 und Roboter Petra!',
    storySnippet: 'Alex muss Hausaufgaben machen, aber er sieht lieber aus dem Fenster. Es regnet und ist sehr windig. Ein Raumschiff landet im Garten! Aus dem Raumschiff kommen ein kleiner Außerirdischer und ein Roboter.',
    vocabulary: [
      { german: 'das Zimmer', english: 'the room', article: 'das' },
      { german: 'das Fenster', english: 'the window', article: 'das' },
      { german: 'das Raumschiff', english: 'the spaceship', article: 'das' },
      { german: 'der Außerirdische', english: 'the alien', article: 'der' },
      { german: 'der Roboter', english: 'the robot', article: 'der' },
      { german: 'die Hausaufgaben', english: 'homework', article: 'die' }
    ],
    gates: [
      {
        id: 'l1-q1',
        type: 'speed_gate',
        isLesen: true,
        passageTitle: 'Lesetext: PB3 & das Raumschiff',
        passage: 'Alex ist in seinem Zimmer. Er muss Hausaufgaben machen, aber er sieht lieber aus dem Fenster. Es regnet und ist sehr windig. Ein graues Raumschiff landet im Garten!',
        prompt: 'Wo ist Alex am Anfang der Geschichte?',
        options: ['Im Garten', 'In seinem Zimmer', 'In der Schule'],
        correctIndex: 1,
        explanation: 'Alex ist in seinem Zimmer und schaut aus dem Fenster.'
      },
      {
        id: 'l1-q2',
        type: 'speed_gate',
        isLesen: true,
        passageTitle: 'Lesetext: Das Wetter draußen',
        passage: 'Alex sieht aus dem Fenster: Es regnet und ist sehr windig. Draußen im Garten landet plötzlich ein Raumschiff.',
        prompt: 'Wie ist das Wetter draußen?',
        options: ['Es regnet und ist windig.', 'Es ist sonnig und heiß.', 'Es schneit und ist kalt.'],
        correctIndex: 0,
        explanation: 'Es regnet und ist sehr windig.'
      },
      {
        id: 'l1-q3',
        type: 'speed_gate',
        isLesen: true,
        passageTitle: 'Lesetext: Alex und die Hausaufgaben',
        passage: 'Alex muss Hausaufgaben machen, aber er sieht lieber aus dem Fenster. Er sieht ein kleines graues Raumschiff im Garten landen!',
        prompt: 'Was muss Alex eigentlich machen?',
        options: ['Er muss schlafen', 'Er muss Hausaufgaben machen', 'Er muss essen'],
        correctIndex: 1,
        explanation: 'Alex muss Hausaufgaben machen, blickt aber aus dem Fenster.'
      },
      {
        id: 'l1-q4',
        type: 'speed_gate',
        isLesen: true,
        passageTitle: 'Lesetext: Der Besuch',
        passage: 'Alex öffnet schnell das Fenster. Er ruft: "Hallo! Wer seid ihr?" Ein kleiner Außerirdischer namens PB3 winkt ihm zu.',
        prompt: 'Was öffnet Alex?',
        options: ['Die Tür', 'Das Fenster', 'Das Buch'],
        correctIndex: 1,
        explanation: 'Alex öffnet das Fenster, um mit PB3 zu sprechen.'
      },
      {
        id: 'l1-q5',
        type: 'speed_gate',
        isLesen: true,
        passageTitle: 'Lesetext: Planet P3',
        passage: 'Der kleine Außerirdische sagt: "Ich heiße PB3. Ich komme vom fernen Planeten P3 und das ist mein Roboter Petra."',
        prompt: 'Von welchem Planeten kommt PB3?',
        options: ['P3', 'Mars', 'Erde'],
        correctIndex: 0,
        explanation: 'PB3 kommt vom fernen Planeten P3!'
      },
      {
        id: 'l1-q6',
        type: 'speed_gate',
        isLesen: true,
        passageTitle: 'Lesetext: Roboter Petra',
        passage: 'PB3 reist nicht allein. Aus dem Raumschiff kommt auch Roboter Petra. Petra kann blinken und grünen Schleim spritzen!',
        prompt: 'Wie heißt der Roboter von PB3?',
        options: ['Petra', 'Pb3', 'Alex'],
        correctIndex: 0,
        explanation: 'Der Roboter heißt Petra.'
      },
      {
        id: 'l1-q7',
        type: 'true_false',
        isLesen: true,
        passageTitle: 'Lesetext: Das Raumschiff',
        passage: 'Das Raumschiff im Garten ist rund und grau. Alex beobachtet die kleine Tür, die sich langsam öffnet.',
        prompt: 'Richtig oder Falsch: Alex sieht ein gelbes und eckiges Objekt.',
        options: ['Richtig (True)', 'Falsch (False - rund & grau)', 'Keine Ahnung'],
        correctIndex: 1,
        explanation: 'Falsch! Das Raumschiff ist rund und grau.'
      }
    ],
    voiceCheckpoints: [
      {
        id: 'v1-1',
        germanText: 'Hallo! Ich bin PB3.',
        englishTranslation: 'Hello! I am PB3.',
        phoneticGuide: 'HAH-loh! Ikh bin Pe-Be-Drei.',
        pronunciationTip: 'Remember: In German "B" is pronounced "beh" and "3" is "drei". Practice the soft "ch" in "Ich".'
      },
      {
        id: 'v1-2',
        germanText: 'Es regnet und ist sehr windig.',
        englishTranslation: "It's raining and very windy.",
        phoneticGuide: 'Es REHK-net oont ist zehr VIN-dikh.',
        pronunciationTip: 'In German, the letter "W" is pronounced like an English "V" (windig = vin-dikh).'
      },
      {
        id: 'v1-3',
        germanText: 'Alex öffnet das Fenster.',
        englishTranslation: 'Alex opens the window.',
        phoneticGuide: 'AH-leks OEF-net dahs FEN-ster.',
        pronunciationTip: 'The umlaut "ö" sounds like rounding your lips as if to say "o" while pronouncing "eh".'
      }
    ],
    targetLaps: 1
  },
  {
    id: 2,
    slug: 'level-2-obst-farben',
    title: 'Level 2: Farben & Obst',
    subtitle: 'Der rote Apfel & Markt im Dorf',
    theme: 'market_colors',
    trackStyle: {
      skyColorTop: '#0284c7',
      skyColorBottom: '#38bdf8',
      roadColor: '#1e293b',
      curbColorLight: '#ef4444',
      curbColorDark: '#ffffff',
      fogColor: '#38bdf8',
      weather: 'rainbow',
      scenery: 'village'
    },
    summary: 'Auf Planet P3 gibt es nur Schwarz, Grau, Grün und Weiß. Auf der Erde entdeckt PB3 rote Äpfel, gelbe Bananen und violette Trauben!',
    storySnippet: 'PB3 sieht auf Alex Tisch einen Apfel. Der Apfel ist rot! Auf P3 gibt es keine roten Dinge. Alex und PB3 sehen am Himmel einen bunten Regenbogen.',
    vocabulary: [
      { german: 'der Apfel', english: 'the apple', article: 'der' },
      { german: 'die Birne', english: 'the pear', article: 'die' },
      { german: 'die Trauben', english: 'the grapes', article: 'die' },
      { german: 'die Banane', english: 'the banana', article: 'die' },
      { german: 'die Orange', english: 'the orange', article: 'die' },
      { german: 'die Wassermelone', english: 'the watermelon', article: 'die' }
    ],
    gates: [
      {
        id: 'l2-q1',
        type: 'speed_gate',
        isLesen: true,
        passageTitle: 'Lesetext: Der rote Apfel',
        passage: 'PB3 sieht auf Alex Tisch einen Apfel. Der Apfel ist rot! PB3 staunt sehr, denn auf seinem Planeten P3 gibt es überhaupt keine roten Dinge.',
        prompt: 'Welche Farbe hat der Apfel auf Alex Tisch?',
        options: ['Rot', 'Grün', 'Blau'],
        correctIndex: 0,
        explanation: 'Der Apfel ist rot. Auf Planet P3 gibt es keine roten Dinge!'
      },
      {
        id: 'l2-q2',
        type: 'speed_gate',
        isLesen: true,
        passageTitle: 'Lesetext: Die Farben auf Planet P3',
        passage: 'PB3 erzählt Alex von seiner Heimat: "Auf dem Planeten P3 gibt es nur Schwarz, Grau, Grün und Weiß. Wir haben keine bunten Farben!"',
        prompt: 'Welche Farben gibt es auf dem Planeten P3?',
        options: ['Schwarz, Grau, Grün, Weiß', 'Rot, Gelb, Blau, Pink', 'Gold, Silber, Lila'],
        correctIndex: 0,
        explanation: 'Auf P3 gibt es nur Schwarz, Grau, Grün und Weiß.'
      },
      {
        id: 'l2-q3',
        type: 'speed_gate',
        isLesen: true,
        passageTitle: 'Lesetext: Obst und Lieblingsobst',
        passage: 'Alex und PB3 essen Obst in der Küche. Alex sagt fröhlich: "Mein Lieblingsobst sind süße violette Trauben!"',
        prompt: 'Was ist Alex\' Lieblingsobst?',
        options: ['Trauben', 'Kartoffeln', 'Zwiebeln'],
        correctIndex: 0,
        explanation: 'Alex Lieblingsobst sind Trauben!'
      },
      {
        id: 'l2-q4',
        type: 'speed_gate',
        isLesen: true,
        passageTitle: 'Lesetext: Der Regenbogen am Himmel',
        passage: 'Alex und PB3 gehen nach draußen ins Dorf. Der Regen hört auf, die Sonne scheint und am Himmel leuchtet ein wunderschöner bunter Regenbogen!',
        prompt: 'Was sehen Alex und PB3 auf dem Weg ins Dorf?',
        options: ['Einen Schneesturm', 'Einen Regenbogen', 'Ein Monster'],
        correctIndex: 1,
        explanation: 'Die Sonne scheint und sie sehen einen wunderschönen Regenbogen!'
      },
      {
        id: 'l2-q5',
        type: 'speed_gate',
        isLesen: true,
        passageTitle: 'Lesetext: Obstkorb auf Deutsch',
        passage: 'Auf dem Tisch liegen eine saftige Birne und gelbe Bananen. PB3 lernt: Die Birne schmeckt köstlich.',
        prompt: 'Wie heißt "the pear" auf Deutsch?',
        options: ['Die Birne', 'Die Banane', 'Die Bohne'],
        correctIndex: 0,
        explanation: 'Die Birne = the pear.'
      }
    ],
    voiceCheckpoints: [
      {
        id: 'v2-1',
        germanText: 'Der Apfel ist rot.',
        englishTranslation: 'The apple is red.',
        phoneticGuide: 'Dehr AHP-fel ist roht.',
        pronunciationTip: 'Roll or tap the German "R" softly in "rot".'
      },
      {
        id: 'v2-2',
        germanText: 'Bananen sind gelb und lecker.',
        englishTranslation: 'Bananas are yellow and delicious.',
        phoneticGuide: 'Bah-NAH-nen zint gelp oont LEK-ker.',
        pronunciationTip: 'In German "s" before a vowel sounds like an English "z" (sind = zint).'
      },
      {
        id: 'v2-3',
        germanText: 'Alex mag Trauben und Orangen.',
        englishTranslation: 'Alex likes grapes and oranges.',
        phoneticGuide: 'AH-leks mahk TROW-ben oont oh-RAHN-zhen.',
        pronunciationTip: '"au" in Trauben sounds like "ow" as in cow.'
      }
    ],
    targetLaps: 1
  },
  {
    id: 3,
    slug: 'level-3-gemuse-schleim',
    title: 'Level 3: Gemüse & Petras Schleim',
    subtitle: 'Die Jagd nach dem Lastwagen & Böser Tim',
    theme: 'highway_chase',
    trackStyle: {
      skyColorTop: '#7c2d12',
      skyColorBottom: '#ea580c',
      roadColor: '#27272a',
      curbColorLight: '#22c55e',
      curbColorDark: '#15803d',
      fogColor: '#ea580c',
      weather: 'sunset',
      scenery: 'highway'
    },
    summary: 'Männer stellen die Kiste in einen Lastwagen! Alex jagt mit dem Fahrrad hinterher. Tim will PB3 nicht hergeben – doch Petra spritzt bunten Schleim!',
    storySnippet: 'PB3 und Petra steigen in eine Kiste. Ein Mann macht die Kiste zu und stellt sie in einen Lastwagen. Tim behauptet: "Das sind MEINE Spielsachen!" Doch Petra schießt grünen und bunten Schleim!',
    vocabulary: [
      { german: 'die Kartoffeln', english: 'potatoes', article: 'die' },
      { german: 'die Zwiebeln', english: 'onions', article: 'die' },
      { german: 'die Karotten', english: 'carrots', article: 'die' },
      { german: 'die Erbsen', english: 'peas', article: 'die' },
      { german: 'der Lastwagen', english: 'truck / lorry', article: 'der' },
      { german: 'der Schleim', english: 'slime', article: 'der' }
    ],
    gates: [
      {
        id: 'l3-q1',
        type: 'speed_gate',
        isLesen: true,
        passageTitle: 'Lesetext: PB3s Lieblingsgemüse',
        passage: 'PB3 probiert verschiedenes Gemüse auf der Erde: Karotten, Kartoffeln und Erbsen. Aber Zwiebeln schmecken ihm am allerbesten. Zwiebeln sind sein absolutes Lieblingsgemüse!',
        prompt: 'Was ist PB3s Lieblingsgemüse?',
        options: ['Zwiebeln', 'Kartoffeln', 'Schokolade'],
        correctIndex: 0,
        explanation: 'Zwiebeln sind PB3s absolutes Lieblingsgemüse!'
      },
      {
        id: 'l3-q2',
        type: 'speed_gate',
        isLesen: true,
        passageTitle: 'Lesetext: Das Versteck in der Kiste',
        passage: 'Im Dorf kommen fremde Leute. PB3 und Petra haben Angst und steigen schnell in eine große Kiste. Ein Mann nagelt die Kiste zu und stellt sie auf einen Lastwagen!',
        prompt: 'Wohin steigen PB3 und Petra im Dorf?',
        options: ['In eine Kiste', 'In ein Flugzeug', 'In ein Auto'],
        correctIndex: 0,
        explanation: 'Sie steigen in eine Kiste, damit sie niemand sieht.'
      },
      {
        id: 'l3-q3',
        type: 'speed_gate',
        isLesen: true,
        passageTitle: 'Lesetext: Tims Spielzeug',
        passage: 'Der kleine Junge Tim öffnet die Kiste in seinem Zimmer. Er greift nach PB3 und Petra und ruft laut: "Das sind MEINE Spielsachen!"',
        prompt: 'Was ruft Tim im Zimmer?',
        options: ['Das sind MEINE Spielsachen!', 'Willkommen PB3!', 'Ich will schlafen!'],
        correctIndex: 0,
        explanation: 'Tim sagt: "Das sind MEINE Spielsachen!"'
      },
      {
        id: 'l3-q4',
        type: 'speed_gate',
        isLesen: true,
        passageTitle: 'Lesetext: Petras Abwehr',
        passage: 'Petra lässt sich das nicht gefallen! Eine kleine Tür an Petras Bauch öffnet sich, und heraus spritzt schrecklicher, klebriger grüner Schleim direkt über Tim!',
        prompt: 'Was kommt aus Petras kleiner Tür?',
        options: ['Schrecklicher grüner Schleim!', 'Heißer Tee', 'Ein kleiner Vogel'],
        correctIndex: 0,
        explanation: 'Aus Petras Öffnung spritzt schrecklicher grüner Schleim über Tim!'
      },
      {
        id: 'l3-q5',
        type: 'speed_gate',
        isLesen: true,
        passageTitle: 'Lesetext: Keine Spielsachen',
        passage: 'PB3 schüttelt sich und ruft Tim empört ins Gesicht: "Wir sind lebendige Wesen vom Planeten P3 und wir sind NICHT deine Spielsachen!"',
        prompt: 'Was ruft PB3 zu Tim?',
        options: ['Wir sind NICHT deine Spielsachen!', 'Wir mögen dich!', 'Bitte hilf uns!'],
        correctIndex: 0,
        explanation: 'PB3 ruft empört: "Wir sind NICHT deine Spielsachen!"'
      }
    ],
    voiceCheckpoints: [
      {
        id: 'v3-1',
        germanText: 'Dieser grüne Schleim ist für dich!',
        englishTranslation: 'This green slime is for you!',
        phoneticGuide: 'DEE-zer GREW-ne SHLIME ist fewr dikh!',
        pronunciationTip: '"sch" in German always sounds like English "sh" (Schleim = shlime).'
      },
      {
        id: 'v3-2',
        germanText: 'Zwiebeln sind mein Lieblingsgemüse.',
        englishTranslation: 'Onions are my favourite vegetable.',
        phoneticGuide: 'TSVEE-beln zint mine LEEP-lings-ge-mew-ze.',
        pronunciationTip: '"Z" in German sounds like "ts" (Zwiebeln = tsvee-beln).'
      },
      {
        id: 'v3-3',
        germanText: 'Wir sind keine Spielsachen!',
        englishTranslation: 'We are not toys!',
        phoneticGuide: 'Veer zint KY-ne SHPEEL-zakh-en!',
        pronunciationTip: '"Sp" at the start of German words is pronounced "shp" (Spielsachen = shpeel-zakh-en).'
      }
    ],
    targetLaps: 1
  },
  {
    id: 4,
    slug: 'level-4-kennenlernen',
    title: 'Level 4: Kennenlernen & Begrüßung',
    subtitle: 'Woher kommst du? & Sprachen der Welt',
    theme: 'greetings_intro',
    trackStyle: {
      skyColorTop: '#0f172a',
      skyColorBottom: '#1e3a8a',
      roadColor: '#1e293b',
      curbColorLight: '#38bdf8',
      curbColorDark: '#0284c7',
      fogColor: '#1e3a8a',
      weather: 'clear',
      scenery: 'city'
    },
    summary: 'Meistere die wichtigsten Fragen beim Kennenlernen: Woher kommst du? Wo wohnst du? Welche Sprachen sprichst du?',
    storySnippet: 'Hallo! Wie heißt du? Ich komme aus Ägypten. Ich wohne in Kairo. Ich spreche Arabisch und Englisch. Was sprichst du?',
    vocabulary: [
      { german: 'Woher', english: 'where from' },
      { german: 'Wo', english: 'where' },
      { german: 'Wie', english: 'how / what' },
      { german: 'Was', english: 'what' },
      { german: 'Deutschland', english: 'Germany' },
      { german: 'Ägypten', english: 'Egypt' },
      { german: 'die Türkei', english: 'Turkey' }
    ],
    gates: [
      {
        id: 'l4-q1',
        type: 'fill_blank',
        isLesen: true,
        passageTitle: 'Lesetext: Omar aus Kairo',
        passage: 'Hallo! Wie heißt du? Mein Name ist Omar. Ich komme aus Ägypten und wohne in Kairo. Ich spreche Arabisch und Englisch.',
        prompt: '__________ kommst du? - Ich komme aus Ägypten.',
        options: ['Woher', 'Wo', 'Wie'],
        correctIndex: 0,
        explanation: 'Für die Herkunft fragt man mit "Woher".'
      },
      {
        id: 'l4-q2',
        type: 'fill_blank',
        isLesen: true,
        passageTitle: 'Lesetext: Wo wohnst du?',
        passage: 'Mein Name ist Omar. Ich komme aus Ägypten und wohne in Kairo. Wo wohnst du?',
        prompt: '__________ wohnst du? - Ich wohne in Kairo.',
        options: ['Wo', 'Woher', 'Was'],
        correctIndex: 0,
        explanation: 'Für den Wohnort fragt man mit "Wo".'
      },
      {
        id: 'l4-q3',
        type: 'fill_blank',
        prompt: 'Ich komme __________ Deutschland.',
        options: ['aus', 'in', 'an'],
        correctIndex: 0,
        explanation: 'Man sagt: Ich komme aus Deutschland.'
      },
      {
        id: 'l4-q4',
        type: 'fill_blank',
        prompt: 'Ich komme __________ Türkei.',
        options: ['aus der', 'aus', 'in'],
        correctIndex: 0,
        explanation: 'Achtung: Türkei hat Artikel! "aus der Türkei".'
      },
      {
        id: 'l4-q5',
        type: 'fill_blank',
        isLesen: true,
        passageTitle: 'Lesetext: Sprachen in Ägypten',
        passage: 'Ich komme aus Ägypten. In Ägypten spricht man Arabisch. In der Schule lernen wir auch Deutsch und Englisch.',
        prompt: 'Ich komme aus Ägypten. Ich spreche __________.',
        options: ['Arabisch', 'Deutsch', 'Englisch'],
        correctIndex: 0,
        explanation: 'In Ägypten spricht man Arabisch.'
      },
      {
        id: 'l4-q6',
        type: 'speed_gate',
        prompt: 'Was bedeutet das englische Wort "you" auf Deutsch?',
        options: ['Du', 'Ich', 'Er'],
        correctIndex: 0,
        explanation: '"You" heißt auf Deutsch "Du".'
      }
    ],
    voiceCheckpoints: [
      {
        id: 'v4-1',
        germanText: 'Ich komme aus Ägypten.',
        englishTranslation: 'I come from Egypt.',
        phoneticGuide: 'Ikh KOM-me ows eh-GEEP-ten.',
        pronunciationTip: '"Ä" in Ägypten is pronounced like "eh" in bet.'
      },
      {
        id: 'v4-2',
        germanText: 'Ich spreche Arabisch und Englisch.',
        englishTranslation: 'I speak Arabic and English.',
        phoneticGuide: 'Ikh SHPREH-khe ah-RAH-bish oont ENG-lish.',
        pronunciationTip: 'Soft "ch" in "spreche" - breathe air gently against your palate.'
      },
      {
        id: 'v4-3',
        germanText: 'Ich wohne in Kairo.',
        englishTranslation: 'I live in Cairo.',
        phoneticGuide: 'Ikh VOH-ne in KY-roh.',
        pronunciationTip: 'Silent "h" in "wohne" makes the "o" long and smooth.'
      }
    ],
    targetLaps: 1
  },
  {
    id: 5,
    slug: 'level-5-lenas-alltag',
    title: 'Level 5: Lenas Alltag & Berufe',
    subtitle: '13 Jahre, Schule, Sport & Familie',
    theme: 'lenas_life',
    trackStyle: {
      skyColorTop: '#15803d',
      skyColorBottom: '#86efac',
      roadColor: '#334155',
      curbColorLight: '#eab308',
      curbColorDark: '#1e293b',
      fogColor: '#86efac',
      weather: 'clear',
      scenery: 'fields'
    },
    summary: 'Lerne Lenas Wochenplan kennen: Schule in Hamburg, Volleyball am Dienstag, Fußball am Samstag und Filmabend am Sonntag.',
    storySnippet: 'Hallo! Ich heiße Lena und bin 13 Jahre alt. Ich komme aus Deutschland und wohne in Hamburg. Meine Mutter ist Ärztin und mein Vater arbeitet in einer Bank. Mein Lieblingsfach ist Deutsch.',
    vocabulary: [
      { german: 'die Ärztin', english: 'female doctor', article: 'die' },
      { german: 'die Bank', english: 'bank', article: 'die' },
      { german: 'das Lieblingsfach', english: 'favourite subject', article: 'das' },
      { german: 'am Dienstag', english: 'on Tuesday' },
      { german: 'am Wochenende', english: 'on the weekend' },
      { german: 'zu Mittag essen', english: 'to eat lunch' }
    ],
    gates: [
      {
        id: 'l5-q1',
        type: 'speed_gate',
        isLesen: true,
        passageTitle: 'Lesetext: Lenas Alltag & Alter',
        passage: 'Hallo! Ich heiße Lena und bin 13 Jahre alt. Ich komme aus Deutschland und wohne in Hamburg.',
        prompt: 'Wie alt ist Lena?',
        options: ['dreizehn', 'zwölf', 'fünfzehn'],
        correctIndex: 0,
        explanation: 'Lena ist 13 Jahre alt (dreizehn).'
      },
      {
        id: 'l5-q2',
        type: 'speed_gate',
        isLesen: true,
        passageTitle: 'Lesetext: Wohnort Hamburg',
        passage: 'Ich komme aus Deutschland und wohne in Hamburg mit meinen Eltern und meinem Bruder.',
        prompt: 'Wo wohnt Lena mit ihrer Familie?',
        options: ['Hamburg', 'Berlin', 'München'],
        correctIndex: 0,
        explanation: 'Lena wohnt in Hamburg.'
      },
      {
        id: 'l5-q3',
        type: 'speed_gate',
        isLesen: true,
        passageTitle: 'Lesetext: Die Berufe der Eltern',
        passage: 'Meine Mutter ist Ärztin im Krankenhaus und mein Vater arbeitet in einer Bank.',
        prompt: 'Was ist Lenas Mutter von Beruf?',
        options: ['Ärztin', 'Lehrerin', 'Verkäuferin'],
        correctIndex: 0,
        explanation: 'Ihre Mutter ist Ärztin.'
      },
      {
        id: 'l5-q4',
        type: 'speed_gate',
        isLesen: true,
        passageTitle: 'Lesetext: Sport in der Freizeit',
        passage: 'Am Dienstag nach der Schule spiele ich Volleyball mit meinen Freundinnen. Am Samstag spielen wir Fußball!',
        prompt: 'Wann spielt Lena Volleyball mit ihren Freundinnen?',
        options: ['am Dienstag', 'am Montag', 'am Samstag'],
        correctIndex: 0,
        explanation: 'Am Dienstag spielt sie Volleyball.'
      },
      {
        id: 'l5-q5',
        type: 'speed_gate',
        isLesen: true,
        passageTitle: 'Lesetext: Schule & Lieblingsfach',
        passage: 'In der Schule lerne ich viele Fächer. Mein Lieblingsfach ist Deutsch, aber ich mag auch Sport!',
        prompt: 'Was ist Lenas Lieblingsfach in der Schule?',
        options: ['Deutsch und Sport', 'Mathematik', 'Französisch'],
        correctIndex: 0,
        explanation: 'Ihr Lieblingsfach ist Deutsch, aber sie mag auch Sport!'
      },
      {
        id: 'l5-q6',
        type: 'true_false',
        isLesen: true,
        passageTitle: 'Lesetext: Der Beruf des Vaters',
        passage: 'Meine Mutter ist Ärztin. Mein Vater ist kein Lehrer, er arbeitet in einer großen Bank.',
        prompt: 'Richtig oder Falsch: Der Vater arbeitet als Lehrer.',
        options: ['Falsch (Er arbeitet in einer Bank)', 'Richtig', 'Keine Ahnung'],
        correctIndex: 0,
        explanation: 'Falsch! Der Vater arbeitet in einer Bank.'
      }
    ],
    voiceCheckpoints: [
      {
        id: 'v5-1',
        germanText: 'Meine Mutter ist Ärztin.',
        englishTranslation: 'My mother is a doctor.',
        phoneticGuide: 'MY-ne MOOT-ter ist EHRTS-tin.',
        pronunciationTip: '"Ä" sounds like "eh", and the "zt" cluster is sharp like "tst".'
      },
      {
        id: 'v5-2',
        germanText: 'Mein Lieblingsfach ist Deutsch.',
        englishTranslation: 'My favourite subject is German.',
        phoneticGuide: 'Mine LEEP-lings-fahkh ist DOYTCH.',
        pronunciationTip: '"eu" in Deutsch sounds like "oy" (as in boy).'
      },
      {
        id: 'v5-3',
        germanText: 'Am Dienstag spiele ich Volleyball.',
        englishTranslation: 'On Tuesday I play volleyball.',
        phoneticGuide: 'Ahm DEEN-stahk SHPEE-le ikh VOL-ley-ball.',
        pronunciationTip: '"ie" in Dienstag is a long "ee" sound.'
      }
    ],
    targetLaps: 1
  },
  {
    id: 6,
    slug: 'level-6-modalverb-kennen',
    title: 'Level 6: Modalverb "Können" & Hobbys',
    subtitle: 'Lina, Paul & Anna: Was kannst du tun?',
    theme: 'modal_hobbies',
    trackStyle: {
      skyColorTop: '#581c87',
      skyColorBottom: '#a855f7',
      roadColor: '#1e1b4b',
      curbColorLight: '#f43f5e',
      curbColorDark: '#ffffff',
      fogColor: '#a855f7',
      weather: 'night',
      scenery: 'city'
    },
    summary: 'Meistere das Modalverb "können" (kann, kannst, können, könnt) und alle Hobbys: Musik machen, tanzen, singen, Schach spielen.',
    storySnippet: 'Lina kann singen und tanzen, aber nicht zeichnen. Ihr Bruder Paul kann Fußball spielen und Gitarre spielen. Ihre Schwester Anna kann kochen, aber nicht schwimmen!',
    vocabulary: [
      { german: 'Gitarre spielen', english: 'to play guitar' },
      { german: 'Schach spielen', english: 'to play chess' },
      { german: 'schwimmen', english: 'to swim' },
      { german: 'kochen', english: 'to cook' },
      { german: 'zeichnen', english: 'to draw' },
      { german: 'können', english: 'can / to be able to' }
    ],
    gates: [
      {
        id: 'l6-q1',
        type: 'fill_blank',
        prompt: 'Was __________ du machen? - Ich kann tanzen.',
        options: ['kannst', 'kann', 'könnt'],
        correctIndex: 0,
        explanation: 'Du kannst!'
      },
      {
        id: 'l6-q2',
        type: 'fill_blank',
        prompt: 'Sara und Omar __________ Schach spielen.',
        options: ['können', 'könnt', 'kann'],
        correctIndex: 0,
        explanation: 'Sara und Omar = Sie (Plural) -> können.'
      },
      {
        id: 'l6-q3',
        type: 'fill_blank',
        prompt: 'Ali __________ gut kochen.',
        options: ['kann', 'kannst', 'könnt'],
        correctIndex: 0,
        explanation: 'Er (Ali) -> kann.'
      },
      {
        id: 'l6-q4',
        type: 'speed_gate',
        isLesen: true,
        passageTitle: 'Lesetext: Linas Familie & Hobbys',
        passage: 'Lina kann singen und tanzen. Ihr Bruder Paul kann super Fußball spielen und Gitarre spielen. Die Familie liebt Musik und Sport!',
        prompt: 'Was kann Linas Bruder Paul machen?',
        options: ['Gitarre spielen', 'Kuchen backen', 'Schwimmen'],
        correctIndex: 0,
        explanation: 'Paul kann Fußball und Gitarre spielen!'
      },
      {
        id: 'l6-q5',
        type: 'speed_gate',
        isLesen: true,
        passageTitle: 'Lesetext: Was kann Anna nicht?',
        passage: 'Linas kleine Schwester Anna kann prima kochen, aber sie kann leider überhaupt noch nicht schwimmen!',
        prompt: 'Was kann Anna NICHT?',
        options: ['schwimmen', 'kochen', 'lachen'],
        correctIndex: 0,
        explanation: 'Anna kann kochen, aber sie kann nicht schwimmen.'
      },
      {
        id: 'l6-q6',
        type: 'true_false',
        prompt: 'Richtig oder Falsch: "Frau Emma können sehr gut backen."',
        options: ['Falsch (Es heißt: kann!)', 'Richtig', 'Keine Ahnung'],
        correctIndex: 0,
        explanation: 'Falsch! Frau Emma ist 3. Person Singular (sie), also: "Frau Emma kann gut backen."'
      }
    ],
    voiceCheckpoints: [
      {
        id: 'v6-1',
        germanText: 'Ich kann sehr gut Gitarre spielen.',
        englishTranslation: 'I can play guitar very well.',
        phoneticGuide: 'Ikh kahn zehr goot ghee-TAHR-re SHPEE-len.',
        pronunciationTip: 'Short crisp "a" in "kann".'
      },
      {
        id: 'v6-2',
        germanText: 'Omar kann gut Tennis spielen.',
        englishTranslation: 'Omar can play tennis well.',
        phoneticGuide: 'OH-mar kahn goot TEN-nis SHPEE-len.',
        pronunciationTip: 'Accent is on the first syllable of "Tennis".'
      },
      {
        id: 'v6-3',
        germanText: 'Wir können zusammen Musik machen.',
        englishTranslation: 'We can make music together.',
        phoneticGuide: 'Veer KOEN-nen tsoo-ZAHM-men moo-ZEEK MAH-khen.',
        pronunciationTip: 'Rounded "ö" in "können" + "z" pronounced "ts".'
      }
    ],
    targetLaps: 1
  },
  {
    id: 7,
    slug: 'level-7-verbkonjugation',
    title: 'Level 7: Verbkonjugation & Pronomen',
    subtitle: 'Er, Sie, Es, Wir, Ihr & Verben im Einsatz',
    theme: 'verbs_pronouns',
    trackStyle: {
      skyColorTop: '#1e3a8a',
      skyColorBottom: '#3b82f6',
      roadColor: '#0f172a',
      curbColorLight: '#06b6d4',
      curbColorDark: '#e0f2fe',
      fogColor: '#3b82f6',
      weather: 'clear',
      scenery: 'highway'
    },
    summary: 'Personalpronomen und Verbendungen: ich -e, du -st, er/sie/es -t, wir -en, ihr -t, sie -en.',
    storySnippet: 'Max ist 20 Jahre alt. Er kommt aus England. Das Baby ist klein. Es geht nicht in die Schule. Ali spielt Fußball. Er ist 8 Jahre alt.',
    vocabulary: [
      { german: 'er / sie / es', english: 'he / she / it' },
      { german: 'wir / ihr / sie', english: 'we / you (pl) / they' },
      { german: 'wohnen', english: 'to live' },
      { german: 'sprechen', english: 'to speak' },
      { german: 'hören', english: 'to hear / listen' },
      { german: 'kaufen', english: 'to buy' }
    ],
    gates: [
      {
        id: 'l7-q1',
        type: 'fill_blank',
        prompt: 'Wir __________ in Ägypten.',
        options: ['wohnen', 'wohnt', 'wohnst'],
        correctIndex: 0,
        explanation: 'Wir wohnen.'
      },
      {
        id: 'l7-q2',
        type: 'fill_blank',
        prompt: 'Er __________ Arabisch und Deutsch.',
        options: ['spricht', 'sprechen', 'sprecht'],
        correctIndex: 0,
        explanation: 'Vokalwechsel: er spricht!'
      },
      {
        id: 'l7-q3',
        type: 'fill_blank',
        isLesen: true,
        passageTitle: 'Lesetext: Ali spielt Fußball',
        passage: 'Ali spielt gern Fußball im Verein. Er ist 8 Jahre alt und trainiert jeden Mittwoch.',
        prompt: 'Ali spielt Fußball. __________ ist 8 Jahre alt.',
        options: ['Er', 'Es', 'Sie'],
        correctIndex: 0,
        explanation: 'Ali ist männlich -> Er.'
      },
      {
        id: 'l7-q4',
        type: 'fill_blank',
        isLesen: true,
        passageTitle: 'Lesetext: Das kleine Baby',
        passage: 'Das Baby ist noch sehr klein. Es geht noch nicht in die Schule, sondern schläft im Kinderwagen.',
        prompt: 'Das Baby ist klein. __________ geht nicht in die Schule.',
        options: ['es', 'er', 'sie'],
        correctIndex: 0,
        explanation: 'Das Baby (Neutrum) -> es.'
      },
      {
        id: 'l7-q5',
        type: 'fill_blank',
        isLesen: true,
        passageTitle: 'Lesetext: Mai und Emma',
        passage: 'Mai und Emma sprechen fließend Englisch im Unterricht. Sie kommen aus den USA.',
        prompt: 'Mai und Emma sprechen Englisch. __________ kommen aus den USA.',
        options: ['Sie', 'Ihr', 'Wir'],
        correctIndex: 0,
        explanation: 'Mai und Emma (Plural) -> Sie.'
      },
      {
        id: 'l7-q6',
        type: 'fill_blank',
        prompt: 'Du __________ sehr schön.',
        options: ['bist', 'ist', 'sind'],
        correctIndex: 0,
        explanation: 'Konjugation von sein: du bist.'
      },
      {
        id: 'l7-q7',
        type: 'fill_blank',
        prompt: 'Was kaufst __________ heute auf dem Markt?',
        options: ['du', 'ihr', 'wir'],
        correctIndex: 0,
        explanation: 'kaufst -> du kaufst.'
      }
    ],
    voiceCheckpoints: [
      {
        id: 'v7-1',
        germanText: 'Die Kinder sprechen sehr gut Arabisch.',
        englishTranslation: 'The children speak Arabic very well.',
        phoneticGuide: 'Dee KIN-der SHPREH-khen zehr goot ah-RAH-bish.',
        pronunciationTip: 'Crisp short "i" in "Kinder".'
      },
      {
        id: 'v7-2',
        germanText: 'Wir hören gern fröhliche Musik.',
        englishTranslation: 'We like listening to cheerful music.',
        phoneticGuide: 'Veer HOE-ren gehrn FROE-likh-e moo-ZEEK.',
        pronunciationTip: 'Long "ö" sound in "hören".'
      },
      {
        id: 'v7-3',
        germanText: 'Peter und Max kommen aus Deutschland.',
        englishTranslation: 'Peter and Max come from Germany.',
        phoneticGuide: 'PEH-ter oont Mahks KOM-men ows DOYTCH-lahnt.',
        pronunciationTip: 'Final "d" in "Deutschland" sounds like "t".'
      }
    ],
    targetLaps: 1
  },
  {
    id: 8,
    slug: 'level-8-grand-prix',
    title: 'Level 8: Grand Prix - "Stell dich vor!"',
    subtitle: 'Die große Meisterprüfung auf der Autobahn',
    theme: 'grand_prix',
    trackStyle: {
      skyColorTop: '#09090b',
      skyColorBottom: '#18181b',
      roadColor: '#27272a',
      curbColorLight: '#e11d48',
      curbColorDark: '#fbbf24',
      fogColor: '#18181b',
      weather: 'clear',
      scenery: 'mountains'
    },
    summary: 'Das ultimative Autobahn-Finale! Beantworte alle 7 Fragen zur Selbstvorstellung ("Stell dich vor!") und bringe dein Auto mit 300 km/h ins Ziel!',
    storySnippet: 'Stell dich vor! Wie heißt du? Wie alt bist du? Woher kommst du? Wo wohnst du? Was sprichst du? Was ist dein Hobby? Was ist dein Lieblingsessen?',
    vocabulary: [
      { german: 'Stell dich vor!', english: 'Introduce yourself!' },
      { german: 'das Alter', english: 'age' },
      { german: 'das Hobby', english: 'hobby' },
      { german: 'das Lieblingsessen', english: 'favourite food' },
      { german: 'der Sieger', english: 'the winner' },
      { german: 'die Ziellinie', english: 'finish line' }
    ],
    gates: [
      {
        id: 'l8-q1',
        type: 'speed_gate',
        isLesen: true,
        passageTitle: 'Lesetext: Steckbrief - Alter',
        passage: 'Hallo, ich heiße Omar! Ich bin 12 Jahre alt und feiere im Sommer meinen Geburtstag.',
        prompt: 'Frage: "Wie alt bist du?" - Richtige Antwort:',
        options: ['Ich bin 12 Jahre alt.', 'Ich heiße Omar.', 'Ich komme aus Kairo.'],
        correctIndex: 0,
        explanation: 'Auf "Wie alt bist du?" antwortet man mit dem Alter: "Ich bin ... Jahre alt."'
      },
      {
        id: 'l8-q2',
        type: 'speed_gate',
        isLesen: true,
        passageTitle: 'Lesetext: Steckbrief - Wohnort',
        passage: 'Ich wohne mit meiner Familie in Kairo. Kairo ist eine riesige und schöne Stadt am Nil.',
        prompt: 'Frage: "Wo wohnst du?" - Richtige Antwort:',
        options: ['Ich wohne in Kairo.', 'Ich spreche Arabisch.', 'Mein Hobby ist Fußball.'],
        correctIndex: 0,
        explanation: 'Auf "Wo wohnst du?" antwortet man mit der Stadt: "Ich wohne in ..."'
      },
      {
        id: 'l8-q3',
        type: 'speed_gate',
        isLesen: true,
        passageTitle: 'Lesetext: Sprachen der Welt',
        passage: 'In Ägypten spricht man Arabisch, aber ich lerne auch Deutsch in der Schule. Ich spreche Arabisch und Deutsch.',
        prompt: 'Frage: "Was sprichst du?" - Richtige Antwort:',
        options: ['Ich spreche Arabisch und Deutsch.', 'Ich mag Äpfel.', 'Er heißt Alexander.'],
        correctIndex: 0,
        explanation: 'Hier werden die Sprachen genannt.'
      },
      {
        id: 'l8-q4',
        type: 'speed_gate',
        isLesen: true,
        passageTitle: 'Lesetext: Freizeit & Hobbys',
        passage: 'In meiner Freizeit spiele ich am liebsten Sport. Mein Hobby ist Fußball mit meinen Schulfreunden.',
        prompt: 'Frage: "Was ist dein Hobby?" - Richtige Antwort:',
        options: ['Mein Hobby ist Fußball.', 'Ich bin 11 Jahre alt.', 'Aus dem Raumschiff.'],
        correctIndex: 0,
        explanation: 'Mein Hobby ist Fußball / Schwimmen / Musik.'
      },
      {
        id: 'l8-q5',
        type: 'speed_gate',
        isLesen: true,
        passageTitle: 'Lesetext: PB3 Rätsel',
        passage: 'PB3 hat auf der Erde ein Obst besonders gern: den roten Apfel! Das magische Lösungswort im Kreuzworträtsel ist APFEL.',
        prompt: 'Wie lautet das Lösungswort im Kreuzworträtsel von PB3?',
        options: ['APFEL', 'BANANE', 'SCHLEIM'],
        correctIndex: 0,
        explanation: 'Aus dem PB3 Arbeitsblatt: Das Lösungswort ist APFEL!'
      }
    ],
    voiceCheckpoints: [
      {
        id: 'v8-1',
        germanText: 'Ich heiße Malek und bin elf Jahre alt.',
        englishTranslation: 'My name is Malek and I am eleven years old.',
        phoneticGuide: 'Ikh HIGH-se Mah-lek oont bin elf YAH-re ahlt.',
        pronunciationTip: '"ei" in heiße sounds like "eye".'
      },
      {
        id: 'v8-2',
        germanText: 'Ich wohne in Kairo und lerne Deutsch.',
        englishTranslation: 'I live in Cairo and am learning German.',
        phoneticGuide: 'Ikh VOH-ne in KY-roh oont LEHR-ne DOYTCH.',
        pronunciationTip: 'Clear "d" and "eu" in Deutsch.'
      },
      {
        id: 'v8-3',
        germanText: 'Mein Hobby ist Fußball und mein Lieblingsessen ist Pizza.',
        englishTranslation: 'My hobby is football and my favourite food is pizza.',
        phoneticGuide: 'Mine HOB-by ist FOOS-bahl oont mine LEEP-lings-es-sen ist PEET-sah.',
        pronunciationTip: 'Sharp double s / ß in Fußball and Lieblingsessen.'
      }
    ],
    targetLaps: 1
  }
];
