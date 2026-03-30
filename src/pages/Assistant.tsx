import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Search, Send, Bot, User, Loader2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Assistant() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string, sources?: any[] }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm sorry, the AI Assistant is currently disabled because no API key was provided during deployment. To enable this feature, please add a GEMINI_API_KEY to your environment variables." 
      }]);
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMessage,
        config: {
          systemInstruction: "You are a helpful medical assistant for seniors. Provide clear, simple information about medications, interactions, and health tips. Always use Google Search to provide the most accurate and up-to-date information. Remind users to always consult with their doctor before making any changes to their medication.",
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || "I'm sorry, I couldn't find an answer for that.";
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

      setMessages(prev => [...prev, { role: 'assistant', content: text, sources }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I encountered an error. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 flex flex-col h-[calc(100vh-12rem)]">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">AI Med <span className="text-primary">Assistant</span></h1>
        <p className="text-gray-400">Ask questions about your medications, interactions, or find nearby health info.</p>
      </div>

      <div className="flex-grow glass-card overflow-hidden flex flex-col relative">
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-gray-500">
              <Bot className="w-16 h-16 opacity-20" />
              <p className="text-xl">How can I help you with your health today?</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
                <button 
                  onClick={() => setInput("What are common side effects of Metformin?")}
                  className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-sm text-left"
                >
                  "What are common side effects of Metformin?"
                </button>
                <button 
                  onClick={() => setInput("Can I take Ibuprofen with blood thinners?")}
                  className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-sm text-left"
                >
                  "Can I take Ibuprofen with blood thinners?"
                </button>
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] p-4 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-primary text-dark font-medium' 
                  : 'bg-white/10 text-gray-100 border border-white/10'
              }`}>
                <div className="flex items-center space-x-2 mb-2 opacity-70">
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  <span className="text-xs uppercase tracking-wider font-bold">
                    {msg.role === 'user' ? 'You' : 'Assistant'}
                  </span>
                </div>
                <div className="prose prose-invert max-w-none text-lg">
                  {msg.content}
                </div>
                
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Sources:</p>
                    <div className="flex flex-wrap gap-2">
                      {msg.sources.map((source, sIdx) => (
                        source.web && (
                          <a 
                            key={sIdx}
                            href={source.web.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-xs bg-white/5 hover:bg-white/10 px-2 py-1 rounded-md transition-colors text-primary"
                          >
                            <span>{source.web.title || 'Source'}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/10 p-4 rounded-2xl border border-white/10 flex items-center space-x-3">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span className="text-gray-400">Searching for information...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white/5 border-t border-white/10">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center space-x-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about medications, side effects, or interactions..."
              className="flex-grow bg-dark border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-3 bg-primary text-dark rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100"
            >
              <Send className="w-6 h-6" />
            </button>
          </form>
          <p className="text-[10px] text-center text-gray-500 mt-2 uppercase tracking-widest">
            Always consult a medical professional for health advice.
          </p>
        </div>
      </div>
    </div>
  );
}
