
import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Moon, 
  Sun, 
  ChevronRight, 
  Github, 
  Linkedin, 
  Twitter, 
  Mail,
  ArrowRight,
  ExternalLink,
  Code2,
  CheckCircle2,
  Copy,
  ChevronUp,
  Smartphone,
  Rocket
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { PROJECTS, SKILLS, TESTIMONIALS, SERVICES } from './constants';

// --- Shared Framer Motion Variants ---
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// --- Reusable Components ---

const SectionHeader = ({ title, subtitle, badge }: { title: string; subtitle: string; badge?: string }) => (
  <div className="mb-16 text-center">
    {badge && (
      <motion.span 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-4 inline-block"
      >
        {badge}
      </motion.span>
    )}
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6"
    >
      {title}
    </motion.h2>
    <motion.div 
      initial={{ width: 0 }}
      whileInView={{ width: 80 }}
      viewport={{ once: true }}
      className="h-1.5 bg-blue-600 mx-auto mb-6 rounded-full"
    />
    <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
      {subtitle}
    </p>
  </div>
);

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'All' | 'Mobile' | 'Web' | 'Desktop'>('All');
  const [scrolled, setScrolled] = useState(false);
  const [copied, setCopied] = useState(false);

  // User details
  const userName = "Md. Ziaul Haque";
  const userShortName = "Ziaul";
  // Placeholder representing the user's uploaded image (South Asian male in striped polo)
  const profileImageUrl = "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=800&auto=format&fit=crop";

  // Scroll Progress Bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const copyEmail = () => {
    navigator.clipboard.writeText("ziaul@haque.dev");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const navLinks = [
    { name: 'About', id: 'about' },
    { name: 'Skills', id: 'skills' },
    { name: 'Projects', id: 'projects' },
    { name: 'Services', id: 'services' },
    { name: 'Contact', id: 'contact' },
  ];

  // Robust Navbar Scroll Handler - Fix for "Navbar not working"
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const navHeight = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-600 selection:text-white transition-colors duration-500 overflow-x-hidden">
      
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-blue-600 z-[60] origin-left" 
        style={{ scaleX }}
      />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 py-2' : 'bg-transparent py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 group cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="w-11 h-11 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-6 transition-transform">
                <Code2 className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{userShortName}<span className="text-blue-600">.</span></span>
            </motion.div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-10">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.id)}
                  className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-widest cursor-pointer"
                >
                  {link.name}
                </button>
              ))}
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2" />
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>

            {/* Mobile Toggle */}
            <div className="flex items-center gap-4 md:hidden">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-slate-600 dark:text-slate-400"
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              <div className="px-6 pt-4 pb-8 space-y-2">
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => scrollToSection(link.id)}
                    className="w-full text-left block px-4 py-5 text-lg font-bold text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-2xl transition-all"
                  >
                    {link.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main>
        {/* Hero Section */}
        <section id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
             <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />
             <div className="absolute bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="text-left">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-bold mb-8 border border-blue-500/20"
                >
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                  </span>
                  Available for High-Scale Flutter Projects
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-6xl md:text-8xl font-black tracking-tight text-slate-900 dark:text-white mb-8 leading-[1.1]"
                >
                  Building the <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600">Future of Mobile.</span>
                </motion.h1>

                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-xl mb-12 leading-relaxed font-medium"
                >
                  I'm <span className="text-slate-900 dark:text-white font-black">{userName}</span>. A Senior Flutter Developer with 5+ years of experience crafting exceptional mobile experiences.
                </motion.p>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col sm:flex-row items-center gap-5"
                >
                  <button onClick={() => scrollToSection('projects')} className="w-full sm:w-auto px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-2xl shadow-blue-500/30 transition-all flex items-center justify-center gap-3 group text-center">
                    Explore My Portfolio
                    <ArrowRight size={22} className="group-hover:translate-x-1.5 transition-transform" />
                  </button>
                  <button onClick={() => scrollToSection('contact')} className="w-full sm:w-auto px-10 py-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-800 rounded-2xl font-black hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-3 text-center">
                    Let's Chat
                  </button>
                </motion.div>
              </div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="hidden lg:block relative"
              >
                <div className="relative z-10 p-6 bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800">
                  <div className="rounded-[2.5rem] overflow-hidden bg-slate-100 dark:bg-slate-800 aspect-[4/5] flex items-center justify-center relative">
                    <img 
                      src={profileImageUrl} 
                      alt={userName} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-blue-600/10 mix-blend-multiply" />
                  </div>
                </div>
                <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[3.5rem] -z-10 blur opacity-20" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* About Me Section */}
        <section id="about" className="py-32 bg-white dark:bg-slate-900 relative scroll-mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-24 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl group border-8 border-slate-50 dark:border-slate-800">
                  <img 
                    src={profileImageUrl} 
                    alt={userName} 
                    className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-blue-600/5 mix-blend-overlay group-hover:bg-transparent transition-all" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <SectionHeader 
                  badge="The Architect"
                  title="Professional Flutter Developer"
                  subtitle=""
                />
                <div className="-mt-12">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Who is {userShortName}?</h3>
                  <p className="text-xl text-slate-700 dark:text-slate-300 mb-8 leading-relaxed font-medium">
                    I am <span className="text-blue-600 font-bold">{userName}</span>, a dedicated Flutter developer focused on high-performance mobile apps.
                  </p>
                  <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
                    With over 5 years of professional experience, I have successfully launched multiple high-scale apps across iOS and Android. I believe in clean code, modular architecture (Bloc/Riverpod), and providing a seamless user experience that matches native performance.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                    {[
                      "Expert Flutter & Dart",
                      "Scalable Backend Integration",
                      "CI/CD Implementation",
                      "Complex UI/UX Animations",
                      "State Management (Bloc/Riverpod)",
                      "API & Service Integration"
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="text-blue-600 shrink-0" size={20} />
                        <span className="font-bold text-slate-700 dark:text-slate-300">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <button className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black transition-all hover:scale-105 active:scale-95 text-center">
                      Download Resume
                    </button>
                    <div className="flex gap-2">
                      {[Github, Linkedin, Twitter].map((Icon, i) => (
                        <a key={i} href="#" className="p-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                          <Icon size={24} />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-32 bg-slate-50 dark:bg-slate-950 relative overflow-hidden scroll-mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader 
              badge="Expertise"
              title="Toolbox & Skills" 
              subtitle="The modern tech stack I leverage to build robust, scalable, and high-performance applications."
            />

            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {SKILLS.map((skill) => (
                <motion.div
                  key={skill.name}
                  variants={fadeInUp}
                  className="group bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 hover:shadow-2xl hover:shadow-blue-500/10 transition-all hover:-translate-y-2"
                >
                  <div className="flex justify-between items-end mb-6">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl group-hover:bg-blue-600 transition-colors">
                      <Code2 className="text-blue-600 dark:text-blue-400 group-hover:text-white" size={32} />
                    </div>
                    <div className="text-sm font-black font-mono text-blue-600">{skill.level}%</div>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{skill.name}</h3>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-4">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-500"
                    />
                  </div>
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{skill.category}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-32 bg-white dark:bg-slate-900 scroll-mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader 
              badge="Portfolio"
              title="Impactful Works" 
              subtitle="Explore a selection of high-end mobile and web products I've engineered from concept to launch."
            />

            {/* Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-3 mb-20">
              {(['All', 'Mobile', 'Web', 'Desktop'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-3 rounded-2xl text-sm font-black transition-all ${
                    activeTab === tab 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30 scale-105' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              <AnimatePresence mode="popLayout">
                {PROJECTS.filter(p => activeTab === 'All' || p.category === activeTab).map((project) => (
                  <motion.div
                    layout
                    key={project.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                    className="group"
                  >
                    <div className="relative aspect-[16/11] rounded-[2.5rem] overflow-hidden bg-slate-100 dark:bg-slate-800 mb-8 shadow-xl">
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-10">
                        <div className="flex gap-4">
                          {project.liveLink && (
                            <a href={project.liveLink} className="flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-all shadow-xl">
                              Live Demo <ExternalLink size={18} />
                            </a>
                          )}
                          {project.githubLink && (
                            <a href={project.githubLink} className="p-3 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-xl hover:bg-white hover:text-slate-900 transition-all">
                              <Github size={24} />
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="absolute top-6 left-6 px-4 py-2 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-xl">
                        {project.category}
                      </div>
                    </div>
                    
                    <div className="px-4">
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.techStack.map(tech => (
                          <span key={tech} className="px-4 py-1.5 bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-black tracking-wide border border-blue-500/10">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-32 bg-white dark:bg-slate-900 scroll-mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader 
              badge="Offerings"
              title="Professional Services" 
              subtitle="From MVP to enterprise scaling, I provide end-to-end expertise in modern mobile ecosystem."
            />

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {SERVICES.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group p-10 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800 hover:bg-blue-600 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-blue-500/30 hover:-translate-y-3"
                >
                  <div className="mb-10 p-5 bg-white dark:bg-slate-900 rounded-[1.5rem] inline-block shadow-lg group-hover:rotate-12 group-hover:bg-white group-hover:scale-110 transition-all duration-500">
                    <div className="text-blue-600 group-hover:text-blue-600">
                      {service.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-black mb-5 text-slate-900 dark:text-white group-hover:text-white transition-colors">{service.title}</h3>
                  <p className="text-lg text-slate-600 dark:text-slate-400 group-hover:text-blue-50 leading-relaxed transition-colors font-medium">
                    {service.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-32 bg-slate-50 dark:bg-slate-950 relative overflow-hidden scroll-mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-900 rounded-[4rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
              <div className="grid lg:grid-cols-2">
                <div className="p-10 md:p-20 bg-gradient-to-br from-blue-700 to-indigo-800 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-20 bg-white/5 blur-[100px] rounded-full -z-0" />
                  
                  <h2 className="text-5xl font-black mb-10 leading-tight relative z-10">Let's build <br /> your next <span className="text-blue-300 underline decoration-wavy underline-offset-8">big idea.</span></h2>
                  <p className="text-xl text-blue-100 mb-16 leading-relaxed relative z-10 font-medium">
                    Currently accepting new projects. I am ready to bring your vision to life.
                  </p>
                  
                  <div className="space-y-10 relative z-10">
                    <div 
                      onClick={copyEmail}
                      className="flex items-center gap-6 group cursor-pointer"
                    >
                      <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-[1.5rem] flex items-center justify-center group-hover:bg-white group-hover:text-blue-700 transition-all">
                        {copied ? <CheckCircle2 size={28} /> : <Mail size={28} />}
                      </div>
                      <div>
                        <div className="text-sm font-black text-blue-200 uppercase tracking-widest mb-1">Email Address</div>
                        <div className="font-black text-2xl flex items-center gap-2">
                          ziaul@haque.dev
                          <Copy size={16} className="opacity-0 group-hover:opacity-60 transition-opacity" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-[1.5rem] flex items-center justify-center">
                        <Smartphone className="w-28 h-28 p-4" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-blue-200 uppercase tracking-widest mb-1">Contact No</div>
                        <div className="font-black text-2xl">+880 1XXX-XXXXXX</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-24 relative z-10">
                    <div className="text-sm text-blue-200 uppercase tracking-widest font-black mb-8">Professional Networks</div>
                    <div className="flex gap-5">
                      {[Github, Linkedin, Twitter].map((Icon, i) => (
                        <a key={i} href="#" className="w-14 h-14 rounded-2xl bg-white/10 hover:bg-white hover:text-blue-700 flex items-center justify-center transition-all shadow-xl">
                          <Icon size={28} />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-10 md:p-20">
                  <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Your Name</label>
                        <input 
                          type="text" 
                          placeholder="Ziaul Haque"
                          className="w-full px-6 py-5 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/20 text-slate-900 dark:text-white transition-all font-bold placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Email Address</label>
                        <input 
                          type="email" 
                          placeholder="ziaul@example.com"
                          className="w-full px-6 py-5 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/20 text-slate-900 dark:text-white transition-all font-bold placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Message</label>
                      <textarea 
                        rows={6}
                        placeholder="Tell me about your project..."
                        className="w-full px-6 py-5 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/20 text-slate-900 dark:text-white transition-all font-bold resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      />
                    </div>
                    <button className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl font-black shadow-2xl shadow-blue-500/30 transition-all flex items-center justify-center gap-4 text-xl hover:scale-[1.02] active:scale-[0.98]">
                      Send Message
                      <Rocket size={24} />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-20 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Code2 className="text-white w-7 h-7" />
                </div>
                <span className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">{userShortName}</span>
              </div>
              <p className="text-xl text-slate-500 dark:text-slate-400 max-w-sm mb-8 leading-relaxed font-medium">
                Designing and building high-performance mobile apps with passion.
              </p>
            </div>
            
            <div>
              <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm mb-8">Navigation</h4>
              <ul className="space-y-4 font-bold text-slate-500 dark:text-slate-400">
                {navLinks.map(link => (
                  <li key={link.name}>
                    <button 
                      onClick={() => scrollToSection(link.id)} 
                      className="hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm mb-8">Contact</h4>
              <ul className="space-y-4 font-bold text-slate-500 dark:text-slate-400">
                <li>ziaul@haque.dev</li>
                <li>Dhaka, Bangladesh</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-slate-100 dark:border-slate-900">
            <div className="text-slate-400 text-sm font-bold">
              &copy; {new Date().getFullYear()} {userName}. All rights reserved.
            </div>
          </div>
        </div>

        {/* Back to Top */}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`fixed bottom-10 right-10 p-5 bg-blue-600 text-white rounded-2xl shadow-2xl transition-all duration-500 z-50 hover:scale-110 active:scale-90 ${scrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 pointer-events-none'}`}
        >
          <ChevronUp size={28} />
        </button>
      </footer>
    </div>
  );
};

export default App;
