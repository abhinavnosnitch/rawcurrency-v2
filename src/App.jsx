import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';
import { Menu, X, ArrowRight, Check, Play, ExternalLink, Calendar, MessageSquare, ChevronRight, Zap, Globe, Layers, Cpu, Moon, Sun, Terminal, Code, Activity, GitBranch, Database, BarChart3, Lock, Shield, Search, PenTool, Rocket, ShieldCheck, TrendingUp, Target, Fingerprint, Lightbulb, UserCheck, UserX } from 'lucide-react';

// --- Assets & Constants ---
const HERO_DAY_URL = "https://res.cloudinary.com/doalvffjs/image/upload/v1769107605/hero-daytime_md8lbe.webp";
const HERO_NIGHT_URL = "https://res.cloudinary.com/doalvffjs/image/upload/v1769143380/hero-nightime_bulkgx.webp";

// --- Hooks ---

const useFocusTrap = (isActive) => {
  const ref = useRef(null);
  useEffect(() => {
    if (!isActive) return;
    const element = ref.current;
    if (!element) return;

    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      } else if (e.key === 'Escape') {
        // Handled by parent
      }
    };

    element.addEventListener('keydown', handleTab);
    firstElement?.focus();
    return () => element.removeEventListener('keydown', handleTab);
  }, [isActive]);
  return ref;
};

// --- Utilities ---

const GrainOverlay = () => (
  <div className="pointer-events-none hidden fixed inset-0 z-[9999] opacity-[0.03] mix-blend-overlay">
    <svg className="h-full w-full">
      <filter id="noiseFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  </div>
);

const GridPattern = ({ width = 40, height = 40, className, mouseX, mouseY, isDark }) => {
  const hasMouse = mouseX !== undefined && mouseY !== undefined;

  return (
    <div className={`absolute inset-0 w-full h-full ${className}`}>
      <svg width="100%" height="100%">
        <defs>
          <pattern id="grid-pattern" width={width} height={height} patternUnits="userSpaceOnUse">
            <path d={`M ${width} 0 L 0 0 0 ${height}`} fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
      </svg>
      {/* Interactive Spotlight Overlay */}
      {hasMouse && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: useMotionTemplate`
                      radial-gradient(
                          600px circle at ${mouseX}px ${mouseY}px,
                          ${isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.03)"},
                          transparent 80%
                      )
                  `
          }}
        />
      )}
    </div>
  )
};

const Fireflies = ({ count = 30, opacity = 0.7 }) => {
  const fireflies = useMemo(() => Array.from({ length: count }).map(() => ({
    left: Math.random() * 100 + '%',
    top: Math.random() * 100 + '%',
    style: {
      animation: `firefly-move ${Math.random() * 5 + 5}s infinite alternate ease-in-out ${Math.random() * 2}s`,
      // Add random slight scaling to make it feel more organic
      transform: `scale(${Math.random() * 0.5 + 0.5})`
    }
  })), [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {fireflies.map((firefly, i) => (
        <div
          key={i}
          style={{
            left: firefly.left,
            top: firefly.top,
            ...firefly.style
          }}
          className="absolute w-1.5 h-1.5 bg-yellow-400 rounded-full shadow-[0_0_12px_2px_rgba(250,204,21,0.4)] opacity-0"
        />
      ))}
    </div>
  )
};


const GlowButton = ({ children, onClick, className, primary = false, isDark = false, ...props }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    {...props}
    className={`relative px-6 py-3 rounded-xl font-medium text-sm transition-all duration-[1200ms] overflow-hidden group cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed ${primary
      ? isDark
        ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
        : "bg-zinc-900 text-white shadow-[0_0_20px_rgba(0,0,0,0.1)] hover:shadow-[0_0_30px_rgba(0,0,0,0.2)]"
      : isDark
        ? "bg-zinc-900/50 text-white border border-white/10 hover:bg-zinc-800/50 backdrop-blur-md"
        : "bg-white/80 text-zinc-900 border border-zinc-200 hover:bg-white backdrop-blur-0 shadow-sm"
      } ${className}`}
  >
    <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    {primary && (
      <div className={`absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r skew-x-12 ${isDark ? "from-transparent via-black/10 to-transparent" : "from-transparent via-white/20 to-transparent"}`} />
    )}
  </motion.button>
);

const RevealSection = ({ children, className, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-10%" }}
    transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

// --- Components ---

const NavBar = ({ onOpenModal, onOpenStrategyModal, isDark, toggleTheme, currentView, setCurrentView }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [hoveredNav, setHoveredNav] = useState(null);
  const { scrollY } = useScroll();

  const navItems = [
    { label: 'Home', id: 'home', type: 'page' },
    { label: 'How It Works', id: 'how-it-works', type: 'page' },
    { label: 'Pricing', id: 'pricing', type: 'page' },
    { label: 'Run Audit', id: 'audit', type: 'page' }
  ];

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setScrolled(latest > 50);
      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    });
  }, [scrollY, mobileMenuOpen]);

  const handleNavClick = (e, item) => {
    e.preventDefault();
    if (item.id === 'audit') {
      setCurrentView('audit');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (item.type === 'page' || item.id === 'home') {
      setCurrentView(item.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Handle other types if any
    }
    setMobileMenuOpen(false);
  };

  const handleRunAudit = () => {
    setCurrentView('audit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center transition-all duration-[1200ms] ease-in-out ${scrolled
          ? isDark
            ? "h-16 bg-black/80 backdrop-blur-xl border-b border-white/5"
            : "h-16 bg-white/80 backdrop-blur-0 border-b border-zinc-200"
          : "h-24 bg-transparent border-transparent"
          }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center w-full">
          <a href="#" className="flex items-center gap-2 z-50 group" onClick={(e) => handleNavClick(e, { id: 'home', type: 'page' })}>
            <div className={`w-8 h-8 hidden rounded-lg flex items-center justify-center font-bold text-lg rotate-3 group-hover:rotate-0 transition-all duration-[1200ms] ${isDark ? "bg-white text-black" : "bg-zinc-900 text-white"}`}>R</div>
            <span className={`text-xl font-bold tracking-tight transition-colors duration-[1200ms] ${isDark ? "text-white" : "text-zinc-900"}`}>
              RAW<span className="text-zinc-500">CURRENCY</span>
            </span>
          </a>

          <div
            onMouseLeave={() => setHoveredNav(null)}
            className={`hidden md:flex items-center backdrop-blur-md border rounded-full p-1.5 absolute left-1/2 -translate-x-1/2 transition-all duration-[1200ms] ${isDark ? "bg-zinc-900/50 border-white/5" : "bg-white/50 border-zinc-200/50 backdrop-blur-0"}`}
          >
            {navItems.map((item) => {
              const isActive = (item.id === 'home' && currentView === 'home') || (item.id === 'how-it-works' && currentView === 'how-it-works');
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item)}
                  onMouseEnter={() => setHoveredNav(item.id)}
                  className={`relative px-5 py-2 text-xs font-medium transition-colors duration-300 z-10 ${isActive ? (isDark ? "text-white" : "text-black") :
                    isDark
                      ? `hover:text-white ${hoveredNav === item.id ? "text-white" : "text-zinc-400"}`
                      : `hover:text-zinc-900 ${hoveredNav === item.id ? "text-zinc-900" : "text-zinc-500"}`
                    }`}
                >
                  {item.label}
                  {(hoveredNav === item.id || isActive) && (
                    <motion.div
                      layoutId="nav-pill"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      className={`absolute inset-0 rounded-full -z-10 ${isDark ? "bg-white/10" : "bg-zinc-400/20"}`}
                    />
                  )}
                </a>
              )
            })}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all duration-[1200ms] cursor-pointer ${isDark ? "text-zinc-400 hover:text-white hover:bg-white/10" : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"}`}
              aria-label="Toggle Theme"
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.5 }}>
                    <Sun size={20} />
                  </motion.div>
                ) : (
                  <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.5 }}>
                    <Moon size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
            <GlowButton onClick={onOpenStrategyModal} primary isDark={isDark}>Strategy Call</GlowButton>
          </div>

          <div className="md:hidden flex items-center gap-4 z-50">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all duration-[1200ms] cursor-pointer ${isDark ? "text-zinc-400 hover:text-white hover:bg-white/10" : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"}`}
              aria-label="Toggle Theme"
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.5 }}>
                    <Sun size={20} />
                  </motion.div>
                ) : (
                  <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.5 }}>
                    <Moon size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 transition-colors duration-[1200ms] cursor-pointer ${isDark ? "text-white" : "text-zinc-900"}`}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`fixed top-20 right-4 z-50 w-64 rounded-2xl border backdrop-blur-xl shadow-2xl p-6 md:hidden ${isDark ? "bg-black/70 border-white/10" : "bg-white/70 border-zinc-200 backdrop-blur-0"}`}
            >
              <div className="flex flex-col space-y-4">
                {navItems.map((item, i) => (
                  <motion.a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => handleNavClick(e, item)}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className={`text-lg font-medium relative overflow-hidden group ${isDark ? "text-zinc-300" : "text-zinc-600"}`}
                  >
                    <span className={`relative z-10 transition-colors duration-500 ${isDark ? "group-hover:text-white" : "group-hover:text-zinc-900"}`}>
                      {item.label}
                    </span>

                  </motion.a>
                ))}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="pt-4 border-t border-white/10"
                >
                  <GlowButton onClick={() => { onOpenStrategyModal(); setMobileMenuOpen(false); }} primary isDark={isDark} className="w-full justify-center">
                    Strategy Call
                  </GlowButton>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const Hero = ({ onOpenModal, isDark }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const [showEffects, setShowEffects] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEffects(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 }
    }
  };

  const lineVariants = {
    hidden: { y: "100%", opacity: 0, filter: "blur(10px)" },
    visible: {
      y: "0%",
      opacity: 1,
      filter: "blur(0px)",
      transition: { duration: 1.2, ease: [0.19, 1, 0.22, 1] }
    }
  };

  return (
    <div
      id="home"
      className={`relative w-full h-[100dvh] min-h-[700px] overflow-hidden flex flex-col items-center justify-center transition-colors duration-[1200ms] ${isDark ? "bg-black" : "bg-zinc-50"}`}
    >
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <motion.div className="absolute inset-0 z-0" initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
          <img src={HERO_NIGHT_URL} alt="Office Night" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/0" />
        </motion.div>
        <motion.div
          className="absolute inset-0 z-10"
          initial={{ opacity: 1 }}
          animate={{ opacity: isDark ? 0 : 1 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          <img src={HERO_DAY_URL} alt="Office Day" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/0 to-white/0" />
        </motion.div>

        {showEffects && (
          <motion.div className="absolute inset-0 z-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}>
            <Fireflies count={50} opacity={0.8} />
          </motion.div>
        )}
        <GridPattern
          className={`absolute inset-0 z-30 opacity-30 transition-colors duration-[1200ms] ${isDark ? "text-zinc-700" : "text-zinc-400"}`}
          isDark={isDark}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: -20, filter: 'blur(5px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 1.6, ease: "easeOut" }}
          className="mb-8"
        >
          <span className={`inline-flex items-center gap-2 px-3 py-1 text-[10px] font-mono tracking-widest border rounded-full backdrop-blur-md transition-all duration-[1200ms] ${isDark ? "text-zinc-300 border-white/20 bg-black/40" : "text-zinc-700 border-zinc-900/10 bg-white/40 backdrop-blur-0 shadow-sm"}`}>
            <span className="w-1.5 h-1.5 hidden rounded-full bg-emerald-500 animate-pulse" />
            SYSTEM ARCHITECTURE v2 LIVE
          </span>
        </motion.div>

        <motion.h1
          className={`text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 leading-[1.1] transition-colors duration-[1200ms] ${isDark ? "text-white" : "text-zinc-900"}`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="overflow-hidden flex justify-center">
            <motion.div variants={lineVariants}>Scale Without</motion.div>
          </div>
          <div className="overflow-hidden flex justify-center gap-4 flex-wrap">
            <motion.div variants={lineVariants} className="relative">
              <span className="text-transparent hidden bg-clip-text bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-500">Human</span>
              <motion.span
                className="absolute hidden inset-0 text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/50"
                animate={{ opacity: isDark ? 1 : 0 }}
                transition={{ duration: 1.2 }}
                aria-hidden="true"
              >
                Human
              </motion.span>
            </motion.div>
            <motion.div variants={lineVariants} className="relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-500">Friction.</span>
              <motion.span
                className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/50"
                animate={{ opacity: isDark ? 1 : 0 }}
                transition={{ duration: 1.2 }}
                aria-hidden="true"
              >
                Friction.
              </motion.span>
            </motion.div>
          </div>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className={`text-lg md:text-xl mb-10 leading-relaxed max-w-xl mx-auto transition-colors duration-[1200ms] ${isDark ? "text-zinc-300" : "text-zinc-700"}`}
        >
          <span className="md:hidden block">Booked calls. Zero chaos.</span>
          <span className="hidden md:block">We build the automated infrastructure that powers high-ticket empires. Zero management. Pure throughput.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full"
        >
          <GlowButton onClick={onOpenModal} primary isDark={isDark} className="min-w-[180px] shadow-xl">
            Run My Growth Audit
            <ArrowRight className="w-4 h-4" />
          </GlowButton>
          <GlowButton onClick={() => { }} isDark={isDark} className="min-w-[180px] backdrop-blur-xs">
            View Case Studies
          </GlowButton>
        </motion.div>

        <motion.div
          style={{ y, opacity }}
          className={`mt-20 hidden relative w-full max-w-5xl aspect-[16/9] rounded-t-2xl border backdrop-blur-md overflow-hidden shadow-2xl transition-all duration-[1200ms] ${isDark ? "border-white/10 bg-zinc-900/40 shadow-blue-900/20" : "border-white/40 bg-white/30 shadow-zinc-200/50 backdrop-blur-0"}`}
        >
          <div className={`absolute inset-0 bg-gradient-to-b z-20 transition-colors duration-[1200ms] ${isDark ? "from-transparent to-black" : "from-transparent to-zinc-50"}`} />

          <div className={`p-4 border-b flex items-center justify-between transition-colors duration-[1200ms] ${isDark ? "border-white/5" : "border-white/20"}`}>
            <div className="flex gap-2">
              <div className={`w-2.5 h-2.5 rounded-full transition-colors duration-[1200ms] ${isDark ? "bg-zinc-700" : "bg-black/20"}`} />
              <div className={`w-2.5 h-2.5 rounded-full transition-colors duration-[1200ms] ${isDark ? "bg-zinc-700" : "bg-black/20"}`} />
              <div className={`w-2.5 h-2.5 rounded-full transition-colors duration-[1200ms] ${isDark ? "bg-zinc-700" : "bg-black/20"}`} />
            </div>
            <div className={`h-4 w-32 rounded-full transition-colors duration-[1200ms] ${isDark ? "bg-zinc-800" : "bg-black/10"}`} />
          </div>
          <div className="p-8 grid grid-cols-3 gap-8 h-full opacity-60">
            <div className="col-span-2 space-y-4">
              <div className={`h-32 rounded-lg border w-full relative overflow-hidden flex items-end justify-between px-4 pb-0 transition-colors duration-[1200ms] ${isDark ? "bg-zinc-800/50 border-white/5" : "bg-white/40 border-white/20"}`}>
                {[0.4, 0.7, 0.3, 0.9, 0.6, 0.8, 0.5].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h * 100}%` }}
                    transition={{ duration: 1.5, delay: 2 + (i * 0.1), ease: "easeOut" }}
                    className={`w-1/12 rounded-t-sm ${isDark ? "bg-emerald-500/20" : "bg-emerald-500/30"}`}
                  />
                ))}
              </div>
            </div>
            <div className="col-span-1 space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 2.6 }}
                className={`h-full rounded-lg border transition-colors duration-[1200ms] ${isDark ? "bg-zinc-800/50 border-white/5" : "bg-white/40 border-white/20"}`}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div >
  );
};

// ... existing code (Manifesto, LogoTicker, BentoCard, Features, ProcessBridge) ...
const Manifesto = ({ onOpenModal, isDark }) => {
  return (
    <section className={`py-32 md:py-48 relative transition-colors duration-[1200ms] ${isDark ? "bg-black" : "bg-zinc-50"}`}>
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left Column: Text */}
          <div className="order-1 lg:order-1">
            {/* The Hook */}
            <RevealSection>
              <h2 className={`text-4xl md:text-6xl font-bold tracking-tighter mb-6 ${isDark ? "text-white" : "text-zinc-900"}`}>
                You already know how to coach.
              </h2>
              <p className={`text-xl md:text-2xl mb-12 leading-relaxed ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                The problem is everything wrapped around it.
              </p>
            </RevealSection>

            {/* The Problem Beat */}
            <div className={`space-y-8 mb-16 ml-0 border-l-2 pl-8 py-2 ${isDark ? "border-zinc-800" : "border-zinc-300"}`}>
              <RevealSection delay={0.2}>
                <p className={`text-lg md:text-xl font-medium ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>
                  Leads leaking from broken funnels.
                </p>
              </RevealSection>
              <RevealSection delay={0.3}>
                <p className={`text-lg md:text-xl font-medium ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>
                  Vendors pointing fingers when ads stall.
                </p>
              </RevealSection>
              <RevealSection delay={0.4}>
                <p className={`text-lg md:text-xl font-medium ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>
                  Tech stacks duct-taped together at 2am.
                </p>
              </RevealSection>
            </div>

            {/* The Solution */}
            <RevealSection delay={0.5} className="mb-10">
              <p className={`text-xl md:text-3xl font-medium leading-tight mb-6 ${isDark ? "text-white" : "text-zinc-900"}`}>
                We design, build, and run the entire growth system, end-to-end.
              </p>
              <div className={`flex flex-wrap gap-3 text-sm font-semibold tracking-widest uppercase mb-6 ${isDark ? "text-emerald-600" : "text-emerald-600"}`}>
                <span className="border-hidden px-2 py-1 rounded border-current">Landing Pages</span>
                <span className="border-hidden px-2 py-1 rounded border-current">Funnels</span>
                <span className="border-hidden px-2 py-1 rounded border-current">Ads</span>
                <span className="border-hidden px-2 py-1 rounded border-current">Automation</span>
                <span className="border-hidden px-2 py-1 rounded border-current">AI</span>
              </div>
              <p className={`text-base ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                One system. One owner. Fewer moving parts.
              </p>
            </RevealSection>

            {/* CTAs */}
            <RevealSection delay={0.6} className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <GlowButton onClick={onOpenModal} primary isDark={isDark}>Run My Growth Audit</GlowButton>

              <button onClick={() => { }} className={`group flex items-center gap-2 text-sm font-medium transition-colors ${isDark ? "text-zinc-400 hover:text-white" : "text-zinc-600 hover:text-zinc-900"}`}>
                <span>View Case Studies</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </RevealSection>
          </div>

          {/* Right Column: Image */}
          <div className="order-2 lg:order-2 relative h-full min-h-[400px] lg:min-h-[600px]">
            <RevealSection delay={0.2} className="relative w-full h-full">
              {/* Abstract tech/structure image */}
              <div className={`absolute inset-0 rounded-2xl overflow-hidden border ${isDark ? "border-white/10" : "border-zinc-200"}`}>
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 1.5 }}
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
                  alt="Architecture"
                  className="w-full h-full object-cover"
                />
                {/* Overlays */}
                <div className={`absolute inset-0 bg-gradient-to-tr ${isDark ? "from-black/60 via-transparent to-transparent" : "from-white/30 via-transparent to-transparent"}`} />
              </div>

              {/* Floating Element - Animated */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className={`absolute bottom-8 left-[-20px] md:left-[-40px] p-6 rounded-xl border backdrop-blur-md shadow-2xl max-w-xs ${isDark ? "bg-zinc-900/80 border-white/10" : "bg-white/80 border-zinc-200"}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse" />
                  <span className={`text-xs font-mono font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>SYSTEM STATUS</span>
                </div>
                <div className="space-y-2">
                  <div className={`h-1.5 w-full rounded-full ${isDark ? "bg-zinc-800" : "bg-zinc-200"}`}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "34.5%" }}
                      transition={{ duration: 1.5, delay: 0.8 }}
                      className="h-full rounded-full bg-red-400"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                    <span>EFFICIENCY</span>
                    <span>34.5%</span>
                  </div>
                </div>
              </motion.div>
            </RevealSection>
          </div>

        </div>
      </div>
    </section>
  )
};

const LogoTicker = ({ isDark }) => {
  return (
    <section className={`py-12 border-y hidden overflow-hidden ${isDark ? "bg-black border-white/5" : "bg-white border-zinc-100"}`}>
      <div className="flex">
        <motion.div
          className="flex gap-16 min-w-max px-8"
          animate={{ x: "-50%" }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(2)].map((_, i) => (
            <React.Fragment key={i}>
              {["Acme Corp", "Nebula", "Vertex", "Oculus", "Spherule", "GlobalBank", "Nvidia", "Stripe", "Vercel", "Linear"].map((logo, idx) => (
                <div key={idx} className={`flex items-center gap-2 text-xl font-bold font-mono uppercase tracking-widest opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all cursor-pointer ${isDark ? "text-white" : "text-black"}`}>
                  <div className="w-4 h-4 bg-current rounded-sm" />
                  {logo}
                </div>
              ))}
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </section>
  )
};

const BentoCard = ({ children, className, isDark, delay }) => (
  <RevealSection delay={delay} className={`rounded-3xl p-8 border relative overflow-hidden group ${isDark ? "bg-zinc-900/50 border-white/5 hover:border-white/10" : "bg-white border-zinc-200 hover:border-zinc-300 shadow-sm"} ${className}`}>
    <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${isDark ? "from-white/5 via-transparent to-transparent" : "from-black/5 via-transparent to-transparent"}`} />
    {children}
  </RevealSection>
);

const Features = ({ onOpenModal, isDark }) => {
  return (
    <section id="advantage" className={`py-32 relative transition-colors duration-[1200ms] ${isDark ? "bg-black" : "bg-zinc-50"}`}>
      <div className="container mx-auto px-6">
        <div className="mb-20">
          <RevealSection>
            <h2 className={`text-4xl md:text-6xl font-bold mb-6 tracking-tighter ${isDark ? "text-white" : "text-zinc-900"}`}>
              The <span className="text-zinc-500">Unfair</span> Advantage
            </h2>
            <p className={`text-xl max-w-2xl ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
              Why top-performing digital creators trust us with their backend.
            </p>
            <div className={`mt-8 border-l-2 pl-6 py-2 max-w-3xl ${isDark ? "border-zinc-800" : "border-zinc-200"}`}>
              <p className={`text-lg mb-4 ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>
                Most growth systems fail because responsibility is fragmented. Ads, funnels, and automation live in silos.
              </p>
              <p className={`text-lg font-medium ${isDark ? "text-white" : "text-zinc-900"}`}>
                We remove that fragmentation by owning the entire system.
              </p>
            </div>
          </RevealSection>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[400px]">

          {/* Large Card - Velocity */}
          <BentoCard className="md:col-span-2 flex flex-col justify-between" isDark={isDark} delay={0.1}>
            <div className="relative z-10">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${isDark ? "bg-white/10 text-white" : "bg-zinc-100 text-zinc-900"}`}>
                <Zap size={24} />
              </div>
              <h3 className={`text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-zinc-900"}`}>Velocity Architecture</h3>
              <p className={`text-lg max-w-md ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                Momentum dies when builds drag on. We deploy fully operational, automated growth systems in days, not months.
              </p>
            </div>
            {/* Visual */}
            <div className="absolute right-0 bottom-0 w-1/2 h-3/4 opacity-50 group-hover:opacity-100 transition-opacity duration-500">
              <div className="w-full h-full relative">
                <div className={`absolute top-10 left-10 w-full h-full rounded-tl-2xl border-l border-t ${isDark ? "bg-zinc-950 border-white/10" : "bg-white border-zinc-200"}`} />
                <div className={`absolute top-24 left-24 w-full h-full rounded-tl-2xl border-l border-t ${isDark ? "bg-zinc-900 border-white/10" : "bg-zinc-50 border-zinc-200"}`} />
              </div>
            </div>
          </BentoCard>

          {/* Tall Card - Ownership */}
          <BentoCard className="md:col-span-1 row-span-1" isDark={isDark} delay={0.2}>
            <div className="h-full flex flex-col">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${isDark ? "bg-white/10 text-white" : "bg-zinc-100 text-zinc-900"}`}>
                <Layers size={24} />
              </div>
              <h3 className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-zinc-900"}`}>Single-System Ownership</h3>
              <p className={`text-sm mb-8 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>From first click to booked call, the same team owns the full system. No finger-pointing.</p>

              <div className={`flex-1 rounded-lg p-4 font-mono text-xs overflow-hidden ${isDark ? "bg-black/50 text-emerald-400" : "bg-zinc-100 text-emerald-600"}`}>
                <div className="opacity-70">
                  &gt; system_check()<br />
                  &gt; ad_spend: <span className="text-emerald-500">OPTIMIZED</span><br />
                  &gt; funnel_flow: <span className="text-emerald-500">ACTIVE</span><br />
                  &gt; crm_sync: <span className="text-emerald-500">REALTIME</span><br />
                  &gt; ai_agents: <span className="text-emerald-500">ONLINE</span><br />
                </div>
                <motion.div
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-2 h-4 bg-emerald-500 mt-1"
                />
              </div>
            </div>
          </BentoCard>

          {/* Wide Card - Reliability */}
          <BentoCard className="md:col-span-1" isDark={isDark} delay={0.3}>
            <div className="relative z-10">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${isDark ? "bg-white/10 text-white" : "bg-zinc-100 text-zinc-900"}`}>
                <Database size={24} />
              </div>
              <h3 className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-zinc-900"}`}>Built to Hold</h3>
              <p className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>Clean backend architecture. Redundancy where it matters. Fewer failure points.</p>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
              <div className={`w-64 h-64 border rounded-full flex items-center justify-center ${isDark ? "border-white/20" : "border-black/10"}`}>
                <div className={`w-48 h-48 border rounded-full flex items-center justify-center ${isDark ? "border-white/20" : "border-black/10"}`}>
                  <div className="w-24 h-24 bg-emerald-500/20 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Last Card - Compounding */}
          <BentoCard className="md:col-span-2" isDark={isDark} delay={0.4}>
            <div className="flex h-full items-center gap-8">
              <div className="flex-1">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${isDark ? "bg-white/10 text-white" : "bg-zinc-100 text-zinc-900"}`}>
                  <BarChart3 size={24} />
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-zinc-900"}`}>Compounding Improvements</h3>
                <p className={`text-lg ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>We monitor, refine, and improve the system over time so performance compounds instead of slipping.</p>
              </div>
              <div className="flex-1 h-full flex items-center justify-center">
                <div className={`relative w-40 h-40 rounded-full border-4 border-dashed animate-[spin_10s_linear_infinite] ${isDark ? "border-zinc-800" : "border-zinc-200"}`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Activity size={32} className={isDark ? "text-zinc-600" : "text-zinc-400"} />
                  </div>
                </div>
              </div>
            </div>
          </BentoCard>
        </div>

        <div className="mt-20 text-center">
          <p className={`text-xl font-medium mb-8 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
            If you’re wondering where your system is breaking, this is where we start.
          </p>
          <div className="flex flex-col items-center gap-2">
            <GlowButton onClick={onOpenModal} primary isDark={isDark}>Run My Growth Audit</GlowButton>
            <span className={`text-[12px] uppercase tracking-wider ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>We review a limited number of systems each week.</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const ProcessBridge = ({ onClick, isDark }) => {
  return (
    <section className={`py-40 relative overflow-hidden border-t transition-colors duration-[1200ms] ${isDark ? "bg-black border-white/5" : "bg-zinc-50 border-zinc-200"}`}>
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className={`absolute inset-0 bg-[size:60px_60px] ${isDark ? "bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]" : "bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)]"}`} />
      </div>

      {/* Connecting Line Graphic */}
      <div className="absolute top-1/2 left-0 w-full h-[1px] -translate-y-1/2 hidden md:block">
        <div className={`w-full h-full bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent`} />
        {/* Nodes on the line */}
        <div className={`absolute left-[20%] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 ${isDark ? "border-zinc-800 bg-black" : "border-zinc-300 bg-white"}`} />
        <div className={`absolute left-[80%] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 ${isDark ? "border-zinc-800 bg-black" : "border-zinc-300 bg-white"}`} />
      </div>


      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
        <RevealSection className="text-center max-w-4xl mx-auto">
          <div className="mb-8 flex justify-center">
            <div className={`px-4 py-1.5 rounded-full border text-xs font-mono tracking-widest uppercase backdrop-blur-md flex items-center gap-2 ${isDark ? "bg-zinc-900/50 border-white/10 text-zinc-400" : "bg-white/50 border-zinc-200 text-zinc-500"}`}>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Operational Blueprint
            </div>
          </div>

          <h2 className={`text-5xl md:text-7xl font-bold mb-8 tracking-tighter ${isDark ? "text-white" : "text-zinc-900"}`}>
            We build the machine <br />
            <span className="text-zinc-500">that builds your business.</span>
          </h2>

          <div className="flex flex-row items-center justify-center gap-4 md:gap-16 my-12">
            {[
              { label: "Diagnose", icon: Search },
              { label: "Design", icon: PenTool },
              { label: "Deploy", icon: Rocket }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center gap-3 group cursor-default">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-500 ${isDark ? "bg-zinc-900 border-white/10 group-hover:border-emerald-500/50 group-hover:bg-zinc-800" : "bg-white border-zinc-200 group-hover:border-emerald-500/50 group-hover:shadow-lg"}`}>
                  <step.icon className={`w-6 h-6 transition-colors duration-500 ${isDark ? "text-zinc-500 group-hover:text-emerald-400" : "text-zinc-400 group-hover:text-emerald-600"}`} />
                </div>
                <span className={`text-sm font-medium tracking-wide ${isDark ? "text-zinc-500 group-hover:text-zinc-300" : "text-zinc-500 group-hover:text-zinc-700"}`}>{step.label}</span>
              </div>
            ))}
          </div>

          <div className="relative group inline-block">
            <div className={`absolute -inset-1 rounded-xl opacity-20 blur-lg group-hover:opacity-40 transition duration-1000 ${isDark ? "bg-emerald-500" : "bg-emerald-400"}`} />
            <GlowButton onClick={onClick} primary isDark={isDark} className="px-10 py-4 text-lg min-w-[220px]">
              See How It Works
            </GlowButton>
          </div>
        </RevealSection>
      </div>
    </section>
  )
}

const Toolkit = ({ isDark }) => {
  const [activeItem, setActiveItem] = useState(0);

  const stackItems = [
    {
      id: 0,
      title: "Landing Pages & Funnels",
      subtitle: "Conversion Architecture",
      desc: "High-throughput pages designed to capture, qualify, and route leads without friction.",
      image: "https://res.cloudinary.com/doalvffjs/image/upload/v1769597916/b7503d35-442c-43a1-af40-80aabcc190a6_0_1_grfwcf.webp",
      tags: ["Design", "Speed", "Frictionless"],
      icon: Globe
    },
    {
      id: 1,
      title: "Paid Acquisition",
      subtitle: "Meta & Google Ads",
      desc: "Audience testing, creative iteration, and scaling rules tied to booked calls, not clicks.",
      image: "https://pbs.twimg.com/media/GSNGKTRXcAAxIo6?format=jpg&name=large",
      tags: ["Scale", "Revenue", "Testing"],
      icon: Target
    },
    {
      id: 2,
      title: "Backend & CRM",
      subtitle: "Data Integrity",
      desc: "Reliable data flows that keep leads, follow-ups, and attribution clean and consistent.",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2560&auto=format&fit=crop",
      tags: ["Sync", "Clean", "Reliable"],
      icon: Database
    },
    {
      id: 3,
      title: "AI Automation",
      subtitle: "Workflow Orchestration",
      desc: "Automations that handle routing, tagging, follow-ups, and internal handoffs instantly.",
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2560&auto=format&fit=crop",
      tags: ["Routing", "Speed", "Handoffs"],
      icon: Cpu
    },
    {
      id: 4,
      title: "Conversion Copy",
      subtitle: "Psychology & Messaging",
      desc: "Clear, conversion-first messaging across pages, ads, and follow-ups used to sell.",
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=2573&auto=format&fit=crop",
      tags: ["Clarity", "Persuasion", "Action"],
      icon: MessageSquare
    },
    {
      id: 5,
      title: "Advanced SEO",
      subtitle: "Organic Compounding",
      desc: "Technical and content strategies designed to attract higher-intent traffic over time.",
      image: "https://images.unsplash.com/photo-1674027001834-719c347d1eca?q=80&w=2560&auto=format&fit=crop",
      tags: ["Traffic", "Content", "Intent"],
      icon: Search
    },
    {
      id: 6,
      title: "AI Voice Callers",
      subtitle: "24/7 Qualification",
      desc: "Automated qualification and booking for inbound leads that require human filtering.",
      image: "https://images.unsplash.com/photo-1761311985467-f95c26a80bcd?q=80&w=2670&auto=format&fit=crop",
      tags: ["Voice", "Booking", "Scale"],
      icon: Zap
    }
  ];

  return (
    <section id="toolkit" className={`py-32 border-t transition-colors duration-[1200ms] ${isDark ? "bg-zinc-950 border-white/5" : "bg-white border-zinc-200"}`}>
      <div className="container mx-auto px-6">
        <RevealSection className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className={`text-3xl md:text-5xl font-bold mb-4 tracking-tight transition-colors duration-[1200ms] ${isDark ? "text-white" : "text-zinc-900"}`}>
              What We Handle
            </h2>
            <p className={`text-lg max-w-xl transition-colors duration-[1200ms] ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>Modular components designed for high-throughput acquisition.</p>
          </div>
          <GlowButton isDark={isDark}>
            View Documentation <ExternalLink size={14} />
          </GlowButton>
        </RevealSection>

        {/* Horizontal Expanding Gallery */}
        <RevealSection delay={0.2} className="flex flex-col lg:flex-row gap-4 h-[600px] lg:h-[500px]" onMouseLeave={() => setActiveItem(null)}>
          {stackItems.map((item) => {
            const isActive = activeItem === item.id;
            return (
              <motion.div
                key={item.id}
                layout
                onClick={() => setActiveItem(item.id)}
                onMouseEnter={() => setActiveItem(item.id)}
                className={`relative rounded-3xl overflow-hidden cursor-pointer border transition-all duration-700 ease-[0.32,0.72,0,1] ${isActive
                  ? "flex-[3]"
                  : activeItem === null ? "flex-[1]" : "flex-[0.5]"
                  } ${isDark ? "bg-zinc-900/50 border-white/10" : "bg-zinc-50 border-zinc-200"}`}
              >
                {/* Background Image (Visible on Active/Hover) */}
                <div className={`absolute inset-0 transition-opacity duration-700 ${isActive ? "opacity-100" : "opacity-30"}`}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? "from-black via-black/50 to-transparent" : "from-white via-white/15 to-transparent"}`} />
                </div>

                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className={`hidden md:block p-3 rounded-xl transition-colors duration-500 backdrop-blur-md ${isActive ? (isDark ? "bg-white/20 text-white" : "bg-black/20 text-black") : (isDark ? "bg-black/40 text-zinc-300" : "bg-white/40 text-zinc-600")}`}>
                      <item.icon size={24} />
                    </div>
                    <div className={`text-xs font-mono px-2 py-1 rounded border backdrop-blur-md transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-60"} ${isDark ? "border-white/20 text-white bg-black/20" : "border-black/20 text-black bg-white/20"}`}>
                      0{item.id + 1}
                    </div>
                  </div>

                  <div className="relative z-10">
                    <motion.h3
                      layout="position"
                      className={`font-bold transition-all duration-500 ${isActive ? "text-2xl md:text-3xl mb-2" : "text-lg md:text-xl mb-0"} ${isDark ? "text-white" : "text-zinc-900"}`}
                    >
                      {item.title}
                    </motion.h3>

                    <AnimatePresence mode="wait">
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <p className={`text-sm md:text-base font-medium mb-2 md:mb-4 ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>{item.subtitle}</p>
                          <p className={`text-xs md:text-sm leading-relaxed mb-4 md:mb-6 max-w-md ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>{item.desc}</p>

                          <div className="hidden md:flex gap-3 flex-wrap">
                            {item.tags.map((tag, idx) => (
                              <span key={idx} className={`text-xs px-3 py-1.5 rounded-full font-mono border backdrop-blur-sm ${isDark ? "bg-white/10 border-white/20 text-zinc-200" : "bg-black/10 border-black/20 text-zinc-800"}`}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </RevealSection>
      </div>
    </section>
  );
};

const Process = ({ isPageMode, onOpenModal, isDark }) => {
  const steps = [
    {
      title: "Diagnose the system",
      description: "We begin with a full audit of your current setup. Traffic sources. Pages and funnels. Follow-ups and booking flow. Automation, data, and handoffs.",
      subtext: "The goal is simple: find what’s leaking, what’s fragile, and what’s slowing everything down. You leave this phase with clarity, even if you choose not to move forward.",
      icon: Search,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "Design around the bottleneck",
      description: "We don’t rebuild everything. We fix what matters first.",
      subtext: "Based on the audit, we design the smallest system change that creates the biggest lift, whether that’s the page, the follow-up, the routing, or the qualification layer.",
      icon: PenTool,
      image: "https://images.unsplash.com/photo-1586776977607-310e9c725c37?q=80&w=2055&auto=format&fit=crop"
    },
    {
      title: "Deploy fast, without chaos",
      description: "Once the plan is clear, we move. Pages go live. Automations are connected. Tracking is verified. Bookings are tested end to end.",
      subtext: "Nothing ships half-finished. Nothing gets handed off incomplete.",
      icon: Rocket,
      image: "https://images.unsplash.com/photo-1598566665290-e59c95256dc3?q=80&w=2069&auto=format&fit=crop"
    },
    {
      title: "Stabilize before scaling",
      description: "Most systems break after launch. We stay close during early traffic and usage.",
      subtext: "We watch where things bend under load, where leads stall, and where friction shows up. Fixes happen while data is fresh, not weeks later.",
      icon: ShieldCheck,
      image: "https://images.unsplash.com/photo-1509490927285-34bd4d057c88?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "Improve what compounds",
      description: "Once the system is stable, we improve it deliberately. Small adjustments. Clear priorities. Measured changes.",
      subtext: "This is how growth becomes predictable instead of stressful.",
      icon: TrendingUp,
      image: "https://images.unsplash.com/photo-1598978483528-fd57466ab0ad?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  return (
    <section id="process" className={`py-24 relative overflow-hidden ${isDark ? "bg-black" : "bg-zinc-50"}`}>
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px] opacity-10 ${isDark ? "bg-emerald-500" : "bg-emerald-300"}`} />
        <div className={`absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[100px] opacity-5 ${isDark ? "bg-blue-500" : "bg-blue-300"}`} />
      </div>

      <div className="container mx-auto px-6 relative z-10">

        {/* Intro Section - Working With Us */}
        <RevealSection className="max-w-4xl mx-auto text-center mb-24">
          <div className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-mono tracking-widest border rounded-full mb-6 ${isDark ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/10" : "text-emerald-600 border-emerald-200 bg-emerald-50"}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            WORKING WITH US
          </div>
          <h2 className={`text-4xl md:text-5xl font-bold tracking-tight mb-8 ${isDark ? "text-white" : "text-zinc-900"}`}>
            What actually happens after you say yes.
          </h2>
          <p className={`text-xl md:text-2xl leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
            We don’t start with deliverables. We start with understanding how your system behaves in the real world. <br /><br />
            <span className={isDark ? "text-white" : "text-zinc-900"}>Every engagement follows the same sequence. No improvisation. No guesswork.</span>
          </p>
        </RevealSection>

        {/* Steps - Zig Zag Layout */}
        <div className="space-y-32">
          {steps.map((step, index) => (
            <div key={index} className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-24 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>

              {/* Text Side */}
              <div className="flex-1 space-y-6">
                <RevealSection delay={0.2}>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-emerald-500 ${isDark ? "bg-zinc-900 border border-zinc-800" : "bg-white border border-zinc-200 shadow-sm"}`}>
                    <step.icon size={24} />
                  </div>
                  <div className="flex items-baseline gap-4 mb-2">
                    <span className={`font-mono text-sm tracking-wider opacity-50 ${isDark ? "text-emerald-500" : "text-emerald-600"}`}>0{index + 1}</span>
                    <h3 className={`text-3xl md:text-4xl font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>{step.title}</h3>
                  </div>
                  <p className={`text-xl font-medium ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>
                    {step.description}
                  </p>
                  <p className={`text-lg leading-relaxed ${isDark ? "text-zinc-500" : "text-zinc-600"}`}>
                    {step.subtext}
                  </p>
                </RevealSection>
              </div>

              {/* Image Side */}
              <div className="flex-1 w-full">
                <RevealSection delay={0.3} className="relative aspect-[4/3] rounded-2xl overflow-hidden group">
                  <div className={`absolute inset-0 z-10 bg-gradient-to-tr ${isDark ? "from-black/40 via-transparent to-transparent" : "from-black/20 via-transparent to-transparent"}`} />
                  <motion.img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Tech Overlay Lines */}
                  <div className={`absolute inset-0 border-2 z-20 rounded-2xl pointer-events-none ${isDark ? "border-white/5" : "border-black/5"}`} />
                </RevealSection>
              </div>
            </div>
          ))}
        </div>

        {/* Who This Is For Section */}
        <RevealSection className="mt-40 mb-20 max-w-5xl mx-auto">
          <div className={`rounded-3xl p-10 md:p-16 border ${isDark ? "bg-zinc-900/50 border-white/10" : "bg-white border-zinc-200 shadow-lg"}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* For */}
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <UserCheck className="text-emerald-500" size={28} />
                  <h3 className={`text-2xl font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>Who This Is For</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    "You have a proven offer and existing traffic.",
                    "You are tired of managing multiple freelancers.",
                    "You value systems over temporary hacks.",
                    "You are ready to hand off technical execution entirely."
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 text-lg items-start">
                      <Check size={20} className="mt-1 flex-shrink-0 text-emerald-500" />
                      <span className={isDark ? "text-zinc-300" : "text-zinc-600"}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Not For */}
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <UserX className="text-red-500" size={28} />
                  <h3 className={`text-2xl font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>Who This Is Not For</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    "You are just starting out (no offer, no sales).",
                    "You want 'fast cash' schemes or magic pills.",
                    "You want to micromanage every pixel.",
                    "You are not willing to invest in infrastructure."
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 text-lg items-start">
                      <X size={20} className="mt-1 flex-shrink-0 text-red-500" />
                      <span className={isDark ? "text-zinc-400" : "text-zinc-500"}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </RevealSection>

        {/* Implied Promise */}
        <RevealSection className="text-center max-w-3xl mx-auto mt-24 mb-24">
          <p className={`text-2xl md:text-3xl font-medium leading-relaxed ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
            Growth shouldn't feel like a constant emergency.
          </p>
          <p className={`text-lg mt-6 ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>
            When you have a clean, owned system running in the background, you stop worrying about where the next lead is coming from. You get the mental space to actually lead your company.
          </p>
        </RevealSection>

        {/* Final CTA */}
        <RevealSection className="text-center pb-24 border-t pt-24 border-dashed border-zinc-700/20">
          <p className={`text-2xl font-bold mb-8 ${isDark ? "text-white" : "text-zinc-900"}`}>
            If you want to see how this applies to your system, <br /> the audit is where we start.
          </p>
          <div className="flex flex-col items-center gap-4">
            <GlowButton onClick={onOpenModal} primary isDark={isDark} className="px-10 py-4 text-lg">
              Run My Growth Audit
            </GlowButton>
            <span className={`text-xs uppercase tracking-widest font-semibold ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>
              We review a limited number of systems each week.
            </span>
          </div>
        </RevealSection>

      </div>
    </section>
  );
};

// New dedicated Page: "How It Works"
const HowItWorksPage = ({ onOpenModal, isDark }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div className="animate-in fade-in duration-700">
      {/* Page Hero */}
      <section
        onMouseMove={handleMouseMove}
        className={`pt-48 pb-32 text-center relative overflow-hidden ${isDark ? "bg-black" : "bg-zinc-50"}`}
      >
        <div className="absolute inset-0 pointer-events-none">
          <GridPattern
            className={`absolute inset-0 z-10 opacity-30 ${isDark ? "text-zinc-800" : "text-zinc-300"}`}
            mouseX={mouseX}
            mouseY={mouseY}
            isDark={isDark}
          />
          <div className={`absolute inset-0 bg-gradient-to-b ${isDark ? "from-transparent via-black/50 to-black" : "from-transparent via-white/50 to-zinc-50"}`} />
        </div>

        <div className="container mx-auto px-6 max-w-4xl relative z-20">
          <RevealSection>
            <h1 className={`text-6xl md:text-8xl font-bold tracking-tighter mb-4 pb-4 bg-clip-text text-transparent bg-gradient-to-b ${isDark ? "from-white via-white to-white/40" : "from-zinc-900 via-zinc-800 to-zinc-500"}`}>
              The System
            </h1>
            <div className={`text-xl md:text-3xl mb-12 font-medium leading-relaxed max-w-2xl mx-auto space-y-4 ${isDark ? "text-white" : "text-zinc-900"}`}>
              <p><span className={isDark ? "text-zinc-400" : "text-zinc-500"}>We don’t sell tactics.</span> We run the system.</p>
            </div>
            <GlowButton onClick={onOpenModal} primary isDark={isDark} className="px-10 py-4 text-lg shadow-xl shadow-emerald-500/10">
              Run My Growth Audit
            </GlowButton>
          </RevealSection>
        </div>
      </section>

      {/* --- NEW BELIEF LAYER (BENTO GRID REDESIGN) --- */}
      <section className={`py-24 ${isDark ? "bg-black" : "bg-zinc-50"}`}>
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-auto">

            {/* Card 1: Positioning */}
            <BentoCard className="md:col-span-2" isDark={isDark} delay={0.1}>
              <div className="relative z-10 h-full flex flex-col justify-between min-h-[300px]">
                <div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${isDark ? "bg-white/10 text-white" : "bg-zinc-100 text-zinc-900"}`}>
                    <Target size={24} />
                  </div>
                  <h2 className={`text-3xl font-bold mb-4 tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>This isn’t a growth problem</h2>
                  <div className={`space-y-4 text-lg leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                    <p>Most coaches already know how to coach. They’ve put in the reps. They’ve refined their offer.</p>
                    <p><span className={isDark ? "text-white font-medium" : "text-zinc-900 font-medium"}>What breaks is everything wrapped around the work.</span></p>
                    <p>Traffic comes in, but nothing connects cleanly. Leads show interest, then stall. Tools pile up.</p>
                  </div>
                </div>
                <p className={`mt-6 text-sm font-mono uppercase tracking-wider ${isDark ? "text-red-400" : "text-red-600"}`}>System Fragmented</p>
              </div>
              {/* Background Visual */}
              <div className="absolute top-0 right-0 w-1/3 h-full opacity-20 pointer-events-none">
                <div className={`w-full h-full bg-gradient-to-l ${isDark ? "from-red-500/20 to-transparent" : "from-red-500/10 to-transparent"}`} />
              </div>
            </BentoCard>

            {/* Card 2: Differentiation */}
            <BentoCard className="md:col-span-1 lg:row-span-2" isDark={isDark} delay={0.2}>
              <div className="relative z-10 h-full flex flex-col">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${isDark ? "bg-white/10 text-white" : "bg-zinc-100 text-zinc-900"}`}>
                  <Fingerprint size={24} />
                </div>
                <h2 className={`text-3xl font-bold mb-6 tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>Ownership changes everything</h2>
                <div className={`space-y-6 text-lg leading-relaxed flex-1 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                  <p>Most setups split responsibility. Ads live with one person. Funnels with another.</p>
                  <p>When something underperforms, fixes stay partial.</p>
                  <div className={`p-4 rounded-xl border ${isDark ? "bg-zinc-900/50 border-white/10" : "bg-zinc-50 border-zinc-200"}`}>
                    <p className={`font-medium mb-2 ${isDark ? "text-white" : "text-zinc-900"}`}>We work differently.</p>
                    <p className="text-sm">One team owns the full system, from first click to booked call.</p>
                  </div>
                  <p>This is not a tactic advantage. <span className="text-emerald-500 font-medium">It is a structural one.</span></p>
                </div>
              </div>
            </BentoCard>

            {/* Card 3: Core Belief */}
            <BentoCard className="md:col-span-2" isDark={isDark} delay={0.3}>
              <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${isDark ? "bg-white/10 text-white" : "bg-zinc-100 text-zinc-900"}`}>
                    <Lightbulb size={24} />
                  </div>
                  <h2 className={`text-3xl font-bold mb-4 tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>Why this works</h2>
                  <div className={`space-y-4 text-lg leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                    <p>Growth does not fail because people are lazy or uninformed. <span className={isDark ? "text-white" : "text-black"}>It fails because responsibility is split.</span></p>
                    <p>When one team owns the entire system, momentum becomes easier to create and easier to keep.</p>
                  </div>
                </div>
                {/* Simple Visual */}
                <div className="hidden md:flex flex-1 items-center justify-center opacity-80">
                  <div className={`relative w-48 h-48 rounded-full border-2 ${isDark ? "border-zinc-800" : "border-zinc-200"} flex items-center justify-center`}>
                    <div className={`absolute inset-0 border-t-2 border-emerald-500 rounded-full animate-spin [animation-duration:3s]`} />
                    <div className={`w-32 h-32 rounded-full border-2 ${isDark ? "border-zinc-800" : "border-zinc-200"} flex items-center justify-center`}>
                      <Zap className="text-emerald-500" size={32} />
                    </div>
                  </div>
                </div>
              </div>
            </BentoCard>

          </div>
        </div>
      </section>
      {/* --- END NEW BELIEF LAYER --- */}

      {/* The Core Process Content - Zig Zag */}
      <Process isPageMode={true} onOpenModal={onOpenModal} isDark={isDark} />

    </div>
  );
};

const Insights = ({ isDark }) => {
  return (
    <section id="insights" className={`py-32 border-t transition-colors duration-[1200ms] ${isDark ? "bg-black border-white/10" : "bg-zinc-50 border-zinc-200"}`}>
      <div className="container mx-auto px-6">
        <RevealSection className="flex justify-between items-end mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold tracking-tight transition-colors duration-[1200ms] ${isDark ? "text-white" : "text-zinc-900"}`}>
            Intelligence
          </h2>
          <a href="#" className={`hidden md:flex items-center gap-2 font-medium transition-colors text-sm ${isDark ? "text-zinc-400 hover:text-white" : "text-zinc-500 hover:text-zinc-900"}`}>
            View Archive <ArrowRight size={14} />
          </a>
        </RevealSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Main Article */}
          <RevealSection delay={0.2}>
            <motion.div
              whileHover={{ y: -5 }}
              className="group cursor-pointer"
            >
              <div className="rounded-2xl overflow-hidden aspect-[16/9] mb-6 relative">
                <div className="absolute inset-0 bg-blue-600/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Blog Main" />
              </div>
              <div>
                <span className="text-emerald-500 text-xs font-mono mb-3 block">STRATEGY_01</span>
                <h3 className={`text-2xl md:text-3xl font-bold mb-3 transition-colors duration-[1200ms] ${isDark ? "text-white group-hover:text-emerald-400" : "text-zinc-900 group-hover:text-emerald-600"}`}>How to Automate 80% of Your Sales Calls</h3>
                <p className={`leading-relaxed transition-colors duration-[1200ms] ${isDark ? "text-zinc-500" : "text-zinc-600"}`}>A deep dive into the conversational AI stack that powers modern high-ticket funnels.</p>
              </div>
            </motion.div>
          </RevealSection>

          {/* List */}
          <RevealSection delay={0.4} className="flex flex-col gap-8 justify-center">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className={`flex gap-6 group cursor-pointer border-b pb-8 last:border-0 transition-colors duration-[1200ms] ${isDark ? "border-white/5" : "border-zinc-200"}`}
              >
                <div className={`w-32 h-24 rounded-lg border overflow-hidden flex-shrink-0 relative transition-all duration-[1200ms] ${isDark ? "bg-zinc-900 border-white/10" : "bg-zinc-100 border-zinc-200"}`}>
                  <div className={`absolute inset-0 transition-colors z-10 ${isDark ? "bg-white/5 group-hover:bg-transparent" : "bg-black/5 group-hover:bg-transparent"}`} />
                  <img src={`https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?auto=format&fit=crop&q=80&w=300&hue=${i * 50}`} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="Thumbnail" />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-xs font-mono text-zinc-500 mb-1">PROTOCOL_{i}</span>
                  <h4 className={`text-lg font-bold transition-colors duration-[1200ms] ${isDark ? "text-white group-hover:text-emerald-400" : "text-zinc-900 group-hover:text-emerald-600"}`}>The 5-Step Framework for High-Ticket Sales</h4>
                  <span className="text-xs text-zinc-500 mt-2 flex items-center gap-2"><div className={`w-1 h-1 rounded-full ${isDark ? "bg-zinc-600" : "bg-zinc-400"}`} /> 5 min read</span>
                </div>
              </motion.div>
            ))}
          </RevealSection>
        </div>
      </div>
    </section>
  );
};

const Footer = ({ isDark }) => (
  <footer className={`border-t py-16 transition-colors duration-[1200ms] ${isDark ? "bg-black border-white/10" : "bg-zinc-50 border-zinc-200"}`}>
    <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-12">
      <RevealSection className="max-w-xs">
        <h4 className={`font-bold text-lg tracking-tight transition-colors duration-[1200ms] ${isDark ? "text-white" : "text-zinc-900"}`}>RAW<span className="text-zinc-500">CURRENCY</span></h4>
        <p className="text-zinc-500 text-sm mt-4 leading-relaxed">
          Building the automated backbone for the next generation of digital enterprise.
        </p>
        <div className="flex gap-4 mt-6">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono text-zinc-400">ALL SYSTEMS OPERATIONAL</span>
        </div>
      </RevealSection>
      <div className="grid grid-cols-2 gap-12">
        <RevealSection delay={0.2}>
          <h5 className={`font-bold mb-4 text-sm transition-colors duration-[1200ms] ${isDark ? "text-white" : "text-zinc-900"}`}>Platform</h5>
          <ul className={`space-y-2 text-sm ${isDark ? "text-zinc-500" : "text-zinc-600"}`}>
            <li><a href="#" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-zinc-900"}`}>Architecture</a></li>
            <li><a href="#" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-zinc-900"}`}>Integrations</a></li>
            <li><a href="#" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-zinc-900"}`}>Security</a></li>
          </ul>
        </RevealSection>
        <RevealSection delay={0.3}>
          <h5 className={`font-bold mb-4 text-sm transition-colors duration-[1200ms] ${isDark ? "text-white" : "text-zinc-900"}`}>Company</h5>
          <ul className={`space-y-2 text-sm ${isDark ? "text-zinc-500" : "text-zinc-600"}`}>
            <li><a href="#" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-zinc-900"}`}>Manifesto</a></li>
            <li><a href="#" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-zinc-900"}`}>Careers</a></li>
            <li><a href="#" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-zinc-900"}`}>Legal</a></li>
          </ul>
        </RevealSection>
      </div>
    </div>
    <div className={`container mx-auto px-6 mt-16 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 transition-colors duration-[1200ms] ${isDark ? "border-white/5" : "border-zinc-200"}`}>
      <p className="text-zinc-500 text-xs">© {new Date().getFullYear()} RawCurrency Inc. // EST. 2024</p>
      <div className="flex gap-6">
        <a href="#" className={`transition-colors ${isDark ? "text-zinc-600 hover:text-white" : "text-zinc-400 hover:text-zinc-900"}`}><span className="sr-only">Twitter</span><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg></a>
        <a href="#" className={`transition-colors ${isDark ? "text-zinc-600 hover:text-white" : "text-zinc-400 hover:text-zinc-900"}`}><span className="sr-only">GitHub</span><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg></a>
      </div>
    </div>
  </footer>
);

// --- New Components ---

const StrategyModal = ({ isOpen, onClose, isDark, onNavigateToAudit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const modalRef = useFocusTrap(isOpen);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);

    fetch("https://formsubmit.co/ajax/abhinavnosnitch@gmail.com", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(Object.fromEntries(formData))
    })
      .then(response => response.json())
      .then(data => {
        setIsSubmitting(false);
        setIsSuccess(true);
      })
      .catch(error => {
        console.error('Error:', error);
        setIsSubmitting(false);
      });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`absolute inset-0 backdrop-blur-sm transition-colors duration-[1200ms] ${isDark ? "bg-black/80" : "bg-zinc-900/20"}`}
          />

          <motion.div
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={`relative w-full max-w-lg border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all duration-[1200ms] ${isDark ? "bg-zinc-900 border-white/10" : "bg-white border-zinc-200"}`}
          >

            <div className="p-8 overflow-y-auto">
              <button
                onClick={onClose}
                className={`absolute top-4 right-4 p-2 transition-colors cursor-pointer ${isDark ? "text-zinc-500 hover:text-white" : "text-zinc-400 hover:text-zinc-900"}`}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              <h2 className={`text-2xl font-bold mb-2 tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>Conversation Context</h2>
              <p className={`mb-8 text-sm leading-relaxed ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>
                This is not a generic call. We require context to ensure the conversation is useful.
              </p>

              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isDark ? "bg-emerald-500/10 text-emerald-500" : "bg-emerald-100 text-emerald-600"}`}>
                    <Check size={32} />
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-zinc-900"}`}>Request Received</h3>
                  <p className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>We'll be in touch shortly.</p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  {/* Required hidden fields */}
                  <input type="hidden" name="_subject" value="New Strategy Request" />
                  <input type="hidden" name="form_type" value="Big Strategy Form" />
                  <input type="hidden" name="_captcha" value="false" />
                  <input type="hidden" name="_template" value="table" />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-wider">Full Name</label>
                      <input
                        type="text"
                        name="Full Name"
                        placeholder="Full Name"
                        required
                        className={`w-full px-4 py-3 border rounded-lg text-sm placeholder-zinc-500 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all ${isDark ? "bg-zinc-950 border-white/10 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900"}`}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-wider">Business Name</label>
                      <input
                        type="text"
                        name="Business Name"
                        placeholder="Business Name"
                        required
                        className={`w-full px-4 py-3 border rounded-lg text-sm placeholder-zinc-500 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all ${isDark ? "bg-zinc-950 border-white/10 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900"}`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-wider">Your Position</label>
                    <input
                      type="text"
                      name="Position"
                      placeholder="Your Position"
                      required
                      className={`w-full px-4 py-3 border rounded-lg text-sm placeholder-zinc-500 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all ${isDark ? "bg-zinc-950 border-white/10 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900"}`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-wider">Email Address</label>
                      <input
                        type="email"
                        name="Email"
                        placeholder="Email Address"
                        required
                        className={`w-full px-4 py-3 border rounded-lg text-sm placeholder-zinc-500 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all ${isDark ? "bg-zinc-950 border-white/10 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900"}`}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-wider">Contact Number (Optional)</label>
                      <input
                        type="tel"
                        name="Contact Number"
                        placeholder="Contact Number (optional)"
                        className={`w-full px-4 py-3 border rounded-lg text-sm placeholder-zinc-500 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all ${isDark ? "bg-zinc-950 border-white/10 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900"}`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-wider">Current Bottlenecks / Breakdowns</label>
                    <textarea
                      name="Current Bottlenecks / Breakdowns"
                      placeholder="Current Bottlenecks / Breakdowns"
                      rows={4}
                      required
                      className={`w-full px-4 py-3 border rounded-lg text-sm placeholder-zinc-500 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all ${isDark ? "bg-zinc-950 border-white/10 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900"}`}
                    />
                  </div>

                  <div className="pt-4 space-y-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-3 rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-white/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? "bg-zinc-300 text-black hover:bg-zinc-200" : "bg-zinc-500 text-white hover:bg-zinc-600"}`}
                    >
                      {isSubmitting ? "Sending..." : "Request a Conversation"}
                    </button>

                    <button
                      type="button"
                      onClick={() => { onClose(); onNavigateToAudit(); }}
                      className={`w-full py-3 text-sm font-medium transition-colors border rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 ${isDark ? "border-zinc-800 text-zinc-400" : "border-zinc-200 text-zinc-500"}`}
                    >
                      Go to the audit for an in-depth diagnosis
                    </button>

                    <p className={`text-[10px] text-center ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>
                      Submitting does not guarantee a call. We review context before confirming next steps.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const GrowthAuditPage = ({ isDark, onOpenStrategyModal }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);

    fetch("https://formsubmit.co/ajax/abhinavnosnitch@gmail.com", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(Object.fromEntries(formData))
    })
      .then(response => response.json())
      .then(data => {
        setIsSubmitting(false);
        setIsSuccess(true);
      })
      .catch(error => {
        console.error('Error:', error);
        setIsSubmitting(false);
      });
  };

  const scrollToForm = () => {
    document.getElementById('system-overview')?.scrollIntoView({ behavior: 'smooth' });
  };

  const { scrollY } = useScroll();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }



  return (
    <div className="animate-in fade-in duration-700">
      {/* Hero */}
      <section
        onMouseMove={handleMouseMove}
        className={`pt-48 pb-32 text-center relative overflow-hidden ${isDark ? "bg-black" : "bg-zinc-50"}`}
      >
        <div className="absolute inset-0 pointer-events-none">
          <GridPattern
            className={`absolute inset-0 z-10 opacity-30 ${isDark ? "text-zinc-800" : "text-zinc-300"}`}
            mouseX={mouseX}
            mouseY={mouseY}
            isDark={isDark}
          />
          <div className={`absolute inset-0 bg-gradient-to-b ${isDark ? "from-transparent via-black/50 to-black" : "from-transparent via-white/50 to-zinc-50"}`} />
        </div>

        <div className="container mx-auto px-6 max-w-4xl relative z-20">
          <RevealSection>
            <h1 className={`text-6xl md:text-8xl font-bold tracking-tighter mb-4 pb-4 bg-clip-text text-transparent bg-gradient-to-b ${isDark ? "from-white via-white to-white/40" : "from-zinc-900 via-zinc-800 to-zinc-500"}`}>
              Growth Audit
            </h1>
            <div className={`text-xl md:text-3xl mb-12 font-medium leading-relaxed max-w-2xl mx-auto space-y-4 ${isDark ? "text-white" : "text-zinc-900"}`}>
              <p><span className={isDark ? "text-zinc-400" : "text-zinc-500"}>We do not guess.</span> We diagnose.</p>
            </div>
            <div className="flex flex-col items-center gap-6">
              <GlowButton onClick={scrollToForm} primary isDark={isDark} className="px-10 py-4 text-lg shadow-xl shadow-emerald-500/10">
                Submit for Review
              </GlowButton>
              <button
                onClick={onOpenStrategyModal}
                className={`text-sm font-medium underline decoration-zinc-700 hover:text-emerald-500 transition-colors ${isDark ? "text-zinc-500" : "text-zinc-600"}`}
              >
                Skip the audit and request a direct call
              </button>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* Content Sections - Bento Grid */}
      <section className={`py-24 border-y transition-colors duration-[1200ms] ${isDark ? "bg-zinc-950 border-white/5" : "bg-white border-zinc-100"}`}>
        <div className="container mx-auto px-6 max-w-6xl">
          <RevealSection className="max-w-5xl mx-auto">
            <div className={`rounded-3xl p-10 md:p-16 border ${isDark ? "bg-zinc-900/50 border-white/10" : "bg-white border-zinc-200 shadow-lg"}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* What This Is */}
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <Check className="text-emerald-500" size={28} />
                    <h3 className={`text-2xl font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>What this is</h3>
                  </div>
                  <ul className="space-y-4">
                    {[
                      "A system diagnostic.",
                      "A review of how your growth system behaves in the real world, from first touch to booked call.",
                      "An identification of bottlenecks, broken handoffs, and quiet points of failure.",
                      "A focus on where efficiency is bleeding and where ownership is missing.",
                      "A structural analysis of growth issues, not dramatic ones."
                    ].map((item, i) => (
                      <li key={i} className="flex gap-3 text-lg items-start">
                        <span className={isDark ? "text-zinc-300" : "text-zinc-600"}>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className={`mt-6 text-sm font-mono uppercase tracking-widest ${isDark ? "text-emerald-500" : "text-emerald-600"}`}>STRUCTURAL DIAGNOSIS</p>
                </div>

                {/* What This Isn't */}
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <X className="text-red-500" size={28} />
                    <h3 className={`text-2xl font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>What this isn't</h3>
                  </div>
                  <ul className="space-y-4">
                    {[
                      "A sales call.",
                      "A generic strategy session.",
                      "A pitch disguised as a review.",
                      "A place for persuasion over clarity.",
                      "A manufactured opportunity if there isn't a real one."
                    ].map((item, i) => (
                      <li key={i} className="flex gap-3 text-lg items-start">
                        <span className={isDark ? "text-zinc-400" : "text-zinc-500"}>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className={`mt-6 p-4 hidden rounded-xl border ${isDark ? "bg-black/40 border-white/5" : "bg-zinc-50 border-zinc-200"}`}>
                    <p className={`text-sm font-medium ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>That restraint is intentional.</p>
                  </div>
                </div>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* Why We Start Here - Full Width Asymmetric Section */}
      <section className={`py-24 relative overflow-hidden border-y transition-colors duration-[1200ms] ${isDark ? "bg-zinc-950 border-white/5" : "bg-white border-zinc-100"}`}>
        {/* Background Pattern */}
        <div className={`absolute inset-0 bg-[size:32px_32px] pointer-events-none transition-all duration-[1200ms] opacity-30 ${isDark ? "bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)]" : "bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)]"}`}></div>

        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <RevealSection>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
              {/* Text Content - 60% */}
              <div className="lg:col-span-3 space-y-6">
                <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full border ${isDark ? "bg-emerald-500/10 border-emerald-500/20" : "bg-emerald-50 border-emerald-200"}`}>
                  <Search size={20} className="text-emerald-500" />
                  <span className={`text-sm font-mono uppercase tracking-wider ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>Methodology</span>
                </div>

                <h2 className={`text-4xl md:text-5xl font-bold tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>
                  Why we start here
                </h2>

                <div className={`space-y-6 text-xl leading-relaxed ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                  <p>Most teams try to fix growth problems from the outside.</p>
                  <p className={`${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                    They change ads.<br />
                    They rebuild pages.<br />
                    They add tools.
                  </p>
                  <p>But without seeing the full system, those changes stay partial and temporary.</p>
                  <p>The audit lets us see how <span className={`font-semibold ${isDark ? "text-white" : "text-zinc-900"}`}>traffic flows</span>, where <span className={`font-semibold ${isDark ? "text-white" : "text-zinc-900"}`}>decisions are made</span>, and where <span className={`font-semibold ${isDark ? "text-white" : "text-zinc-900"}`}>momentum stalls</span>.</p>
                  <p className={`${isDark ? "text-zinc-500" : "text-zinc-600"} text-lg italic`}>It gives us a shared understanding of reality before any recommendations are made.</p>
                </div>
              </div>

              {/* Visual Element - 40% */}
              <div className="lg:col-span-2 flex items-center justify-center">
                <RevealSection delay={0.3} className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden group">
                  <div className={`absolute inset-0 z-10 bg-gradient-to-tr ${isDark ? "from-black/40 via-transparent to-transparent" : "from-black/20 via-transparent to-transparent"}`} />
                  <motion.img
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&q=80"
                    alt="System Diagnostic Dashboard"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ filter: isDark ? 'brightness(0.9)' : 'brightness(1.1)' }}
                  />
                  <div className={`absolute inset-0 border-2 z-20 rounded-2xl pointer-events-none ${isDark ? "border-white/5" : "border-black/5"}`} />
                </RevealSection>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* A Note on Calls - Full Width Asymmetric Section (Flipped) */}
      <section className={`py-24 relative overflow-hidden border-b transition-colors duration-[1200ms] ${isDark ? "bg-black border-white/5" : "bg-zinc-50 border-zinc-100"}`}>
        {/* Background Accent */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className={`absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-5 ${isDark ? "bg-blue-500" : "bg-blue-300"}`} />
        </div>

        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <RevealSection>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
              {/* Visual Element - 40% (LEFT side now) */}
              <div className="lg:col-span-2 flex items-center justify-center order-2 lg:order-1">
                <RevealSection delay={0.3} className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden group">
                  <div className={`absolute inset-0 z-10 bg-gradient-to-tr ${isDark ? "from-black/40 via-transparent to-transparent" : "from-black/20 via-transparent to-transparent"}`} />
                  <motion.img
                    src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop&q=80"
                    alt="Call Scheduling Interface"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ filter: isDark ? 'brightness(0.9)' : 'brightness(1.1)' }}
                  />
                  <div className={`absolute inset-0 border-2 z-20 rounded-2xl pointer-events-none ${isDark ? "border-white/5" : "border-black/5"}`} />
                </RevealSection>
              </div>

              {/* Text Content - 60% (RIGHT side now) */}
              <div className="lg:col-span-3 space-y-6 order-1 lg:order-2">
                <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full border ${isDark ? "bg-blue-500/10 border-blue-500/20" : "bg-blue-50 border-blue-200"}`}>
                  <MessageSquare size={20} className="text-blue-500" />
                  <span className={`text-sm font-mono uppercase tracking-wider ${isDark ? "text-blue-400" : "text-blue-600"}`}>Our Process</span>
                </div>

                <h2 className={`text-4xl md:text-5xl font-bold tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>
                  A note on calls
                </h2>

                <div className={`space-y-6 text-xl leading-relaxed ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                  <p>We only take calls <span className={`font-semibold ${isDark ? "text-white" : "text-zinc-900"}`}>after</span> we have diagnosed the system.</p>
                  <p className={`${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                    That way, conversations are specific, grounded, and useful.<br />
                    Not hypothetical.<br />
                    Not surface-level.
                  </p>
                  <p>If a call makes sense after review, we will suggest it.</p>
                  <p className={`text-lg ${isDark ? "text-zinc-500" : "text-zinc-600"}`}>If it doesn't, we will tell you that too.</p>
                </div>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* Intake Form */}
      <section id="system-overview" className={`py-32 relative ${isDark ? "bg-black" : "bg-zinc-50"}`}>
        {/* Background Gradients */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className={`absolute top-1/4 left-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-10 ${isDark ? "bg-emerald-900" : "bg-emerald-300"}`} />
          <div className={`absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-10 ${isDark ? "bg-blue-900" : "bg-blue-300"}`} />
        </div>

        <div className="container mx-auto px-6 max-w-5xl relative z-10">
          <RevealSection>
            <div className="text-center mb-16">
              <span className={`inline-block px-3 py-1 mb-6 text-xs font-mono border rounded-full ${isDark ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" : "text-emerald-600 border-emerald-200 bg-emerald-50"}`}>SYSTEM INTAKE</span>
              <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${isDark ? "text-white" : "text-zinc-900"}`}>Intake Questions</h2>
              <p className={`text-xl max-w-xl mx-auto ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                The more context you provide, the precise the diagnosis. Detail matters.
              </p>
            </div>

            <div className={`p-8 md:p-12 rounded-3xl border shadow-2xl ${isDark ? "bg-zinc-900 border-white/10" : "bg-white border-zinc-200"}`}>
              {isSuccess ? (
                <div className="p-12 text-center">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isDark ? "bg-emerald-500/10 text-emerald-500" : "bg-emerald-100 text-emerald-600"}`}>
                    <Check size={40} />
                  </div>
                  <h3 className={`text-2xl font-bold mb-4 ${isDark ? "text-white" : "text-zinc-900"}`}>Audit Request Received</h3>
                  <p className={`text-lg mb-8 max-w-lg mx-auto ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                    Thank you for providing those details. Your input has been securely logged. We will review your context and reach out shortly if we see a fit.
                  </p>
                  <button
                    onClick={onOpenStrategyModal}
                    className={`text-sm font-medium hover:text-emerald-500 transition-colors ${isDark ? "text-zinc-500" : "text-zinc-600"}`}
                  >
                    Have more to add? <span className="underline decoration-zinc-700">Request a Call</span>
                  </button>
                </div>
              ) : (
                <form
                  className="space-y-12"
                  onSubmit={handleSubmit}
                >
                  {/* Hidden Fields */}
                  <input type="hidden" name="_subject" value="New Growth Audit Intake" />
                  <input type="hidden" name="form_type" value="Comprehensive Audit Intake" />
                  <input type="hidden" name="_captcha" value="false" />
                  <input type="hidden" name="_template" value="table" />

                  {/* Identity */}
                  <div>
                    <h3 className={`text-sm font-mono uppercase tracking-widest mb-8 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>// 01. IDENTITY</h3>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className={`text-xs font-bold uppercase tracking-wide ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>Full Name</label>
                          <input type="text" name="Full Name" required className={`w-full px-4 py-3 rounded-xl border bg-transparent focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all ${isDark ? "border-zinc-800 text-white placeholder-zinc-600" : "border-zinc-300 text-zinc-900 placeholder-zinc-400"}`} placeholder="John Doe" />
                        </div>
                        <div className="space-y-2">
                          <label className={`text-xs font-bold uppercase tracking-wide ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>Business Name</label>
                          <input type="text" name="Business Name" required className={`w-full px-4 py-3 rounded-xl border bg-transparent focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all ${isDark ? "border-zinc-800 text-white placeholder-zinc-600" : "border-zinc-300 text-zinc-900 placeholder-zinc-400"}`} placeholder="Acme Inc." />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className={`text-xs font-bold uppercase tracking-wide ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>Your Role in the Business</label>
                          <input type="text" name="Role" required className={`w-full px-4 py-3 rounded-xl border bg-transparent focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all ${isDark ? "border-zinc-800 text-white placeholder-zinc-600" : "border-zinc-300 text-zinc-900 placeholder-zinc-400"}`} placeholder="Founder, CEO, Growth Head..." />
                        </div>
                        <div className="space-y-2">
                          <label className={`text-xs font-bold uppercase tracking-wide ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>Email Address</label>
                          <input type="email" name="Email" required className={`w-full px-4 py-3 rounded-xl border bg-transparent focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all ${isDark ? "border-zinc-800 text-white placeholder-zinc-600" : "border-zinc-300 text-zinc-900 placeholder-zinc-400"}`} placeholder="john@acme.com" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className={`text-xs font-bold uppercase tracking-wide ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>Primary Business Model</label>
                        <select name="Business Model" required className={`w-full px-4 py-3 rounded-xl border bg-transparent focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all ${isDark ? "border-zinc-800 text-white bg-zinc-900" : "border-zinc-300 text-zinc-900 bg-white"}`}>
                          <option value="" disabled selected>Select Model...</option>
                          <option value="coach">Coach</option>
                          <option value="consultant">Consultant</option>
                          <option value="creator">Creator</option>
                          <option value="service">Service Business</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className={`h-px w-full ${isDark ? "bg-zinc-800" : "bg-zinc-200"}`} />

                  {/* Questions */}
                  <div>
                    <h3 className={`text-sm font-mono uppercase tracking-widest mb-8 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>// 02. DIAGNOSTICS</h3>
                    <div className="space-y-8">
                      <div className="space-y-3">
                        <label className={`text-sm font-bold ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>What are you primarily trying to improve right now?</label>
                        <div className={`text-xs mb-2 ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>Booked calls, lead quality, consistency, conversion, system reliability, or something else.</div>
                        <textarea name="Goal" rows={3} className={`w-full px-4 py-3 rounded-xl border bg-transparent focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all ${isDark ? "border-zinc-800 text-white placeholder-zinc-600" : "border-zinc-300 text-zinc-900 placeholder-zinc-400"}`} placeholder="Describe your main objective..." />
                      </div>

                      <div className="space-y-3">
                        <label className={`text-sm font-bold ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>Where does attention currently come from?</label>
                        <div className={`text-xs mb-2 ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>Paid ads, organic social, referrals, search, email, partnerships, or no consistent source yet.</div>
                        <textarea name="Traffic Sources" rows={3} className={`w-full px-4 py-3 rounded-xl border bg-transparent focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all ${isDark ? "border-zinc-800 text-white placeholder-zinc-600" : "border-zinc-300 text-zinc-900 placeholder-zinc-400"}`} placeholder="List your traffic sources..." />
                      </div>

                      <div className="space-y-3">
                        <label className={`text-sm font-bold ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>Walk us through what happens from first click or inquiry to booked call.</label>
                        <div className={`text-xs mb-2 ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>Be specific. Include pages, follow-ups, tools, and handoffs if possible.</div>
                        <textarea name="Funnel Steps" rows={4} className={`w-full px-4 py-3 rounded-xl border bg-transparent focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all ${isDark ? "border-zinc-800 text-white placeholder-zinc-600" : "border-zinc-300 text-zinc-900 placeholder-zinc-400"}`} placeholder="Step-by-step process..." />
                      </div>

                      <div className="space-y-3">
                        <label className={`text-sm font-bold ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>What feels most broken, fragile, or frustrating in your current setup?</label>
                        <div className={`text-xs mb-2 ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>Leaks, wasted spend, poor lead quality, tech issues, vendor overlap, lack of ownership.</div>
                        <textarea name="Pain Points" rows={3} className={`w-full px-4 py-3 rounded-xl border bg-transparent focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all ${isDark ? "border-zinc-800 text-white placeholder-zinc-600" : "border-zinc-300 text-zinc-900 placeholder-zinc-400"}`} placeholder="Key pain points..." />
                      </div>

                      <div className="space-y-3">
                        <label className={`text-sm font-bold ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>Why are you looking at this now instead of later?</label>
                        <div className={`text-xs mb-2 ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>What changed? What pressure are you feeling? What prompted this review?</div>
                        <textarea name="Why Now" rows={3} className={`w-full px-4 py-3 rounded-xl border bg-transparent focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all ${isDark ? "border-zinc-800 text-white placeholder-zinc-600" : "border-zinc-300 text-zinc-900 placeholder-zinc-400"}`} placeholder="Context on timing..." />
                      </div>
                    </div>
                  </div>

                  <div className={`h-px w-full ${isDark ? "bg-zinc-800" : "bg-zinc-200"}`} />

                  {/* Submission */}
                  <div className="pt-4">
                    <div className={`p-4 rounded-xl mb-8 flex gap-4 ${isDark ? "bg-emerald-900/10 border border-emerald-500/20" : "bg-emerald-50 border border-emerald-200"}`}>
                      <ShieldCheck className="text-emerald-500 shrink-0" size={20} />
                      <p className={`text-xs leading-relaxed ${isDark ? "text-emerald-200" : "text-emerald-800"}`}>
                        <strong>Confidentiality Protocol:</strong> Your system data is encrypted and reviewed only by senior architects. We do not share logic with competitors.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-4 text-lg font-semibold rounded-xl transition-all shadow-xl hover:shadow-white/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? "bg-zinc-300 text-black hover:bg-zinc-200" : "bg-zinc-500 text-white hover:bg-zinc-600"}`}
                    >
                      {isSubmitting ? "Submitting securely..." : "Submit for Review"}
                    </button>

                    <div className="mt-8 text-center space-y-4">
                      <p className={`text-xs ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                        Limited audit slots available per week.
                      </p>
                      <button type="button" onClick={onOpenStrategyModal} className={`text-sm font-medium hover:text-emerald-500 transition-colors ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                        Prefer to skip the audit? <span className="underline decoration-zinc-700">Request a Direct Strategy Call</span>
                      </button>
                    </div>
                  </div>

                </form>
              )}</div>
          </RevealSection>
        </div>
      </section>

      {/* Final framing line */}
      <section className={`py-32 text-center border-t ${isDark ? "bg-black border-white/10" : "bg-zinc-50 border-zinc-200"}`}>
        <div className="container mx-auto px-6">
          <RevealSection>
            <div className="mb-6 flex justify-center">
              <div className={`w-px h-16 ${isDark ? "bg-gradient-to-b from-transparent via-white/50 to-transparent" : "bg-gradient-to-b from-transparent via-zinc-900/50 to-transparent"}`} />
            </div>
            <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${isDark ? "text-white" : "text-zinc-900"}`}>Certainty is an engineered state.</h2>
            <p className={`text-lg ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>Everything else follows from there.</p>
          </RevealSection>
        </div>
      </section>
    </div>
  );
};

const PricingPage = ({ onOpenModal, isDark }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div className={`min-h-screen pt-32 pb-20 transition-colors duration-[1200ms] ${isDark ? "bg-black" : "bg-zinc-50"}`}>
      {/* Hero */}
      <section
        onMouseMove={handleMouseMove}
        className={`-mt-32 pt-48 pb-20 text-center relative overflow-hidden mb-20 ${isDark ? "bg-black" : "bg-zinc-50"}`}
      >
        <div className="absolute inset-0 pointer-events-none">
          <GridPattern
            className={`absolute inset-0 z-10 opacity-30 ${isDark ? "text-zinc-800" : "text-zinc-300"}`}
            mouseX={mouseX}
            mouseY={mouseY}
            isDark={isDark}
          />
          <div className={`absolute inset-0 bg-gradient-to-b ${isDark ? "from-transparent via-black/50 to-black" : "from-transparent via-white/50 to-zinc-50"}`} />
        </div>

        <div className="container mx-auto px-6 max-w-5xl relative z-20">
          <RevealSection className="text-center max-w-3xl mx-auto">
            <h1 className={`text-6xl md:text-8xl font-bold tracking-tighter mb-4 pb-4 bg-clip-text text-transparent bg-gradient-to-b ${isDark ? "from-white via-white to-white/40" : "from-zinc-900 via-zinc-800 to-zinc-500"}`}>
              Pricing
            </h1>
            <h2 className={`text-xl md:text-3xl mb-12 font-medium leading-relaxed max-w-2xl mx-auto space-y-4 ${isDark ? "text-white" : "text-zinc-900"}`}>
              <p><span className={isDark ? "text-zinc-400" : "text-zinc-500"}>Clear scope. Real execution.</span> No fluff</p>
            </h2>

            <GlowButton onClick={onOpenModal} primary isDark={isDark} className="px-10 py-4 text-lg">
              Run My Growth Audit
            </GlowButton>
          </RevealSection>
        </div>
      </section>

      <div className="container mx-auto px-6 max-w-5xl">

        {/* Philosophy Section */}
        <RevealSection className="max-w-3xl mx-auto mb-24">
          <div className={`p-8 md:p-12 border-y md:border rounded-3xl transition-colors duration-500 ${isDark ? "border-zinc-800 bg-zinc-900/20" : "border-zinc-200 bg-zinc-50/50"}`}>

            {/* Header */}
            <div className="text-center mb-10">
              <h2 className={`text-2xl md:text-3xl font-bold leading-tight mb-4 tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>
                We price based on what we own and deliver.
              </h2>
              <div className={`text-lg opacity-60 font-medium ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                You’ll always know:
              </div>
            </div>

            {/* The List - Minimal & Powerful */}
            <div className={`divide-y mb-10 ${isDark ? "divide-zinc-800" : "divide-zinc-200"}`}>
              {[
                "What’s included",
                "What’s not",
                "What the next step is"
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-4 first:pt-0">
                  <span className={`text-lg font-medium tracking-wide ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>{item}</span>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border ${isDark ? "border-zinc-800 text-zinc-400" : "border-zinc-300 text-zinc-500"}`}>
                    <Check size={14} strokeWidth={3} />
                  </div>
                </div>
              ))}
            </div>

            {/* Footer text */}
            <div className={`text-center flex flex-col md:flex-row justify-center gap-4 md:gap-8 text-sm font-medium opacity-50 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
              <span>No bundles designed to confuse.</span>
              <span className="hidden md:inline">•</span>
              <span>No “custom quote” smoke.</span>
            </div>

          </div>
        </RevealSection>



        {/* Entry Point */}
        <RevealSection delay={0.1} className="mb-24">
          <div className={`p-8 md:p-12 rounded-3xl border relative overflow-hidden ${isDark ? "bg-zinc-900/50 border-emerald-500/20" : "bg-white border-emerald-200 shadow-xl shadow-emerald-500/5"}`}>
            <div className="absolute hidden top-0 right-0 p-4">
              <span className={`px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase ${isDark ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-700"}`}>Entry Point</span>
            </div>

            <div className="flex flex-col md:flex-row gap-12 items-start">
              <div className="flex-1">
                <h2 className={`text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-zinc-900"}`}>End-to-End Diagnostic + Action Plan</h2>
                <p className="text-2xl font-mono text-emerald-500 mb-6">$350 one-time</p>
                <p className={`text-lg mb-8 ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>For teams who want clarity before committing to builds.</p>
                <div className={`space-y-4 mb-8 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                  <p>We review your system end to end and identify:</p>
                  <ul className="space-y-2 pl-4">
                    <li>• where leads leak</li>
                    <li>• what’s breaking under load</li>
                    <li>• what’s missing ownership</li>
                    <li>• what to fix first</li>
                  </ul>
                </div>
                <p className={`font-medium mb-8 ${isDark ? "text-white" : "text-zinc-900"}`}>You leave with a clear, prioritized roadmap, even if we never work together.</p>
                <div className={`text-sm mb-4 ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>No pitch. No obligation.</div>
                <p className={`text-sm italic mb-8 opacity-70 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Recommended if you’re unsure where the real bottleneck is.</p>
              </div>
              <div className="flex-1 flex hidden items-center justify-center w-full">
                <GlowButton onClick={onOpenModal} primary isDark={isDark} className="w-full md:w-auto text-lg px-12 py-4">Run My Growth Audit</GlowButton>
              </div>
            </div>
          </div>
        </RevealSection>

        <RevealSection className="text-center mb-24 max-w-4xl mx-auto">
          <p className={`text-xl md:text-2xl leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
            Some teams start with a diagnostic. Others come in with a clear scope. <br />
            <span className={isDark ? "text-white" : "text-zinc-900"}>Both are fine.</span>
          </p>
        </RevealSection>

        {/* Core Builds */}
        <div className="mb-24">
          <RevealSection className="mb-12">
            <h3 className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-zinc-900"}`}>Core Builds (One-Time)</h3>
            <p className={`text-lg mb-4 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>For teams who already know what they need built.</p>
          </RevealSection>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Landing Page */}
            <RevealSection delay={0.2} className={`p-8 rounded-3xl border flex flex-col h-full ${isDark ? "bg-zinc-900/30 border-white/5" : "bg-white border-zinc-200"}`}>
              <h4 className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-zinc-900"}`}>High-Conversion Landing Page</h4>
              <p className="text-xl font-mono text-emerald-500 mb-4">$500 – $800</p>
              <p className={`text-sm mb-6 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>For capturing and qualifying demand.</p>

              <div className={`flex-1 space-y-3 text-sm mb-8 ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>
                <p className="font-semibold mb-2">Includes:</p>
                <p>• conversion-focused structure</p>
                <p>• clean copy implementation</p>
                <p>• form or booking integration</p>
                <p>• basic tracking setup</p>
              </div>
              <div className={`pt-6 border-t mt-auto text-sm font-medium ${isDark ? "border-white/5 text-zinc-500" : "border-zinc-100 text-zinc-400"}`}>
                <p>Built to ship fast and actually convert.</p>
              </div>
            </RevealSection>

            {/* Website */}
            <RevealSection delay={0.3} className={`p-8 rounded-3xl border flex flex-col h-full ${isDark ? "bg-zinc-900/30 border-white/5" : "bg-white border-zinc-200"}`}>
              <h4 className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-zinc-900"}`}>Fully Functional Website</h4>
              <p className="text-xl font-mono text-emerald-500 mb-4">$1,200 – $1,800</p>
              <p className={`text-sm mb-6 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>For teams that need a proper foundation.</p>

              <div className={`flex-1 space-y-3 text-sm mb-8 ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>
                <p className="font-semibold mb-2">Includes:</p>
                <p>• multi-page website</p>
                <p>• mobile-first, fast loading</p>
                <p>• SEO-ready structure</p>
                <p>• clean handoff and documentation</p>
              </div>
              <div className={`pt-6 border-t mt-auto text-sm font-medium ${isDark ? "border-white/5 text-zinc-500" : "border-zinc-100 text-zinc-400"}`}>
                <p>Not a brochure.<br />A working asset.</p>
              </div>
            </RevealSection>

            {/* Funnels */}
            <RevealSection delay={0.4} className={`p-8 rounded-3xl border flex flex-col h-full ${isDark ? "bg-zinc-900/30 border-white/5" : "bg-white border-zinc-200"}`}>
              <h4 className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-zinc-900"}`}>Funnels & Booking Systems</h4>
              <p className="text-xl font-mono text-emerald-500 mb-4">$800 – $1,500</p>
              <p className={`text-sm mb-6 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>For routing traffic into booked calls.</p>

              <div className={`flex-1 space-y-3 text-sm mb-8 ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>
                <p className="font-semibold mb-2">Includes:</p>
                <p>• funnel flow design</p>
                <p>• lead capture + qualification</p>
                <p>• calendar and follow-up integration</p>
                <p>• end-to-end testing</p>
              </div>
              <div className={`pt-6 border-t mt-auto text-sm font-medium ${isDark ? "border-white/5 text-zinc-500" : "border-zinc-100 text-zinc-400"}`}>
                <p>No broken handoffs.<br />No “leads going nowhere.”</p>
              </div>
            </RevealSection>
          </div>
        </div>

        {/* Automation & Ongoing */}
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          {/* AI Systems */}
          <RevealSection delay={0.2} className={`p-10 rounded-3xl border relative overflow-hidden ${isDark ? "bg-zinc-900/50 border-emerald-500/20" : "bg-white border-emerald-200"}`}>
            <div className={`absolute inset-0 bg-gradient-to-br opacity-30 pointer-events-none ${isDark ? "from-emerald-500/10 to-transparent" : "from-emerald-100 to-transparent"}`} />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className={`text-2xl font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>AI & Automation Systems</h3>
                  <p className={`text-sm uppercase tracking-wider mt-1 ${isDark ? "text-emerald-500" : "text-emerald-600"}`}>Ongoing Ownership</p>
                </div>
              </div>
              <p className="text-3xl font-mono text-emerald-500 mb-6">$2,500 – $4,500 <span className="text-base font-sans text-zinc-500">/ month</span></p>
              <p className={`text-lg mb-8 ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>For teams that want the system running, not just built.</p>

              <div className={`space-y-3 mb-8 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                <p className="font-semibold text-white">Includes:</p>
                <ul className="space-y-2">
                  <li>• AI lead qualification</li>
                  <li>• CRM integration and scoring</li>
                  <li>• automated follow-ups</li>
                  <li>• AI voice or chat workflows (where applicable)</li>
                  <li>• system monitoring and improvements</li>
                </ul>
              </div>

              <div className={`pt-8 border-t space-y-4 ${isDark ? "border-white/10" : "border-zinc-200"}`}>
                <p className={`font-medium ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>This is not “AI tools setup.”<br />This is AI operating inside your business.</p>
                <p className={`text-sm ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Month-to-month.<br />We earn retention by keeping things working.</p>
              </div>
            </div>
          </RevealSection>

          {/* System Management */}
          <RevealSection delay={0.3} className={`p-10 rounded-3xl border flex flex-col justify-between ${isDark ? "bg-zinc-900/30 border-white/5" : "bg-white border-zinc-200"}`}>
            <div>
              <div className="mb-4">
                <h3 className={`text-2xl font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>System Management (Non-AI)</h3>
                <p className={`text-sm uppercase tracking-wider mt-1 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Optional Ongoing Support</p>
              </div>
              <p className="text-3xl font-mono text-zinc-400 mb-6">$1,500 – $3,000 <span className="text-base font-sans text-zinc-600">/ month</span></p>
              <p className={`text-lg mb-8 ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>For stability and continuous improvement.</p>

              <div className={`space-y-3 mb-8 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                <p className="font-semibold text-white">Includes:</p>
                <ul className="space-y-2">
                  <li>• monitoring and fixes</li>
                  <li>• performance stabilization</li>
                  <li>• small iterative improvements</li>
                  <li>• priority support when things break</li>
                </ul>
              </div>
            </div>
            <div className={`pt-8 border-t ${isDark ? "border-white/5" : "border-zinc-100"}`}>
              <p className={`font-medium ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>Growth should feel boring when it’s working.</p>
            </div>
          </RevealSection>
        </div>

        {/* Pricing Factors & Anti-Pitch */}
        <div className="grid md:grid-cols-2 gap-16 mb-24">
          {/* Factors */}
          <RevealSection delay={0.2}>
            <h3 className={`text-xl font-bold mb-6 ${isDark ? "text-white" : "text-zinc-900"}`}>What Determines Final Pricing</h3>
            <div className={`space-y-6 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
              <div>
                <p className={`text-sm uppercase tracking-wider mb-2 ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>Pricing depends on:</p>
                <ul className="space-y-1">
                  <li>• system complexity</li>
                  <li>• traffic volume</li>
                  <li>• number of integrations</li>
                  <li>• level of ongoing ownership required</li>
                </ul>
              </div>
              <div>
                <p className={`text-sm uppercase tracking-wider mb-2 ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>Not on:</p>
                <ul className="space-y-1">
                  <li>• hype</li>
                  <li>• urgency</li>
                  <li>• or how many tools you’ve duct-taped together</li>
                </ul>
              </div>
            </div>
          </RevealSection>

          {/* What We Don't Do */}
          <RevealSection delay={0.3}>
            <h3 className={`text-xl font-bold mb-6 ${isDark ? "text-white" : "text-zinc-900"}`}>What We Don’t Do</h3>
            <ul className={`space-y-3 mb-8 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
              <li className="flex items-center gap-3">
                <span className="text-red-500">×</span> One-off “quick fixes”
              </li>
              <li className="flex items-center gap-3">
                <span className="text-red-500">×</span> Cheap task work
              </li>
              <li className="flex items-center gap-3">
                <span className="text-red-500">×</span> Revenue guarantees
              </li>
              <li className="flex items-center gap-3">
                <span className="text-red-500">×</span> Micromanaged builds
              </li>
            </ul>
            <div className={`pl-4 border-l-2 ${isDark ? "border-zinc-800 text-zinc-300" : "border-zinc-200 text-zinc-600"}`}>
              <p className="font-medium">We’re not here to be another vendor.</p>
              <p className="font-medium">We’re here to own the system.</p>
            </div>
          </RevealSection>
        </div>

        {/* Risk Reversal & Working Principles */}
        <RevealSection delay={0.3} className={`mb-24 p-8 rounded-3xl border ${isDark ? "bg-zinc-900/30 border-white/5" : "bg-zinc-50 border-zinc-200"}`}>
          <h3 className={`text-xl font-bold mb-6 ${isDark ? "text-white" : "text-zinc-900"}`}>Working Principles</h3>
          <div className={`grid md:grid-cols-2 gap-x-12 gap-y-4 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${isDark ? "bg-zinc-500" : "bg-zinc-400"}`} />
                <span>If no meaningful opportunity to improve booked calls is found, we will say so.</span>
              </li>
              <li className="flex gap-3">
                <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${isDark ? "bg-zinc-500" : "bg-zinc-400"}`} />
                <span>We always present a clear roadmap before any build or implementation.</span>
              </li>
            </ul>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${isDark ? "bg-zinc-500" : "bg-zinc-400"}`} />
                <span>Nothing is executed automatically or unilaterally.</span>
              </li>
              <li className="flex gap-3">
                <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${isDark ? "bg-zinc-500" : "bg-zinc-400"}`} />
                <span>No work begins without your explicit approval of the plan.</span>
              </li>
            </ul>
          </div>
        </RevealSection>

        {/* Footer CTA */}
        <RevealSection className="text-center max-w-2xl mx-auto pt-16 border-t border-white/5">
          <h2 className={`text-3xl font-bold mb-6 ${isDark ? "text-white" : "text-zinc-900"}`}>How to Start</h2>
          <p className={`text-lg mb-8 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
            You don’t need to pick a package.<br />
            You start with a diagnosis.
          </p>
          <div className="flex flex-col items-center gap-4">
            <GlowButton onClick={onOpenModal} primary isDark={isDark} className="px-10 py-4 text-lg">Run My Growth Audit</GlowButton>
            <p className={`text-xs uppercase tracking-wider ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>We review a limited number of systems each week.</p>
          </div>

        </RevealSection>

      </div>
    </div>
  );
};

// --- Main App ---
export default function App() {
  const [isStrategyModalOpen, setIsStrategyModalOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [currentView, setCurrentView] = useState('home');

  useEffect(() => {
    document.body.style.backgroundColor = isDark ? '#000000' : '#ffffff';
    document.body.style.transition = 'background-color 1200ms ease-in-out';
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const navigateTo = (view) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAudit = () => navigateTo('audit');

  return (
    <div className={`font-sans antialiased selection:bg-emerald-500 selection:text-white transition-colors duration-[1200ms] ease-in-out ${isDark ? "bg-black text-zinc-100" : "bg-white text-zinc-900"}`}>
      <GrainOverlay />
      <NavBar onOpenModal={handleOpenAudit} onOpenStrategyModal={() => setIsStrategyModalOpen(true)} isDark={isDark} toggleTheme={toggleTheme} currentView={currentView} setCurrentView={setCurrentView} />

      <main>
        {currentView === 'home' ? (
          <>
            <Hero onOpenModal={handleOpenAudit} isDark={isDark} />
            <Manifesto onOpenModal={handleOpenAudit} isDark={isDark} />
            <LogoTicker isDark={isDark} />
            <Features onOpenModal={handleOpenAudit} isDark={isDark} />
            <Toolkit isDark={isDark} />

            {/* New Pricing Section */}
            {/* Enhanced Pricing Section */}
            <section id="pricing-philosophy" className={`py-40 relative transition-colors duration-[1200ms] ${isDark ? "bg-black" : "bg-zinc-50"}`}>
              <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                  {/* Left Column: Text Content and CTAs */}
                  <div className="order-1">
                    <RevealSection>
                      <h2 className={`text-4xl md:text-5xl font-bold mb-8 tracking-tighter ${isDark ? "text-white" : "text-zinc-900"}`}>
                        Pricing
                      </h2>
                      <p className={`text-xl md:text-2xl font-medium mb-12 ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>
                        What ownership looks like in practice
                      </p>

                      <div className={`space-y-8 text-lg md:text-xl leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                        <RevealSection delay={0.2}>
                          <p>
                            Pricing reflects the level of responsibility we take on, not a bundle of tasks.
                          </p>
                          <ul className="space-y-2 mt-4 font-medium">
                            <li>We don’t sell packages.</li>
                            <li>We don’t price by hours.</li>
                            <li className={isDark ? "text-white" : "text-zinc-900"}>And we don’t guess.</li>
                          </ul>
                        </RevealSection>

                        <RevealSection delay={0.3}>
                          <p>
                            Pricing is based on what needs to be owned, built, and run inside your system.
                          </p>
                        </RevealSection>

                        <RevealSection delay={0.4}>
                          <p>
                            Some teams only need a high-conversion landing page.<br />
                            Others need a full site, funnels, automation, and AI working together.
                          </p>
                        </RevealSection>

                        <RevealSection delay={0.5}>
                          <p className={`font-semibold ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                            That’s why pricing starts with diagnosis.
                          </p>
                        </RevealSection>

                        <RevealSection delay={0.6}>
                          <div className={`pt-8 border-t ${isDark ? "border-zinc-800" : "border-zinc-300"}`}>
                            <p>
                              The difference isn’t ambition.<br />
                              It’s system complexity.
                            </p>
                          </div>
                        </RevealSection>
                      </div>

                      {/* CTAs */}
                      <RevealSection delay={0.7} className="flex flex-col sm:flex-row gap-6 items-start sm:items-center mt-12">
                        <button
                          onClick={() => navigateTo('pricing')}
                          className={`group flex items-center gap-2 text-lg font-bold transition-all ${isDark ? "text-white hover:text-emerald-400" : "text-zinc-900 hover:text-emerald-600"}`}
                        >
                          <span>View Full Pricing</span>
                          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>

                        <GlowButton onClick={handleOpenAudit} primary isDark={isDark} className="px-8 py-4">
                          Run My Growth Audit →
                        </GlowButton>
                      </RevealSection>

                      <RevealSection delay={0.8}>
                        <p className={`mt-6 text-sm italic ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>
                          Limited systems reviewed each week.
                        </p>
                      </RevealSection>
                    </RevealSection>
                  </div>

                  {/* Right Column: Visual */}
                  <div className="order-2 relative h-full min-h-[500px]">
                    <RevealSection delay={0.3} className="relative w-full h-full">
                      <div className={`absolute inset-0 rounded-2xl overflow-hidden border ${isDark ? "border-white/10" : "border-zinc-200"}`}>
                        <motion.img
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 1.5 }}
                          src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=2070&auto=format&fit=crop"
                          alt="Structure and Complexity"
                          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-tr ${isDark ? "from-black/60 via-transparent to-transparent" : "from-white/30 via-transparent to-transparent"}`} />
                      </div>

                      {/* Floating Element - Engagement Model */}
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className={`absolute bottom-12 right-[-20px] md:right-auto md:left-[-40px] p-6 rounded-xl border backdrop-blur-md shadow-2xl min-w-[280px] ${isDark ? "bg-zinc-900/90 border-white/10" : "bg-white/90 border-zinc-200"}`}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                          <span className={`text-xs font-mono font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>ENGAGEMENT MODEL</span>
                        </div>

                        <div className="space-y-4">
                          <div className="flex justify-between items-center text-xs font-mono">
                            <span className="text-zinc-500">SCOPE DEFINITION</span>
                            <span className={isDark ? "text-white" : "text-black"}>100% FIXED</span>
                          </div>
                          <div className={`h-1 w-full rounded-full ${isDark ? "bg-zinc-800" : "bg-zinc-200"}`}>
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: "100%" }}
                              transition={{ duration: 1, delay: 0.8 }}
                              className="h-full rounded-full bg-emerald-500"
                            />
                          </div>

                          <div className="flex justify-between items-center text-xs font-mono pt-2 border-t border-white/5">
                            <span className="text-zinc-500">HIDDEN FEES</span>
                            <span className={isDark ? "text-white" : "text-black"}>0%</span>
                          </div>
                        </div>
                      </motion.div>
                    </RevealSection>
                  </div>
                </div>
              </div>
            </section>

            <ProcessBridge onClick={() => navigateTo('how-it-works')} isDark={isDark} />

            <section className={`border-y py-16 overflow-hidden relative flex items-center justify-center transition-colors duration-[1200ms] ${isDark ? "bg-zinc-950 border-white/5" : "bg-zinc-50 border-zinc-200"}`}>
              <div className="w-full overflow-hidden transform -rotate-0">
                <motion.div
                  className={`whitespace-nowrap text-[6rem] md:text-[10rem] w-max font-black uppercase tracking-tighter select-none flex items-center ${isDark ? "text-transparent stroke-white" : "text-transparent stroke-black"}`}
                  style={{
                    WebkitTextStroke: isDark ? "2px rgba(255,255,255,0.2)" : "2px rgba(0,0,0,0.1)",
                  }}
                  animate={{ x: "-50%" }}
                  initial={{ x: "0%" }}
                  transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                >
                  <span className="px-8"> SLEEP WHILE YOU SCALE • OWN YOUR FREEDOM • THE FUTURE IS AUTOMATED • JOIN THE 1% • ARCHITECT YOUR FREEDOM • BUILD SYSTEMS • BREAK RECORDS • REPEAT • </span>
                  <span className="px-8"> SLEEP WHILE YOU SCALE • OWN YOUR FREEDOM • THE FUTURE IS AUTOMATED • JOIN THE 1% • ARCHITECT YOUR FREEDOM • BUILD SYSTEMS • BREAK RECORDS • REPEAT • </span>
                </motion.div>
              </div>
              <div className={`absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-transparent to-transparent ${isDark ? "via-zinc-950/0" : "via-zinc-50/0"}`} />
            </section>


            <section className={`py-40 text-center relative overflow-hidden transition-colors duration-[1200ms] ${isDark ? "bg-zinc-950" : "bg-white"}`}>
              <div className={`absolute inset-0 bg-[size:32px_32px] pointer-events-none transition-all duration-[1200ms] ${isDark ? "bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)]" : "bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)]"}`}></div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-emerald-500/5 pointer-events-none" />

              <div className="container mx-auto px-6 relative z-10">
                <RevealSection>
                  <h2 className={`text-6xl md:text-8xl font-bold mb-8 tracking-tighter ${isDark ? "text-white" : "text-zinc-900"}`}>
                    Ready for <br /> <span className="text-zinc-500">Hypergrowth?</span>
                  </h2>
                  <p className="text-zinc-500 text-xl mb-12 max-w-xl mx-auto">Stop managing your business manually. Build a system that captures revenue while you sleep.</p>
                  <GlowButton onClick={handleOpenAudit} primary isDark={isDark} className="px-8 py-4 text-lg md:px-12 md:py-5 md:text-xl">
                    Initialize Strategy Sequence
                  </GlowButton>
                </RevealSection>
              </div>
            </section>
          </>
        ) : currentView === 'how-it-works' ? (
          <HowItWorksPage onOpenModal={handleOpenAudit} isDark={isDark} />
        ) : currentView === 'pricing' ? (
          <PricingPage onOpenModal={handleOpenAudit} isDark={isDark} />
        ) : (
          <GrowthAuditPage onOpenModal={handleOpenAudit} onOpenStrategyModal={() => setIsStrategyModalOpen(true)} isDark={isDark} />
        )}
      </main>

      <Footer isDark={isDark} />

      <StrategyModal
        isOpen={isStrategyModalOpen}
        onClose={() => setIsStrategyModalOpen(false)}
        isDark={isDark}
        onNavigateToAudit={() => { setIsStrategyModalOpen(false); navigateTo('audit'); }}
      />

      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: 'spring' }}
        onClick={() => setIsStrategyModalOpen(true)}
        className={`fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-2xl border md:hidden hover:scale-110 transition-transform duration-500 ${isDark ? "bg-zinc-900 text-white border-white/10" : "bg-white text-zinc-900 border-zinc-200"}`}
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>
    </div>
  );
}
