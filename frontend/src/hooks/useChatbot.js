import { startTransition, useDeferredValue, useEffect, useState } from "react";

import { fetchFaqDirectory, sendChatMessage } from "../api/client";
import { APP_BRAND, INITIAL_SUGGESTIONS, MAX_INPUT_LENGTH, STORAGE_KEYS } from "../data/constants";
import { buildWelcomeMessage, createMessage, downloadTranscript } from "../utils/chat";

function restoreSession() {
  const saved = sessionStorage.getItem(STORAGE_KEYS.session);

  if (!saved) {
    return null;
  }

  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
}

export function useChatbot() {
  const savedSession = restoreSession();

  const [faqDirectory, setFaqDirectory] = useState({
    meta: APP_BRAND,
    faqs: [],
    categories: []
  });
  const [messages, setMessages] = useState(
    savedSession?.messages?.length ? savedSession.messages : [buildWelcomeMessage()]
  );
  const [suggestions, setSuggestions] = useState(savedSession?.suggestions || INITIAL_SUGGESTIONS);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uiError, setUiError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const deferredSearchTerm = useDeferredValue(searchTerm);

  useEffect(() => {
    async function loadDirectory() {
      try {
        const directory = await fetchFaqDirectory();

        startTransition(() => {
          setFaqDirectory(directory);
          setSuggestions(
            savedSession?.suggestions?.length
              ? savedSession.suggestions
              : directory.meta?.welcomePrompts || INITIAL_SUGGESTIONS
          );

          if (!savedSession?.messages?.some((message) => message.role === "user")) {
            setMessages([buildWelcomeMessage(directory.meta || APP_BRAND)]);
          }
        });
      } catch (error) {
        setUiError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadDirectory();
  }, []);

  useEffect(() => {
    sessionStorage.setItem(
      STORAGE_KEYS.session,
      JSON.stringify({
        messages,
        suggestions
      })
    );
  }, [messages, suggestions]);

  const filteredFaqs = faqDirectory.faqs.filter((faq) => {
    const categoryMatches = selectedCategory === "All" || faq.category === selectedCategory;
    const searchMatches =
      !deferredSearchTerm.trim() ||
      [faq.question, faq.answer, faq.category, ...(faq.keywords || [])]
        .join(" ")
        .toLowerCase()
        .includes(deferredSearchTerm.trim().toLowerCase());

    return categoryMatches && searchMatches;
  });

  const featuredQuestions = faqDirectory.faqs
    .filter((faq) => faq.featured)
    .slice(0, 6)
    .map((faq) => faq.question);

  const categoryOptions = [
    {
      name: "All",
      count: faqDirectory.faqs.length
    },
    ...faqDirectory.categories
  ];

  const hasUserMessages = messages.some((message) => message.role === "user");

  async function sendMessage(rawMessage) {
    if (isTyping) {
      return;
    }

    const message = rawMessage.trim();

    if (!message) {
      setUiError("Please enter a question before sending.");
      return;
    }

    if (message.length > MAX_INPUT_LENGTH) {
      setUiError(`Please keep your question under ${MAX_INPUT_LENGTH} characters.`);
      return;
    }

    setUiError("");
    setStatusMessage("");
    const userMessage = createMessage({ role: "user", text: message });
    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setIsTyping(true);

    const startedAt = Date.now();
    const warmupNoticeTimer = globalThis.setTimeout(() => {
      setStatusMessage(
        "The Render backend may be waking up. The first reply can take a little longer than usual."
      );
    }, 6000);

    try {
      const response = await sendChatMessage(message);
      const elapsed = Date.now() - startedAt;
      const minimumDelay = Math.max(650 - elapsed, 0);

      await new Promise((resolve) => {
        window.setTimeout(resolve, minimumDelay);
      });

      const botMessage = createMessage({
        role: "bot",
        text: response.answer,
        meta: {
          category: response.category,
          matchedQuestion: response.matchedQuestion,
          confidence: response.confidence
        }
      });

      setMessages((currentMessages) => [...currentMessages, botMessage]);
      setSuggestions(response.suggestions?.length ? response.suggestions : INITIAL_SUGGESTIONS);
      setUiError("");
    } catch (error) {
      setUiError(error.message || "I ran into a server issue while processing that question.");
      const botMessage = createMessage({
        role: "bot",
        type: "error",
        text: error.message || "I ran into a server issue while processing that question."
      });

      setMessages((currentMessages) => [...currentMessages, botMessage]);
    } finally {
      globalThis.clearTimeout(warmupNoticeTimer);
      setStatusMessage("");
      setIsTyping(false);
    }
  }

  function clearConversation() {
    setMessages([buildWelcomeMessage(faqDirectory.meta || APP_BRAND)]);
    setSuggestions(faqDirectory.meta?.welcomePrompts || INITIAL_SUGGESTIONS);
    setUiError("");
    setStatusMessage("");
  }

  function exportConversation() {
    downloadTranscript(messages, faqDirectory.meta || APP_BRAND);
  }

  return {
    brand: faqDirectory.meta || APP_BRAND,
    messages,
    suggestions: suggestions.length ? suggestions : featuredQuestions,
    featuredQuestions,
    faqItems: filteredFaqs,
    categoryOptions,
    selectedCategory,
    setSelectedCategory,
    searchTerm,
    setSearchTerm,
    isTyping,
    isLoading,
    uiError,
    statusMessage,
    hasUserMessages,
    sendMessage,
    clearConversation,
    exportConversation
  };
}
