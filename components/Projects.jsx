'use client';
import { Github } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Projects() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/content/projects');
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section id="projects" className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-gray-900">
        <div className="text-gray-900 dark:text-white">Loading projects...</div>
      </section>
    );
  }

  return (
    <section id="projects" className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-gray-900 transition-all duration-500 py-20 px-6 md:px-8">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            My Projects
          </h2>
        </div>

        {/* Projects Grid - Responsive columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <a
              key={index}
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-gray-800 dark:to-gray-700 overflow-hidden">
                {/* Overlay on hover */}
                <div className={`absolute inset-0 bg-slate-900/80 dark:bg-slate-950/80 backdrop-blur-sm transition-all duration-500 flex items-center justify-center z-10 ${hoveredIndex === index ? 'opacity-75' : 'opacity-0'}`}>
                  <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-slate-600 dark:text-slate-400 group-hover:bg-slate-600 group-hover:text-white dark:group-hover:bg-slate-500 transition-all duration-300">
                    <Github size={28} />
                  </div>
                </div>

                {/* Project Image */}
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover"
                />

                {/* Category Badge */}
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3 py-1 bg-slate-600/90 dark:bg-slate-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-slate-700 dark:text-slate-300 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors duration-300">
                  {project.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed line-clamp-3">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-gray-700 rounded-full text-xs font-medium hover:bg-slate-600 hover:text-white dark:hover:bg-slate-500 transition-all duration-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Border Animation */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-600 to-slate-700 dark:from-slate-500 dark:to-slate-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"></div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}