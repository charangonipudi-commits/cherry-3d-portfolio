/**
 * Cherry AI local engine.
 *
 * A dependency-free intent engine that understands English, Telugu
 * (script) and romanised Telugu-English mix ("Tenglish"), keeps
 * conversation context, and answers ONLY from the site knowledge.
 * The exact same module runs in the browser (offline fallback) and
 * inside the /api/chat serverless function.
 */

import { SERVICES, SITE, formatINR } from './knowledge.js';
import type { CardPayload, EngineReply, HistoryTurn, Lang } from './types';

type Product = 'website' | 'app' | 'both' | null;

type Intent =
  | 'feature'
  | 'order'
  | 'pricing'
  | 'discount'
  | 'howto_order'
  | 'identity'
  | 'about_owner'
  | 'roadmap'
  | 'projects'
  | 'services'
  | 'contact'
  | 'greeting'
  | 'ack'
  | 'thanks'
  | 'bye'
  | 'unknown';

/* ------------------------------------------------------------------ */
/* Text normalisation                                                  */
/* ------------------------------------------------------------------ */

const TELUGU_SCRIPT = /[\u0C00-\u0C7F]/;

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}₹%\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(norm: string): string[] {
  return norm ? norm.split(' ') : [];
}

/**
 * Word match with light stemming: exact for short words,
 * prefix match for 3+ letter keywords ("services" hits "service").
 */
function hasWord(tokens: string[], word: string): boolean {
  if (word.includes(' ')) return false; // phrases handled separately
  return tokens.some((t) => {
    if (t === word) return true;
    if (word.length >= 3 && t.startsWith(word)) return true;
    return word.length >= 4 && t.length >= 4 && t.includes(word);
  });
}

function hasPhrase(norm: string, phrase: string): boolean {
  return norm.includes(phrase);
}

function hits(norm: string, tokens: string[], phrases: string[]): number {
  let count = 0;
  for (const p of phrases) {
    if (p.includes(' ') ? hasPhrase(norm, p) : hasWord(tokens, p)) count += 1;
  }
  return count;
}

/* ------------------------------------------------------------------ */
/* Language detection: en | te (script) | tenglish (romanised)         */
/* ------------------------------------------------------------------ */

// Strong romanised-Telugu markers — one hit is enough to switch style.
const TENGLISH_MARKERS = [
  'entha',
  'enta',
  'antha',
  'kavali',
  'kavala',
  'kaavali',
  'chestaru',
  'chesthara',
  'chestara',
  'chestunnaru',
  'cheyandi',
  'cheppandi',
  'cheppu',
  'chudali',
  'chudu',
  'meeru',
  'miru',
  'naku',
  'naaku',
  'ela',
  'elanti',
  'emi',
  'gurinchi',
  'kosam',
  'avasaram',
  'kavalsina',
  'chesaru',
  'tayaru',
  'cheppu',
  'telugu',
  'andhru',
  'meku',
];

function detectLanguage(rawText: string, norm: string, tokens: string[]): Lang {
  if (TELUGU_SCRIPT.test(rawText)) return 'te';
  if (hits(norm, tokens, TENGLISH_MARKERS) > 0) return 'tenglish';
  return 'en';
}

/* ------------------------------------------------------------------ */
/* Product detection                                                   */
/* ------------------------------------------------------------------ */

const WEBSITE_WORDS = [
  'website',
  'websit',
  'web',
  'site',
  'webpage',
  'landing',
  'వెబ్',
  'సైట్',
];
const APP_WORDS = [
  'app',
  'application',
  'android',
  'apk',
  'playstore',
  'యాప్',
];

function detectProduct(norm: string, tokens: string[]): Product {
  const web = hits(norm, tokens, WEBSITE_WORDS) > 0;
  const app = hits(norm, tokens, APP_WORDS) > 0;
  if (web && app) return 'both';
  if (web) return 'website';
  if (app) return 'app';
  return null;
}

/** Most recent product discussed before the current message. */
function deriveLastTopic(history: HistoryTurn[]): Product {
  const userTurns = history
    .slice(0, -1)
    .filter((m) => m.role === 'user')
    .reverse();
  for (const turn of userTurns) {
    const norm = normalize(turn.content);
    const product = detectProduct(norm, tokenize(norm));
    if (product === 'website' || product === 'app') return product;
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* Intent rules                                                        */
/* ------------------------------------------------------------------ */

const INTENT_RULES: Array<{ intent: Intent; phrases: string[] }> = [
  {
    intent: 'feature',
    phrases: [
      'firebase',
      'backend',
      'database',
      'auth',
      'login',
      'monetization',
      'monetisation',
      'admob',
      'playstore',
      'play store',
      'publish',
      'apk',
      'ssl',
      'deploy',
      'deployment',
      'hosting',
      'ecommerce',
      'e commerce',
      'razorpay',
      'google play',
      'promotion',
      'marketing',
      'analytics',
      'ఫైర్‌బేస్',
      'ఫైర్‌బేస్',
    ],
  },
  {
    intent: 'howto_order',
    phrases: [
      'how to order',
      'how do i order',
      'how can i order',
      'how to buy',
      'how can i get',
      'how does it work',
      'order process',
      'order ela',
      'ela order',
      'ela kontanu',
      'order ఎలా',
      'ఎలా order',
      'procedure',
      'koni',
    ],
  },
  {
    intent: 'order',
    phrases: [
      'order',
      'kavali',
      'kavala',
      'kaavali',
      'konali',
      'i want',
      'i need',
      'want one',
      'get one',
      'book',
      'కావాలి',
      'కొనాలి',
      'cheyinchandi',
    ],
  },
  {
    intent: 'pricing',
    phrases: [
      'price',
      'pricing',
      'cost',
      'charge',
      'fee',
      'rate',
      'how much',
      'howmuch',
      'entha',
      'enta',
      'antha',
      'dhara',
      'dara',
      'rupees',
      '₹',
      'ఎంత',
      'ధర',
    ],
  },
  {
    intent: 'discount',
    phrases: ['discount', 'offer', '50%', '50 percent', 'deal', 'sale'],
  },
  {
    intent: 'identity',
    phrases: [
      'who are you',
      'who r u',
      'who is this',
      'what are you',
      'your name',
      'are you ai',
      'are you a bot',
      'are you bot',
      'are you robot',
      'are you real',
      'real person',
      'human',
      'nee peru',
      'nuvvu evaru',
      'evaru nuvvu',
      'నువ్వు ఎవరు',
      'నీ పేరు',
    ],
  },
  {
    intent: 'about_owner',
    phrases: [
      'about charan',
      'about cherry',
      'who is charan',
      'who is cherry',
      'charan',
      'gonipudi',
      'owner',
      'creator',
      'experience',
      'about you',
      'about yourself',
      'charan evaru',
      'చరణ్',
      'గోనిపుడి',
      'మీ గురించి',
    ],
  },
  {
    intent: 'roadmap',
    phrases: [
      'roadmap',
      'app building',
      'building roadmap',
      'app idea',
      'idea to',
      'steps',
      'checkpoint',
      'రోడ్',
      'రోడ్మ్యాప్',
    ],
  },
  {
    intent: 'projects',
    phrases: [
      'project',
      'portfolio',
      'example',
      'sample',
      'previous work',
      'past work',
      'ప్రాజెక్ట్',
    ],
  },
  {
    intent: 'services',
    phrases: [
      'service',
      'services',
      'offer',
      'what do you do',
      'what you do',
      'what can you',
      'emi chestaru',
      'em chestaru',
      'chesthara',
      'chestara',
      'chestaru',
      'cheyara',
      'cheyagalaru',
      'cheyavacha',
      'cheyacha',
      'chestunnaru',
      'create chestara',
      'సర్వీస్',
      'చేస్తారా',
      'చేయగలరా',
      'చేయవచ్చా',
      'చేస్తారు',
    ],
  },
  {
    intent: 'contact',
    phrases: [
      'contact',
      'whatsapp',
      'whats app',
      'wa.me',
      'phone',
      'number',
      'reach',
      'talk',
      'message',
      'వాట్సాప్',
      'ఫోన్',
    ],
  },
  {
    intent: 'greeting',
    phrases: [
      'hi',
      'hello',
      'hey',
      'hlo',
      'namaste',
      'namaskaram',
      'good morning',
      'good afternoon',
      'good evening',
      'నమస్కారం',
      'నమస్తే',
    ],
  },
  {
    intent: 'ack',
    phrases: ['ok', 'okay', 'nice', 'great', 'super', 'awesome', 'cool', 'good'],
  },
  {
    intent: 'thanks',
    phrases: ['thanks', 'thank you', 'thankyou', 'thx', 'tq', 'dhanyavadalu', 'ధన్యవాదాలు'],
  },
  {
    intent: 'bye',
    phrases: ['bye', 'goodbye', 'see you', 'see ya', 'vellanu', 'vasta'],
  },
];

/** Lower resolves first on equal score (more specific wins). */
const PRIORITY: Record<Intent, number> = {
  feature: 0,
  howto_order: 1,
  order: 1,
  pricing: 2,
  discount: 2,
  identity: 2,
  about_owner: 3,
  roadmap: 3,
  projects: 3,
  services: 4,
  contact: 5,
  greeting: 8,
  ack: 8,
  thanks: 9,
  bye: 9,
  unknown: 99,
};

function scoreIntents(norm: string, tokens: string[]) {
  const scores: Array<{ intent: Intent; score: number }> = [];
  for (const rule of INTENT_RULES) {
    const score = hits(norm, tokens, rule.phrases);
    if (score > 0) scores.push({ intent: rule.intent, score });
  }
  // A short greeting-like message ("hi cherry") should stay a greeting.
  const greetingScore = scores.find((s) => s.intent === 'greeting');
  const shortGreeting = greetingScore && tokens.length <= 3;
  scores.sort((a, b) => {
    const pa = shortGreeting && a.intent === 'greeting' ? -1 : PRIORITY[a.intent];
    const pb = shortGreeting && b.intent === 'greeting' ? -1 : PRIORITY[b.intent];
    if (b.score !== a.score) return b.score - a.score;
    return pa - pb;
  });
  return scores;
}

/* ------------------------------------------------------------------ */
/* Localised reply content                                             */
/* ------------------------------------------------------------------ */

const SUGGEST: Record<
  Lang,
  { services: string; website: string; app: string; projects: string; about: string; order: string; contact: string }
> = {
  en: {
    services: 'Services',
    website: 'Website Price',
    app: 'App Price',
    projects: 'My Projects',
    about: 'About Charan',
    order: 'How to Order?',
    contact: 'Contact on WhatsApp',
  },
  te: {
    services: 'సర్వీసులు',
    website: 'వెబ్‌సైట్ ధర',
    app: 'యాప్ ధర',
    projects: 'ప్రాజెక్ట్‌లు',
    about: 'Charan గురించి',
    order: 'Order ఎలా?',
    contact: 'WhatsApp Contact',
  },
  tenglish: {
    services: 'Services',
    website: 'Website price entha?',
    app: 'App price entha?',
    projects: 'Projects',
    about: 'About Charan',
    order: 'Order ela?',
    contact: 'WhatsApp Contact',
  },
};

function unknownReply(lang: Lang): EngineReply {
  const text =
    lang === 'te'
      ? 'ఈ information నా దగ్గర ఇంకా లేదు. Exact details కోసం Charan ని WhatsApp లో contact చేయండి.'
      : lang === 'tenglish'
        ? 'Ee information na daggara inka ledu. Exact details kosam Charan ni WhatsApp lo contact cheyandi.'
        : "I don't have that information yet. Please contact Charan on WhatsApp for the exact details.";
  return { text, cards: [], suggestions: [SUGGEST[lang].contact, SUGGEST[lang].services], lang };
}

function reply(lang: Lang, text: string, cards: CardPayload[], keys: Array<keyof typeof SUGGEST.en>): EngineReply {
  return { text, cards, suggestions: keys.map((k) => SUGGEST[lang][k]), lang };
}

function greetingReply(lang: Lang): EngineReply {
  if (lang === 'te')
    return reply(
      lang,
      'నమస్కారం! 👋 నేను Cherry AI. Websites, Android apps, pricing, projects గురించి సహాయం చేస్తాను. మీకు ఏం కావాలి?',
      [],
      ['services', 'website', 'app'],
    );
  if (lang === 'tenglish')
    return reply(
      lang,
      'Hi! 👋 Nenu Cherry AI. Websites, Android apps, pricing, projects gurinchi help chesta. Meeke em kavali?',
      [],
      ['services', 'website', 'app'],
    );
  return reply(
    lang,
    "Hello! 👋 I'm Cherry AI — ask me anything about Charan's websites, Android apps, pricing or projects.",
    [],
    ['services', 'website', 'app'],
  );
}

function servicesReply(lang: Lang): EngineReply {
  if (lang === 'te')
    return reply(
      lang,
      'Charan రెండు main services అందిస్తారు:\n\n1. Customized Website — మీ requirements కి సరిపోయే responsive website, deployment తో సహా.\n2. Customized App — మీ requirements మీదట customized Android application, APK generation తో సహా.\n\nరెండింటికీ ప్రస్తుతం 50% OFF ఉంది! 🎉',
      [],
      ['website', 'app', 'projects'],
    );
  if (lang === 'tenglish')
    return reply(
      lang,
      'Charan ki rendu main services unnayi:\n\n1. Customized Website — mee requirements ki saripoye responsive website, deployment tho saha.\n2. Customized App — mee requirements prakaram customized Android application, APK generation tho.\n\nRenditiki ippudu 50% OFF undi! 🎉',
      [],
      ['website', 'app', 'projects'],
    );
  return reply(
    lang,
    "Charan offers two main services:\n\n1. Customized Website — a responsive website designed to your requirements, including deployment.\n2. Customized App — a customized Android application with the functionality you need, including APK generation.\n\nBoth are 50% OFF right now! 🎉",
    [],
    ['website', 'app', 'projects'],
  );
}

function pricingReply(lang: Lang, product: Exclude<Product, null | 'both'>): EngineReply {
  const service = SERVICES.find((s) => s.id === product)!;
  const price = formatINR(service.discountedPrice);
  const original = formatINR(service.originalPrice);
  const cards: CardPayload[] = [{ kind: 'pricing', product }];

  if (lang === 'te') {
    const text =
      product === 'website'
        ? `Customized Website ప్రస్తుతం ${price} — ${original} కి 50% OFF! 🎉\nదీనిలో custom responsive design, mobile + desktop support, modern UI/UX, deployment మరియు basic post-launch support ఉన్నాయి.`
        : `Customized App ప్రస్తుతం ${price} — ${original} కి 50% OFF! 🎉\nదీనిలో custom app UI, Android development, మీకు కావాల్సిన functionality, APK generation మరియు basic post-launch support ఉన్నాయి.`;
    return reply(lang, text, cards, ['app', 'projects', 'order']);
  }
  if (lang === 'tenglish') {
    const text =
      product === 'website'
        ? `Customized Website ippudu ${price} — ${original} ki 50% OFF! 🎉\nLo custom responsive design, mobile + desktop support, modern UI/UX, deployment mariyu basic post-launch support unnayi.`
        : `Customized App ippudu ${price} — ${original} ki 50% OFF! 🎉\nLo custom app UI, Android development, meeku kavalsina functionality, APK generation mariyu basic post-launch support unnayi.`;
    return reply(lang, text, cards, ['app', 'projects', 'order']);
  }
  const text =
    product === 'website'
      ? `The Customized Website is ${price} right now — 50% OFF from ${original}! 🎉\nIt includes custom responsive design, mobile + desktop support, modern UI/UX, deployment and basic post-launch support.`
      : `The Customized App is ${price} right now — 50% OFF from ${original}! 🎉\nIt includes a custom app UI, Android development, the functionality you need, APK generation and basic post-launch support.`;
  return reply(lang, text, cards, ['app', 'projects', 'order']);
}

function pricingBothReply(lang: Lang): EngineReply {
  const cards: CardPayload[] = [
    { kind: 'pricing', product: 'website' },
    { kind: 'pricing', product: 'app' },
  ];
  if (lang === 'te')
    return reply(lang, 'ఇదిగో ధరలు — రెండింటికీ 50% OFF! 🎉', cards, ['projects', 'order']);
  if (lang === 'tenglish')
    return reply(lang, 'Idigo prices — renditiki 50% OFF! 🎉', cards, ['projects', 'order']);
  return reply(
    lang,
    "Here's the pricing — both services are 50% OFF right now! 🎉",
    cards,
    ['projects', 'order'],
  );
}

function orderReply(lang: Lang, product: Product): EngineReply {
  if (product === 'both' || product === null) {
    if (lang === 'te')
      return reply(
        lang,
        'సూపర్! 😊 మీకు ఏది కావాలి — Customized Website లేదా Customized App? రెండింటికీ 50% OFF ఉంది.',
        [
          { kind: 'pricing', product: 'website' },
          { kind: 'pricing', product: 'app' },
        ],
        ['order', 'contact'],
      );
    if (lang === 'tenglish')
      return reply(
        lang,
        'Super! 😊 Meeku edi kavali — Customized Website leda Customized App? Renditiki 50% OFF undi.',
        [
          { kind: 'pricing', product: 'website' },
          { kind: 'pricing', product: 'app' },
        ],
        ['order', 'contact'],
      );
    return reply(
      lang,
      'Great! 😊 Which one would you like — a Customized Website or a Customized App? Both are 50% OFF right now.',
      [
        { kind: 'pricing', product: 'website' },
        { kind: 'pricing', product: 'app' },
      ],
      ['order', 'contact'],
    );
  }

  const service = SERVICES.find((s) => s.id === product)!;
  const cards: CardPayload[] = [{ kind: 'pricing', product }];
  const price = formatINR(service.discountedPrice);
  const original = formatINR(service.originalPrice);
  if (lang === 'te')
    return reply(
      lang,
      `గ్రేట్ ఛాయిస్! 🎉 ${service.name} ప్రస్తుతం ${price} (${original} కి 50% OFF). Order చేయాలంటే కింద "Order" button నొక్కండి — WhatsApp open అవుతుంది, message ready గా ఉంటుంది.`,
      cards,
      ['order', 'contact'],
    );
  if (lang === 'tenglish')
    return reply(
      lang,
      `Great choice! 🎉 ${service.name} ippudu ${price} (${original} ki 50% OFF). Order cheyali ante kindha "Order" button nokandi — WhatsApp open avutundi, message ready ga untundi.`,
      cards,
      ['order', 'contact'],
    );
  return reply(
    lang,
    `Great choice! 🎉 The ${service.name} is ${price} right now (50% OFF from ${original}). Tap the "Order" button below — WhatsApp opens with a message ready to send to Charan.`,
    cards,
    ['order', 'contact'],
  );
}

function projectsReply(lang: Lang): EngineReply {
  const cards: CardPayload[] = [{ kind: 'projects' }];
  if (lang === 'te')
    return reply(
      lang,
      'Charan real, modern projects తయారు చేస్తారు. మీరు తీసుకోగలిగిన examples ఇవే:',
      cards,
      ['website', 'app'],
    );
  if (lang === 'tenglish')
    return reply(
      lang,
      'Charan real, modern projects tayaru chestaru. Meeru theesukogaligina examples ive:',
      cards,
      ['website', 'app'],
    );
  return reply(
    lang,
    "Charan builds real, modern projects. Here are examples of what you can get built:",
    cards,
    ['website', 'app'],
  );
}

function roadmapReply(lang: Lang): EngineReply {
  const cards: CardPayload[] = [{ kind: 'roadmap' }];
  if (lang === 'te')
    return reply(
      lang,
      'App idea నుంచి Play Store launch వరకు 8-checkpoint roadmap ఉంది. Steps ఇవిగో:',
      cards,
      ['app', 'order'],
    );
  if (lang === 'tenglish')
    return reply(
      lang,
      'App idea nunchi Play Store launch varaku 8-checkpoint roadmap undi. Steps ivigo:',
      cards,
      ['app', 'order'],
    );
  return reply(
    lang,
    "Charan's App Building Roadmap is an 8-checkpoint route from app idea to Play Store launch. Here are the steps:",
    cards,
    ['app', 'order'],
  );
}

function aboutReply(lang: Lang): EngineReply {
  if (lang === 'te')
    return reply(
      lang,
      `Charan (Cherry) ${SITE.experience} కలిగిన 3D creator & developer. ${SITE.stats.appsBuilt} apps build చేసారు, ${SITE.stats.appUsers} users వాడారు, annual earnings ${SITE.stats.annualEarnings}. ప్రధానంగా clean UI, smooth user experience మరియు practical functionality మీద focus.`,
      [],
      ['services', 'projects', 'contact'],
    );
  if (lang === 'tenglish')
    return reply(
      lang,
      `Charan (Cherry) ki ${SITE.experience} undi — 3D creator & developer. ${SITE.stats.appsBuilt} apps build chesaru, ${SITE.stats.appUsers} users, annual earnings ${SITE.stats.annualEarnings}. Main ga clean UI, smooth user experience mariyu practical functionality meeda focus.`,
      [],
      ['services', 'projects', 'contact'],
    );
  return reply(
    lang,
    `Charan (Cherry) is a 3D creator & developer with 2+ years of Android experience. He has built ${SITE.stats.appsBuilt} apps with ${SITE.stats.appUsers} users and ${SITE.stats.annualEarnings} annual earnings — focused on clean UI, smooth user experiences and practical functionality.`,
    [],
    ['services', 'projects', 'contact'],
  );
}

function identityReply(lang: Lang): EngineReply {
  if (lang === 'te')
    return reply(
      lang,
      'నేను Cherry AI — ఈ website assistant! 🤖 Charan services, pricing, projects గురించి చెప్పగలను. ఏదైనా అడగండి!',
      [],
      ['services', 'website', 'about'],
    );
  if (lang === 'tenglish')
    return reply(
      lang,
      'Nenu Cherry AI — ee website assistant! 🤖 Charan services, pricing, projects gurinchi cheppagalanu. Edaina adagandi!',
      [],
      ['services', 'website', 'about'],
    );
  return reply(
    lang,
    "I'm Cherry AI — the assistant on this website! 🤖 I can tell you about Charan's services, pricing, projects and his app-building roadmap. Ask me anything!",
    [],
    ['services', 'website', 'about'],
  );
}

function contactReply(lang: Lang): EngineReply {
  const cards: CardPayload[] = [{ kind: 'contact' }];
  if (lang === 'te')
    return reply(
      lang,
      'మీరు Charan ని నేరుగా WhatsApp లో contact చేయవచ్చు — projects మరియు requirements గురించి అక్కడే మాట్లాడతారు.',
      cards,
      ['order', 'website', 'app'],
    );
  if (lang === 'tenglish')
    return reply(
      lang,
      'Meeru Charan ni direct ga WhatsApp lo contact cheyochu — projects mariyu requirements gurinchi akkade matlataru.',
      cards,
      ['order', 'website', 'app'],
    );
  return reply(
    lang,
    "You can reach Charan directly on WhatsApp — he'll get back to you about your project and requirements.",
    cards,
    ['order', 'website', 'app'],
  );
}

function howtoReply(lang: Lang): EngineReply {
  if (lang === 'te')
    return reply(
      lang,
      'Order చేయడం చాలా easy:\n1. మీకు కావాల్సినది ఎంచుకోండి — Customized Website లేదా Customized App.\n2. Order button నొక్కండి — WhatsApp open అవుతుంది, message ready గా ఉంటుంది.\n3. మీ requirements Charan కి చెప్పండి — ఆయన మీకు details చెబుతారు.\n\nరెండు services కీ 50% OFF ఉంది!',
      [],
      ['website', 'app', 'contact'],
    );
  if (lang === 'tenglish')
    return reply(
      lang,
      'Order cheyadam chala easy:\n1. Meeku kavalsinadi choose cheyandi — Customized Website leda Customized App.\n2. Order button nokandi — WhatsApp open avutundi, message ready ga untundi.\n3. Mee requirements Charan ki cheppandi — details cheptaru.\n\nRendu services ki 50% OFF undi!',
      [],
      ['website', 'app', 'contact'],
    );
  return reply(
    lang,
    "Ordering is easy:\n1. Pick what you need — a Customized Website or a Customized App.\n2. Tap the order button — WhatsApp opens with a pre-filled message.\n3. Tell Charan your requirements and he'll get back to you with the details.\n\nBoth services are 50% OFF right now!",
    [],
    ['website', 'app', 'contact'],
  );
}

function discountReply(lang: Lang): EngineReply {
  const cards: CardPayload[] = [
    { kind: 'pricing', product: 'website' },
    { kind: 'pricing', product: 'app' },
  ];
  if (lang === 'te')
    return reply(lang, 'అవును! రెండు services కీ ప్రస్తుతం 50% OFF ఉంది 🎉', cards, ['order', 'contact']);
  if (lang === 'tenglish')
    return reply(lang, 'Avunu! Rendu services ki ippudu 50% OFF undi 🎉', cards, ['order', 'contact']);
  return reply(
    lang,
    'Yes! Both services are currently 50% OFF 🎉',
    cards,
    ['order', 'contact'],
  );
}

function thanksReply(lang: Lang): EngineReply {
  if (lang === 'te')
    return reply(lang, 'ధన్యవాదాలు! 😊 ఇంకేమైనా కావాలా?', [], ['services', 'order']);
  if (lang === 'tenglish')
    return reply(lang, 'Dhanyavadalu! 😊 Inkemaina kavala?', [], ['services', 'order']);
  return reply(lang, "You're welcome! 😊 Anything else you'd like to know?", [], ['services', 'order']);
}

function byeReply(lang: Lang): EngineReply {
  if (lang === 'te') return reply(lang, 'మళ్ళీ కలుద్దాం! 👋 Charan WhatsApp లో ఉంటారు. Good luck! 🍒', [], []);
  if (lang === 'tenglish')
    return reply(lang, 'Malli kaluddam! 👋 Charan WhatsApp lo untaru. Good luck! 🍒', [], []);
  return reply(lang, "See you soon! 👋 Charan is one WhatsApp message away. Good luck! 🍒", [], []);
}

function ackReply(lang: Lang): EngineReply {
  if (lang === 'te')
    return reply(lang, 'సూపర్! 😊 ఇంకా ఏదైనా తెలుసుకోవాలా — pricing, projects లేదా order?', [], ['services', 'website', 'app']);
  if (lang === 'tenglish')
    return reply(lang, 'Super! 😊 Inka emaina telusukovala — pricing, projects leda order?', [], ['services', 'website', 'app']);
  return reply(
    lang,
    "Great! 😊 Want to know anything else — pricing, projects or how to order?",
    [],
    ['services', 'website', 'app'],
  );
}

/* ------------------------------------------------------------------ */
/* Feature follow-ups (grounded in roadmap / trust / services)         */
/* ------------------------------------------------------------------ */

const FEATURE_RULES: Array<{
  words: string[];
  website?: string;
  app?: string;
  anyLang?: boolean;
}> = [
  {
    words: ['firebase', 'backend', 'database', 'auth', 'login'],
    app: "Firebase is a core part of Charan's app workflow — it's Step 3 \"Connect Firebase\" in the App Building Roadmap (authentication, database, storage and live data). Share your exact requirements with Charan on WhatsApp to confirm what can be included.",
  },
  {
    words: ['monetization', 'monetisation', 'admob'],
    app: "Monetization is Step 4 (\"Add Monetization\") and paid features are Step 5 in the App Building Roadmap. For the exact setup for your app, discuss with Charan on WhatsApp.",
  },
  {
    words: ['playstore', 'play store', 'publish'],
    app: "Play Store preparation is Step 6 of the roadmap — listing, screenshots, release info and checklist. The Customized App service includes APK generation, and Google Play is one of Charan's trusted platforms.",
  },
  {
    words: ['ssl'],
    website:
      'SSL security is part of the trusted platforms Charan works with — websites are delivered secure.',
  },
  {
    words: ['deploy', 'deployment', 'hosting'],
    website:
      'Yes — website deployment is included in the Customized Website service, along with basic post-launch support.',
  },
  {
    words: ['ecommerce', 'e commerce'],
    website:
      'Charan has built a complete modern E-Commerce Website — responsive design, product pages, customer-friendly UI and deployment (see example projects).',
  },
  {
    words: ['razorpay'],
    website:
      'Razorpay (payment integration) is one of the trusted platforms Charan works with. Confirm the exact payment setup for your project with him on WhatsApp.',
  },
];

function featureReply(lang: Lang, product: Product, norm: string): EngineReply | null {
  const rule = FEATURE_RULES.find((r) => r.words.some((w) => norm.includes(w)));
  const scoped =
    product === 'app' ? rule?.app : product === 'website' ? rule?.website : (rule?.app ?? rule?.website);

  let baseText: string;
  if (rule && scoped) {
    baseText = scoped;
  } else if (rule && !scoped && product) {
    baseText = scoped ?? '';
  } else {
    baseText =
      "Charan can discuss custom requirements like this — the best way is to message him directly on WhatsApp with what you need.";
  }
  if (!baseText) {
    baseText =
      "Charan can discuss custom requirements like this — the best way is to message him directly on WhatsApp with what you need.";
  }

  const suggestions: Array<keyof typeof SUGGEST.en> = ['contact', 'order'];
  if (lang === 'te') {
    return reply(lang, `${baseText}\n\n(పై సమాధానం site information ఆధారంగా — exact details కోసం Charan ని WhatsApp లో contact చేయండి.)`, [], suggestions);
  }
  if (lang === 'tenglish') {
    return reply(lang, `${baseText}\n\n(Idi site information prakaram — exact details kosam Charan ni WhatsApp lo contact cheyandi.)`, [], suggestions);
  }
  return reply(lang, baseText, [], suggestions);
}

/* ------------------------------------------------------------------ */
/* Main entry                                                          */
/* ------------------------------------------------------------------ */

export function runEngine(history: HistoryTurn[]): EngineReply {
  const lastUser = [...history].reverse().find((m) => m.role === 'user');
  if (!lastUser) return greetingReply('en');

  const raw = lastUser.content;
  const norm = normalize(raw);
  const tokens = tokenize(norm);

  if (!norm || !/[^\s]/.test(norm)) return unknownReply('en');

  const lang = detectLanguage(raw, norm, tokens);
  const product = detectProduct(norm, tokens);
  const lastTopic = deriveLastTopic(history);

  // Context-aware scoping: "price?" right after an app discussion = app price.
  const scopedProduct: Product = product ?? lastTopic;

  const scores = scoreIntents(norm, tokens);
  const best = scores[0];

  if (!best) return unknownReply(lang);

  switch (best.intent) {
    case 'feature':
      return featureReply(lang, scopedProduct, norm) ?? unknownReply(lang);
    case 'order':
      return orderReply(lang, scopedProduct);
    case 'pricing':
      if (scopedProduct === 'website' || scopedProduct === 'app') return pricingReply(lang, scopedProduct);
      return pricingBothReply(lang);
    case 'discount':
      return discountReply(lang);
    case 'howto_order':
      return howtoReply(lang);
    case 'identity':
      return identityReply(lang);
    case 'about_owner':
      return aboutReply(lang);
    case 'roadmap':
      return roadmapReply(lang);
    case 'projects':
      return projectsReply(lang);
    case 'services':
      // "website create chesthara?" → pitch that exact service. But a
      // general "what services do you do?" is never scoped by context.
      if (product === 'website' || product === 'app') return pricingReply(lang, product);
      return servicesReply(lang);
    case 'contact':
      return contactReply(lang);
    case 'greeting':
      return greetingReply(lang);
    case 'ack':
      return ackReply(lang);
    case 'thanks':
      return thanksReply(lang);
    case 'bye':
      return byeReply(lang);
    default:
      return unknownReply(lang);
  }
}

export function rateLimitReply(lang: Lang): EngineReply {
  if (lang === 'te')
    return {
      text: 'కొంచెం వేగంగా messages పంపుతున్నారు 🙏 ఒక నిమిషం ఆగి మళ్ళీ try చేయండి.',
      cards: [],
      suggestions: [],
      lang,
    };
  if (lang === 'tenglish')
    return {
      text: 'Konchem veeganga messages pamputunnaru 🙏 Oka nimisham aagi malli try cheyandi.',
      cards: [],
      suggestions: [],
      lang,
    };
  return {
    text: "You're sending messages a bit too fast 🙏 Please wait a minute and try again.",
    cards: [],
    suggestions: [],
    lang,
  };
}

export { detectLanguage };

/** Convenience wrapper: detect language from raw visitor text. */
export function detectLanguageFromText(rawText: string): Lang {
  const norm = normalize(rawText);
  return detectLanguage(rawText, norm, tokenize(norm));
}
