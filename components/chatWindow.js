"use client";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Send, MessageSquare, Loader2, Smile, Pencil, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import EmojiPicker from 'emoji-picker-react';
const REACTIONS = ["👍", "❤️", "😂", "😮", "🤬" , "😎" ,"😢", "🙏", "😭", "☠️", "🤷‍♂️", "🚀", "❌"];

export default function ChatWindow({ selectedUser , onMessageReceived }) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [showReactions, setShowReactions] = useState(null);
  const [reactionPopupVisible, setReactionPopupVisible] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); 
  const emojiPickerRef = useRef(null); 
  const emojiButtonRef = useRef(null); 
  useEffect(() => {
    if (selectedUser ) {
      setMessages([]);
      fetchMessages();
    }
  }, [selectedUser ]);

  useEffect(() => {
    scrollToBottom();

    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.senderEmail !== session?.user?.email) {
        onMessageReceived?.(selectedUser .email, lastMessage);
      }
    }
  }, [messages, selectedUser ?.email, session?.user?.email, onMessageReceived]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/messages?recipientEmail=${selectedUser ?.email}`);
      if (!response.ok) throw new Error("Failed to fetch messages");
      const data = await response.json();
      setMessages(data.messages);
    } catch (error) {
      setError("Failed to load messages");
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser ) return;

    const tempId = Date.now().toString();
    const tempMessage = {
      _id: tempId,
      content: newMessage,
      senderEmail: session?.user?.email,
      senderName: session?.user?.name,
      senderImage: session?.user?.image,
      timestamp: new Date().toISOString(),
      status: "sending",
    };

    setMessages((prev) => [...prev, tempMessage]);
    setNewMessage("");

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipientEmail: selectedUser .email,
          content: newMessage,
        }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const sentMessage = await response.json();
      setMessages((prev) => prev.map((msg) => (msg._id === tempId ? sentMessage : msg)));
    } catch (error) {
      setMessages((prev) => prev.map((msg) => (msg._id === tempId ? { ...msg, status: "error" } : msg)));
      setError("Failed to send message");
      console.error("Error sending message:", error);
    }
  };

  async function handleEditMessage(messageId, newContent) {
    setMessages((prevMessages) =>
      prevMessages.map((msg) => (msg._id === messageId ? { ...msg, content: newContent } : msg))
    );

    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: "PUT",
        body: JSON.stringify({ content: newContent }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to edit message: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error editing message:", error);
    }
  }

  async function handleDeleteMessage(messageId) {
    setMessages((prevMessages) => prevMessages.filter((msg) => msg._id !== messageId));

    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete message: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  }

  const handleReaction = async (messageId, reaction) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg._id === messageId ? { ...msg, reactions: [reaction] } : msg 
      )
    );

    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reaction }),
      });

      if (!response.ok) {
        throw new Error("Failed to add reaction");
      }
    } catch (error) {
      console.error("Error adding reaction:", error);
    }
  };

  const handleReactionClick = (messageId) => {
    setShowReactions((prev) => (prev === messageId ? null : messageId));
    setReactionPopupVisible((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (showReactions && !event.target.closest(".reaction-popup")) {
      setShowReactions(null);
      setReactionPopupVisible(false);
    }
    if (
      emojiPickerRef.current && 
      !emojiPickerRef.current.contains(event.target) && 
      emojiButtonRef.current && 
      !emojiButtonRef.current.contains(event.target)
    ) {
      setShowEmojiPicker(false); 
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showReactions]);

  const handleEmojiClick = (emojiData) => {
    setNewMessage((prev) => prev + emojiData.emoji); 
  };
  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 border border-zinc-700/50 overflow-hidden rounded-2xl shadow-2xl relative">
      {/* Chat Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 border-b border-zinc-700/50 backdrop-blur-lg bg-zinc-800/90 flex items-center gap-3 z-10"
      >
        <div className="relative">
          {selectedUser ?.image ? (
            <Image
              src={ selectedUser .image || "/placeholder.svg"}
              alt={selectedUser .name}
              width={48}
              height={48}
              className="rounded-full ring-2 ring-blue-500/30 transition-all duration-300 hover:ring-blue-500/50"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-blue-400" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <h2 className="font-bold text-white text-lg">{selectedUser .name}</h2>
          <p className="text-sm text-zinc-400">{selectedUser .email}</p>
        </div>
      </motion.div>

      {/* Messages Area */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4 relative"
        style={{
          backgroundImage: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
          backgroundSize: '200% 200%',
          backgroundPosition: 'center',
          animation: 'pulse 15s infinite'
        }}
      >
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="h-full flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 border-4 border-blue-500/20 rounded-full animate-ping absolute"></div>
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              </div>
              <p className="text-sm text-zinc-400 animate-pulse">Loading messages...</p>
            </div>
          </motion.div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full flex items-center justify-center"
          >
            <div className="text-center bg-red-500/10 p-4 rounded-xl border border-red-500/20">
              <p className="text-red-400 mb-2">{error}</p>
              <button
                onClick={fetchMessages}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
              >
                Try again
              </button>
            </div>
          </motion.div>
        ) : (
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex ${
                  message.senderEmail === session?.user?.email ? 'justify-end' : 'justify-start'
                }`}
              >
                <div className="flex items-start gap-2 max-w-[80%] md:max-w-[70%] group relative">
                  {message.senderEmail !== session?.user?.email && message.senderImage && (
                    <Image
                      src={message.senderImage || "/placeholder.svg"}
                      alt={message.senderName}
                      width={32}
                      height={32}
                      className="rounded-full ring-2 ring-zinc-700/50 mt-1"
                    />
                  )}
                  <div className="relative">
                    {/* Message Actions */}
                    <div className="absolute -top-8 left-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-zinc-800/90 rounded-full p-1 shadow-lg z-10">
                      <button
                        onClick={() => handleReactionClick(message._id)}
                        className="p-1 hover:bg-zinc-700/50 rounded-full transition-colors"
                      >
                        <Smile className="w-4 h-4 text-zinc-400" />
                      </button>
                      {message.senderEmail === session?.user?.email && (
                        <>
                          <button
                            onClick={() => setEditingMessage(message._id)}
                            className="p-1 hover:bg-zinc-700/50 rounded-full transition-colors"
                          >
                            <Pencil className="w-4 h-4 text-zinc-400" />
                          </button>
                          <button
                            onClick={() => handleDeleteMessage(message._id)}
                            className="p-1 hover:bg-zinc-700/50 rounded-full transition-colors"
                          >
 <Trash2 className="w-4 h-4 text-zinc-400" />
                          </button>
                        </>
                      )}
                    </div>

                    {editingMessage === message._id ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const input = e.target.elements.content;
                          handleEditMessage(message._id, input.value);
                          setEditingMessage(null);
                        }}
                        className="flex gap-2"
                      >
                        <input
                          name="content"
                          defaultValue={message.content}
                          className="flex-1 p-2 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-zinc-100"
                          autoFocus
                        />
                        <button
                          type="submit"
                          className="px-3 py-1 bg-blue-500 text-white rounded-lg"
                        >
                          Save
                        </button>
                      </form>
                    ) : (
                      <>
                        <div
                          className={`p-3 rounded-2xl shadow-lg backdrop-blur-sm ${
                            message.senderEmail === session?.user?.email
                              ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-sm'
                              : 'bg-gradient-to-br from-zinc-700/50 to-zinc-800/50 text-zinc-100 rounded-bl-sm'
                          }`}
                        >
                          {message.content}
                        </div>

                        {/* Reactions Popup */}
                        {showReactions === message._id && reactionPopupVisible && (
                          <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute left-0 bg-zinc-800 rounded-full p-1 flex gap-1 shadow-lg z-20 reaction-popup"
                            style={{
                              top: 'auto',
                              bottom: '100%',
                              marginBottom: '8px',
                              overflowX: 'auto',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {REACTIONS.slice(0, 4).map((reaction) => (
                              <button
                                key={reaction}
                                onClick={() => {
                                  handleReaction(message._id, reaction);
                                  setShowReactions(null);
                                  setReactionPopupVisible(false);
                                }}
                                className="hover:bg-zinc-700 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                              >
                                {reaction}
                              </button>
                            ))}
                            {REACTIONS.length > 4 && (
                              <div className="flex items-center justify-center w-8 h-8 text-zinc-400">
                                <span>...</span>
                              </div>
                            )}
                          </motion.div>
                        )}

                        {/* Display Reactions */}
                        {message.reactions && message.reactions.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {message.reactions.map((reaction, i) => (
                              <span
                                key={i}
                                className="bg-zinc-800/50 rounded-full px-2 py-1 text-xs"
                              >
                                {reaction}
                              </span>
                            ))}
                          </div>
                        )}
                      </>
                    )}
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
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 border-t border-zinc-700/50 backdrop-blur-lg bg-zinc-800/90 z-10"
      >
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-3 bg-zinc-700/50 border border-zinc-600/50 rounded-xl text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
          />
           <button
            type="button"
            ref={emojiButtonRef}
            onClick={() => setShowEmojiPicker((prev) => !prev)} 
            className="p-3 bg-zinc-700 rounded-lg"
          >
            <Smile/>
          </button>
          {showEmojiPicker && (
           
            <div   ref={emojiPickerRef} className="absolute z-10" style={{ bottom: '100%', left: '0', transform: 'translateY(-8px)' }}> {/* Adjusted positioning */}
              <EmojiPicker onEmojiClick={handleEmojiClick} /> 
            </div>
          )}
          <motion.button
            type="submit"
 className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            disabled={!newMessage.trim()}
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}