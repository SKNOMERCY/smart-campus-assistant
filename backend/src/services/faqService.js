import { randomUUID } from "node:crypto";

import {
  DEFAULT_SUGGESTIONS,
  FALLBACK_RESPONSES,
  FAQ_DATA_FILE,
  SPECIAL_RESPONSES
} from "../config/constants.js";
import { readJsonFile, writeJsonFile } from "../utils/fileStore.js";
import {
  detectSmallTalkIntent,
  fuzzySimilarity,
  normalizeText,
  uniqueTokens
} from "../utils/textProcessing.js";

async function loadFaqDataset() {
  return readJsonFile(FAQ_DATA_FILE);
}

async function saveFaqDataset(dataset) {
  const updatedDataset = {
    ...dataset,
    meta: {
      ...dataset.meta,
      updatedAt: new Date().toISOString()
    }
  };

  await writeJsonFile(FAQ_DATA_FILE, updatedDataset);
  return updatedDataset;
}

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

function buildSuggestions(dataset, bestFaq, rankedFaqs) {
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

export async function getFaqs({ category, search } = {}) {
  const dataset = await loadFaqDataset();
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

export async function getFaqCategories(search) {
  const { faqs, categories } = await getFaqs({ search });

  return {
    categories,
    matchingQuestions: faqs.slice(0, 8).map((faq) => faq.question)
  };
}

export async function getChatResponse(message) {
  const dataset = await loadFaqDataset();
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
    suggestions: buildSuggestions(dataset, bestMatch.faq, rankedFaqs)
  };
}

export async function createFaq(payload) {
  const dataset = await loadFaqDataset();
  const nextFaq = {
    id: randomUUID(),
    category: payload.category,
    question: payload.question,
    answer: payload.answer,
    keywords: payload.keywords || [],
    aliases: payload.aliases || [],
    relatedTopics: payload.relatedTopics || [],
    featured: Boolean(payload.featured)
  };

  dataset.faqs.push(nextFaq);
  await saveFaqDataset(dataset);
  return nextFaq;
}

export async function updateFaq(id, payload) {
  const dataset = await loadFaqDataset();
  const faqIndex = dataset.faqs.findIndex((faq) => faq.id === id);

  if (faqIndex === -1) {
    return null;
  }

  const currentFaq = dataset.faqs[faqIndex];
  const updatedFaq = {
    ...currentFaq,
    ...payload,
    id: currentFaq.id,
    featured: payload.featured ?? currentFaq.featured ?? false
  };

  dataset.faqs[faqIndex] = updatedFaq;
  await saveFaqDataset(dataset);

  return updatedFaq;
}

export async function deleteFaq(id) {
  const dataset = await loadFaqDataset();
  const initialCount = dataset.faqs.length;

  dataset.faqs = dataset.faqs.filter((faq) => faq.id !== id);

  if (dataset.faqs.length === initialCount) {
    return false;
  }

  await saveFaqDataset(dataset);
  return true;
}
