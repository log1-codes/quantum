'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Send, MessageSquare, Loader2 } from 'lucide-react';

export default function ChatWindow({ selectedUser }) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const messageListRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  useEffect(() => {
    if (selectedUser) {
      setMessages([]); // Clear messages when user changes
      fetchMessages();
    }
  }, [selectedUser]);

  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (messageListRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messageListRef.current;
      const isBottom = scrollHeight - scrollTop - clientHeight < 50;
      setIsAtBottom(isBottom);
    }
  };

  const fetchMessages = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/messages?recipientEmail=${selectedUser?.email}`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      setMessages(data.messages);
    } catch (error) {
      setError('Failed to load messages');
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    const tempId = Date.now().toString();
    const tempMessage = {
      _id: tempId,
      content: newMessage,
      senderEmail: session?.user?.email,
      senderName: session?.user?.name,
      senderImage: session?.user?.image,
      timestamp: new Date().toISOString(),
      status: 'sending'
    };

    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');
    setIsAtBottom(true);

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientEmail: selectedUser.email,
          content: newMessage
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');
      
      const sentMessage = await response.json();
      setMessages(prev => prev.map(msg => 
        msg._id === tempId ? sentMessage : msg
      ));
    } catch (error) {
      setMessages(prev => prev.map(msg => 
        msg._id === tempId ? { ...msg, status: 'error' } : msg
      ));
      setError('Failed to send message');
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900/50 border border-zinc-800/50 overflow-hidden rounded-xl">
      {/* Chat Header */}
      <div className="p-4 border-b border-zinc-800/50 flex items-center gap-3 bg-zinc-800/30">
        {selectedUser?.image ? (
          <Image
            src={selectedUser.image}
            alt={selectedUser.name}
            width={40}
            height={40}
            className="rounded-full ring-2 ring-blue-500/20"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-blue-500" />
          </div>
        )}
        <div>
          <h2 className="font-bold text-white">{selectedUser.name}</h2>
          <p className="text-sm text-zinc-400">{selectedUser.email}</p>
        </div>
      </div>

      {/* Messages List */}
      <div 
        ref={messageListRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 scroll-smooth"
        style={{ minHeight: '300px' }}
      >
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
              <p className="text-sm text-zinc-400">Loading messages...</p>
            </div>
          </div>
        ) : error ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-400 mb-2">{error}</p>
              <button 
                onClick={fetchMessages}
                className="text-sm text-blue-500 hover:text-blue-400"
              >
                Try again
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 min-h-full">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-zinc-400">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message._id}
                  className={`flex ${
                    message.senderEmail === session?.user?.email ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div className="flex items-start gap-2 max-w-[70%]">
                    {message.senderEmail !== session?.user?.email && message.senderImage && (
                      <Image
                        src={message.senderImage}
                        alt={message.senderName}
                        width={32}
                        height={32}
                        className="rounded-full ring-2 ring-zinc-700/50"
                      />
                    )}
                    <div>
                      <div
                        className={`p-3 rounded-2xl shadow-md ${
                          message.senderEmail === session?.user?.email
                            ? 'bg-blue-600 text-white rounded-br-sm'
                            : 'bg-zinc-700/50 text-zinc-100 rounded-bl-sm'
                        }`}
                      >
                        {message.content}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1 px-1">
                        {new Date(message.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                        {message.status === 'sending' && (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        )}
                        {message.status === 'error' && (
                          <span className="text-red-400">Failed to send</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      <div className="p-4 border-t border-zinc-800/50 bg-zinc-800/30">
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-3 bg-zinc-700/50 border border-zinc-600/50 rounded-xl text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!newMessage.trim()}
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}