"use client"

import { Suspense, useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useSearchParams, useRouter } from "next/navigation"
import { ChevronDown, Users, MessageSquare } from "lucide-react"
import ChatWindow from "@/components/chatWindow"
import LoadingSpinner from "@/components/profile/LoadingSpinner"
import React from "react"

// Update the MobileUserDropdown component to fix z-index issues
const MobileUserDropdown = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [userList, setUserList] = useState([])
  const handleUserSelect = (user) => {}

  return (
    <div className="relative w-full md:hidden mb-4">
      <div
        className="flex items-center justify-between w-full p-3 bg-zinc-800 rounded-lg cursor-pointer"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <div className="flex items-center">
          <Users className="w-5 h-5 mr-2 text-blue-400" />
          <span className="font-medium">{selectedUser ? selectedUser.name : "Select a user"}</span>
        </div>
        <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${sidebarOpen ? "rotate-180" : ""}`} />
      </div>

      {sidebarOpen && (
        <div className="absolute z-50 w-full mt-1 bg-zinc-800 rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {userList.length === 0 ? (
            <div className="p-3 text-gray-400 text-center">No users found</div>
          ) : (
            userList.map((user) => (
              <div
                key={user.email}
                onClick={() => handleUserSelect(user)}
                className={`p-3 cursor-pointer hover:bg-zinc-700 ${
                  selectedUser?.email === user.email ? "bg-blue-600 text-white" : "text-gray-300"
                }`}
              >
                {user.name} ({user.email})
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

// Replace the ChatContent function with this optimized version
function ChatContent() {
  const { data: session, status } = useSession()
  const [selectedUser, setSelectedUser] = useState(null)
  const [userList, setUserList] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  // Fetch user from URL parameter
  useEffect(() => {
    const userEmail = searchParams.get("user")
    if (userEmail && session && !selectedUser) {
      const fetchUser = async () => {
        setIsLoading(true)
        try {
          const response = await fetch(`/api/search?q=${encodeURIComponent(userEmail)}`)
          if (response.ok) {
            const { users } = await response.json()
            if (users.length > 0) {
              setSelectedUser(users[0])
            }
          }
        } catch (error) {
          console.error("Error fetching user:", error)
        } finally {
          setIsLoading(false)
        }
      }

      fetchUser()
    }
  }, [searchParams, session, selectedUser])

  // Fetch user list
  useEffect(() => {
    if (session && userList.length === 0) {
      const fetchUserList = async () => {
        setIsLoading(true)
        try {
          const response = await fetch("/api/search")
          if (response.ok) {
            const { users } = await response.json()
            setUserList(users)
          }
        } catch (error) {
          console.error("Error fetching user list:", error)
        } finally {
          setIsLoading(false)
        }
      }

      fetchUserList()
    }
  }, [session, userList.length])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarOpen && !event.target.closest(".mobile-dropdown")) {
        setSidebarOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [sidebarOpen])

  const handleUserSelect = (user) => {
    setSelectedUser (user);
    router.push(`/chat?user=${user.email}`);
    setSidebarOpen(false)
  };

  // Memoized MobileUserDropdown component
  const MemoizedMobileUserDropdown = React.memo(() => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    return (
      <div className="relative w-full md:hidden mb-4 mobile-dropdown">
        <div
          className="flex items-center justify-between w-full p-3 bg-zinc-800 rounded-lg cursor-pointer"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <div className="flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-400" />
            <span className="font-medium">{selectedUser ? selectedUser.name : "Select a user"}</span>
          </div>
          <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${sidebarOpen ? "rotate-180" : ""}`} />
        </div>

        {sidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setSidebarOpen(false)}>
            <div
              className="absolute top-[calc(4rem+1px)] left-4 right-4 bg-zinc-800 rounded-lg shadow-xl max-h-60 overflow-y-auto z-50"
              onClick={(e) => e.stopPropagation()}
            >
              {userList.length === 0 ? (
                <div className="p-3 text-gray-400 text-center">No users found</div>
              ) : (
                userList.map((user) => (
                  <div
                    key={user.email}
                    onClick={() => handleUserSelect(user)}
                    className={`p-3 cursor-pointer hover:bg-zinc-700 ${
                      selectedUser?.email === user.email ? "bg-blue-600 text-white" : "text-gray-300"
                    }`}
                  >
                    {user.name} ({user.email})
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    )
  })

  return (
    <div className="container mx-auto p-4 pt-16 md:pt-24 h-[100dvh] flex flex-col">
      <div className="flex flex-col md:flex-row gap-4 flex-grow h-[calc(100%-2rem)]">
        {/* Mobile User Dropdown */}
        <MemoizedMobileUserDropdown />

        {/* Sidebar - Hidden on mobile */}
        <div className="hidden md:block md:w-1/4 lg:w-1/5 bg-zinc-800 rounded-lg overflow-hidden shadow-lg">
          <div className="p-4 border-b border-zinc-700 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-blue-400" />
            <h2 className="text-lg font-bold">Chats</h2>
          </div>

          {status === "loading" || isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-pulse flex items-center">
                <div className="h-2 w-2 bg-blue-400 rounded-full mr-1 animate-bounce"></div>
                <div className="h-2 w-2 bg-blue-400 rounded-full mr-1 animate-bounce [animation-delay:0.2s]"></div>
                <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          ) : (
            <div className="overflow-y-auto max-h-[calc(100vh-12rem)]">
              {userList.length === 0 ? (
                <div className="text-gray-400 p-4 text-center">No chats found</div>
              ) : (
                <ul className="p-2">
                  {userList.map((user) => (
                    <li
                      key={user.email}
                      onClick={() => handleUserSelect(user)}
                      className={`p-3 rounded-lg mb-2 cursor-pointer transition-all duration-200 flex items-center ${
                        selectedUser?.email === user.email
                          ? "bg-blue-600 text-white shadow-md"
                          : "hover:bg-zinc-700 text-gray-300"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center mr-3 text-sm font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="overflow-hidden">
                        <div className="font-medium truncate">{user.name}</div>
                        <div className="text-xs truncate opacity-70">{user.email}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Chat Area */}
        <div className="flex-grow bg-zinc-900 rounded-lg overflow-hidden shadow-lg flex flex-col">
          {status === "unauthenticated" ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center bg-zinc-800 p-8 rounded-lg shadow-inner max-w-md">
                <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Please Sign In</h3>
                <p className="text-gray-400">Sign in to access your chats and messages</p>
              </div>
            </div>
          ) : selectedUser ? (
            <ChatWindow selectedUser={selectedUser} />
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-zinc-700" />
                <p className="text-gray-400">Select a chat to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-black text-white">
      <Suspense fallback={<LoadingSpinner />}>
        <ChatContent />
      </Suspense>
    </div>
  )
}

