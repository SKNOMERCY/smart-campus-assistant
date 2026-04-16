import { Router } from "express";

import {
  createFaqEntry,
  deleteFaqEntry,
  listCategories,
  listFaqs,
  updateFaqEntry
} from "../controllers/faqController.js";
import { requireAdminKey } from "../middleware/requireAdminKey.js";

const router = Router();

router.get("/categories", listCategories);
router.route("/").get(listFaqs).post(requireAdminKey, createFaqEntry);
router.route("/:id").put(requireAdminKey, updateFaqEntry).delete(requireAdminKey, deleteFaqEntry);

export default router;
