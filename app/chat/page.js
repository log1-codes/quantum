'use client';

import React, { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import ChatWindow from '@/components/chatWindow';
import LoadingSpinner from '@/components/profile/LoadingSpinner';

function ChatContent() {
  const { data: session, status } = useSession();
  const [selectedUser , setSelectedUser ] = useState(null);
  const [userList, setUserList] = useState([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const userEmail = searchParams.get('user');
    if (userEmail && session) {
      const fetchUser  = async () => {
        try {
          const response = await fetch(`/api/search?q=${encodeURIComponent(userEmail)}`);
          if (response.ok) {
            const { users } = await response.json();
            if (users.length > 0) {
              setSelectedUser (users[0]);
            }
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      };
      
      fetchUser ();
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
    setSelectedUser (user);
    router.push(`/chat?user=${user.email}`);
  };

  return (
    <div className="container mx-auto p-4 pt-24">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[calc(100vh-8rem)]">
        {/* Sidebar */}
        <div className="md:col-span-1 bg-zinc-800 rounded-lg p-4 overflow-hidden flex flex-col">
          <h2 className="text-xl font-bold mb-4">Chats</h2>
          {status === "loading" ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-pulse text-gray-400">Loading chats...</div>
            </div>
          ) : (
            <ul className="flex-1 overflow-y-auto">
              {userList.length === 0 ? (
                <li className="text-gray-400 p-2">No chats found</li>
              ) : (
                userList.map((user) => (
                  <li
                    key={user.email}
                    onClick={() => handleUserSelect(user)}
                    className={`p-3 rounded-lg mb-2 cursor-pointer transition duration-200 ${
                      selectedUser ?.email === user.email 
                        ? 'bg-blue-600 text-white' 
                        : 'hover:bg-zinc-700 text-gray-300'
                    }`}
                  >
                    {user.name} ({user.email})
                  </li>
                ))
              )}
            </ul>
          )}
        </div>

        {/* Chat Area */}
        <div className="md:col-span-3 bg-zinc-900 rounded-lg overflow-hidden flex flex-col h-full">
          {status === "unauthenticated" ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Please Sign In</h3>
                <p className="text-gray-400">Sign in to access your chats</p>
              </div>
            </div>
          ) : (
            selectedUser  ? (
              <ChatWindow selectedUser ={selectedUser } />
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  Select a chat to start messaging
                </div>
              </div>
            )
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