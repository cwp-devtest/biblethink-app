import { useState, useEffect, useRef } from "react";
import { X, Send, Sparkles, User, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { openaiService, ChatMessage as OpenAIChatMessage } from "@/services/openaiService";
import { usePassage } from "@/contexts/PassageContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface ChatDrawerProps {
  open: boolean;
  onClose: () => void;
}

const ChatDrawer = ({ open, onClose }: ChatDrawerProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Get current passage from context!
  const { currentPassage } = usePassage();

  const quickSuggestions = [
    "What does this mean?",
    "Historical context?",
    "Related passages?",
  ];

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);
    setError(null);

    try {
      // Build conversation history for OpenAI
      const conversationHistory: OpenAIChatMessage[] = messages.map(msg => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      }));

      // Format current passage for AI if available
      let passageContext: string | undefined;
      if (currentPassage) {
        const versesText = currentPassage.verses
          .map(v => `Verse ${v.number}: ${v.text}`)
          .join('\n\n');
        passageContext = `${currentPassage.reference}\n\n${versesText}`;
      }

      // Call OpenAI API with passage context
      const response = await openaiService.sendMessage(
        userMessage.text,
        conversationHistory,
        passageContext
      );

      if (response.error) {
        setError(response.error);
        setIsTyping(false);
        return;
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.message,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  };

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="h-[85vh] flex flex-col">
        <DrawerHeader className="relative border-b pb-4">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
          <DrawerTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-[hsl(var(--accent))]" />
            Bible Study Assistant
          </DrawerTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {currentPassage 
              ? `Discussing ${currentPassage.reference}` 
              : "Ask me anything about scripture"}
          </p>
        </DrawerHeader>

        <div className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 px-4" ref={scrollRef}>
            {error && (
              <Alert variant="destructive" className="mx-4 mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {messages.length === 0 && !error ? (
              <div className="flex items-center justify-center h-full text-muted-foreground text-center px-8">
                <div>
                  <p className="mb-2">
                    {currentPassage 
                      ? `Ready to discuss ${currentPassage.reference}`
                      : "Ask me about any Bible question..."}
                  </p>
                  <p className="text-xs">
                    {currentPassage 
                      ? "✓ I can see the passage you're reading!"
                      : "Navigate to a passage to get contextual insights"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 py-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.sender === "ai" && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-[hsl(var(--accent))]" />
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                        message.sender === "user"
                          ? "bg-[hsl(var(--accent))] text-white"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender === "user"
                            ? "text-white/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                    {message.sender === "user" && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[hsl(var(--accent))] flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-2 justify-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-[hsl(var(--accent))]" />
                    </div>
                    <div className="bg-muted rounded-2xl px-4 py-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
                {/* Invisible element at bottom to scroll to */}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          <div className="border-t p-4 space-y-3">
            {currentPassage && messages.length === 0 && !error && (
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-sm text-emerald-700 dark:text-emerald-400">
                  <Sparkles className="h-3 w-3" />
                  ✓ Reading {currentPassage.reference}
                </div>
                <div className="flex flex-wrap gap-2">
                  {quickSuggestions.map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-xs"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder="Ask a question..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                size="icon"
                className="bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ChatDrawer;
