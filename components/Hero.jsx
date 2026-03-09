'use client';

import { ArrowRight, Download, Github, Linkedin, Mail, Instagram, Facebook } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [showScroll, setShowScroll] = useState(true);
  const [socialLinks, setSocialLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowScroll(false);
      } else {
        setShowScroll(true);
      }
    };

    // Fetch social links
    const fetchSocial = async () => {
      try {
        const response = await fetch('/api/content/social');
        const data = await response.json();
        if (data.links && data.links.length > 0) {
          setSocialLinks(data.links.filter((l) => l.showInHero !== false));
        }
      } catch (error) {
        console.error('Error loading social links:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSocial();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToProjects = () => {
    const element = document.getElementById('projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const iconMap = {
    Github: Github,
    Linkedin: Linkedin,
    Mail: Mail,
    Instagram: Instagram,
    Facebook: Facebook,
  };

  if (!mounted || loading) return null;

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center bg-slate-50 dark:bg-gray-900 transition-all duration-500 overflow-hidden py-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* Left Column: Content */}
        <div className="order-2 lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
              Hi, I'm <span className="text-slate-600 dark:text-slate-400">Daffa Arya Seta</span>
            </h1>
            <p className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200">
              Junior Developer
            </p>
          </div>

          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed">
            I craft beautiful digital experiences with clean code and elegant design.
            Passionate about building products that make a difference.
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
            <a
              href="/cv.pdf"
              download
              className="group flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-full border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:bg-gray-10 hover:border-gray-75 dark:hover:bg-gray-750 hover:scale-105 "
            >
              Download CV
              <Download size={20} className="group-hover:translate-y-0.5 transition-transform" />
            </a>

            <button
              onClick={scrollToProjects}
              className="group flex items-center gap-2 px-8 py-4 bg-slate-600 hover:bg-slate-700 dark:bg-slate-500 dark:hover:bg-slate-600 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105"
            >
              View My Work
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4 pt-8">
            {socialLinks.map((social, index) => {
              const IconComponent = iconMap[social.icon] || Github;
              return (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-slate-500 hover:bg-slate-50 dark:hover:border-slate-400 hover:text-slate-600 dark:hover:text-slate-400 transition-all duration-300 hover:scale-110 shadow-sm"
                  aria-label={social.platform}
                >
                  <IconComponent size={20} />
                </a>
              );
            })}
          </div>
        </div>

        {/* Right Column: Profile Image */}
        <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
          <div className="relative group">
            {/* Background Glow */}
            <div className="absolute -inset-4 bg-slate-500/20 dark:bg-slate-400/10 rounded-full blur-3xl group-hover:bg-slate-500/30 transition-all duration-500"></div>

            <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-[450px] lg:h-[450px] rounded-full overflow-hidden border-4 border-slate-500 dark:border-slate-400 p-2 bg-white dark:bg-gray-800 transition-transform duration-500 group-hover:scale-[1.02]">
              <div className="w-full h-full rounded-full overflow-hidden relative bg-gray-200 dark:bg-gray-700">
                <img
                  src="/daffa.jpeg"
                  alt="Daffa Arya Seta"
                  className="w-full h-full object-cover transition-all duration-700"
                />
              </div>
            </div>

            {/* Decorative Element */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-slate-500/10 border border-slate-500/20 rounded-full blur-xl animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      {showScroll && (
        <div className="hidden sm:flex pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-10 z-20 animate-bounce transition-opacity duration-500">
          <div className="w-6 h-10 border-2 border-slate-500/30 rounded-full flex items-start justify-center p-2 backdrop-blur-sm">
            <div className="w-1.5 h-3 bg-slate-500 rounded-full animate-scroll"></div>
          </div>
        </div>
      )}
    </section>
  );
}