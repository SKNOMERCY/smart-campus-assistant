export const FAQ_DATA_FILE = new URL("../data/faqs.json", import.meta.url);

export const DEFAULT_PORT = Number(process.env.PORT) || 5000;
export const MAX_MESSAGE_LENGTH = 320;

export const FALLBACK_RESPONSES = [
  "I couldn't confidently match that to a saved campus or city FAQ yet. Try rephrasing it or tap one of the suggested questions below.",
  "That question is a little outside my current knowledge base. I can still help if you ask it with terms like admissions, hostel, transport, fees, or placements.",
  "I want to avoid guessing. If you reword the question with a key topic or choose a suggested FAQ, I can answer more reliably."
];

export const DEFAULT_SUGGESTIONS = [
  "What are the admission requirements?",
  "How do I reach the campus by public transport?",
  "Are hostel rooms available for first-year students?",
  "What scholarships are offered?",
  "Where is the registrar office?"
];

export const SPECIAL_RESPONSES = {
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
