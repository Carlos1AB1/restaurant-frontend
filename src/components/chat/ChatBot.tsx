// src/components/chat/ChatBot.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import apiClient from '@/lib/api/client';
import { RootState } from '@/store';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  sender: 'USER' | 'BOT';
  content: string;
  created_at: string;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  
 // src/components/chat/ChatBot.tsx (continuación)
 useEffect(() => {
    if (isOpen && !messages.length) {
      // Cargar conversación o iniciar una nueva
      const sessionId = localStorage.getItem('chatSessionId') || crypto.randomUUID();
      localStorage.setItem('chatSessionId', sessionId);
      
      const fetchOrCreateConversation = async () => {
        try {
          setLoading(true);
          const response = await apiClient.post('/chatbot/message/', {
            message: 'Hola',
            session_id: !isAuthenticated ? sessionId : undefined
          });
          
          setConversationId(response.data.conversation_id);
          setMessages([response.data.message]);
          setLoading(false);
        } catch (err) {
          console.error('Error al iniciar conversación:', err);
          setLoading(false);
        }
      };
      
      fetchOrCreateConversation();
    }
  }, [isOpen, isAuthenticated, messages.length]);
  
  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage = {
      id: crypto.randomUUID(),
      sender: 'USER' as const,
      content: input,
      created_at: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      const sessionId = localStorage.getItem('chatSessionId');
      const response = await apiClient.post('/chatbot/message/', {
        message: input,
        conversation_id: conversationId,
        session_id: !isAuthenticated ? sessionId : undefined
      });
      
      setMessages(prev => [...prev, response.data.message]);
    } catch (err) {
      toast.error('Error al enviar mensaje');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleReset = async () => {
    try {
      await apiClient.post('/chatbot/reset/', {
        conversation_id: conversationId
      });
      
      setMessages([]);
      setConversationId(null);
      
      // Reiniciar conversación
      const sessionId = localStorage.getItem('chatSessionId') || crypto.randomUUID();
      localStorage.setItem('chatSessionId', sessionId);
      
      const response = await apiClient.post('/chatbot/message/', {
        message: 'Hola',
        session_id: !isAuthenticated ? sessionId : undefined
      });
      
      setConversationId(response.data.conversation_id);
      setMessages([response.data.message]);
      
      toast.success('Conversación reiniciada');
    } catch (err) {
      toast.error('Error al reiniciar conversación');
    }
  };
  
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-700 transition"
        aria-label="Abrir chat"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </button>
    );
  }
  
  return (
    <div className="fixed bottom-6 right-6 w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col">
      <div className="bg-indigo-600 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h3 className="font-medium">Asistente Virtual</h3>
        <div className="flex gap-2">
          <button onClick={handleReset} className="text-white hover:text-gray-200" aria-label="Reiniciar chat">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
              <path d="M3 3v5h5"></path>
            </svg>
          </button>
          <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200" aria-label="Cerrar chat">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`mb-3 ${message.sender === 'USER' ? 'text-right' : ''}`}
          >
            <div 
              className={`inline-block p-3 rounded-lg ${
                message.sender === 'USER' 
                  ? 'bg-indigo-100 text-gray-800' 
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="mb-3">
            <div className="inline-block p-3 rounded-lg bg-gray-200 text-gray-800">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="border-t p-2 flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
          disabled={loading}
        />
        <button 
          type="submit" 
          className="bg-indigo-600 text-white p-2 rounded-r-md hover:bg-indigo-700"
          disabled={loading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
    </div>
  );
}