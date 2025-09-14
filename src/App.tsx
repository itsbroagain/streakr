import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useScroll, useTransform } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { createClient } from '@supabase/supabase-js';
import * as THREE from 'three';

// ===========================================
// SUPABASE CONFIGURATION
// ===========================================

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// ===========================================
// EMAIL SERVICE CLASS
// ===========================================

class EmailService {
  static async submitEmail(emailData: {
    email: string;
    source: string;
    metadata?: any;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Submitting email to Supabase:', emailData);
      
      const { error } = await supabase
        .from('email_signups')
        .insert([{
          email: emailData.email,
          source: emailData.source,
          metadata: emailData.metadata || {},
          created_at: new Date().toISOString()
        }]);

      if (error) {
        console.error('Supabase error:', error);
        
        if (error.code === '23505') {
          return { success: false, error: 'Email already registered!' };
        }
        
        return { success: false, error: error.message };
      }

      console.log('Email submitted successfully');
      return { success: true };
      
    } catch (error: any) {
      console.error('Email submission error:', error);
      return { success: false, error: 'Failed to submit email. Please try again.' };
    }
  }
}

// ===========================================
// EMAIL SIGNUP HOOK
// ===========================================

const useEmailSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitEmail = useCallback(async (email: string, source = 'hero') => {
    setIsLoading(true);
    setError(null);
    
    const result = await EmailService.submitEmail({
      email,
      source,
      metadata: {
        tier: 'founding_streaker',
        benefits: {
          premium_months_free: 3,
          badge: 'founding_streaker',
          early_access: true
        },
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        referrer: document.referrer
      }
    });

    setIsLoading(false);
    
    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || 'Something went wrong');
    }

    return result;
  }, []);

  const resetState = useCallback(() => {
    setSuccess(false);
    setError(null);
  }, []);

  return { submitEmail, isLoading, success, error, resetState };
};

// ===========================================
// 3D COMPONENTS
// ===========================================

const FloatingIcons: React.FC = () => {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  const icons = useMemo(() => ['💪', '📚', '🧘', '💧', '🏃', '🎯'], []);
  
  return (
    <group ref={meshRef}>
      {icons.map((_, index) => {
        const angle = (index / icons.length) * Math.PI * 2;
        const radius = 3;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        return (
          <mesh key={index} position={[x, Math.sin(index * 2) * 0.5, z]}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial 
              color="#6C5CE7" 
              opacity={0.8} 
              transparent 
              emissive="#6C5CE7" 
              emissiveIntensity={0.2}
            />
          </mesh>
        );
      })}
    </group>
  );
};

const ParticleField: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const positions = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.005;
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#6C5CE7"
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
};

// ===========================================
// MOUSE PARALLAX HOOK
// ===========================================

const useMouseParallax = (strength: number = 0.05) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springX = useSpring(x, { damping: 25, stiffness: 700, mass: 0.5 });
  const springY = useSpring(y, { damping: 25, stiffness: 700, mass: 0.5 });

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      x.set((e.clientX - centerX) * strength);
      y.set((e.clientY - centerY) * strength);
    };

    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, [x, y, strength]);

  return { x: springX, y: springY };
};

// ===========================================
// INTERACTIVE HABIT DEMO
// ===========================================

const InteractiveHabitDemo: React.FC = () => {
  const [habits, setHabits] = useState([
    { id: 1, name: 'Morning Run', completed: false, streak: 7, icon: '🏃' },
    { id: 2, name: 'Read 30min', completed: true, streak: 12, icon: '📚' },
    { id: 3, name: 'Meditate', completed: false, streak: 3, icon: '🧘' },
    { id: 4, name: 'Drink Water', completed: true, streak: 5, icon: '💧' },
  ]);

  const toggleHabit = useCallback((id: number) => {
    setHabits(prev => prev.map(habit => 
      habit.id === id 
        ? { 
            ...habit, 
            completed: !habit.completed, 
            streak: !habit.completed ? habit.streak + 1 : Math.max(0, habit.streak - 1)
          }
        : habit
    ));
  }, []);

  const completedCount = useMemo(() => habits.filter(h => h.completed).length, [habits]);
  const totalStreak = useMemo(() => habits.reduce((sum, h) => sum + h.streak, 0), [habits]);

  return (
    <div className="glass-effect rounded-2xl p-6 max-w-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-lg font-semibold">Try It Live!</h3>
        <div className="text-sm text-success-green font-medium">
          {completedCount}/{habits.length} today
        </div>
      </div>
      
      <div className="space-y-3 mb-4">
        {habits.map(habit => (
          <motion.div
            key={habit.id}
            className="flex items-center justify-between p-3 glass-effect rounded-lg cursor-pointer hover:bg-white/10 transition-all"
            whileTap={{ scale: 0.98 }}
            onClick={() => toggleHabit(habit.id)}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                habit.completed 
                  ? 'bg-success-green border-success-green' 
                  : 'border-white/40 hover:border-white/60'
              }`}>
                {habit.completed && <span className="text-white text-sm">✓</span>}
              </div>
              <div>
                <span className="text-white">{habit.name}</span>
                <div className="text-xs text-white/60">{habit.icon}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-orange-400">🔥</span>
              <span className="text-white text-sm font-medium">{habit.streak}</span>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="glass-effect rounded-lg p-3 text-center">
        <div className="text-brand-purple text-xl font-bold">{totalStreak}</div>
        <div className="text-white/60 text-xs">Total Streak Days</div>
      </div>
    </div>
  );
};

// ===========================================
// GITHUB STYLE HEATMAP
// ===========================================

const ActivityHeatmap: React.FC = () => {
  const generateData = useCallback(() => {
    const data = [];
    const today = new Date();
    
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        count: Math.floor(Math.random() * 5),
        level: Math.floor(Math.random() * 5)
      });
    }
    return data;
  }, []);

  const [activityData] = useState(generateData);
  
  const getLevelColor = useCallback((level: number) => {
    const colors = ['#1e293b', '#0f766e', '#059669', '#10b981', '#34d399'];
    return colors[level] || colors[0];
  }, []);

  return (
    <div className="glass-effect rounded-2xl p-6 max-w-2xl">
      <h3 className="text-white text-lg font-semibold mb-4">Beta Tester Activity</h3>
      
      <div className="grid grid-cols-52 gap-1 mb-4">
        {activityData.map((day, index) => (
          <motion.div
            key={index}
            className="w-3 h-3 rounded-sm cursor-pointer"
            style={{ backgroundColor: getLevelColor(day.level) }}
            whileHover={{ scale: 1.2 }}
            title={`${day.date}: ${day.count} habits completed`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.001, duration: 0.2 }}
          />
        ))}
      </div>
      
      <div className="flex items-center justify-between text-xs text-white/60">
        <span>Less</span>
        <div className="flex space-x-1">
          {[0, 1, 2, 3, 4].map(level => (
            <div
              key={level}
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: getLevelColor(level) }}
            />
          ))}
        </div>
        <span>More</span>
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-success-green text-xl font-bold">1,247</div>
          <div className="text-white/60 text-xs">Total Habits</div>
        </div>
        <div>
          <div className="text-brand-purple text-xl font-bold">89%</div>
          <div className="text-white/60 text-xs">Success Rate</div>
        </div>
        <div>
          <div className="text-orange-400 text-xl font-bold">42</div>
          <div className="text-white/60 text-xs">Avg Streak</div>
        </div>
      </div>
    </div>
  );
};

// ===========================================
// REAL-TIME SIGNUP COUNTER
// ===========================================

const SignupCounter: React.FC = () => {
  const [foundingMembers, setFoundingMembers] = useState(247);
  const [totalSignups, setTotalSignups] = useState(1247);
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setFoundingMembers(prev => Math.min(prev + 1, 500));
        setTotalSignups(prev => prev + Math.floor(Math.random() * 3) + 1);
      }
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4 max-w-md">
      <motion.div
        key={foundingMembers}
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center p-4 glass-effect rounded-xl"
      >
        <div className="text-2xl font-bold text-brand-purple">{foundingMembers}/500</div>
        <div className="text-sm text-white/60">Founding Streakers</div>
        <div className="flex justify-center items-center mt-2">
          <div className="w-2 h-2 bg-brand-purple rounded-full animate-pulse mr-2"></div>
          <span className="text-xs text-brand-purple">Limited Spots</span>
        </div>
      </motion.div>
      
      <div className="text-center p-4 glass-effect rounded-xl">
        <div className="text-2xl font-bold text-white">{totalSignups.toLocaleString()}</div>
        <div className="text-sm text-white/60">Total Signups</div>
        <div className="flex justify-center items-center mt-2">
          <div className="w-2 h-2 bg-success-green rounded-full animate-pulse mr-2"></div>
          <span className="text-xs text-success-green">Live</span>
        </div>
      </div>
    </div>
  );
};

// ===========================================
// EXIT INTENT POPUP
// ===========================================

const ExitIntentPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const { submitEmail, isLoading, success, error } = useEmailSignup();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    await submitEmail(email, 'exit_intent');
    if (success) {
      setTimeout(() => onClose(), 3000);
    }
  }, [email, submitEmail, success, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="glass-effect rounded-3xl p-8 max-w-md w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl transition-colors"
        >
          ×
        </button>
        
        {success ? (
          <div className="text-center">
            <motion.div 
              className="text-6xl mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
            >
              🏆
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-4">Welcome, Founding Streaker!</h2>
            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-3 text-white/90">
                <span className="text-success-green">✓</span>
                <span>3 months Premium Plan - FREE</span>
              </div>
              <div className="flex items-center space-x-3 text-white/90">
                <span className="text-brand-purple">✓</span>
                <span>Exclusive "Founding Streaker" badge</span>
              </div>
              <div className="flex items-center space-x-3 text-white/90">
                <span className="text-blue-400">✓</span>
                <span>Priority early access to all features</span>
              </div>
            </div>
            <p className="text-white/60 mt-6 text-sm">
              Check your email for next steps. You're part of something special!
            </p>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-4xl mb-4">🚀</div>
            <h2 className="text-2xl font-bold text-white mb-2">Become a Founding Streaker</h2>
            <p className="text-white/70 mb-6">
              Join our exclusive founding members and get premium features before anyone else.
            </p>
            
            <div className="glass-effect rounded-2xl p-4 mb-6 text-left">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-success-green/20 rounded-full flex items-center justify-center">
                    <span className="text-success-green text-sm font-bold">3mo</span>
                  </div>
                  <div>
                    <div className="text-white font-medium">Premium Plan FREE</div>
                    <div className="text-white/60 text-sm">All advanced features unlocked</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-brand-purple/20 rounded-full flex items-center justify-center">
                    <span className="text-brand-purple text-sm">👑</span>
                  </div>
                  <div>
                    <div className="text-white font-medium">Founding Streaker Badge</div>
                    <div className="text-white/60 text-sm">Exclusive status in the community</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <span className="text-blue-400 text-sm">⚡</span>
                  </div>
                  <div>
                    <div className="text-white font-medium">Priority Access</div>
                    <div className="text-white/60 text-sm">First to get new features</div>
                  </div>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 glass-effect rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-brand-purple"
              />
              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full px-6 py-3 bg-gradient-to-r from-brand-purple to-purple-600 text-white font-semibold rounded-xl hover:scale-105 transition-all duration-200 disabled:opacity-50"
              >
                {isLoading ? 'Securing Your Spot...' : 'Become a Founding Streaker'}
              </button>
            </form>
            
            {error && (
              <motion.p
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-red-400 text-sm mt-2"
              >
                {error}
              </motion.p>
            )}
            
            <p className="text-xs text-white/50 mt-4">
              Limited founding member spots • No spam, unsubscribe anytime
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

// ===========================================
// MAIN APP COMPONENT
// ===========================================

function App() {
  const [email, setEmail] = useState('');
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [hasSeenExitPopup, setHasSeenExitPopup] = useState(false);
  const { submitEmail, isLoading, success, error, resetState } = useEmailSignup();
  
  // Mouse parallax
  const mouseParallax = useMouseParallax(0.03);
  
  // Scroll progress
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  // Exit intent detection
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasSeenExitPopup && !success) {
        setShowExitPopup(true);
        setHasSeenExitPopup(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasSeenExitPopup, success]);

  const handleHeroSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    await submitEmail(email, 'hero_form');
    if (success) {
      setEmail('');
    }
  }, [email, submitEmail, success]);

  const handleNewSignup = useCallback(() => {
    resetState();
    setEmail('');
  }, [resetState]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-deep via-elevated-surface to-cosmic-deep">
      
      {/* 3D Background */}
      <div className="fixed inset-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={0.5} />
          <FloatingIcons />
          <ParticleField />
        </Canvas>
      </div>

      {/* Animated Background Elements */}
      <motion.div 
        className="fixed inset-0 overflow-hidden pointer-events-none"
        style={{ y: backgroundY }}
      >
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/5 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
            }}
            animate={{
              y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000)],
              x: [null, Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000)],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear"
            }}
          />
        ))}
        
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-purple/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-success-green/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10">
        
        {/* Navigation */}
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/10"
        >
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <motion.div 
              className="text-2xl font-bold gradient-text"
              style={{ x: mouseParallax.x, y: mouseParallax.y }}
            >
              LoopedIn
            </motion.div>
            
            <div className="flex items-center space-x-6">
              <a href="#features" className="text-white/70 hover:text-white transition-colors">Features</a>
              <a href="#demo" className="text-white/70 hover:text-white transition-colors">Demo</a>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 glass-effect rounded-full text-white border border-brand-purple hover:bg-brand-purple/20 transition-all"
                onClick={() => document.getElementById('hero-signup')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Join Waitlist
              </motion.button>
            </div>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-6 pt-20">
          <div className="max-w-6xl mx-auto text-center">
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="mb-8"
            >
              <div className="inline-flex items-center space-x-2 glass-effect rounded-full px-6 py-3 mb-8">
                <div className="w-2 h-2 bg-success-green rounded-full animate-pulse"></div>
                <span className="text-white/80 text-sm">Beta launching soon • Join 1,000+ early users</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-6xl md:text-8xl font-black mb-6"
              style={{ x: mouseParallax.x, y: mouseParallax.y }}
            >
              <span className="gradient-text">Build Habits</span>
              <br />
              <span className="text-white">That Actually</span>
              <br />
              <span className="text-white">Stick</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto mb-12 leading-relaxed"
            >
              The only habit tracker that adapts to your lifestyle. Smart streaks, 
              AI-powered insights, and a community that celebrates your progress.
            </motion.p>

            {/* Signup Form */}
            <motion.div
              id="hero-signup"
              initial={{ opacity:0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="max-w-lg mx-auto mb-16"
            >
              {success ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="glass-effect rounded-2xl p-8 text-center"
                >
                  <motion.div 
                    className="text-6xl mb-4"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                  >
                    🎉
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white mb-4">Welcome, Founding Streaker!</h2>
                  <div className="space-y-3 text-left mb-6">
                    <div className="flex items-center space-x-3 text-white/90">
                      <span className="text-success-green">✓</span>
                      <span>3 months Premium Plan - FREE</span>
                    </div>
                    <div className="flex items-center space-x-3 text-white/90">
                      <span className="text-brand-purple">✓</span>
                      <span>Exclusive "Founding Streaker" badge</span>
                    </div>
                    <div className="flex items-center space-x-3 text-white/90">
                      <span className="text-blue-400">✓</span>
                      <span>Priority early access to all features</span>
                    </div>
                  </div>
                  <button
                    onClick={handleNewSignup}
                    className="text-brand-purple hover:text-brand-purple/80 text-sm underline"
                  >
                    Sign up another email
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleHeroSubmit} className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    placeholder="Enter your email for early access"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 px-6 py-4 glass-effect rounded-xl text-white placeholder-white/60 text-lg focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  />
                  <motion.button
                    type="submit"
                    disabled={isLoading || !email}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-gradient-to-r from-brand-purple to-purple-600 text-white font-semibold rounded-xl text-lg hover:shadow-2xl hover:shadow-brand-purple/25 transition-all duration-200 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Joining...</span>
                      </div>
                    ) : (
                      'Become a Founding Streaker'
                    )}
                  </motion.button>
                </form>
              )}
              
              {error && (
                <motion.p
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-red-400 text-center mt-4"
                >
                  {error}
                </motion.p>
              )}
            </motion.div>

            {/* Live Counter */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="flex justify-center"
            >
              <SignupCounter />
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Why <span className="gradient-text">LoopedIn</span> Works
              </h2>
              <p className="text-xl text-white/70 max-w-3xl mx-auto">
                Built by habit researchers, powered by AI, and designed for real humans with real lives.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: '🧠',
                  title: 'AI-Powered Insights',
                  description: 'Our AI analyzes your patterns and suggests optimal times, rewards, and strategies personalized just for you.',
                  color: 'brand-purple'
                },
                {
                  icon: '🔥',
                  title: 'Smart Streaks',
                  description: 'Flexible streaks that account for life. Miss a day? Our algorithm helps you bounce back stronger.',
                  color: 'success-green'
                },
                {
                  icon: '👥',
                  title: 'Community Power',
                  description: 'Join accountability groups, celebrate wins together, and learn from others on similar journeys.',
                  color: 'blue-400'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  className="glass-effect rounded-2xl p-8 text-center group hover:bg-white/10 transition-all duration-300"
                >
                  <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className={`text-2xl font-bold text-${feature.color} mb-4`}>
                    {feature.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Demo Section */}
        <section id="demo" className="py-32 px-6 bg-gradient-to-r from-cosmic-deep/50 to-elevated-surface/50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                See It In <span className="gradient-text">Action</span>
              </h2>
              <p className="text-xl text-white/70 max-w-3xl mx-auto">
                Don't just read about it. Experience the magic of habit tracking that actually works.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <InteractiveHabitDemo />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div className="glass-effect rounded-2xl p-6">
                  <h3 className="text-2xl font-bold text-white mb-4">Real-Time Tracking</h3>
                  <p className="text-white/70 mb-4">
                    Click the habits above to see how our smart streak system works. 
                    Notice how it celebrates your wins and keeps you motivated.
                  </p>
                  <div className="flex items-center space-x-2 text-success-green">
                    <span className="w-2 h-2 bg-success-green rounded-full animate-pulse"></span>
                    <span className="text-sm">Live demo - try clicking!</span>
                  </div>
                </div>

                <div className="glass-effect rounded-2xl p-6">
                  <h3 className="text-2xl font-bold text-white mb-4">Smart Analytics</h3>
                  <p className="text-white/70 mb-4">
                    Every interaction provides insights. Our AI learns your patterns 
                    and suggests the best times and strategies for success.
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-brand-purple">92%</div>
                      <div className="text-xs text-white/60">Success Rate</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-success-green">14</div>
                      <div className="text-xs text-white/60">Avg Streak</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-400">3.2x</div>
                      <div className="text-xs text-white/60">Improvement</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Activity Heatmap Section */}
        <section className="py-32 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Your Progress, <span className="gradient-text">Visualized</span>
              </h2>
              <p className="text-xl text-white/70 max-w-3xl mx-auto">
                See your habit journey unfold with beautiful, motivating visualizations 
                that celebrate every step of your progress.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <ActivityHeatmap />
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-32 px-6 bg-gradient-to-r from-elevated-surface/30 to-cosmic-deep/30">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Loved by <span className="gradient-text">Thousands</span>
              </h2>
              <p className="text-xl text-white/70">
                Real stories from real people building better lives.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Sarah Chen',
                  role: 'Product Designer',
                  content: 'Finally, a habit tracker that gets it. The AI suggestions actually work, and I\'ve maintained my meditation streak for 3 months!',
                  avatar: '👩‍💻',
                  rating: 5
                },
                {
                  name: 'Marcus Johnson',
                  role: 'Fitness Coach',
                  content: 'The community aspect is game-changing. My clients are more motivated than ever, and the streak flexibility keeps them consistent.',
                  avatar: '💪',
                  rating: 5
                },
                {
                  name: 'Elena Rodriguez',
                  role: 'Busy Mom',
                  content: 'With three kids, I thought habit tracking was impossible. LoopedIn adapts to my chaos and celebrates small wins. Life-changing!',
                  avatar: '👩‍👧‍👦',
                  rating: 5
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="glass-effect rounded-2xl p-8"
                >
                  <div className="flex items-center mb-4">
                    <div className="text-4xl mr-4">{testimonial.avatar}</div>
                    <div>
                      <h4 className="text-white font-semibold">{testimonial.name}</h4>
                      <p className="text-white/60 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">⭐</span>
                    ))}
                  </div>
                  
                  <p className="text-white/80 italic">"{testimonial.content}"</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-32 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-7xl font-bold text-white mb-8">
                Your Best Self is
                <br />
                <span className="gradient-text">One Habit Away</span>
              </h2>
              
              <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
                Join the exclusive founding members program and get premium features 
                before anyone else. Limited spots available.
              </p>

              <div className="glass-effect rounded-3xl p-8 mb-12 max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-white mb-6">Founding Streaker Benefits</h3>
                <div className="grid md:grid-cols-2 gap-6 text-left">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-success-green rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-xs font-bold">3</span>
                    </div>
                    <div>
                      <div className="text-white font-medium">3 Months Premium FREE</div>
                      <div className="text-white/60 text-sm">Full access to all premium features</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-brand-purple rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-xs">👑</span>
                    </div>
                    <div>
                      <div className="text-white font-medium">Founding Streaker Badge</div>
                      <div className="text-white/60 text-sm">Exclusive status in the community</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-xs">⚡</span>
                    </div>
                    <div>
                      <div className="text-white font-medium">Priority Early Access</div>
                      <div className="text-white/60 text-sm">First to get new features and updates</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-xs">💬</span>
                    </div>
                    <div>
                      <div className="text-white font-medium">Direct Founder Access</div>
                      <div className="text-white/60 text-sm">Shape the future of LoopedIn</div>
                    </div>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('hero-signup')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-12 py-6 bg-gradient-to-r from-brand-purple to-purple-600 text-white font-bold rounded-2xl text-xl hover:shadow-2xl hover:shadow-brand-purple/25 transition-all duration-200"
              >
                Secure My Founding Streaker Spot
              </motion.button>

              <p className="text-white/50 text-sm mt-6">
                Only 500 founding member spots available • No spam, unsubscribe anytime
              </p>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16 px-6 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              <div className="col-span-2">
                <div className="text-3xl font-bold gradient-text mb-4">LoopedIn</div>
                <p className="text-white/60 mb-6 max-w-md">
                  The habit tracker that adapts to your life. Built by researchers, 
                  powered by AI, designed for humans.
                </p>
                <div className="flex space-x-4">
                  {['Twitter', 'LinkedIn', 'GitHub'].map((social) => (
                    <motion.div
                      key={social}
                      whileHover={{ scale: 1.1 }}
                      className="w-10 h-10 glass-effect rounded-full flex items-center justify-center cursor-pointer hover:bg-white/10 transition-all"
                    >
                      <span className="text-white/60 text-sm">{social[0]}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-4">Product</h4>
                <div className="space-y-2">
                  {['Features', 'Pricing', 'API', 'Security'].map((item) => (
                    <div key={item} className="text-white/60 hover:text-white cursor-pointer transition-colors">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-4">Company</h4>
                <div className="space-y-2">
                  {['About', 'Blog', 'Careers', 'Contact'].map((item) => (
                    <div key={item} className="text-white/60 hover:text-white cursor-pointer transition-colors">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-white/50 text-sm">
                © 2024 LoopedIn. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                {['Privacy', 'Terms', 'Cookies'].map((item) => (
                  <div key={item} className="text-white/50 hover:text-white text-sm cursor-pointer transition-colors">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Exit Intent Popup */}
      <AnimatePresence>
        {showExitPopup && (
          <ExitIntentPopup onClose={() => setShowExitPopup(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;