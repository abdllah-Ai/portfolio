// src/components/Contact.jsx
// Contact section with form and social links
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Download, Linkedin, Github, ExternalLink } from 'lucide-react';
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

function ContactCard({ icon: Icon, label, value, href, isExternal }) {
  const Component = href ? 'a' : 'div';
  const linkProps = href
    ? {
      href,
      target: isExternal ? '_blank' : undefined,
      rel: isExternal ? 'noopener noreferrer' : undefined,
    }
    : {};

  return (
    <Component
      {...linkProps}
      className="contact p-6 rounded-2xl flex items-center gap-4 transition-all cursor-pointer"
    >
      <div className="w-14 h-14 rounded-xl chip flex items-center justify-center flex-shrink-0">
        <Icon size={24} className="text-accent" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted">{label}</p>
        <p className="font-semibold truncate">{value}</p>
      </div>
      {href && (
        <ExternalLink size={18} className="text-muted flex-shrink-0" />
      )}
    </Component>
  );
}

export default function Contact() {
  const { content } = useContent();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mailto fallback
    const mailtoLink = `mailto:${content.email}?subject=${encodeURIComponent(
      formData.subject || 'Contact from Portfolio'
    )}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
    )}`;

    window.location.href = mailtoLink;
  };

  return (
    <section id="contact" className="py-24 px-6 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 accent-blob rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 accent-blob rounded-full blur-3xl" />

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
            <Mail size={16} className="text-accent" />
            <span className="text-sm font-medium">Get in Touch</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-accent neon-text">Let's Connect</span>
          </h2>

          <p className="text-lg text-muted max-w-2xl mx-auto">
            Ready to bring your vision to life? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact form */}
          <motion.div variants={itemVariants}>
            <div className="card p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-6">
                Send a Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-muted mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl input focus:outline-none transition-all"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl input focus:outline-none transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl input focus:outline-none transition-all"
                    placeholder="Project inquiry"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl input focus:outline-none transition-all resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3"
                >
                  <Send size={20} />
                  Send Message
                </button>
              </form>
            </div>
          </motion.div>

          {/* Contact info */}
          <motion.div variants={itemVariants} className="space-y-6">
            <ContactCard
              icon={Mail}
              label="Email"
              value={content.email || 'hello@example.com'}
              href={`mailto:${content.email}`}
            />

            <ContactCard
              icon={Phone}
              label="Phone"
              value={content.phone || '+1 (555) 123-4567'}
              href={`tel:${content.phone}`}
            />

            <ContactCard
              icon={MapPin}
              label="Location"
              value={content.location || 'Los Angeles, CA'}
            />

            <ContactCard
              icon={Linkedin}
              label="LinkedIn"
              value="Connect with us"
              href={content.linkedin}
              isExternal
            />

            <ContactCard
              icon={Github}
              label="GitHub"
              value="View our work"
              href={content.github}
              isExternal
            />

            {/* Download CV CTA */}
            <a
              href={content.resumeUrl || '/resume/Abdallah_Salah_CV.pdf'}
              download
              className="btn-primary w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 mt-8"
            >
              <Download size={20} />
              Download Resume / CV
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
