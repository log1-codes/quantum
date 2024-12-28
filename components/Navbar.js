"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Zap, User, Activity, LogOut } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Info } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '/', icon: <Zap className="w-4 h-4" /> },
    { name: 'Stats', href: '/stats', icon: <Activity className="w-4 h-4" /> },
    { name: 'About', href: '/about', icon: <Info className="w-4 h-4" /> },
    { name: 'Contact', href: '/contact', icon: <MessageCircle className="w-4 h-4" /> },
    ...(session ? [
      { name: 'Profile', href: '/profile', icon: <User  className="w-4 h-4" /> },
      { name: 'Logout', href: '#', icon: <LogOut className="w-4 h-4" />, onClick: () => signOut() }
    ] : [
      { name: 'Login', href: '/login' },
      { name: 'Signup', href: '/signup' }
    ])
  ];

  return (
    <div className="fixed top-0 left-0 right-0 flex justify-center w-full z-50 px-4 pt-6">
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`
          w-full max-w-7xl rounded-2xl
          ${scrolled 
            ? 'bg-white/10 backdrop-blur-xl border border-white/10 shadow-lg shadow-black/5' 
            : 'bg-white/5 backdrop-blur-sm'}
          transition-all duration-300
        `}
      >
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center"
            >
              <Link href="/" className="flex items-center space-x-2 group">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  transition={{ duration: 0.3 }}
                  className="p-2 rounded-xl bg-violet-500/10"
                >
                  <Zap className="h-5 w-5 text-violet-400" />
                </motion.div>
                <span className="text-xl font-semibold font-mono tracking-tight text-white">
                  quantum
                </span>
              </Link>
            </motion.div>

            <div className="hidden md:flex items-center gap-4">
              {navItems.map((item) => (
                <motion.div
                  key={item.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={item.href}
                    onClick={item.onClick}
                    className={`
                      flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
                      transition-all duration-200
                      ${pathname === item.href 
                        ? 'bg-violet-500/15 text-violet-300' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                      }
                    `}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                </motion.div>
              ))}

              {session?.user && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-2"
                >
                  <div className ="h-8 w-8 rounded-lg overflow-hidden border border-violet-400/30 hover:border-violet-400/60 transition-colors">
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt="Profile"
                        width={32}
                        height={32}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-violet-400 to-fuchsia-500 flex items-center justify-center text-white text-sm font-medium">
                        {session.user.name?.[0] || 'U'}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/10"
            >
              <div className="px-2 py-2 space-y-1">
                {navItems.map((item) => (
                  <motion.div
                    key={item.name}
                    whileHover={{ scale: 1.02, x: 4 }}
                  >
                    <Link
                      href={item.href}
                      onClick={(e) => {
                        setIsMenuOpen(false);
                        item.onClick?.(e);
                      }}
                      className={`
                        flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                        ${pathname === item.href 
                          ? 'bg-violet-500/15 text-violet-300' 
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                        }
                      `}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}