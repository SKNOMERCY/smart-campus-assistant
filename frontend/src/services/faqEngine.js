import faqDataset from "../data/faqs.json";
import { detectSmallTalkIntent, fuzzySimilarity, normalizeText, uniqueTokens } from "../utils/textProcessing";

const FALLBACK_RESPONSES = [
  "I couldn't confidently match that to a saved campus or city FAQ yet. Try rephrasing it or tap one of the suggested questions below.",
  "That question is a little outside my current knowledge base. I can still help if you ask it with terms like admissions, hostel, transport, fees, or placements.",
  "I want to avoid guessing. If you reword the question with a key topic or choose a suggested FAQ, I can answer more reliably."
];

const DEFAULT_SUGGESTIONS = [
  "What are the admission requirements?",
  "How do I reach the campus by public transport?",
  "Are hostel rooms available for first-year students?",
  "What scholarships are offered?",
  "Where is the registrar office?"
];

const SPECIAL_RESPONSES = {
  greeting: {
    answer:
      "Hello! I can help with admissions, academics, campus life, placements, and city essentials for Northbridge College in Riverton City.",
    suggestions: DEFAULT_SUGGESTIONS
  },
  thanks: {
    answer: "Happy to help. If you want, I can also suggest more FAQs about campus life, fees, or city transport.",
    suggestions: [
      "What are the library hours?",
      "Tell me about placement support",
      "What is the campus Wi-Fi process?"
    ]
  },
  goodbye: {
    answer: "You can return anytime for quick answers about Northbridge College and Riverton City. Have a great day.",
    suggestions: DEFAULT_SUGGESTIONS.slice(0, 3)
  }
};

const dataset = faqDataset;

function buildFaqSearchIndex(faq) {
  const searchableValues = [
    faq.question,
    faq.category,
    ...(faq.keywords || []),
    ...(faq.aliases || []),
    ...(faq.relatedTopics || [])
  ];

  return {
    tokenSet: uniqueTokens(searchableValues),
    variants: [faq.question, ...(faq.aliases || [])]
  };
}

function coverageRatio(queryTokens, candidateTokens) {
  const uniqueQueryTokens = [...new Set(queryTokens)];
  const candidateSet = new Set(candidateTokens);

  if (!uniqueQueryTokens.length) {
    return 0;
  }

  let matches = 0;

  uniqueQueryTokens.forEach((token) => {
    if (candidateSet.has(token)) {
      matches += 1;
    }
  });

  return matches / uniqueQueryTokens.length;
}

function scoreFaq(query, faq) {
  const normalizedQuery = normalizeText(query);
  const queryTokens = uniqueTokens([query]);
  const searchIndex = buildFaqSearchIndex(faq);
  const questionTokens = uniqueTokens([faq.question, ...(faq.aliases || [])]);

  const exactQuestionMatch =
    normalizeText(faq.question) === normalizedQuery ||
    searchIndex.variants.some((variant) => normalizeText(variant) === normalizedQuery);

  const questionScore = coverageRatio(queryTokens, questionTokens);
  const tokenScore = coverageRatio(queryTokens, searchIndex.tokenSet);
  const keywordTokens = uniqueTokens([...(faq.keywords || []), ...(faq.relatedTopics || [])]);
  const keywordScore = coverageRatio(queryTokens, keywordTokens);
  const fuzzyScore = Math.max(
    ...searchIndex.variants.map((variant) => fuzzySimilarity(query, variant))
  );

  const phraseBoost =
    searchIndex.variants.some(
      (variant) =>
        normalizeText(variant).includes(normalizedQuery) ||
        normalizedQuery.includes(normalizeText(variant))
    )
      ? 0.15
      : 0;

  const exactBoost = exactQuestionMatch ? 0.35 : 0;
  const questionBoost = questionScore >= 0.5 ? 0.12 : 0;
  const totalScore =
    questionScore * 0.4 +
    keywordScore * 0.24 +
    tokenScore * 0.14 +
    fuzzyScore * 0.12 +
    phraseBoost +
    exactBoost +
    questionBoost;

  return {
    totalScore: Math.min(totalScore, 1),
    questionScore,
    tokenScore,
    keywordScore,
    fuzzyScore
  };
}

function buildSuggestions(bestFaq, rankedFaqs) {
  const sameCategory = dataset.faqs
    .filter((faq) => faq.category === bestFaq.category && faq.id !== bestFaq.id)
    .sort((left, right) => Number(right.featured) - Number(left.featured));

  const rankedAlternatives = rankedFaqs
    .map(({ faq }) => faq)
    .filter((faq) => faq.id !== bestFaq.id);

  return [...sameCategory, ...rankedAlternatives]
    .filter((faq, index, list) => list.findIndex((item) => item.id === faq.id) === index)
    .slice(0, 4)
    .map((faq) => faq.question);
}

export async function getFaqDirectory({ category, search } = {}) {
  const normalizedCategory = normalizeText(category);
  const normalizedSearch = normalizeText(search);

  const filteredFaqs = dataset.faqs.filter((faq) => {
    const categoryMatches =
      !normalizedCategory ||
      normalizedCategory === "all" ||
      normalizeText(faq.category) === normalizedCategory;

    const searchMatches =
      !normalizedSearch ||
      normalizeText(
        [faq.question, faq.answer, faq.category, ...(faq.keywords || []), ...(faq.aliases || [])].join(
          " "
        )
      ).includes(normalizedSearch);

    return categoryMatches && searchMatches;
  });

  const categories = dataset.faqs.reduce((result, faq) => {
    result[faq.category] = (result[faq.category] || 0) + 1;
    return result;
  }, {});

  return {
    meta: dataset.meta,
    faqs: filteredFaqs,
    total: filteredFaqs.length,
    categories: Object.entries(categories)
      .map(([name, count]) => ({ name, count }))
      .sort((left, right) => left.name.localeCompare(right.name))
  };
}

export async function getChatResponse(message) {
  const intent = detectSmallTalkIntent(message);

  if (intent && SPECIAL_RESPONSES[intent]) {
    return {
      type: "intent",
      matched: false,
      confidence: 1,
      answer: SPECIAL_RESPONSES[intent].answer,
      suggestions: SPECIAL_RESPONSES[intent].suggestions
    };
  }

  const rankedFaqs = dataset.faqs
    .map((faq) => ({
      faq,
      ...scoreFaq(message, faq)
    }))
    .sort((left, right) => right.totalScore - left.totalScore);

  const bestMatch = rankedFaqs[0];
  const matched =
    bestMatch &&
    bestMatch.totalScore >= 0.28 &&
    (bestMatch.questionScore >= 0.18 ||
      bestMatch.tokenScore >= 0.18 ||
      bestMatch.keywordScore >= 0.18 ||
      bestMatch.fuzzyScore >= 0.74);

  if (!matched) {
    const fallback =
      FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];

    return {
      type: "fallback",
      matched: false,
      confidence: bestMatch?.totalScore || 0,
      answer: fallback,
      suggestions: rankedFaqs.length
        ? rankedFaqs.slice(0, 4).map(({ faq }) => faq.question)
        : DEFAULT_SUGGESTIONS
    };
  }

  return {
    type: "faq",
    matched: true,
    confidence: bestMatch.totalScore,
    answer: bestMatch.faq.answer,
    category: bestMatch.faq.category,
    matchedQuestion: bestMatch.faq.question,
    suggestions: buildSuggestions(bestMatch.faq, rankedFaqs)
  };
}
