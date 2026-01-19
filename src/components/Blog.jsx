// src/components/Blog.jsx
// Blog section with post cards
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, Clock, ArrowRight } from 'lucide-react';
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

function BlogCard({ post }) {
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <motion.article
      variants={itemVariants}
      className="card p-6 rounded-2xl group cursor-pointer"
    >
      <div className="flex flex-wrap gap-2 mb-4">
        {post.tags?.map((tag) => (
          <span key={tag} className="tag text-xs px-2 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>

      <h3 className="text-xl font-bold mb-3 group-hover:opacity-80 transition-opacity">
        {post.title}
      </h3>

      <div className="flex items-center gap-4 text-sm text-muted">
        <span className="flex items-center gap-1">
          <Calendar size={14} />
          {formattedDate}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={14} />
          {post.read}
        </span>
      </div>

      <div className="mt-4 pt-4 divider">
        <span className="text-sm font-medium text-accent neon-text flex items-center gap-1 group-hover:gap-2 transition-all">
          Read More <ArrowRight size={14} />
        </span>
      </div>
    </motion.article>
  );
}

export default function Blog() {
  const { content } = useContent();
  const posts = content.blog || [];

  if (posts.length === 0) return null;

  return (
    <section id="blog" className="py-24 px-6 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute bottom-0 right-1/4 w-72 h-72 accent-blob rounded-full blur-3xl" />

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
            <BookOpen size={16} className="text-accent" />
            <span className="text-sm font-medium">Insights</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-accent neon-text">Latest Articles</span>
          </h2>

          <p className="text-lg text-muted max-w-2xl mx-auto">
            Thoughts, tutorials, and industry insights
          </p>
        </motion.div>

        {/* Blog grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
