/**
 * Dedicated Curriculum for Reading & Listening Comprehension ("Lesen & Hören")
 * Untimed, self-paced, school-aligned German comprehension units with authentic texts.
 */

export interface LesenQuestion {
  id: string;
  prompt: string;
  promptArabic?: string;
  options: [string, string, string];
  correctIndex: 0 | 1 | 2;
  explanation: string;
  explanationArabic?: string;
}

export interface LesenUnit {
  id: string;
  unitNumber: number;
  title: string;
  titleArabic: string;
  topic: string;
  difficulty: 'A1.1' | 'A1.2';
  icon: string;
  coverGradient: string;
  passageTitle: string;
  passage: string;
  passageArabic: string;
  audioSpeed?: number;
  questions: LesenQuestion[];
}

export const LESEN_UNITS: LesenUnit[] = [
  {
    id: 'lesen-unit-1',
    unitNumber: 1,
    title: 'PB3 & das Raumschiff',
    titleArabic: 'بي بي 3 والمركبة الفضائية',
    topic: 'Wetter, Zimmer & Besuch aus dem All',
    difficulty: 'A1.1',
    icon: '🚀',
    coverGradient: 'from-blue-600 via-indigo-600 to-slate-900',
    passageTitle: 'Lesetext 1: Besuch im Garten',
    passage: 'Alex ist in seinem Zimmer. Er muss Hausaufgaben machen, aber er sieht lieber aus dem Fenster. Es regnet und ist sehr windig. Ein graues, rundes Raumschiff landet plötzlich im Garten! Aus dem Raumschiff kommen ein kleiner Außerirdischer namens PB3 und sein Roboter Petra.',
    passageArabic: 'أليكس في غرفته. يجب عليه أداء واجباته المدرسية، لكنه يفضل النظر من النافذة. الجو ممطر وعاصف جداً. فجأة تهبط مركبة فضائية رمادية مستديرة في الحديقة! يخرج من المركبة كائن فضائي صغير يُدعى PB3 وروبوته بترا.',
    audioSpeed: 0.85,
    questions: [
      {
        id: 'u1-q1',
        prompt: 'Wo ist Alex am Anfang der Geschichte?',
        promptArabic: 'أين يوجد أليكس في بداية القصة؟',
        options: ['In seinem Zimmer', 'Im Garten', 'In der Schule'],
        correctIndex: 0,
        explanation: 'Alex ist in seinem Zimmer und schaut aus dem Fenster.',
        explanationArabic: 'أليكس موجود في غرفته وينظر من النافذة.'
      },
      {
        id: 'u1-q2',
        prompt: 'Wie ist das Wetter draußen?',
        promptArabic: 'كيف هو الطقس في الخارج؟',
        options: ['Es regnet und ist windig.', 'Es ist sonnig und warm.', 'Es schneit und ist kalt.'],
        correctIndex: 0,
        explanation: 'Im Text steht: "Es regnet und ist sehr windig."',
        explanationArabic: 'مكتوب في النص: "الجو ممطر وعاصف جداً".'
      },
      {
        id: 'u1-q3',
        prompt: 'Was muss Alex eigentlich machen?',
        promptArabic: 'ماذا يجب على أليكس فعله في الحقيقة؟',
        options: ['Hausaufgaben machen', 'Schlafen', 'Pizza essen'],
        correctIndex: 0,
        explanation: 'Alex muss seine Hausaufgaben machen, sieht aber aus dem Fenster.',
        explanationArabic: 'يجب على أليكس أداء واجباته المدرسية.'
      },
      {
        id: 'u1-q4',
        prompt: 'Welche Form und Farbe hat das Raumschiff?',
        promptArabic: 'ما هو شكل ولون المركبة الفضائية؟',
        options: ['Rund und grau', 'Eckig und gelb', 'Dreieckig und rot'],
        correctIndex: 0,
        explanation: 'Das Raumschiff ist rund und grau.',
        explanationArabic: 'المركبة الفضائية مستديرة ورمادية.'
      },
      {
        id: 'u1-q5',
        prompt: 'Wie heißt der Roboter von PB3?',
        promptArabic: 'ما هو اسم روبوت PB3؟',
        options: ['Petra', 'Alex', 'Tim'],
        correctIndex: 0,
        explanation: 'Der Roboter heißt Petra.',
        explanationArabic: 'الروبوت اسمه بترا (Petra).'
      }
    ]
  },
  {
    id: 'lesen-unit-2',
    unitNumber: 2,
    title: 'Auf dem Gemüsemarkt',
    titleArabic: 'في سوق الخضار والفواكه',
    topic: 'Farben, Obst & Gemüse auf der Erde',
    difficulty: 'A1.1',
    icon: '🍎',
    coverGradient: 'from-emerald-600 via-teal-700 to-slate-900',
    passageTitle: 'Lesetext 2: Bunte Farben auf der Erde',
    passage: 'Auf dem Planeten P3 gibt es nur Schwarz, Grau, Grün und Weiß. Auf der Erde entdeckt PB3 viele bunte Farben: Der Apfel ist rot! Die Bananen sind gelb. Alex Lieblingsobst sind süße violette Trauben. Nach dem Regen leuchtet ein wunderschöner bunter Regenbogen am Himmel.',
    passageArabic: 'على كوكب P3 لا يوجد سوى الأسود والرمادي والأخضر والأبيض. أما على الأرض فيكتشف PB3 العديد من الألوان الزاهية: التفاحة حمراء! الموز أصفر. الفاكهة المفضلة لأليكس هي العنب البنفسجي الحلو. وبعد المطر يتألق قوس قزح رائع وملون في السماء.',
    audioSpeed: 0.85,
    questions: [
      {
        id: 'u2-q1',
        prompt: 'Welche Farbe hat der Apfel auf dem Tisch?',
        promptArabic: 'ما هو لون التفاحة على الطاولة؟',
        options: ['Rot', 'Grün', 'Blau'],
        correctIndex: 0,
        explanation: 'Der Apfel ist rot.',
        explanationArabic: 'التفاحة لونها أحمر.'
      },
      {
        id: 'u2-q2',
        prompt: 'Welche Farben gibt es auf dem Planeten P3?',
        promptArabic: 'ما هي الألوان الموجودة على كوكب P3؟',
        options: ['Schwarz, Grau, Grün und Weiß', 'Rot, Gelb und Blau', 'Pink und Gold'],
        correctIndex: 0,
        explanation: 'Auf P3 gibt es nur Schwarz, Grau, Grün und Weiß.',
        explanationArabic: 'على كوكب P3 يوجد فقط الأسود والرمادي والأخضر والأبيض.'
      },
      {
        id: 'u2-q3',
        prompt: 'Was ist Alex Lieblingsobst?',
        promptArabic: 'ما هي الفاكهة المفضلة لأليكس؟',
        options: ['Trauben', 'Birnen', 'Kartoffeln'],
        correctIndex: 0,
        explanation: 'Alex Lieblingsobst sind süße Trauben.',
        explanationArabic: 'الفاكهة المفضلة لأليكس هي العنب (Trauben).'
      },
      {
        id: 'u2-q4',
        prompt: 'Was leuchtet nach dem Regen am Himmel?',
        promptArabic: 'ما الذي يضيء في السماء بعد المطر؟',
        options: ['Ein Regenbogen', 'Ein Schneesturm', 'Ein Flugzeug'],
        correctIndex: 0,
        explanation: 'Nach dem Regen leuchtet ein bunter Regenbogen.',
        explanationArabic: 'بعد المطر يسطع قوس قزح ملون (Regenbogen).'
      }
    ]
  },
  {
    id: 'lesen-unit-3',
    unitNumber: 3,
    title: 'Tim und die Spielsachen',
    titleArabic: 'تيم والألعاب',
    topic: 'Die Holzkiste, Tim & Petras Schleim',
    difficulty: 'A1.1',
    icon: '📦',
    coverGradient: 'from-amber-600 via-orange-600 to-slate-900',
    passageTitle: 'Lesetext 3: Keine Spielsachen!',
    passage: 'Im Dorf steigen PB3 und Petra in eine große Kiste. Ein Mann stellt die Kiste auf einen Lastwagen. Der kleine Junge Tim ruft im Zimmer: "Das sind MEINE Spielsachen!" Aber PB3 ruft empört: "Wir sind keine Spielsachen!" Aus Petras kleiner Bauch-Tür spritzt schrecklicher, klebriger grüner Schleim über Tim!',
    passageArabic: 'في القرية صعد PB3 وبترا إلى صندوق كبير. وضع رجل الصندوق على شاحنة. صرخ الصبي الصغير تيم في الغرفة: "هذه ألعابي!" لكن PB3 صاح غاضباً: "نحن لسنا ألعاباً!" ومن باب بطن بترا الصغير، اندفع مخاط أخضر لزج ومريع على تيم!',
    audioSpeed: 0.85,
    questions: [
      {
        id: 'u3-q1',
        prompt: 'Was ist PB3s absolutes Lieblingsgemüse?',
        promptArabic: 'ما هي الخضروات المفضلة تماماً لـ PB3؟',
        options: ['Zwiebeln', 'Karotten', 'Kartoffeln'],
        correctIndex: 0,
        explanation: 'Zwiebeln sind PB3s absolutes Lieblingsgemüse!',
        explanationArabic: 'البصل (Zwiebeln) هو الخضار المفضل لـ PB3.'
      },
      {
        id: 'u3-q2',
        prompt: 'Wohin steigen PB3 und Petra im Dorf?',
        promptArabic: 'إلى أين صعد PB3 وبترا في القرية؟',
        options: ['In eine große Kiste', 'In ein Flugzeug', 'In ein Auto'],
        correctIndex: 0,
        explanation: 'Sie steigen in eine große Holzkiste.',
        explanationArabic: 'صعدا داخل صندوق كبير (Kiste).'
      },
      {
        id: 'u3-q3',
        prompt: 'Was ruft Tim im Zimmer?',
        promptArabic: 'ماذا نادى تيم في الغرفة؟',
        options: ['"Das sind MEINE Spielsachen!"', '"Hallo Freunde!"', '"Gute Nacht!"'],
        correctIndex: 0,
        explanation: 'Tim ruft: "Das sind MEINE Spielsachen!"',
        explanationArabic: 'تيم صرخ: "هذه ألعابي!".'
      },
      {
        id: 'u3-q4',
        prompt: 'Was spritzt aus Petras Bauch-Tür?',
        promptArabic: 'ما الذي اندفع من باب بطن بترا؟',
        options: ['Grüner Schleim', 'Kaltes Wasser', 'Heißer Tee'],
        correctIndex: 0,
        explanation: 'Aus Petras Tür spritzt schrecklicher grüner Schleim.',
        explanationArabic: 'خرج مخاط أخضر (grüner Schleim).'
      }
    ]
  },
  {
    id: 'lesen-unit-4',
    unitNumber: 4,
    title: 'Kennenlernen & Begrüßung',
    titleArabic: 'التعارف والتحية',
    topic: 'Herkunft, Wohnort & Sprachen',
    difficulty: 'A1.1',
    icon: '🌍',
    coverGradient: 'from-cyan-600 via-blue-600 to-slate-900',
    passageTitle: 'Lesetext 4: Omar stellt sich vor',
    passage: 'Hallo! Wie heißt du? Mein Name ist Omar. Ich komme aus Ägypten und wohne in der Hauptstadt Kairo. Ich spreche Arabisch und lerne Deutsch und Englisch in der Schule. Woher kommst du und welche Sprachen sprichst du?',
    passageArabic: 'مرحباً! ما اسمك؟ اسمي عمر. أنا من مصر وأعيش في العاصمة القاهرة. أتحدث اللغة العربية وأتعلم الألمانية والإنجليزية في المدرسة. من أين أنت وما هي اللغات التي تتحدثها؟',
    audioSpeed: 0.88,
    questions: [
      {
        id: 'u4-q1',
        prompt: 'Woher kommt Omar?',
        promptArabic: 'من أين يأتي عمر؟',
        options: ['Aus Ägypten', 'Aus Deutschland', 'Aus der Türkei'],
        correctIndex: 0,
        explanation: 'Omar kommt aus Ägypten.',
        explanationArabic: 'عمر من مصر (aus Ägypten).'
      },
      {
        id: 'u4-q2',
        prompt: 'Wo wohnt Omar?',
        promptArabic: 'أين يعيش عمر؟',
        options: ['In Kairo', 'In Berlin', 'In Alexandria'],
        correctIndex: 0,
        explanation: 'Er wohnt in Kairo.',
        explanationArabic: 'يعيش في القاهرة (in Kairo).'
      },
      {
        id: 'u4-q3',
        prompt: 'Welche Sprache spricht man in Ägypten?',
        promptArabic: 'ما هي اللغة التي يتحدث بها الناس في مصر؟',
        options: ['Arabisch', 'Deutsch', 'Spanisch'],
        correctIndex: 0,
        explanation: 'In Ägypten spricht man Arabisch.',
        explanationArabic: 'في مصر يتحدثون العربية (Arabisch).'
      },
      {
        id: 'u4-q4',
        prompt: 'Welches Fragewort passt: "__________ kommst du?"',
        promptArabic: 'ما هي أداة الاستفهام المناسبة: "من أين تأتي؟"',
        options: ['Woher', 'Wo', 'Wie'],
        correctIndex: 0,
        explanation: 'Für Herkunft fragt man mit "Woher" (Woher kommst du?).',
        explanationArabic: 'للسؤال عن الموطن نستخدم Woher.'
      }
    ]
  },
  {
    id: 'lesen-unit-5',
    unitNumber: 5,
    title: 'Lenas Alltag & Familie',
    titleArabic: 'يوميات لينا وعائلتها (قطعة الامتحان المدرسي)',
    topic: '13 Jahre, Hamburg, Berufe & Sport',
    difficulty: 'A1.2',
    icon: '🏫',
    coverGradient: 'from-violet-600 via-purple-700 to-slate-900',
    passageTitle: 'Lesetext 5: Das Leben von Lena',
    passage: 'Hallo! Ich heiße Lena und bin 13 Jahre alt. Ich komme aus Deutschland und wohne in Hamburg mit meiner Familie. Meine Mutter ist Ärztin im Krankenhaus und mein Vater arbeitet in einer Bank. Mein Lieblingsfach in der Schule ist Deutsch, aber ich mag auch Sport. Am Dienstag spiele ich Volleyball mit meinen Freundinnen und am Samstag spielen wir Fußball.',
    passageArabic: 'مرحباً! اسمي لينا وعمري 13 عاماً. أنا من ألمانيا وأعيش في هامبورغ مع عائلتي. والدتي طبيبة في المستشفى ووالدي يعمل في بنك. مادتي المفضلة في المدرسة هي اللغة الألمانية، ولكني أحب الرياضة أيضاً. يوم الثلاثاء ألعب الكرة الطائرة مع صديقاتي، ويوم السبت نلعب كرة القدم.',
    audioSpeed: 0.85,
    questions: [
      {
        id: 'u5-q1',
        prompt: 'Wie alt ist Lena?',
        promptArabic: 'كم عمر لينا؟',
        options: ['13 Jahre alt (dreizehn)', '12 Jahre alt (zwölf)', '15 Jahre alt (fünfzehn)'],
        correctIndex: 0,
        explanation: 'Lena ist 13 Jahre alt.',
        explanationArabic: 'عمر لينا 13 عاماً (dreizehn).'
      },
      {
        id: 'u5-q2',
        prompt: 'Wo wohnt Lena mit ihrer Familie?',
        promptArabic: 'أين تعيش لينا مع عائلتها؟',
        options: ['In Hamburg', 'In Berlin', 'In München'],
        correctIndex: 0,
        explanation: 'Lena wohnt in Hamburg.',
        explanationArabic: 'تعيش في هامبورغ (Hamburg).'
      },
      {
        id: 'u5-q3',
        prompt: 'Was ist Lenas Mutter von Beruf?',
        promptArabic: 'ما هي مهنة والدة لينا؟',
        options: ['Ärztin', 'Lehrerin', 'Verkäuferin'],
        correctIndex: 0,
        explanation: 'Ihre Mutter ist Ärztin im Krankenhaus.',
        explanationArabic: 'والدتها طبيبة (Ärztin).'
      },
      {
        id: 'u5-q4',
        prompt: 'Wann spielt Lena Volleyball mit ihren Freundinnen?',
        promptArabic: 'متى تلعب لينا الكرة الطائرة مع صديقاتها؟',
        options: ['Am Dienstag', 'Am Montag', 'Am Samstag'],
        correctIndex: 0,
        explanation: 'Am Dienstag spielt sie Volleyball.',
        explanationArabic: 'يوم الثلاثاء (Am Dienstag).'
      },
      {
        id: 'u5-q5',
        prompt: 'Was ist Lenas Lieblingsfach in der Schule?',
        promptArabic: 'ما هي المادة المفضلة للينا في المدرسة؟',
        options: ['Deutsch', 'Mathematik', 'Französisch'],
        correctIndex: 0,
        explanation: 'Ihr Lieblingsfach ist Deutsch.',
        explanationArabic: 'مادتها المفضلة هي الألمانية (Deutsch).'
      },
      {
        id: 'u5-q6',
        prompt: 'Richtig oder Falsch: Lenas Vater arbeitet als Lehrer.',
        promptArabic: 'صح أم خطأ: والد لينا يعمل مدرساً.',
        options: ['Falsch (Er arbeitet in einer Bank)', 'Richtig', 'Keine Ahnung'],
        correctIndex: 0,
        explanation: 'Falsch! Der Vater arbeitet in einer Bank.',
        explanationArabic: 'خطأ! والدها يعمل في بنك.'
      }
    ]
  },
  {
    id: 'lesen-unit-6',
    unitNumber: 6,
    title: 'Lina, Paul & Anna',
    titleArabic: 'لينا وبول وآنا (الأفعال والهوايات)',
    topic: 'Modalverb "können" & Hobbys',
    difficulty: 'A1.2',
    icon: '🎸',
    coverGradient: 'from-rose-600 via-pink-700 to-slate-900',
    passageTitle: 'Lesetext 6: Was können die Geschwister?',
    passage: 'Lina kann singen und tanzen, aber nicht gut zeichnen. Ihr Bruder Paul kann sehr gut Fußball spielen und Gitarre spielen. Ihre kleine Schwester Anna kann prima kochen, aber sie kann leider überhaupt noch nicht schwimmen! Zusammen machen sie gerne Musik.',
    passageArabic: 'لينا تستطيع الغناء والرقص، لكنها لا تجيد الرسم. شقيقها بول يستطيع لعب كرة القدم وعزف الجيتار بشكل ممتاز. أختها الصغيرة آنا تجيد الطبخ بمهارة، لكنها للأسف لا تستطيع السباحة على الإطلاق حتى الآن! معاً يستمتعون بصنع الموسيقى.',
    audioSpeed: 0.85,
    questions: [
      {
        id: 'u6-q1',
        prompt: 'Was kann Linas Bruder Paul machen?',
        promptArabic: 'ماذا يستطيع بول شقيق لينا أن يفعل؟',
        options: ['Fußball und Gitarre spielen', 'Kuchen backen', 'Schwimmen'],
        correctIndex: 0,
        explanation: 'Paul kann Fußball und Gitarre spielen.',
        explanationArabic: 'بول يستطيع لعب كرة القدم وعزف الجيتار.'
      },
      {
        id: 'u6-q2',
        prompt: 'Was kann Anna NICHT?',
        promptArabic: 'ما الذي لا تستطيع آنا فعله؟',
        options: ['Schwimmen', 'Kochen', 'Musik hören'],
        correctIndex: 0,
        explanation: 'Anna kann noch nicht schwimmen.',
        explanationArabic: 'آنا لا تستطيع السباحة (nicht schwimmen).'
      },
      {
        id: 'u6-q3',
        prompt: 'Was kann Lina machen?',
        promptArabic: 'ماذا تستطيع لينا أن تفعل؟',
        options: ['Singen und tanzen', 'Kochen', 'Gitarre spielen'],
        correctIndex: 0,
        explanation: 'Lina kann singen und tanzen.',
        explanationArabic: 'لينا تستطيع الغناء والرقص.'
      }
    ]
  },
  {
    id: 'lesen-unit-7',
    unitNumber: 7,
    title: 'Stell dich vor! (Das Abschluss-Quiz)',
    titleArabic: 'عرّف بنفسك! (المسابقة الختامية)',
    topic: 'Selbstvorstellung & Kreuzworträtsel',
    difficulty: 'A1.2',
    icon: '🏆',
    coverGradient: 'from-yellow-500 via-amber-600 to-slate-900',
    passageTitle: 'Lesetext 7: Der Steckbrief von Malek',
    passage: 'Hallo! Ich heiße Malek. Ich bin 11 Jahre alt und wohne in Kairo. Ich spreche Arabisch und lerne Deutsch in der Schule. Mein Lieblingshobby ist Fußball und mein Lieblingsessen ist Pizza. Das geheime Lösungswort im PB3 Kreuzworträtsel ist APFEL!',
    passageArabic: 'مرحباً! اسمي مالك. عمري 11 عاماً وأعيش في القاهرة. أتحدث العربية وأتعلم الألمانية في المدرسة. هوايتي المفضلة هي كرة القدم وأكلتي المفضلة هي البيتزا. والكلمة السرية لحل لغز PB3 هي APFEL (تفاح)!',
    audioSpeed: 0.85,
    questions: [
      {
        id: 'u7-q1',
        prompt: 'Frage: "Wie alt bist du?" - Richtige Antwort:',
        promptArabic: 'سؤال: "كم عمرك؟" - الإجابة الصحيحة:',
        options: ['Ich bin 11 Jahre alt.', 'Ich heiße Malek.', 'Ich wohne in Kairo.'],
        correctIndex: 0,
        explanation: 'Auf "Wie alt bist du?" antwortet man mit dem Alter.',
        explanationArabic: 'للإجابة عن العمر نقول: "Ich bin ... Jahre alt".'
      },
      {
        id: 'u7-q2',
        prompt: 'Frage: "Wo wohnst du?" - Richtige Antwort:',
        promptArabic: 'سؤال: "أين تسكن؟" - الإجابة الصحيحة:',
        options: ['Ich wohne in Kairo.', 'Ich spreche Arabisch.', 'Mein Hobby ist Fußball.'],
        correctIndex: 0,
        explanation: 'Auf "Wo wohnst du?" antwortet man mit dem Wohnort.',
        explanationArabic: 'للإجابة عن مكان السكن نقول: "Ich wohne in ...".'
      },
      {
        id: 'u7-q3',
        prompt: 'Was ist das Lieblingsessen?',
        promptArabic: 'ما هو الطعام المفضل؟',
        options: ['Pizza', 'Suppe', 'Fisch'],
        correctIndex: 0,
        explanation: 'Sein Lieblingsessen ist Pizza.',
        explanationArabic: 'طعامه المفضل هو البيتزا.'
      },
      {
        id: 'u7-q4',
        prompt: 'Wie lautet das Lösungswort im PB3 Kreuzworträtsel?',
        promptArabic: 'ما هي الكلمة السرية في لغز PB3 المتقاطع؟',
        options: ['APFEL', 'BANANE', 'SCHLEIM'],
        correctIndex: 0,
        explanation: 'Das Lösungswort ist APFEL!',
        explanationArabic: 'كلمة الحل هي APFEL (تفاح).'
      }
    ]
  }
];
