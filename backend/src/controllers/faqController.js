import {
  createFaq,
  deleteFaq,
  getFaqCategories,
  getFaqs,
  updateFaq
} from "../services/faqService.js";

function validateFaqPayload(payload) {
  const requiredFields = ["category", "question", "answer"];
  return requiredFields.every(
    (field) => typeof payload?.[field] === "string" && payload[field].trim().length > 0
  );
}

export async function listFaqs(req, res, next) {
  try {
    const data = await getFaqs({
      category: req.query.category,
      search: req.query.search
    });

    return res.json(data);
  } catch (error) {
    return next(error);
  }
}

export async function listCategories(req, res, next) {
  try {
    const data = await getFaqCategories(req.query.search);
    return res.json(data);
  } catch (error) {
    return next(error);
  }
}

export async function createFaqEntry(req, res, next) {
  try {
    if (!validateFaqPayload(req.body)) {
      return res.status(400).json({
        error: "Category, question, and answer are required to create an FAQ entry."
      });
    }

    const faq = await createFaq(req.body);
    return res.status(201).json(faq);
  } catch (error) {
    return next(error);
  }
}

export async function updateFaqEntry(req, res, next) {
  try {
    if (!validateFaqPayload(req.body)) {
      return res.status(400).json({
        error: "Category, question, and answer must remain valid when updating an FAQ entry."
      });
    }

    const faq = await updateFaq(req.params.id, req.body);

    if (!faq) {
      return res.status(404).json({
        error: "FAQ entry not found."
      });
    }

    return res.json(faq);
  } catch (error) {
    return next(error);
  }
}

export async function deleteFaqEntry(req, res, next) {
  try {
    const removed = await deleteFaq(req.params.id);

    if (!removed) {
      return res.status(404).json({
        error: "FAQ entry not found."
      });
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}
