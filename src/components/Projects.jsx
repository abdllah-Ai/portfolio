// src/components/Projects.jsx
// Projects section with filter chips, card grid, and detail modal
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import { Folder, ExternalLink, Github, X, Tag, ArrowRight } from 'lucide-react';
import { useContent } from '../context/ContentContext.jsx';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function ProjectCard({ project, onClick }) {
  const [lottieData, setLottieData] = useState(null);

  // Load Lottie JSON if project uses Lottie
  useEffect(() => {
    if (project.lottie && typeof project.lottie === 'string') {
      fetch(project.lottie)
        .then((res) => res.json())
        .then(setLottieData)
        .catch(() => setLottieData(null));
    } else if (project.lottie && typeof project.lottie === 'object') {
      setLottieData(project.lottie);
    }
  }, [project.lottie]);

  return (
    <motion.div
      variants={itemVariants}
      layoutId={`project-${project.slug}`}
      onClick={onClick}
      className="card rounded-2xl overflow-hidden cursor-pointer group"
    >
      {/* Image or Lottie preview */}
      <div className="aspect-video surface relative overflow-hidden">
        {lottieData ? (
          <Lottie
            animationData={lottieData}
            loop
            autoplay
            className="w-full h-full object-cover"
          />
        ) : project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Folder size={48} className="text-muted" />
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 media-overlay opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
          <span className="overlay-text font-medium flex items-center gap-2">
            View Details <ArrowRight size={16} />
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 group-hover:opacity-80 transition-opacity">
          {project.title}
        </h3>

        <p className="text-sm text-muted mb-4 line-clamp-2">
          {project.blurb}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {project.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="tag text-xs px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function ProjectModal({ project, onClose }) {
  const [lottieData, setLottieData] = useState(null);
  const closeRef = useRef(null);
  const previousFocusRef = useRef(null);
  const titleId = `project-title-${project.slug}`;

  useEffect(() => {
    if (project.lottie && typeof project.lottie === 'string') {
      fetch(project.lottie)
        .then((res) => res.json())
        .then(setLottieData)
        .catch(() => setLottieData(null));
    } else if (project.lottie && typeof project.lottie === 'object') {
      setLottieData(project.lottie);
    }
  }, [project.lottie]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    previousFocusRef.current = document.activeElement;
    const raf = requestAnimationFrame(() => {
      closeRef.current?.focus();
    });
    return () => {
      cancelAnimationFrame(raf);
      const previous = previousFocusRef.current;
      if (previous && typeof previous.focus === 'function') {
        previous.focus();
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 modal-overlay"
    >
      <motion.div
        layoutId={`project-${project.slug}`}
        onClick={(e) => e.stopPropagation()}
        className="card max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl"
      >
        {/* Header image/Lottie */}
        <div className="aspect-video surface relative">
          {lottieData ? (
            <Lottie
              animationData={lottieData}
              loop
              autoplay
              className="w-full h-full object-cover"
            />
          ) : project.image ? (
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Folder size={64} className="text-muted" />
            </div>
          )}

          {/* Close button */}
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full btn-ghost overlay-button transition-colors"
            aria-label="Close project details"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <h2 id={titleId} className="text-3xl font-bold mb-4 text-accent neon-text">
            {project.title}
          </h2>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map((tag) => (
              <span key={tag} className="tag text-sm px-3 py-1 rounded-full flex items-center gap-1">
                <Tag size={12} />
                {tag}
              </span>
            ))}
          </div>

          <p className="text-lg text-muted mb-8">
            {project.blurb}
          </p>

          {/* Highlights */}
          {project.highlights && project.highlights.length > 0 && (
            <div className="mb-8">
              <h4 className="font-semibold text-lg mb-4">
                Key Highlights
              </h4>
              <ul className="space-y-3">
                {project.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-3 text-muted">
                    <span className="w-2 h-2 mt-2 rounded-full accent-dot flex-shrink-0" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech stack */}
          {project.tech && project.tech.length > 0 && (
            <div className="mb-8">
              <h4 className="font-semibold text-lg mb-4">
                Technologies
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span key={tech} className="badge-tonal text-sm px-3 py-1.5 rounded-lg">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div className="flex flex-wrap gap-4">
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost px-6 py-3 rounded-xl font-medium flex items-center gap-2"
              >
                <Github size={18} />
                View Repository
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary px-6 py-3 rounded-xl font-medium flex items-center gap-2"
              >
                <ExternalLink size={18} />
                Live Demo
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const { content } = useContent();
  const projects = content.projects || [];

  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  // Get unique tags
  const allTags = useMemo(() => {
    const tags = new Set();
    projects.forEach((p) => p.tags?.forEach((t) => tags.add(t)));
    return ['All', ...Array.from(tags)];
  }, [projects]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All') return projects;
    return projects.filter((p) => p.tags?.includes(activeFilter));
  }, [projects, activeFilter]);

  return (
    <section id="projects" className="py-24 px-6 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/4 right-0 w-96 h-96 accent-blob rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-64 h-64 accent-blob rounded-full blur-3xl" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={containerVariants}
        className="max-w-6xl mx-auto relative z-10"
      >
        {/* Section header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 pill px-4 py-2 rounded-full mb-6 text-muted">
            <Folder size={16} className="text-accent" />
            <span className="text-sm font-medium">Portfolio</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-accent neon-text">Featured Projects</span>
          </h2>

          <p className="text-lg text-muted max-w-2xl mx-auto">
            A showcase of our best work and creative endeavors
          </p>
        </motion.div>

        {/* Filter chips */}
        <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-3 mb-12">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveFilter(tag)}
              className={`chip px-4 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === tag ? 'chip-active' : ''
                }`}
            >
              {tag}
            </button>
          ))}
        </motion.div>

        {/* Project grid */}
        <motion.div
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.slug}
                project={project}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <motion.div variants={itemVariants} className="text-center py-16">
            <Folder size={48} className="mx-auto text-muted mb-4" />
            <p className="text-muted">
              No projects found for this filter
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Project detail modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
