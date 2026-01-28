
import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, 
  X, 
  Moon, 
  Sun, 
  Github, 
  Linkedin, 
  Twitter, 
  Mail,
  ArrowRight,
  Code2,
  CheckCircle2,
  Copy,
  ChevronUp,
  Smartphone,
  Rocket,
  Loader2,
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import emailjs from '@emailjs/browser';

// MVC Structure Imports
import { PROJECTS, SKILLS, SERVICES, PERSONAL_DETAILS } from './constants/index';
import SectionHeader from './components/SectionHeader';
import { supabase } from './lib/supabase';

const BUCKET_NAME = 'portfolio';
const PROFILE_FILE_NAME = 'profile.jpg';
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop";

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      return saved ? saved === 'dark' : true;
    }
    return true;
  });
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'All' | 'Mobile' | 'Web' | 'Desktop'>('All');
  const [scrolled, setScrolled] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [profileImageUrl, setProfileImageUrl] = useState<string>(FALLBACK_IMAGE);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const fetchProfileImage = async () => {
    try {
      const { data } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(PROFILE_FILE_NAME);
      
      if (data?.publicUrl) {
        setProfileImageUrl(`${data.publicUrl}?t=${new Date().getTime()}`);
      }
    } catch (error) {
      console.error("Error fetching profile image:", error);
    }
  };

  useEffect(() => {
    fetchProfileImage();
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file.");
      return;
    }
    setIsUploading(true);
    try {
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(PROFILE_FILE_NAME, file, {
          upsert: true,
          cacheControl: '3600',
          contentType: file.type
        });
      if (error) throw error;
      await fetchProfileImage();
      alert("Profile photo updated successfully!");
    } catch (error: any) {
      console.error("Upload error details:", error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_DETAILS.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setIsMenuOpen(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Save to Supabase
      await supabase
        .from('messages')
        .insert([{ name: formData.name, email: formData.email, message: formData.message }]);

      // 2. Send Email via EmailJS
      const emailParams = {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        to_email: PERSONAL_DETAILS.email,
      };

      await emailjs.send(
        'service_6xo2ofs', 
        'template_c7jwajg', 
        emailParams,
        '78QuZGNxg3OzNbBsu' 
      );

      setFormSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setFormSubmitted(false), 5000);

    } catch (error: any) {
      console.error('Submission Error:', error);
      alert('Error sending message. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-600 selection:text-white transition-colors duration-500 overflow-x-hidden font-sans">
      
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-blue-600 z-[70] origin-left" style={{ scaleX }} />

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 py-2 shadow-sm' : 'bg-transparent py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                <Code2 className="text-white w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">{PERSONAL_DETAILS.shortName}<span className="text-blue-600">.</span></span>
            </motion.div>

            <div className="hidden md:flex items-center space-x-8">
              {['About', 'Skills', 'Projects', 'Services', 'Contact'].map((item) => (
                <button key={item} onClick={() => scrollToSection(item.toLowerCase())} className="text-sm font-bold text-slate-700 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-widest">{item}</button>
              ))}
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2" />
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)} 
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-400 hover:bg-blue-600 hover:text-white transition-all focus:outline-none"
                aria-label="Toggle Theme"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>

            <div className="flex items-center gap-3 md:hidden">
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)} 
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-400"
                aria-label="Toggle Theme"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-800 dark:text-slate-200 focus:outline-none">
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 right-0 md:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-40"
            >
              <div className="px-6 pt-4 pb-8 space-y-1">
                {['About', 'Skills', 'Projects', 'Services', 'Contact'].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className="w-full text-left block px-4 py-4 text-lg font-bold text-slate-800 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="relative">
        {/* Hero Section */}
        <section id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-slate-50 dark:bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="text-center lg:text-left">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-bold mb-8 border border-blue-500/20">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  High-Scale Mobile Solutions
                </motion.div>
                <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[1.1] text-slate-900 dark:text-white">
                  Build the <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600">Future.</span>
                </motion.h1>
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-lg md:text-xl lg:text-2xl text-slate-700 dark:text-slate-400 max-w-xl mb-12 font-medium mx-auto lg:mx-0">
                  I'm <span className="text-slate-900 dark:text-white font-black">{PERSONAL_DETAILS.name}</span>. Senior Flutter Specialist with 5+ years of craft.
                </motion.p>
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                  <button onClick={() => scrollToSection('projects')} className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-xl transition-all flex items-center justify-center gap-3 group">
                    My Portfolio <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button onClick={() => scrollToSection('contact')} className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-800 rounded-2xl font-black hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                    Let's Chat
                  </button>
                </div>
              </div>

              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="hidden lg:block relative group">
                <div className="relative z-10 p-5 bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800">
                  <div className="rounded-[2.5rem] overflow-hidden bg-slate-100 dark:bg-slate-800 aspect-[4/5] relative">
                    <img src={profileImageUrl} alt={PERSONAL_DETAILS.name} className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[3.5rem] -z-10 blur opacity-20" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 md:py-32 bg-white dark:bg-slate-900 relative scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative group max-w-md mx-auto lg:max-w-none">
                <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-slate-100 dark:border-slate-800 aspect-[4/5]">
                  <img src={profileImageUrl} alt={PERSONAL_DETAILS.name} className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-600 rounded-3xl -z-10 hidden sm:block"></div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <SectionHeader badge="About Me" title="Senior App Engineer" subtitle="" />
                <div className="-mt-10">
                  <p className="text-lg md:text-xl text-slate-800 dark:text-slate-300 mb-6 leading-relaxed font-medium">
                    I specialize in building high-performance, beautiful mobile applications that scale.
                  </p>
                  <p className="text-slate-700 dark:text-slate-400 mb-10 leading-relaxed">
                    With a deep focus on <span className="text-blue-600 font-bold">Flutter & Dart</span>, I help businesses turn ideas into reality. My approach combines clean code architecture with pixel-perfect design and fluid animations.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
                    {["State Management (Bloc/Riverpod)", "Native Platform Integration", "CI/CD & App Distribution", "High-Performance Graphics"].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="text-blue-600 shrink-0" size={18} />
                        <span className="font-bold text-slate-800 dark:text-slate-300 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <button className="px-6 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black hover:scale-105 transition-all">Download Resume</button>
                    <div className="flex gap-2">
                      {[Github, Linkedin, Twitter].map((Icon, i) => (
                        <a key={i} href="#" className="p-3.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"><Icon size={22} /></a>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-24 md:py-32 bg-slate-50 dark:bg-slate-950 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader badge="Expertise" title="Core Skills" subtitle="Leveraging modern technologies to build industry-leading mobile products." />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {SKILLS.map((skill) => (
                <motion.div 
                  key={skill.name} 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }}
                  className="group bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all"
                >
                  <div className="flex justify-between items-end mb-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl group-hover:bg-blue-600 transition-colors">
                      <Code2 className="text-blue-600 dark:text-blue-400 group-hover:text-white" size={24} />
                    </div>
                    <div className="text-sm font-black text-blue-600">{skill.level}%</div>
                  </div>
                  <h3 className="text-lg font-black mb-3 text-slate-900 dark:text-white">{skill.name}</h3>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${skill.level}%` }} viewport={{ once: true }} transition={{ duration: 1 }} className="h-full bg-blue-600" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-24 md:py-32 bg-white dark:bg-slate-900 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader badge="Showcase" title="Selected Works" subtitle="A collection of apps built for global clients across various industries." />
            
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {(['All', 'Mobile', 'Web', 'Desktop'] as const).map((tab) => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)} 
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 hover:bg-slate-200'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-10">
              <AnimatePresence mode="popLayout">
                {PROJECTS.filter(p => activeTab === 'All' || p.category === activeTab).map((project) => (
                  <motion.div layout key={project.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="group">
                    <div className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-6 shadow-md border border-slate-100 dark:border-slate-800">
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        {project.liveLink && <a href={project.liveLink} className="px-5 py-2.5 bg-white text-slate-950 rounded-lg font-bold text-sm shadow-lg">View Project</a>}
                      </div>
                    </div>
                    <div className="px-2">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.techStack.map(tech => <span key={tech} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-[10px] font-black uppercase tracking-wider">{tech}</span>)}
                      </div>
                      <h3 className="text-2xl font-black mb-3 text-slate-950 dark:text-white group-hover:text-blue-600 transition-colors">{project.title}</h3>
                      <p className="text-slate-700 dark:text-slate-400 text-sm leading-relaxed mb-4">{project.description}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-24 md:py-32 bg-slate-50 dark:bg-slate-950 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader badge="Capabilities" title="What I Offer" subtitle="End-to-end mobile development services from ideation to deployment." />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {SERVICES.map((service, index) => (
                <motion.div 
                  key={service.title} 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ delay: index * 0.1 }} 
                  className="group p-8 rounded-3xl bg-white dark:bg-slate-900 hover:bg-blue-600 transition-all duration-300 shadow-sm border border-slate-200 dark:border-slate-800"
                >
                  <div className="mb-8 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl inline-block group-hover:bg-white/10 group-hover:text-white">
                    {/* Fix: Cast icon element to React.ReactElement<any> to allow merging additional props like className in React.cloneElement */}
                    {React.cloneElement(service.icon as React.ReactElement<any>, { className: "w-6 h-6 text-blue-600 group-hover:text-white" })}
                  </div>
                  <h3 className="text-xl font-black mb-4 text-slate-900 dark:text-white group-hover:text-white">{service.title}</h3>
                  <p className="text-slate-700 dark:text-slate-400 text-sm leading-relaxed group-hover:text-blue-50 font-medium">{service.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 md:py-32 bg-white dark:bg-slate-900 scroll-mt-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-slate-50 dark:bg-slate-950 rounded-3xl lg:rounded-[3rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex flex-col lg:flex-row">
                {/* Contact Info Sidebar */}
                <div className="w-full lg:w-2/5 p-8 sm:p-12 bg-gradient-to-br from-blue-700 to-indigo-800 text-white">
                  <h2 className="text-3xl sm:text-4xl font-black mb-10 leading-tight">Let's build something <br /> <span className="text-blue-200 italic underline underline-offset-4">amazing.</span></h2>
                  
                  <div className="space-y-8">
                    <div onClick={copyEmail} className="flex items-start gap-4 group cursor-pointer">
                      <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center group-hover:bg-white group-hover:text-blue-700 transition-all flex-shrink-0">
                        {copied ? <CheckCircle2 size={24} /> : <Mail size={24} />}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-1">Email Me</div>
                        <div className="font-bold text-sm sm:text-base break-all flex items-center gap-2">{PERSONAL_DETAILS.email} <Copy size={14} className="opacity-40" /></div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center flex-shrink-0"><Smartphone size={24} /></div>
                      <div>
                        <div className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-1">Call Me</div>
                        <div className="font-bold text-sm sm:text-base">{PERSONAL_DETAILS.phone}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="w-full lg:w-3/5 p-8 sm:p-12 bg-white dark:bg-slate-900">
                  <AnimatePresence mode="wait">
                    {formSubmitted ? (
                      <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-full text-center space-y-5 py-10">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><CheckCircle2 size={40} /></div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white">Success!</h3>
                        <p className="text-slate-700 dark:text-slate-400 text-sm">Thanks for reaching out. I'll get back to you soon.</p>
                        <button onClick={() => setFormSubmitted(false)} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">Send Another</button>
                      </motion.div>
                    ) : (
                      <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="grid sm:grid-cols-2 gap-5">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Name</label>
                            <input 
                              type="text" 
                              required 
                              value={formData.name} 
                              onChange={(e) => setFormData({...formData, name: e.target.value})} 
                              className="w-full px-4 py-3.5 bg-slate-100 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500/30 rounded-xl font-bold dark:text-white outline-none transition-all text-sm" 
                              placeholder="Your Name" 
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email</label>
                            <input 
                              type="email" 
                              required 
                              value={formData.email} 
                              onChange={(e) => setFormData({...formData, email: e.target.value})} 
                              className="w-full px-4 py-3.5 bg-slate-100 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500/30 rounded-xl font-bold dark:text-white outline-none transition-all text-sm" 
                              placeholder="Email Address" 
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Message</label>
                          <textarea 
                            required 
                            rows={4} 
                            value={formData.message} 
                            onChange={(e) => setFormData({...formData, message: e.target.value})} 
                            className="w-full px-4 py-3.5 bg-slate-100 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500/30 rounded-xl font-bold resize-none dark:text-white outline-none transition-all text-sm" 
                            placeholder="How can I help you?" 
                          />
                        </div>
                        <button disabled={isSubmitting} className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-black shadow-lg transition-all flex items-center justify-center gap-3 text-base">
                          {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <>Send Message <Rocket size={20} /></>}
                        </button>
                      </form>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-16 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg"><Code2 className="text-white w-5 h-5" /></div>
            <span className="text-xl font-black text-slate-900 dark:text-white">{PERSONAL_DETAILS.shortName}</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-sm mx-auto text-sm font-medium">Crafting premium mobile experiences with Flutter & Dart.</p>
          <div className="text-slate-500 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">
            &copy; {new Date().getFullYear()} {PERSONAL_DETAILS.name}. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Back to top button */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
        className={`fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-xl shadow-2xl transition-all duration-500 z-50 ${scrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
      >
        <ChevronUp size={24} />
      </button>
    </div>
  );
};

export default App;
