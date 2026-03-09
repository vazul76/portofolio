'use client';
import { Server } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch('/api/content/skills');
        const data = await response.json();
        setSkills(data);
      } catch (error) {
        console.error('Error fetching skills:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  if (loading) {
    return (
      <section id="skills" className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-gray-900">
        <div className="text-gray-900 dark:text-white">Loading skills...</div>
      </section>
    );
  }

  return (
    <section id="skills" className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-gray-900 transition-all duration-500 pt-16 py-20 md:py-0">
      <div className="max-w-6xl mx-auto px-8 text-gray-900 dark:text-white w-full transition-colors duration-500">
        <h2 className="text-5xl font-bold mb-16 text-center">Skills</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {skills.map((skill) => (
            <div
              key={skill.name}
              className="group flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-3xl transition-all duration-300 hover:scale-110 cursor-pointer"
            >
              {/* Logo/Icon Container */}
              <div className="relative w-28 h-28 mb-5 flex items-center justify-center">
                {skill.type === 'image' ? (
                  <>
                    {/* Monochrome Version */}
                    <img
                      src={skill.logo}
                      alt={skill.name}
                      className="w-full h-full object-contain grayscale opacity-60 group-hover:opacity-0 transition-all duration-300 absolute inset-0"
                    />
                    {/* Color Version */}
                    <img
                      src={skill.logo}
                      alt={skill.name}
                      className="w-full h-full object-contain opacity-0 group-hover:opacity-100 transition-all duration-300 absolute inset-0"
                    />
                  </>
                ) : (
                  <>
                    {/* Icon Version - Monochrome */}
                    <skill.icon
                      size={80}
                      className="text-gray-400 opacity-60 group-hover:opacity-0 transition-all duration-300 absolute"
                      strokeWidth={1.5}
                    />
                    {/* Icon Version - Colored */}
                    <skill.icon
                      size={80}
                      className="opacity-0 group-hover:opacity-100 transition-all duration-300 absolute"
                      style={{ color: skill.color }}
                      strokeWidth={1.5}
                    />
                  </>
                )}
              </div>

              {/* Skill Name */}
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors duration-300 text-center">
                {skill.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}