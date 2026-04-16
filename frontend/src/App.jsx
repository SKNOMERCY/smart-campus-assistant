import { CategorySidebar } from "./components/layout/CategorySidebar";
import { Header } from "./components/layout/Header";
import { ChatWindow } from "./components/chat/ChatWindow";
import { Composer } from "./components/chat/Composer";
import { SuggestionChips } from "./components/chat/SuggestionChips";
import { useChatbot } from "./hooks/useChatbot";
import { useTheme } from "./hooks/useTheme";

function App() {
  const { theme, toggleTheme } = useTheme();
  const {
    brand,
    messages,
    suggestions,
    featuredQuestions,
    faqItems,
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
  } = useChatbot();

  return (
    <div className="min-h-screen bg-mesh-light px-4 py-5 text-text transition-colors duration-300 dark:bg-mesh-dark sm:px-5 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[340px,1fr]">
        <CategorySidebar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categoryOptions={categoryOptions}
          faqItems={faqItems}
          featuredQuestions={featuredQuestions}
          onAskQuestion={sendMessage}
          isLoading={isLoading}
        />

        <main className="flex min-h-[85vh] flex-col rounded-[2rem] border border-border/60 bg-shell/75 shadow-glass backdrop-blur-2xl">
          <Header
            brand={brand}
            theme={theme}
            onToggleTheme={toggleTheme}
            onExportConversation={exportConversation}
            onClearConversation={clearConversation}
          />

          <ChatWindow
            brand={brand}
            messages={messages}
            isTyping={isTyping}
            hasUserMessages={hasUserMessages}
            featuredQuestions={featuredQuestions}
            onAskQuestion={sendMessage}
          />

          <SuggestionChips suggestions={suggestions} onAskQuestion={sendMessage} />
          <Composer
            onSend={sendMessage}
            disabled={isTyping}
            uiError={uiError}
            statusMessage={statusMessage}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
