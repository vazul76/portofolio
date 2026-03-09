'use client';
import { Home, User, Cog, Code, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Sidebar() {
  const [activeSection, setActiveSection] = useState('hero');

  const menuItems = [
    { id: 'hero', icon: Home, label: 'HOME' },
    { id: 'about', icon: User, label: 'ABOUT' },
    { id: 'skills', icon: Cog, label: 'SKILLS' },
    { id: 'projects', icon: Code, label: 'PROJECTS' },
    { id: 'contact', icon: Phone, label: 'CONTACT' },
  ];

  useEffect(() => {
    const onScroll = () => {
      for (const item of menuItems) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= window.innerHeight / 2 && r.bottom >= window.innerHeight / 2) {
          setActiveSection(item.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden md:block fixed left-6 top-1/2 -translate-y-1/2 z-50">
        <div className="rounded-3xl bg-transparent p-3">
          <nav className="flex flex-col gap-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={
                    'group relative flex items-center h-16 rounded-full overflow-hidden transition-all duration-300 ease-out ' +
                    (active
                      ? 'w-16 bg-slate-600 dark:bg-slate-500 text-white hover:w-[130px] hover:bg-slate-700 dark:hover:bg-slate-600'
                      : 'w-16 bg-slate-200/80 dark:bg-gray-700/80 text-gray-800 dark:text-gray-200 hover:w-[130px] dark:hover:bg-gray-600 backdrop-blur-sm')
                  }
                >
                  <span className="flex items-center justify-center w-16 h-16 flex-shrink-0">
                    <Icon size={22} strokeWidth={2.5} />
                  </span>

                  <span
                    className={
                      'ml-2 font-bold text-sm tracking-wide whitespace-nowrap transition-all duration-300 ' +
                      (active
                        ? 'opacity-100 translate-x-0 text-white'
                        : 'opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 text-gray-800 dark:text-white')
                    }
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Bottom Navigation - Hidden on desktop */}
      <div className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
        <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-full shadow-2xl border border-slate-200/50 dark:border-gray-700/50 px-3 py-2">
          <nav className="flex justify-around items-center relative">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={
                    'flex flex-col items-center justify-center transition-all duration-500 ease-out relative ' +
                    (active ? '-translate-y-3' : 'translate-y-0')
                  }
                  style={{
                    minWidth: '60px',
                  }}
                >
                  {/* Icon Container */}
                  <div
                    className={
                      'flex items-center justify-center rounded-full transition-all duration-500 ' +
                      (active
                        ? 'w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-700 dark:from-slate-500 dark:to-slate-600 text-white shadow-2xl shadow-slate-500/50 scale-110'
                        : 'w-10 h-10 bg-transparent text-gray-600 dark:text-gray-400')
                    }
                  >
                    <Icon
                      size={active ? 26 : 20}
                      strokeWidth={active ? 2.5 : 2}
                      className="transition-all duration-300"
                    />
                  </div>

                  {/* Label - Muncul di bawah untuk non-active */}
                  <span
                    className={
                      'text-[9px] font-bold transition-all duration-300 mt-0.5 whitespace-nowrap ' +
                      (active
                        ? 'opacity-0 scale-0'
                        : 'opacity-100 scale-100 text-gray-700 dark:text-gray-300')
                    }
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}