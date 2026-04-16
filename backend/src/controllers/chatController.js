import { MAX_MESSAGE_LENGTH } from "../config/constants.js";
import { getChatResponse } from "../services/faqService.js";

export async function handleChatRequest(req, res, next) {
  try {
    const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";

    if (!message) {
      return res.status(400).json({
        error: "Please enter a message before sending."
      });
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({
        error: `Please keep messages under ${MAX_MESSAGE_LENGTH} characters.`
      });
    }

    const response = await getChatResponse(message);

    return res.json({
      ...response,
      receivedAt: new Date().toISOString()
    });
  } catch (error) {
    return next(error);
  }
}
