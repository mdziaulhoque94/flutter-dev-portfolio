
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
  Camera,
  Upload,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import emailjs from '@emailjs/browser';

// MVC Structure Imports
import { PROJECTS, SKILLS, TESTIMONIALS, SERVICES, PERSONAL_DETAILS } from './constants/index';
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
    window.addEventListener('scroll', handleScroll);
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
      window.scrollTo({ top: element.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Save to Supabase
      const { error: dbError } = await supabase
        .from('messages')
        .insert([
          { 
            name: formData.name, 
            email: formData.email, 
            message: formData.message 
          }
        ]);

      if (dbError) {
        console.error("Supabase Error:", dbError);
        // We continue anyway so EmailJS can still try to send if DB fails
      }

      // 2. Send Email via EmailJS with user credentials
      const emailParams = {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        to_email: PERSONAL_DETAILS.email,
      };

      await emailjs.send(
        'service_6xo2ofs', // Service ID provided by user
        'template_c7jwajg', // Template ID provided by user
        emailParams,
        '78QuZGNxg3OzNbBsu' // Public Key provided by user
      );

      setFormSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setFormSubmitted(false), 5000);

    } catch (error: any) {
      console.error('Submission Error:', error);
      alert('Error sending message: ' + (error.text || error.message || 'Please check your internet connection or EmailJS setup.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-600 selection:text-white transition-colors duration-500 overflow-x-hidden font-sans">
      
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-blue-600 z-[60] origin-left" style={{ scaleX }} />

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 py-2' : 'bg-transparent py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-11 h-11 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                <Code2 className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-black tracking-tight">{PERSONAL_DETAILS.shortName}<span className="text-blue-600">.</span></span>
            </motion.div>

            <div className="hidden md:flex items-center space-x-10">
              {['About', 'Skills', 'Projects', 'Services', 'Contact'].map((item) => (
                <button key={item} onClick={() => scrollToSection(item.toLowerCase())} className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest">{item}</button>
              ))}
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2" />
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)} 
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white transition-all focus:outline-none"
                aria-label="Toggle Theme"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>

            <div className="flex items-center gap-4 md:hidden">
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)} 
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900"
                aria-label="Toggle Theme"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-600 dark:text-slate-400">
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              <div className="px-6 pt-4 pb-8 space-y-2">
                {['About', 'Skills', 'Projects', 'Services', 'Contact'].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className="w-full text-left block px-4 py-5 text-lg font-bold text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-2xl transition-all"
                  >
                    {item}
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-bold mb-8 border border-blue-500/20">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                  </span>
                  Available for High-Scale Projects
                </motion.div>
                <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[1.1]">
                  Building the <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600">Future of Mobile.</span>
                </motion.h1>
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-xl mb-12 font-medium">
                  I'm <span className="text-slate-900 dark:text-white font-black">{PERSONAL_DETAILS.name}</span>. A Senior Flutter Developer with 5+ years of experience.
                </motion.p>
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <button onClick={() => scrollToSection('projects')} className="w-full sm:w-auto px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-2xl transition-all flex items-center justify-center gap-3 group">
                    View Portfolio <ArrowRight size={22} className="group-hover:translate-x-1.5 transition-transform" />
                  </button>
                  <button onClick={() => scrollToSection('contact')} className="w-full sm:w-auto px-10 py-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-800 rounded-2xl font-black hover:bg-slate-50 transition-all">
                    Let's Chat
                  </button>
                </div>
              </div>

              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="hidden lg:block relative group">
                <div className="relative z-10 p-6 bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800">
                  <div className="rounded-[2.5rem] overflow-hidden bg-slate-100 dark:bg-slate-800 aspect-[4/5] relative">
                    <img src={profileImageUrl} alt={PERSONAL_DETAILS.name} className="w-full h-full object-cover" />
                  </div>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/jpeg,image/png" />
                <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[3.5rem] -z-10 blur opacity-20" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-32 bg-white dark:bg-slate-900 relative scroll-mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-24 items-center">
              <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative group">
                <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-slate-50 dark:border-slate-800 aspect-[4/5]">
                  <img src={profileImageUrl} alt={PERSONAL_DETAILS.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <SectionHeader badge="The Architect" title="Senior Flutter Developer" subtitle="" />
                <div className="-mt-12">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Expert in Cross-Platform Mobile</h3>
                  <p className="text-xl text-slate-700 dark:text-slate-300 mb-8 leading-relaxed font-medium">
                    I am <span className="text-blue-600 font-bold">{PERSONAL_DETAILS.name}</span>, a dedicated mobile engineer.
                  </p>
                  <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
                    With over 5 years of professional experience, I have successfully launched multiple high-scale apps. I specialize in Bloc, Riverpod, and providing a seamless native performance.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                    {["Expert Flutter & Dart", "Scalable Backend Integration", "CI/CD Implementation", "Complex UI/UX Animations", "State Management Specialist", "Native Integration"].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="text-blue-600 shrink-0" size={20} />
                        <span className="font-bold text-slate-700 dark:text-slate-300">{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <button className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black hover:scale-105 transition-all focus:outline-none">Download CV</button>
                    <div className="flex gap-2">
                      {[Github, Linkedin, Twitter].map((Icon, i) => (
                        <a key={i} href="#" className="p-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"><Icon size={24} /></a>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-32 bg-slate-50 dark:bg-slate-950 scroll-mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader badge="Expertise" title="Toolbox & Skills" subtitle="The technologies I leverage to build robust, scalable, and high-performance applications." />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {SKILLS.map((skill) => (
                <div key={skill.name} className="group bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 hover:shadow-2xl transition-all hover:-translate-y-2">
                  <div className="flex justify-between items-end mb-6">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl group-hover:bg-blue-600 transition-colors">
                      <Code2 className="text-blue-600 dark:text-blue-400 group-hover:text-white" size={32} />
                    </div>
                    <div className="text-sm font-black font-mono text-blue-600">{skill.level}%</div>
                  </div>
                  <h3 className="text-xl font-black mb-2">{skill.name}</h3>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-4">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${skill.level}%` }} viewport={{ once: true }} transition={{ duration: 1.5 }} className="h-full bg-gradient-to-r from-blue-600 to-indigo-500" />
                  </div>
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{skill.category}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-32 bg-white dark:bg-slate-900 scroll-mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader badge="Portfolio" title="Selected Works" subtitle="Explore a selection of high-end mobile products I've engineered from concept to launch." />
            <div className="flex flex-wrap justify-center gap-3 mb-20">
              {(['All', 'Mobile', 'Web', 'Desktop'] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-8 py-3 rounded-2xl text-sm font-black transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-xl' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200'}`}>{tab}</button>
              ))}
            </div>
            <div className="grid lg:grid-cols-2 gap-12">
              <AnimatePresence mode="popLayout">
                {PROJECTS.filter(p => activeTab === 'All' || p.category === activeTab).map((project) => (
                  <motion.div layout key={project.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="group">
                    <div className="relative aspect-[16/11] rounded-[2.5rem] overflow-hidden bg-slate-100 dark:bg-slate-800 mb-8 shadow-xl">
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        {project.liveLink && <a href={project.liveLink} className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold shadow-xl">Live Demo</a>}
                        {project.githubLink && <a href={project.githubLink} className="p-3 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-xl hover:bg-white hover:text-slate-900 transition-all"><Github size={24} /></a>}
                      </div>
                    </div>
                    <div className="px-4">
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.techStack.map(tech => <span key={tech} className="px-4 py-1.5 bg-blue-50 dark:bg-blue-900/10 text-blue-600 rounded-xl text-xs font-black border border-blue-500/10">{tech}</span>)}
                      </div>
                      <h3 className="text-3xl font-black mb-4 group-hover:text-blue-600 transition-colors">{project.title}</h3>
                      <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">{project.description}</p>
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
            <SectionHeader badge="Offerings" title="Professional Services" subtitle="Specialized services tailored for high-growth tech companies and enterprise clients." />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {SERVICES.map((service, index) => (
                <motion.div key={service.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="group p-10 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800 hover:bg-blue-600 hover:text-white transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-3">
                  <div className="mb-10 p-5 bg-white dark:bg-slate-900 rounded-2xl inline-block group-hover:bg-white/20">{service.icon}</div>
                  <h3 className="text-2xl font-black mb-5">{service.title}</h3>
                  <p className="text-lg opacity-80 leading-relaxed font-medium">{service.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section id="contact" className="py-32 bg-slate-50 dark:bg-slate-950 scroll-mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-900 rounded-[4rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
              <div className="grid lg:grid-cols-2">
                <div className="p-10 md:p-20 bg-gradient-to-br from-blue-700 to-indigo-800 text-white relative">
                  <h2 className="text-5xl font-black mb-10 leading-tight">Let's build <br /> your next <span className="text-blue-300 underline underline-offset-8">big idea.</span></h2>
                  <div className="space-y-10">
                    <div onClick={copyEmail} className="flex items-center gap-6 group cursor-pointer">
                      <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-[1.5rem] flex items-center justify-center group-hover:bg-white group-hover:text-blue-700 transition-all">
                        {copied ? <CheckCircle2 size={28} /> : <Mail size={28} />}
                      </div>
                      <div>
                        <div className="text-sm font-black text-blue-200 uppercase tracking-widest mb-1">Email</div>
                        <div className="font-black text-lg md:text-2xl flex items-center gap-2">{PERSONAL_DETAILS.email} <Copy size={16} className="opacity-40" /></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-[1.5rem] flex items-center justify-center"><Smartphone size={28} /></div>
                      <div>
                        <div className="text-sm font-black text-blue-200 uppercase tracking-widest mb-1">Call</div>
                        <div className="font-black text-2xl">{PERSONAL_DETAILS.phone}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-10 md:p-20 relative">
                  <AnimatePresence mode="wait">
                    {formSubmitted ? (
                      <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-full text-center space-y-6">
                        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><CheckCircle2 size={48} /></div>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white">Message Received!</h3>
                        <p className="text-lg text-slate-600 dark:text-slate-400">I will get back to you within 24 hours.</p>
                        <button onClick={() => setFormSubmitted(false)} className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold focus:outline-none">Send Another</button>
                      </motion.div>
                    ) : (
                      <form className="space-y-8" onSubmit={handleSubmit}>
                        <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Your Name</label>
                            <input type="text" name="name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-6 py-5 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/20 font-bold dark:text-white" />
                          </div>
                          <div className="space-y-3">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Email Address</label>
                            <input type="email" name="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-6 py-5 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/20 font-bold dark:text-white" />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Message</label>
                          <textarea name="message" required rows={6} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full px-6 py-5 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/20 font-bold resize-none dark:text-white" />
                        </div>
                        <button disabled={isSubmitting} className="w-full py-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-3xl font-black shadow-2xl transition-all flex items-center justify-center gap-4 text-xl focus:outline-none">
                          {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : <>Send Message <Rocket size={24} /></>}
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

      <footer className="py-20 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg"><Code2 className="text-white w-7 h-7" /></div>
            <span className="text-2xl font-black text-slate-900 dark:text-white">{PERSONAL_DETAILS.shortName}</span>
          </div>
          <p className="text-xl text-slate-500 dark:text-slate-400 mb-12 max-w-sm mx-auto">High-performance Flutter development with passion.</p>
          <div className="text-slate-400 text-sm font-bold">&copy; {new Date().getFullYear()} {PERSONAL_DETAILS.name}. All rights reserved.</div>
        </div>
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={`fixed bottom-10 right-10 p-5 bg-blue-600 text-white rounded-2xl shadow-2xl transition-all duration-500 z-50 ${scrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 pointer-events-none hover:scale-110 active:scale-95 transition-transform'}`}>
          <ChevronUp size={28} />
        </button>
      </footer>
    </div>
  );
};

export default App;
