import { Router } from "express";

import {
  createFaqEntry,
  deleteFaqEntry,
  listCategories,
  listFaqs,
  updateFaqEntry
} from "../controllers/faqController.js";

const router = Router();

router.get("/categories", listCategories);
router.route("/").get(listFaqs).post(createFaqEntry);
router.route("/:id").put(updateFaqEntry).delete(deleteFaqEntry);

export default router;
