'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import ChatWindow from '@/components/chatWindow';
import LoadingSpinner from '@/components/profile/LoadingSpinner';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';

function ChatContent() {
  const { data: session, status } = useSession();
  const [selectedUser, setSelectedUser] = useState(null);
  const [userList, setUserList] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const userEmail = searchParams.get('user'); // This will now receive the raw email
    if (userEmail && session) {
      const fetchUser = async () => {
        try {
          const response = await fetch(`/api/users?email=${userEmail}`); // Matches the new backend route
          if (response.ok) {
            const user = await response.json();
            setSelectedUser(user);
          } else {
            console.error('Error fetching user:', await response.json());
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      };

      fetchUser();
    }
  }, [searchParams, session]);

  useEffect(() => {
    if (session) {
      const fetchUserList = async () => {
        try {
          const response = await fetch('/api/search');
          if (response.ok) {
            const { users } = await response.json();
            setUserList(users);
          }
        } catch (error) {
          console.error('Error fetching user list:', error);
        }
      };

      fetchUserList();
    }
  }, [session]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setIsDropdownOpen(false);
    router.push(`/chat?user=${user.email}`);
  };

  return (
    <div className="container mx-auto p-4 pt-24">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[calc(100vh-8rem)]">
        {/* Sidebar for desktop only - hidden on mobile */}
        <div className="md:block md:col-span-1 bg-gradient-to-br from-zinc-900 to-black rounded-lg p-4 overflow-hidden flex flex-col relative shadow-xl border border-orange-800/30">
          <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
            Chats
          </h2>

          {/* Desktop Chat List */}
          <ul className="flex-1 overflow-y-auto">
            {status === "loading" ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="animate-pulse text-gray-400">Loading chats...</div>
              </div>
            ) : userList.length === 0 ? (
              <li className="text-gray-400 p-2">No chats found</li>
            ) : (
              userList.map((user) => (
                <li
                  key={user.email}
                  onClick={() => handleUserSelect(user)}
                  className={`p-3 rounded-lg mb-2 cursor-pointer transition duration-200 flex items-center ${
                    selectedUser?.email === user.email
                      ? 'bg-orange-600/80 text-white'
                      : 'hover:bg-zinc-700/80 text-gray-300'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-zinc-600 flex items-center justify-center mr-3 flex-shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs text-gray-400 truncate">{user.email}</div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Chat Area - Spans full width on mobile */}
        <div className="col-span-1 md:col-span-3 bg-gradient-to-br from-zinc-900 to-black rounded-lg overflow-hidden flex flex-col h-full shadow-xl border border-orange-800/30">
          {/* Mobile Dropdown Button - Only visible on mobile */}
          <div className="block md:hidden p-3 border-b border-zinc-800/50">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-zinc-700/70 backdrop-blur-md p-3 rounded-xl text-white flex justify-between items-center shadow-lg border border-zinc-600/30 transition-all duration-300 hover:bg-zinc-600/80"
            >
              <span className="font-medium">
                {selectedUser ? selectedUser.name : 'Select Chat'}
              </span>
              <div className="text-gray-300">
                {isDropdownOpen ? <IoChevronUp className="w-5 h-5" /> : <IoChevronDown className="w-5 h-5" />}
              </div>
            </button>
          </div>

          {/* Floating Dropdown Panel - Only shown on mobile when dropdown is open */}
          {isDropdownOpen && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-start justify-center pt-24 md:hidden">
              <div className="bg-zinc-800/95 backdrop-blur-xl w-11/12 max-w-md rounded-xl shadow-2xl border border-zinc-700/50 overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-zinc-700/30">
                  <h3 className="font-bold text-lg">Select a Chat</h3>
                  <button
                    onClick={() => setIsDropdownOpen(false)}
                    className="p-2 hover:bg-zinc-700/50 rounded-full"
                  >
                    <IoChevronUp className="w-5 h-5" />
                  </button>
                </div>
                <ul className="overflow-y-auto max-h-80">
                  {status === "loading" ? (
                    <li className="px-4 py-3 text-gray-400">Loading chats...</li>
                  ) : userList.length === 0 ? (
                    <li className="px-4 py-3 text-gray-400">No chats found</li>
                  ) : (
                    userList.map((user) => (
                      <li
                        key={user.email}
                        onClick={() => handleUserSelect(user)}
                        className={`px-4 py-3 cursor-pointer transition duration-200 ${
                          selectedUser?.email === user.email
                            ? 'bg-orange-600/80 text-white'
                            : 'hover:bg-zinc-700/70 text-gray-200'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-zinc-600 flex items-center justify-center mr-3 flex-shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-xs text-gray-400 truncate">{user.email}</div>
                          </div>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          )}

          {status === "unauthenticated" ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Please Sign In</h3>
                <p className="text-gray-400">Sign in to access your chats</p>
              </div>
            </div>
          ) : selectedUser ? (
            <ChatWindow selectedUser={selectedUser} />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-400">
                Select a chat to start messaging
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-black text-white">
      <Suspense fallback={<LoadingSpinner />}>
        <ChatContent />
      </Suspense>
    </div>
  );
}