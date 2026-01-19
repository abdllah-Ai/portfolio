// src/components/Skills.jsx
// Skills section with category cards, progress bars, and mini radar chart
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Palette, Box, Clapperboard, Sparkles, Wrench } from 'lucide-react';
import { useContent } from '../context/ContentContext.jsx';
import MiniRadar from './MiniRadar.jsx';

const CATEGORY_ICONS = {
  '3d-modeling': Box,
  rendering: Sparkles,
  realtime: Clapperboard,
  texturing: Palette,
  motion: Clapperboard,
  design: Palette,
  frontend: Code,
  ml: Code,
  cv: Code,
  robotics: Wrench,
  ds: Code,
  tools: Wrench,
  soft: Sparkles,
};

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

function SkillBar({ name, level, tip }) {
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">{name}</span>
        <span className="text-xs text-muted">{level}%</span>
      </div>
      <div className="h-2 rounded-full progress-track overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full rounded-full progress-fill"
        />
      </div>
      {tip && (
        <p className="text-xs text-muted mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {tip}
        </p>
      )}
    </div>
  );
}

function CategoryCard({ category, isActive, onClick }) {
  const Icon = CATEGORY_ICONS[category.id] || Code;

  return (
    <motion.button
      variants={itemVariants}
      onClick={onClick}
      className={`
        card p-6 rounded-2xl text-left transition-all w-full
        ${isActive ? 'card-active' : ''}
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl chip flex items-center justify-center">
          <Icon size={24} className="text-accent" />
        </div>
        {isActive && (
          <div className="w-2 h-2 rounded-full accent-dot animate-pulse" />
        )}
      </div>

      <h3 className="font-bold text-lg mb-2">
        {category.label}
      </h3>

      <p className="text-sm text-muted">
        {category.skills.length} skills
      </p>
    </motion.button>
  );
}

export default function Skills() {
  const { skills } = useContent();
  const [activeCategory, setActiveCategory] = useState(skills[0]?.id || '');

  const selectedCategory = skills.find((c) => c.id === activeCategory) || skills[0];

  // Prepare radar data from all categories
  const radarData = skills.map((cat) => ({
    label: cat.label,
    value: Math.round(cat.skills.reduce((sum, s) => sum + s.level, 0) / cat.skills.length),
  }));

  return (
    <section id="skills" className="py-24 px-6 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute bottom-0 left-0 w-80 h-80 accent-blob rounded-full blur-3xl" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={containerVariants}
        className="max-w-6xl mx-auto relative z-10"
      >
        {/* Section header */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 pill px-4 py-2 rounded-full mb-6 text-muted">
            <Code size={16} className="text-accent" />
            <span className="text-sm font-medium">Expertise</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-accent neon-text">Skills & Technologies</span>
          </h2>

          <p className="text-lg text-muted max-w-2xl mx-auto">
            A comprehensive toolkit for creating stunning 3D experiences
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Category cards */}
          <div className="lg:col-span-1 space-y-4">
            {skills.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                isActive={category.id === activeCategory}
                onClick={() => setActiveCategory(category.id)}
              />
            ))}
          </div>

          {/* Skills detail */}
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 card p-8 rounded-2xl"
          >
            <h3 className="text-2xl font-bold mb-8">
              {selectedCategory?.label}
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {selectedCategory?.skills.map((skill, index) => (
                <SkillBar
                  key={skill.name}
                  name={skill.name}
                  level={skill.level}
                  tip={skill.tip}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Radar chart summary */}
        <motion.div variants={itemVariants} className="mt-12 flex justify-center">
          <div className="card p-8 rounded-2xl">
            <h4 className="text-lg font-semibold text-center mb-6">
              Skill Overview
            </h4>
            <MiniRadar data={radarData} size={280} />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
