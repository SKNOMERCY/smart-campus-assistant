import { getChatResponse, getFaqDirectory } from "../services/faqEngine";

export function fetchFaqDirectory(search = "") {
  return getFaqDirectory({ search });
}

export function sendChatMessage(message) {
  return getChatResponse(message);
}
