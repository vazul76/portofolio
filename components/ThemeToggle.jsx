'use client';
import { Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';


export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

    console.log('ThemeToggle: Initializing...', { savedTheme, prefersDark, shouldBeDark });

    setIsDark(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleClick = () => {
    const newIsDark = !isDark;
    console.log('ThemeToggle: Toggle clicked. New state isDark:', newIsDark);

    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      console.log('ThemeToggle: Added "dark" class to html');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      console.log('ThemeToggle: Removed "dark" class from html');
    }
  };

  // Hindari render sebelum mounted agar tidak mismatch
  if (!mounted) return null;

  return (
    <button
      onClick={handleClick}
      type="button"
      className="fixed top-6 right-6 z-[100] w-14 h-14 rounded-full bg-transparent dark:bg-transparent hover:scale-110 transition-all duration-300 flex items-center justify-center"
      aria-label="Toggle theme"
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Sun Icon (Visible in Light Mode, switches to Dark) */}
        <Sun
          size={24}
          className={`absolute text-slate-600 transition-all duration-500 ${isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`}
        />
        {/* Moon Icon (Visible in Dark Mode, switches to Light) */}
        <Moon
          size={24}
          className={`absolute text-slate-500 transition-all duration-500 ${isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`}
        />
      </div>
    </button>
  );
}