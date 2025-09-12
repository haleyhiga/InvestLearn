import { useState } from 'react';
import ChatbotInterface from '../ChatbotInterface';

export default function ChatbotInterfaceExample() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleToggle = () => setIsOpen(!isOpen);
  const handleMinimize = () => setIsMinimized(true);
  const handleMaximize = () => setIsMinimized(false);

  return (
    <div className="h-screen bg-background relative">
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Chatbot Interface Demo</h2>
        <p className="text-muted-foreground">
          The AI chatbot appears as a floating button in the bottom-right corner.
          Click it to open, and try the minimize/maximize controls.
        </p>
      </div>
      
      <ChatbotInterface
        isOpen={isOpen}
        isMinimized={isMinimized}
        onToggle={handleToggle}
        onMinimize={handleMinimize}
        onMaximize={handleMaximize}
      />
    </div>
  );
}