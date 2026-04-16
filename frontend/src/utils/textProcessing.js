const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "at",
  "be",
  "by",
  "can",
  "do",
  "for",
  "from",
  "how",
  "i",
  "if",
  "in",
  "is",
  "it",
  "me",
  "my",
  "of",
  "on",
  "or",
  "the",
  "to",
  "what",
  "when",
  "where",
  "which",
  "who",
  "with",
  "you",
  "your"
]);

const SYNONYM_MAP = {
  accommodation: "housing",
  accommodations: "housing",
  aid: "scholarship",
  application: "admission",
  applications: "admission",
  apply: "admission",
  applying: "admission",
  banking: "bank",
  bus: "transport",
  buses: "transport",
  cafeteria: "canteen",
  cafe: "cafes",
  cafes: "cafes",
  canteen: "canteen",
  career: "placement",
  careers: "placement",
  classes: "class",
  clinic: "medical",
  clubs: "club",
  counselling: "advising",
  counselor: "advising",
  deadline: "deadlines",
  dorm: "housing",
  dormitory: "housing",
  dorms: "housing",
  exam: "entrance",
  exams: "entrance",
  fee: "fees",
  food: "canteen",
  funding: "scholarship",
  hostel: "housing",
  hostels: "housing",
  ids: "id",
  internship: "internship",
  internships: "internship",
  internet: "wifi",
  jobs: "placement",
  meal: "canteen",
  meals: "canteen",
  medicalcare: "medical",
  metro: "transport",
  parkinglot: "parking",
  payment: "fees",
  payments: "fees",
  rail: "train",
  railway: "train",
  residence: "housing",
  scholarship: "scholarship",
  scholarships: "scholarship",
  security: "safety",
  shuttle: "transport",
  simcard: "sim",
  station: "train",
  studentportal: "portal",
  timetable: "schedule",
  train: "train",
  transportation: "transport",
  tuition: "fees",
  weather: "weather",
  wifi: "wifi"
};

const GREETING_TOKENS = new Set(["hello", "hey", "hi", "hola", "greetings"]);
const THANKS_TOKENS = new Set(["appreciate", "thanks", "thank", "thx"]);
const GOODBYE_TOKENS = new Set(["bye", "goodbye", "later", "see", "cya"]);

export function normalizeText(text = "") {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s]/g, " ")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function singularizeToken(token) {
  if (token.endsWith("ies") && token.length > 4) {
    return `${token.slice(0, -3)}y`;
  }

  if (token.endsWith("ing") && token.length > 5) {
    return token.slice(0, -3);
  }

  if (token.endsWith("ed") && token.length > 4) {
    return token.slice(0, -2);
  }

  if (token.endsWith("s") && token.length > 3) {
    return token.slice(0, -1);
  }

  return token;
}

export function canonicalizeToken(token = "") {
  const normalized = singularizeToken(token);
  return SYNONYM_MAP[normalized] || normalized;
}

export function tokenize(text = "") {
  return normalizeText(text)
    .split(" ")
    .map(canonicalizeToken)
    .filter((token) => token && !STOP_WORDS.has(token));
}

export function uniqueTokens(values = []) {
  return [...new Set(values.flatMap((value) => tokenize(value)))];
}

export function levenshteinDistance(a = "", b = "") {
  const left = normalizeText(a);
  const right = normalizeText(b);

  if (!left.length) {
    return right.length;
  }

  if (!right.length) {
    return left.length;
  }

  const matrix = Array.from({ length: left.length + 1 }, () =>
    new Array(right.length + 1).fill(0)
  );

  for (let row = 0; row <= left.length; row += 1) {
    matrix[row][0] = row;
  }

  for (let column = 0; column <= right.length; column += 1) {
    matrix[0][column] = column;
  }

  for (let row = 1; row <= left.length; row += 1) {
    for (let column = 1; column <= right.length; column += 1) {
      const substitutionCost = left[row - 1] === right[column - 1] ? 0 : 1;

      matrix[row][column] = Math.min(
        matrix[row - 1][column] + 1,
        matrix[row][column - 1] + 1,
        matrix[row - 1][column - 1] + substitutionCost
      );
    }
  }

  return matrix[left.length][right.length];
}

export function fuzzySimilarity(a = "", b = "") {
  const left = normalizeText(a);
  const right = normalizeText(b);

  if (!left.length || !right.length) {
    return 0;
  }

  const distance = levenshteinDistance(left, right);
  return 1 - distance / Math.max(left.length, right.length);
}

export function detectSmallTalkIntent(text = "") {
  const tokens = tokenize(text);

  if (!tokens.length) {
    return null;
  }

  if (tokens.every((token) => GREETING_TOKENS.has(token))) {
    return "greeting";
  }

  if (tokens.every((token) => THANKS_TOKENS.has(token))) {
    return "thanks";
  }

  if (tokens.every((token) => GOODBYE_TOKENS.has(token))) {
    return "goodbye";
  }

  return null;
}
