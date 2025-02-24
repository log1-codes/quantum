"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { 
  Menu, X, Zap, Activity, Info, MessageCircle, 
  User, LogOut, Search, MessagesSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { debounce } from 'lodash';

const navVariants = {
  hidden: { y: -100, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring",
      stiffness: 100,
      damping: 20
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3
    }
  })
};

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = window.innerHeight * 0.1;
      setScrolled(window.scrollY > scrollThreshold);
    };

    const handleResize = debounce(() => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    }, 100);

    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
        setSearchResults([]);
        setSearchQuery('');
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
      handleResize.cancel();
    };
  }, []);

  const searchUsers = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/search?q=${query}`);
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setSearchResults(data.users);
    } catch (error) {
      setError('Failed to search users');
      console.error('Error searching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = debounce(searchUsers, 300);

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => debouncedSearch.cancel();
  }, [searchQuery]);

  const handleUserSelect = (user) => {
    setIsSearchOpen(false);
    setSearchResults([]);
    setSearchQuery('');
    router.push(`/chat?user=${encodeURIComponent(user.email)}`);
  };

  const navItems = [
    { name: 'Home', href: '/', icon: <Zap className="w-4 h-4" /> },
    { name: 'Stats', href: '/stats', icon: <Activity className="w-4 h-4" /> },
    { name: 'About', href: '/about', icon: <Info className="w-4 h-4" /> },
    { name: 'Contact', href: '/contact', icon: <MessageCircle className="w-4 h-4" /> },
    ...(session ? [
      { name: 'Profile', href: '/profile', icon: <User className="w-4 h-4" /> },
      { name: 'Logout', href: '#', icon: <LogOut className="w-4 h-4" />, onClick: () => signOut()
        
       }
    ] : [
      { name: 'Login', href: '/login' },
      { name: 'Signup', href: '/signup' }
    ])
  ];

  return (
    <motion.div 
      className="fixed  top-0 left-0 right-0 flex justify-center w-full z-50 px-4 pt-4 sm:pt-6"
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      <nav
        className={`
          w-full max-w-7xl rounded-2xl  border border-gray-800 
          ${scrolled 
            ? 'bg-black/20 backdrop-blur-xl border border-white/10 shadow-lg shadow-black/5' 
            : 'bg-black/10 backdrop-blur-sm'}
          transition-all duration-500 ease-in-out
        `}
      >
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.02 }}
            >
              <Link href="/" className="flex items-center space-x-2 group">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  transition={{ duration: 0.3 }}
                  className="p-2 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20"
                >
                  <Zap className="h-5 w-5 text-violet-400" />
                </motion.div>
                <span className="text-xl font-semibold font-mono tracking-tight text-white">
                  quantum
                </span>
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
                      ${pathname === item.href 
                        ? 'bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 text-violet-300' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'}
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
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 
                                 text-white placeholder-white/40 text-sm focus:outline-none 
                                 focus:border-violet-400/60 focus:bg-white/10 transition-all duration-200"
                        autoFocus
                      />
                      
                      {/* Search Results Dropdown */}
                      <AnimatePresence>
                        {(searchResults.length > 0 || isLoading || error) && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-0 w-full mt-2 py-2 bg-black/40 backdrop-blur-xl 
                                     border border-white/10 rounded-lg shadow-xl"
                          >
                            {isLoading && (
                              <div className="px-4 py-2 text-white/70 text-sm flex items-center gap-2">
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                >
                                  <Activity className="w-4 h-4" />
                                </motion.div>
                                Searching...
                              </div>
                            )}
                            
                            {error && (
                              <div className="px-4 py-2 text-red-400 text-sm">
                                {error}
                              </div>
                            )}

                            {searchResults.map((user, i) => (
                              <motion.div
                                key={user._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                onClick={() => handleUserSelect(user)}
                                className="px-4 py-2 hover:bg-white/10 cursor-pointer flex items-center gap-3
                                         transition-colors duration-200"
                              >
                                {user.image ? (
                                  <Image
                                    src={user.image}
                                    alt={user.name}
                                    width={32}
                                    height={32}
                                    className="rounded-full"
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500 
                                                flex items-center justify-center text-white text-sm">
                                    {user.name?.[0] || 'U'}
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

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative"
                  >
                    <Link
                      href="/chat"
                      className={`
                        flex items-center justify-center p-2 rounded-lg
                        text-white/70 hover:text-white hover:bg-white/10
                        transition-colors duration-200
                        ${pathname === '/chat' ? 'bg-violet-500/15 text-violet-300' : ''}
                      `}
                    >
                      <MessagesSquare className="w-4 h-4" />
                    </Link>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative"
                  >
                 
                  </motion.div>
                </div>

                {/* User Profile */}
                {session?.user && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    className="ml-2"
                  >
                    <div className="h-9 w-9 rounded-lg overflow-hidden border border-violet-400/30 
                                  hover:border-violet-400/60 transition-colors duration-200
                                  hover:shadow-lg hover:shadow-violet-500/10">
                      {session.user.image ? (
                        <Image
                          src={session.user.image}
                          alt="Profile"
                          width={36}
                          height={36}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-violet-400 to-fuchsia-500 
                                      flex items-center justify-center text-white text-sm font-medium">
                          {session.user.name?.[0] || 'U'}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10
                         transition-colors duration-200"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isMenuOpen ? 'close' : 'menu'}
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

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden border-t border-white/10"
            >
              <div className="p-4 space-y-3">
                {/* Mobile Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 
                             text-white placeholder-white/40 text-sm focus:outline-none 
                             focus:border-violet-400/60 focus:bg-white/10 transition-all duration-200"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                </div>

                {/* Mobile Navigation Items */}
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.name}
                    custom={i}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Link
                      href={item.href}
                      onClick={(e) => {
                        setIsMenuOpen(false);
                        item.onClick?.(e);
                      }}
                      className={`
                        flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium
                        transition-all duration-200
                        ${pathname === item.href 
                          ? 'bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 text-violet-300' 
                          : 'text-white/70 hover:text-white hover:bg-white/10'}
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
  );
}