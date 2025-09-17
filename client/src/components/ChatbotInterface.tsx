import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Bot, User, X, Minimize2, Maximize2 } from "lucide-react";

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatbotInterfaceProps {
  isOpen: boolean;
  isMinimized: boolean;
  onToggle: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
}

export default function ChatbotInterface({ 
  isOpen, 
  isMinimized, 
  onToggle, 
  onMinimize, 
  onMaximize 
}: ChatbotInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I'm your AI financial advisor assistant. I can help you understand investment concepts, personal finance strategies, budgeting, retirement planning, and answer any money-related questions you have. What financial topic would you like to explore today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsTyping(true);

    try {
      // Prepare conversation history for API
      const conversationHistory = messages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({
          message: currentInput,
          conversationHistory,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || 'Failed to get response from chatbot');
      }

      const data = await response.json();
      
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: data.response,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Floating action button when closed
  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        size="icon"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        data-testid="button-chatbot-open"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    );
  }

  // Minimized state
  if (isMinimized) {
    return (
      <Card className="fixed bottom-6 right-6 w-80 shadow-lg z-50" data-testid="card-chatbot-minimized">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <CardTitle className="text-sm">AI Assistant</CardTitle>
              <Badge variant="secondary" className="text-xs">Online</Badge>
            </div>
            <div className="flex gap-1">
              <Button
                onClick={onMaximize}
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                data-testid="button-chatbot-maximize"
              >
                <Maximize2 className="h-3 w-3" />
              </Button>
              <Button
                onClick={onToggle}
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                data-testid="button-chatbot-close"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-lg z-50" data-testid="card-chatbot-interface">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <CardTitle className="text-sm">AI Assistant</CardTitle>
            <Badge variant="secondary" className="text-xs">Online</Badge>
          </div>
          <div className="flex gap-1">
            <Button
              onClick={onMinimize}
              size="icon"
              variant="ghost"
              className="h-6 w-6"
              data-testid="button-chatbot-minimize"
            >
              <Minimize2 className="h-3 w-3" />
            </Button>
            <Button
              onClick={onToggle}
              size="icon"
              variant="ghost"
              className="h-6 w-6"
              data-testid="button-chatbot-close"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 flex flex-col h-[400px]">
        <ScrollArea className="flex-1 p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
              data-testid={`message-${message.type}-${message.id}`}
            >
              {message.type === 'bot' && (
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                </div>
              )}
              
              <div
                className={`max-w-[80%] p-3 rounded-lg text-sm ${
                  message.type === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {message.content}
              </div>
              
              {message.type === 'user' && (
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div className="bg-muted p-3 rounded-lg text-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-pulse animation-delay-200"></div>
                  <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-pulse animation-delay-400"></div>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
        
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              placeholder="Ask me about budgeting, investing, retirement planning..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              data-testid="input-chat-message"
            />
            <Button 
              onClick={handleSend} 
              size="icon"
              disabled={!input.trim() || isTyping}
              data-testid="button-send-message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}