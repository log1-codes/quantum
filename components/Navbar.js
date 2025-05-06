"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import {
  Menu,
  X,
  Zap,
  Activity,
  Info,
  MessageCircle,
  User,
  LogOut,
  Search,
  MessagesSquare,
  ArrowLeft,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { debounce } from "lodash"

const navVariants = {
  hidden: { y: -100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
    },
  }),
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [scrolled, setScrolled] = useState(false)
  const searchRef = useRef(null)
  const mobileSearchInputRef = useRef(null)
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = window.innerHeight * 0.1
      setScrolled(window.scrollY > scrollThreshold)
    }

    const handleResize = debounce(() => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false)
        setIsMobileSearchActive(false)
      }
    }, 100)

    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false)
        setSearchResults([])
        setSearchQuery("")
      }
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", handleResize)
    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
      document.removeEventListener("mousedown", handleClickOutside)
      handleResize.cancel()
    }
  }, [])

  const searchUsers = async (query) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/search?q=${query}`)
      if (!response.ok) throw new Error("Search failed")
      const data = await response.json()
      setSearchResults(data.users)
    } catch (error) {
      setError("Failed to search users")
      console.error("Error searching users:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query.trim()) {
        searchUsers(query);
      } else {
        setSearchResults([]);
        setIsLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchQuery)
    return () => {
      debouncedSearch.cancel()
    }
  }, [searchQuery, debouncedSearch])

  const handleUserSelect = useCallback(
    (user) => {
      console.log("User selected:", user)

      // Close all menus and clear search
      setIsSearchOpen(false)
      setIsMenuOpen(false)
      setIsMobileSearchActive(false)
      setSearchResults([])
      setSearchQuery("")

      // Navigate immediately without setTimeout
      router.push(`/chat?user=${encodeURIComponent(user.email)}`)
    },
    [router],
  )

  // Auto focus the search input when mobile search is activated
  useEffect(() => {
    if (isMobileSearchActive && mobileSearchInputRef.current) {
      setTimeout(() => {
        mobileSearchInputRef.current.focus()
      }, 300)
    }
  }, [isMobileSearchActive])

  const handleMobileSearchActivate = () => {
    setIsMenuOpen(false)
    setIsMobileSearchActive(true)
  }

  const handleMobileSearchClose = () => {
    setIsMobileSearchActive(false)
    setSearchResults([])
    setSearchQuery("")
  }

  const navItems = [
    { name: "Home", href: "/", icon: <Zap className="w-4 h-4" /> },
    { name: "Stats", href: "/stats", icon: <Activity className="w-4 h-4" /> },
    { name: "About", href: "/about", icon: <Info className="w-4 h-4" /> },
    {
      name: "Contact",
      href: "/contact",
      icon: <MessageCircle className="w-4 h-4" />,
    },
    ...(session
      ? [
          {
            name: "Profile",
            href: "/profile",
            icon: <User className="w-4 h-4" />,
          },
          {
            name: "Logout",
            href: "#",
            icon: <LogOut className="w-4 h-4" />,
            onClick: () => signOut(),
          },
        ]
      : [
          { name: "Login", href: "/login" },
          { name: "Signup", href: "/signup" },
        ]),
  ]

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 flex justify-center w-full z-50 px-4 pt-4 sm:pt-6"
        variants={navVariants}
        initial="hidden"
        animate="visible"
      >
        <nav
          className={`
          w-full max-w-7xl rounded-2xl border border-gray-800 
          ${
            scrolled
              ? "bg-black/30 backdrop-blur-xl border border-white/10 shadow-lg shadow-black/5"
              : "bg-black/20 backdrop-blur-sm"
          }
          transition-all duration-500 ease-in-out
        `}
        >
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <motion.div className="flex items-center" whileHover={{ scale: 1.02 }}>
                <Link href="/" className="flex items-center space-x-2 group">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    transition={{ duration: 0.3 }}
                    className="p-2 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20"
                  >
                    <Zap className="h-5 w-5 text-violet-400" />
                  </motion.div>
                  <span className="text-xl font-semibold font-mono tracking-tight text-white">quantum</span>
                </Link>
              </motion.div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-3">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.name}
                    custom={i}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={item.href}
                      onClick={item.onClick}
                      className={`
                      flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium
                      transition-all duration-200 ease-in-out
                      ${
                        pathname === item.href
                          ? "bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 text-violet-300"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      }
                    `}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  </motion.div>
                ))}

                {/* Action Icons */}
                <div className="flex items-center gap-2 ml-2" ref={searchRef}>
                  <AnimatePresence>
                    {isSearchOpen && (
                      <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 250, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="relative"
                      >
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                          <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 pl-10 rounded-lg bg-white/5 border border-white/10 
                                   text-white placeholder-white/40 text-sm focus:outline-none 
                                   focus:border-violet-400/60 focus:bg-white/10 transition-all duration-200"
                            autoFocus
                          />
                          {searchQuery && (
                            <button
                              onClick={() => setSearchQuery("")}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 
                                       hover:text-white/70 rounded-full bg-white/10 flex items-center justify-center"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                        {/* Desktop Search Results Dropdown */}
                        <AnimatePresence>
                          {(searchResults.length > 0 || isLoading || error || searchQuery) && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute top-full left-0 w-full mt-2 py-2 bg-black/60 backdrop-blur-xl 
                                     border border-white/10 rounded-lg shadow-xl z-30 max-h-[300px] overflow-y-auto"
                            >
                              {isLoading && (
                                <div className="px-4 py-2 text-white/70 text-sm flex items-center gap-2">
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{
                                      duration: 1,
                                      repeat: Number.POSITIVE_INFINITY,
                                      ease: "linear",
                                    }}
                                  >
                                    <Activity className="w-4 h-4" />
                                  </motion.div>
                                  Searching...
                                </div>
                              )}

                              {error && <div className="px-4 py-2 text-red-400 text-sm">{error}</div>}

                              {searchResults.length === 0 && searchQuery && !isLoading && (
                                <div className="px-4 py-3 text-white/50 text-sm">
                                  No users found for "{searchQuery}"
                                </div>
                              )}

                              {searchResults.map((user, i) => (
                                <motion.div
                                  key={user._id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: i * 0.05 }}
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    console.log("User clicked:", user)
                                    handleUserSelect(user)
                                  }}
                                  className="px-4 py-3 rounded-lg hover:bg-white/10 cursor-pointer
                                         flex items-center gap-3 transition-colors duration-200"
                                >
                                  {user.image ? (
                                    <Image
                                      src={user.image || "/placeholder.svg"}
                                      alt={user.name}
                                      width={32}
                                      height={32}
                                      className="rounded-full"
                                    />
                                  ) : (
                                    <div
                                      className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500 
                                                flex items-center justify-center text-white text-sm"
                                    >
                                      {user.name?.[0] || "U"}
                                    </div>
                                  )}
                                  <div>
                                    <div className="text-sm font-medium text-white">{user.name}</div>
                                    <div className="text-xs text-white/50">{user.email}</div>
                                  </div>
                                </motion.div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsSearchOpen(!isSearchOpen)}
                      className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10
                             transition-colors duration-200"
                    >
                      <Search className="w-4 h-4" />
                    </motion.button>

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative">
                      <Link
                        href="/chat"
                        className={`
                        flex items-center justify-center p-2 rounded-lg
                        text-white/70 hover:text-white hover:bg-white/10
                        transition-colors duration-200
                        ${pathname === "/chat" ? "bg-violet-500/15 text-violet-300" : ""}
                      `}
                      >
                        <MessagesSquare className="w-4 h-4" />
                      </Link>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative"
                    ></motion.div>
                  </div>

                  {/* User Profile */}
                  {session?.user && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      className="ml-2"
                    >
                      <div
                        className="h-9 w-9 rounded-lg overflow-hidden border border-violet-400/30 
                                  hover:border-violet-400/60 transition-colors duration-200
                                  hover:shadow-lg hover:shadow-violet-500/10"
                      >
                        {session.user.image ? (
                          <Image
                            src={session.user.image || "/placeholder.svg"}
                            alt="Profile"
                            width={36}
                            height={36}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div
                            className="h-full w-full bg-gradient-to-br from-violet-400 to-fuchsia-500 
                                      flex items-center justify-center text-white text-sm font-medium"
                          >
                            {session.user.name?.[0] || "U"}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Mobile Menu Button and Search Button */}
              <div className="md:hidden flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleMobileSearchActivate}
                  className="p-2 rounded-lg text-white/70 hover:text-white bg-white/5
                        transition-colors duration-200"
                >
                  <Search className="h-5 w-5" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 rounded-lg text-white/70 hover:text-white bg-white/5
                         transition-colors duration-200"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isMenuOpen ? "close" : "menu"}
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </motion.div>
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="md:hidden border-t border-white/10"
              >
                <div className="p-4 space-y-3">
                  {/* Mobile Navigation Items */}
                  {navItems.map((item, i) => (
                    <motion.div key={item.name} custom={i} variants={itemVariants} initial="hidden" animate="visible">
                      <Link
                        href={item.href}
                        onClick={(e) => {
                          setIsMenuOpen(false)
                          item.onClick?.(e)
                        }}
                        className={`
                        flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium
                        transition-all duration-200
                        ${
                          pathname === item.href
                            ? "bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 text-violet-300"
                            : "text-white/70 hover:text-white hover:bg-white/10"
                        }
                      `}
                      >
                        {item.icon}
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}

                  {/* Mobile Action Buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                    <Link
                      href="/chat"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg 
                             bg-violet-500/10 text-violet-300 hover:bg-violet-500/20
                             transition-colors duration-200"
                    >
                      <MessagesSquare className="w-4 h-4" />
                      Messages
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </motion.div>

      {/* Full Screen Mobile Search Overlay */}
      <AnimatePresence>
        {isMobileSearchActive && (
          <motion.div
            className="fixed inset-0 z-50 md:hidden"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="w-full h-full flex flex-col bg-black/95 backdrop-blur-xl">
              {/* Search Header */}
              <div className="px-4 py-4 border-b border-white/10 flex items-center gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleMobileSearchClose}
                  className="p-2 rounded-lg text-white/70 hover:text-white bg-white/5"
                >
                  <ArrowLeft className="h-5 w-5" />
                </motion.button>

                <div className="flex-1 relative">
                  <input
                    ref={mobileSearchInputRef}
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 rounded-lg bg-white/5 border border-white/10 
                           text-white placeholder-white/40 text-sm focus:outline-none 
                           focus:border-violet-400/60 focus:bg-white/10 transition-all duration-200"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 
                               hover:text-white/70 rounded-full bg-white/10 flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Search Results */}
              <div className="flex-1 overflow-y-auto p-2">
                {isLoading && (
                  <div className="px-6 py-4 text-white/70 flex items-center justify-center gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                    >
                      <Activity className="w-5 h-5" />
                    </motion.div>
                    <span>Searching...</span>
                  </div>
                )}

                {error && <div className="px-6 py-4 text-red-400 text-center">{error}</div>}

                {searchResults.length === 0 && !isLoading && searchQuery && (
                  <div className="px-6 py-8 text-white/50 text-center">No users found for "{searchQuery}"</div>
                )}

                {searchResults.length === 0 && !searchQuery && !isLoading && (
                  <div className="px-6 py-8 text-white/50 text-center flex flex-col items-center gap-3">
                    <Search className="w-8 h-8 text-white/30" />
                    <p>Search for users by name or email</p>
                  </div>
                )}

                <div className="space-y-1">
                  {searchResults.map((user, i) => (
                    <motion.div
                      key={user._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        console.log("User clicked:", user)
                        handleUserSelect(user)
                      }}
                      className="px-4 py-3 rounded-lg hover:bg-white/10 cursor-pointer
                             flex items-center gap-3 transition-colors duration-200"
                    >
                      {user.image ? (
                        <Image
                          src={user.image || "/placeholder.svg"}
                          alt={user.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      ) : (
                        <div
                          className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500 
                                    flex items-center justify-center text-white text-sm font-medium"
                        >
                          {user.name?.[0] || "U"}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="text-sm font-medium text-white">{user.name}</div>
                        <div className="text-xs text-white/50">{user.email}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

