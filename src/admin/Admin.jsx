// src/admin/Admin.jsx
// Admin page with full CRUD for all content sections
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Save, Download, Upload, Eye, LogOut, Plus, Trash2, Edit2,
  User, Briefcase, Code, Folder, FlaskConical, BookOpen, Award, Image, Palette
} from 'lucide-react';
import { useContent } from '../context/ContentContext.jsx';
import { defaultTheme, normalizeTheme, themeFields } from '../theme/themeConfig.js';

const TABS = [
  { id: 'general', label: 'General', icon: User },
  { id: 'projects', label: 'Projects', icon: Folder },
  { id: 'skills', label: 'Skills', icon: Code },
  { id: 'labs', label: 'Labs', icon: FlaskConical },
  { id: 'blog', label: 'Blog', icon: BookOpen },
  { id: 'certificates', label: 'Certificates', icon: Award },
  { id: 'gallery', label: 'Gallery', icon: Image },
  { id: 'theme', label: 'Theme', icon: Palette },
];

const toStringArray = (value, delimiter = ',') => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    if (delimiter instanceof RegExp) {
      return value.split(delimiter).map((item) => item.trim()).filter(Boolean);
    }
    return value.split(delimiter).map((item) => item.trim()).filter(Boolean);
  }
  return [];
};

const toLineArray = (value) => toStringArray(value, /\r?\n/);

const formatArray = (value, delimiter = ', ') => (
  Array.isArray(value) ? value.join(delimiter) : (value || '')
);

const clampNumber = (value, min, max, fallback = min) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
};

const normalizeContentDraft = (draft) => {
  const next = { ...draft };
  next.theme = normalizeTheme({ ...defaultTheme, ...(next.theme || {}) });
  next.taglinePhrases = toLineArray(next.taglinePhrases);
  next.projects = (Array.isArray(next.projects) ? next.projects : []).map((project) => ({
    ...project,
    tags: toStringArray(project?.tags),
    tech: toStringArray(project?.tech),
    highlights: toLineArray(project?.highlights),
  }));
  next.labs = Array.isArray(next.labs) ? next.labs : [];
  next.blog = (Array.isArray(next.blog) ? next.blog : []).map((post) => ({
    ...post,
    tags: toStringArray(post?.tags),
  }));
  next.certificates = Array.isArray(next.certificates) ? next.certificates : [];
  next.gallery = Array.isArray(next.gallery) ? next.gallery : [];
  next.about = next.about || {};
  return next;
};

const normalizeSkillsDraft = (value, fallback = []) => {
  if (!Array.isArray(value)) return fallback;
  return value.map((category) => {
    const skills = Array.isArray(category?.skills) ? category.skills : [];
    return {
      ...category,
      id: category?.id ? String(category.id) : '',
      label: category?.label ? String(category.label) : '',
      skills: skills.map((skill) => ({
        ...skill,
        name: skill?.name ? String(skill.name) : '',
        tip: skill?.tip ? String(skill.tip) : '',
        level: clampNumber(skill?.level, 0, 100, 0),
      })),
    };
  });
};

function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isFirstTime, setIsFirstTime] = useState(false);

  useEffect(() => {
    const storedPass = localStorage.getItem('site.admin.pass');
    setIsFirstTime(!storedPass);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Password required');
      return;
    }
    const success = onLogin(password);
    if (!success) {
      setError('Incorrect password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center admin-shell dark p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-8 rounded-2xl max-w-md w-full"
      >
        <h1 className="text-2xl font-bold mb-2 neon-text">Admin Access</h1>
        <p className="text-sm text-muted mb-6">
          {isFirstTime ? 'Set your admin password' : 'Enter your password to continue'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isFirstTime ? 'Create password' : 'Password'}
              className="w-full px-4 py-3 rounded-xl input focus:outline-none"
            />
            {error && <p className="text-accent text-sm mt-2">{error}</p>}
          </div>
          <button type="submit" className="btn-primary w-full py-3 rounded-xl font-semibold">
            {isFirstTime ? 'Set Password' : 'Login'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function GeneralTab({ draft, setDraft }) {
  const updateField = (key, value) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const updateAbout = (key, value) => {
    setDraft((prev) => ({
      ...prev,
      about: { ...prev.about, [key]: value },
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">General Information</h2>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1">Name</label>
          <input
            type="text"
            value={draft.name || ''}
            onChange={(e) => updateField('name', e.target.value)}
            className="w-full px-4 py-2 rounded-lg input"
          />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Title</label>
          <input
            type="text"
            value={draft.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            className="w-full px-4 py-2 rounded-lg input"
          />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Location</label>
          <input
            type="text"
            value={draft.location || ''}
            onChange={(e) => updateField('location', e.target.value)}
            className="w-full px-4 py-2 rounded-lg input"
          />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Email</label>
          <input
            type="email"
            value={draft.email || ''}
            onChange={(e) => updateField('email', e.target.value)}
            className="w-full px-4 py-2 rounded-lg input"
          />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Phone</label>
          <input
            type="text"
            value={draft.phone || ''}
            onChange={(e) => updateField('phone', e.target.value)}
            className="w-full px-4 py-2 rounded-lg input"
          />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Resume URL</label>
          <input
            type="text"
            value={draft.resumeUrl || ''}
            onChange={(e) => updateField('resumeUrl', e.target.value)}
            className="w-full px-4 py-2 rounded-lg input"
          />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">LinkedIn URL</label>
          <input
            type="url"
            value={draft.linkedin || ''}
            onChange={(e) => updateField('linkedin', e.target.value)}
            className="w-full px-4 py-2 rounded-lg input"
          />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">GitHub URL</label>
          <input
            type="url"
            value={draft.github || ''}
            onChange={(e) => updateField('github', e.target.value)}
            className="w-full px-4 py-2 rounded-lg input"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-muted mb-1">Tagline Phrases (one per line)</label>
        <textarea
          value={(draft.taglinePhrases || []).join('\n')}
          onChange={(e) => updateField('taglinePhrases', toLineArray(e.target.value))}
          rows={4}
          className="w-full px-4 py-2 rounded-lg input"
        />
      </div>

      <h3 className="text-lg font-semibold mt-8 mb-4">About Section</h3>
      <div>
        <label className="block text-sm text-muted mb-1">Headline</label>
        <input
          type="text"
          value={draft.about?.headline || ''}
          onChange={(e) => updateAbout('headline', e.target.value)}
          className="w-full px-4 py-2 rounded-lg input"
        />
      </div>
      <div>
        <label className="block text-sm text-muted mb-1">Intro Text</label>
        <textarea
          value={draft.about?.intro || ''}
          onChange={(e) => updateAbout('intro', e.target.value)}
          rows={3}
          className="w-full px-4 py-2 rounded-lg input"
        />
      </div>
    </div>
  );
}

function ProjectsTab({ draft, setDraft }) {
  const projects = draft.projects || [];

  const addProject = () => {
    setDraft((prev) => ({
      ...prev,
      projects: [
        ...(Array.isArray(prev.projects) ? prev.projects : []),
        {
          title: 'New Project',
          slug: 'new-project-' + Date.now(),
          tags: [],
          blurb: '',
          highlights: [],
          tech: [],
          image: '',
          repo: '',
          demo: '',
        },
      ],
    }));
  };

  const updateProject = (index, key, value) => {
    setDraft((prev) => ({
      ...prev,
      projects: (Array.isArray(prev.projects) ? prev.projects : []).map((p, i) =>
        i === index ? { ...p, [key]: value } : p
      ),
    }));
  };

  const removeProject = (index) => {
    setDraft((prev) => ({
      ...prev,
      projects: (Array.isArray(prev.projects) ? prev.projects : []).filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Projects</h2>
        <button onClick={addProject} className="btn-primary px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={16} /> Add Project
        </button>
      </div>

      {projects.map((project, index) => (
        <div key={project.slug} className="card p-6 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{project.title}</h3>
            <button onClick={() => removeProject(index)} className="admin-danger transition-opacity">
              <Trash2 size={18} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted mb-1">Title</label>
              <input
                type="text"
                value={project.title}
                onChange={(e) => updateProject(index, 'title', e.target.value)}
                className="w-full px-3 py-2 rounded-lg input text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Slug</label>
              <input
                type="text"
                value={project.slug}
                onChange={(e) => updateProject(index, 'slug', e.target.value)}
                className="w-full px-3 py-2 rounded-lg input text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-muted mb-1">Blurb</label>
            <textarea
              value={project.blurb}
              onChange={(e) => updateProject(index, 'blurb', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-lg input text-sm"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                value={(project.tags || []).join(', ')}
                onChange={(e) => updateProject(index, 'tags', toStringArray(e.target.value))}
                className="w-full px-3 py-2 rounded-lg input text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Tech (comma-separated)</label>
              <input
                type="text"
                value={(project.tech || []).join(', ')}
                onChange={(e) => updateProject(index, 'tech', toStringArray(e.target.value))}
                className="w-full px-3 py-2 rounded-lg input text-sm"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-muted mb-1">Image URL</label>
              <input
                type="text"
                value={project.image || ''}
                onChange={(e) => updateProject(index, 'image', e.target.value)}
                className="w-full px-3 py-2 rounded-lg input text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Repo URL</label>
              <input
                type="text"
                value={project.repo || ''}
                onChange={(e) => updateProject(index, 'repo', e.target.value)}
                className="w-full px-3 py-2 rounded-lg input text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Demo URL</label>
              <input
                type="text"
                value={project.demo || ''}
                onChange={(e) => updateProject(index, 'demo', e.target.value)}
                className="w-full px-3 py-2 rounded-lg input text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-muted mb-1">Highlights (one per line)</label>
            <textarea
              value={(project.highlights || []).join('\n')}
              onChange={(e) => updateProject(index, 'highlights', toLineArray(e.target.value))}
              rows={3}
              className="w-full px-3 py-2 rounded-lg input text-sm"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function ThemeTab({ draft, setDraft, onReset }) {
  const theme = draft.theme || {};
  const normalizedTheme = normalizeTheme({ ...defaultTheme, ...theme });

  const updateTheme = (key, value) => {
    setDraft((prev) => ({
      ...prev,
      theme: { ...prev.theme, [key]: value },
    }));
  };

  const groupedFields = themeFields.reduce((acc, field) => {
    if (!acc[field.group]) acc[field.group] = [];
    acc[field.group].push(field);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Theme Editor</h2>
          <p className="text-muted text-sm">Customize colors and styling. Changes are applied live.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (onReset) {
              onReset();
              return;
            }
            setDraft((prev) => ({
              ...prev,
              theme: normalizeTheme(defaultTheme),
            }));
          }}
          className="btn-ghost px-4 py-2 rounded-lg text-sm"
        >
          Reset Palette
        </button>
      </div>

      {Object.entries(groupedFields).map(([group, fields]) => (
        <div key={group} className="card p-6 rounded-xl">
          <h3 className="font-semibold mb-4">{group}</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fields.map((field) => (
              <div key={field.key} className="flex items-center gap-3">
                <input
                  type="color"
                  value={normalizedTheme[field.key]}
                  onChange={(e) => updateTheme(field.key, e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer admin-swatch"
                />
                <div className="flex-1">
                  <p className="text-sm">{field.label}</p>
                  <input
                    type="text"
                    value={theme[field.key] || ''}
                    onChange={(e) => updateTheme(field.key, e.target.value)}
                    onBlur={() => setDraft((prev) => ({
                      ...prev,
                      theme: normalizeTheme({ ...defaultTheme, ...(prev.theme || {}) }),
                    }))}
                    className="w-full px-2 py-1 text-xs rounded input text-muted"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function SkillsTab({ draftSkills, setDraftSkills }) {
  const categories = Array.isArray(draftSkills) ? draftSkills : [];

  const addCategory = () => {
    setDraftSkills((prev) => {
      const next = normalizeSkillsDraft(prev, []);
      next.push({
        id: `category-${Date.now()}`,
        label: 'New Category',
        skills: [],
      });
      return next;
    });
  };

  const updateCategory = (index, key, value) => {
    setDraftSkills((prev) => {
      const next = normalizeSkillsDraft(prev, []);
      if (!next[index]) return next;
      next[index] = { ...next[index], [key]: value };
      return next;
    });
  };

  const removeCategory = (index) => {
    setDraftSkills((prev) => normalizeSkillsDraft(prev, []).filter((_, i) => i !== index));
  };

  const addSkill = (categoryIndex) => {
    setDraftSkills((prev) => {
      const next = normalizeSkillsDraft(prev, []);
      const category = next[categoryIndex];
      if (!category) return next;
      const skills = Array.isArray(category.skills) ? category.skills : [];
      const nextSkills = [...skills, { name: 'New Skill', level: 80, tip: '' }];
      next[categoryIndex] = { ...category, skills: nextSkills };
      return next;
    });
  };

  const updateSkill = (categoryIndex, skillIndex, key, value) => {
    setDraftSkills((prev) => {
      const next = normalizeSkillsDraft(prev, []);
      const category = next[categoryIndex];
      if (!category) return next;
      const skills = Array.isArray(category.skills) ? category.skills : [];
      const nextSkills = skills.map((skill, index) => {
        if (index !== skillIndex) return skill;
        const nextValue = key === 'level'
          ? clampNumber(value, 0, 100, 0)
          : value;
        return { ...skill, [key]: nextValue };
      });
      next[categoryIndex] = { ...category, skills: nextSkills };
      return next;
    });
  };

  const removeSkill = (categoryIndex, skillIndex) => {
    setDraftSkills((prev) => {
      const next = normalizeSkillsDraft(prev, []);
      const category = next[categoryIndex];
      if (!category) return next;
      const skills = Array.isArray(category.skills) ? category.skills : [];
      next[categoryIndex] = {
        ...category,
        skills: skills.filter((_, index) => index !== skillIndex),
      };
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Skills</h2>
        <button onClick={addCategory} className="btn-primary px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={16} /> Add Category
        </button>
      </div>

      {categories.length === 0 && (
        <p className="text-sm text-muted">No categories yet. Add one to get started.</p>
      )}

      {categories.map((category, categoryIndex) => {
        const skills = Array.isArray(category.skills) ? category.skills : [];
        return (
        <div key={category.id || categoryIndex} className="card p-6 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Category</h3>
            <button
              type="button"
              onClick={() => removeCategory(categoryIndex)}
              className="admin-danger transition-opacity"
              aria-label="Remove category"
            >
              <Trash2 size={18} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted mb-1">ID</label>
              <input
                type="text"
                value={category.id || ''}
                onChange={(e) => updateCategory(categoryIndex, 'id', e.target.value)}
                className="w-full px-3 py-2 rounded-lg input text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Label</label>
              <input
                type="text"
                value={category.label || ''}
                onChange={(e) => updateCategory(categoryIndex, 'label', e.target.value)}
                className="w-full px-3 py-2 rounded-lg input text-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <h4 className="font-semibold">Skills</h4>
            <button
              type="button"
              onClick={() => addSkill(categoryIndex)}
              className="btn-ghost px-3 py-2 rounded-lg flex items-center gap-2 text-sm"
            >
              <Plus size={14} /> Add Skill
            </button>
          </div>

          {skills.length === 0 && (
            <p className="text-sm text-muted">No skills yet. Add one to this category.</p>
          )}

          <div className="space-y-3">
            {skills.map((skill, skillIndex) => (
              <div key={`${category.id || categoryIndex}-skill-${skillIndex}`} className="card p-4 rounded-xl space-y-3">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeSkill(categoryIndex, skillIndex)}
                    className="admin-danger transition-opacity"
                    aria-label="Remove skill"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="grid md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-muted mb-1">Name</label>
                    <input
                      type="text"
                      value={skill.name || ''}
                      onChange={(e) => updateSkill(categoryIndex, skillIndex, 'name', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg input text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted mb-1">Level (0-100)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={Number.isFinite(Number(skill.level)) ? Number(skill.level) : 0}
                      onChange={(e) => updateSkill(categoryIndex, skillIndex, 'level', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg input text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted mb-1">Tip</label>
                    <input
                      type="text"
                      value={skill.tip || ''}
                      onChange={(e) => updateSkill(categoryIndex, skillIndex, 'tip', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg input text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        );
      })}
    </div>
  );
}

function SimpleListTab({ title, items, setItems, fields }) {
  const safeItems = Array.isArray(items) ? items : [];

  const addItem = () => {
    const newItem = {};
    fields.forEach((f) => {
      newItem[f.key] = f.default || '';
    });
    setItems([...safeItems, newItem]);
  };

  const updateItem = (index, key, value, parser) => {
    const nextValue = parser ? parser(value) : value;
    setItems(safeItems.map((item, i) => (i === index ? { ...item, [key]: nextValue } : item)));
  };

  const removeItem = (index) => {
    setItems(safeItems.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{title}</h2>
        <button onClick={addItem} className="btn-primary px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={16} /> Add
        </button>
      </div>

      {safeItems.map((item, index) => (
        <div key={index} className="card p-4 rounded-xl">
          <div className="flex justify-end mb-2">
            <button onClick={() => removeItem(index)} className="admin-danger transition-opacity">
              <Trash2 size={16} />
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {fields.map((field) => (
              <div key={field.key}>
                <label className="block text-xs text-muted mb-1">{field.label}</label>
                <input
                  type="text"
                  value={field.format ? field.format(item[field.key]) : (item[field.key] || '')}
                  onChange={(e) => updateItem(index, field.key, e.target.value, field.parse)}
                  className="w-full px-3 py-2 rounded-lg input text-sm"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Admin() {
  const { content, skills, saveContent, updateSkills, replaceContent, resetContent, authed, login, logout } = useContent();
  const [activeTab, setActiveTab] = useState('general');
  const [draft, setDraft] = useState({ ...content });
  const [draftSkills, setDraftSkills] = useState([...skills]);

  useEffect(() => {
    setDraft(normalizeContentDraft(content));
    setDraftSkills(normalizeSkillsDraft(skills));
  }, [content, skills]);

  if (!authed) {
    return <LoginScreen onLogin={login} />;
  }

  const handleSave = () => {
    const normalized = normalizeContentDraft(draft);
    const normalizedSkills = normalizeSkillsDraft(draftSkills, skills);
    saveContent(normalized);
    updateSkills(normalizedSkills);
    setDraft(normalized);
    setDraftSkills(normalizedSkills);
    alert('Saved successfully!');
  };

  const handleExport = () => {
    const normalized = normalizeContentDraft(draft);
    const normalizedSkills = normalizeSkillsDraft(draftSkills, skills);
    const data = { ...normalized, skills: normalizedSkills };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'site-content.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const raw = JSON.parse(event.target?.result);
        const payload = raw?.content || raw;
        const importedSkills = raw?.skills || payload?.skills;
        const normalized = normalizeContentDraft(payload || {});
        setDraft(normalized);
        if (importedSkills) {
          setDraftSkills(normalizeSkillsDraft(importedSkills, skills));
        }
        alert('Imported successfully!');
      } catch {
        alert('Failed to parse JSON');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handlePreview = () => {
    window.open('/', '_blank');
  };

  const handleResetTheme = () => {
    const resetTheme = normalizeTheme(defaultTheme);
    saveContent({ theme: resetTheme });
    setDraft((prev) => ({ ...prev, theme: resetTheme }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralTab draft={draft} setDraft={setDraft} />;
      case 'projects':
        return <ProjectsTab draft={draft} setDraft={setDraft} />;
      case 'theme':
        return <ThemeTab draft={draft} setDraft={setDraft} onReset={handleResetTheme} />;
      case 'labs':
        return (
          <SimpleListTab
            title="Labs"
            items={draft.labs || []}
            setItems={(items) => setDraft((prev) => ({ ...prev, labs: items }))}
            fields={[
              { key: 'title', label: 'Title' },
              { key: 'kind', label: 'Kind (image/gif/video)' },
              { key: 'src', label: 'Source URL' },
              { key: 'note', label: 'Note' },
            ]}
          />
        );
      case 'blog':
        return (
          <SimpleListTab
            title="Blog Posts"
            items={draft.blog || []}
            setItems={(items) => setDraft((prev) => ({ ...prev, blog: items }))}
            fields={[
              { key: 'title', label: 'Title' },
              { key: 'slug', label: 'Slug' },
              {
                key: 'tags',
                label: 'Tags (comma-sep)',
                parse: toStringArray,
                format: (value) => formatArray(value),
              },
              { key: 'read', label: 'Read Time' },
              { key: 'date', label: 'Date (YYYY-MM-DD)' },
            ]}
          />
        );
      case 'certificates':
        return (
          <SimpleListTab
            title="Certificates"
            items={draft.certificates || []}
            setItems={(items) => setDraft((prev) => ({ ...prev, certificates: items }))}
            fields={[
              { key: 'title', label: 'Title' },
              { key: 'issuer', label: 'Issuer' },
              { key: 'year', label: 'Year' },
              { key: 'credentialUrl', label: 'Credential URL' },
              { key: 'logo', label: 'Logo URL' },
              { key: 'takeaway', label: 'Takeaway' },
            ]}
          />
        );
      case 'gallery':
        return (
          <SimpleListTab
            title="Gallery"
            items={draft.gallery || []}
            setItems={(items) => setDraft((prev) => ({ ...prev, gallery: items }))}
            fields={[
              { key: 'title', label: 'Title' },
              { key: 'kind', label: 'Kind (image/lottie)' },
              { key: 'src', label: 'Source URL' },
            ]}
          />
        );
      case 'skills':
        return <SkillsTab draftSkills={draftSkills} setDraftSkills={setDraftSkills} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen admin-shell dark">
      {/* Header */}
      <header className="sticky top-0 z-50 admin-header">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold neon-text">Admin Panel</h1>

          <div className="flex items-center gap-3">
            <button onClick={handlePreview} className="btn-ghost px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
              <Eye size={16} /> Preview
            </button>
            <label className="btn-ghost px-4 py-2 rounded-lg flex items-center gap-2 text-sm cursor-pointer">
              <Upload size={16} /> Import
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
            <button onClick={handleExport} className="btn-ghost px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
              <Download size={16} /> Export
            </button>
            <button onClick={handleSave} className="btn-primary px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
              <Save size={16} /> Save
            </button>
            <button onClick={logout} className="btn-ghost px-3 py-2 rounded-lg admin-danger transition-opacity">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        {/* Sidebar */}
        <nav className="w-48 flex-shrink-0 space-y-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all admin-nav-item ${activeTab === tab.id
                    ? 'admin-nav-item-active'
                    : ''
                  }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Content */}
        <main className="flex-1 min-w-0">{renderTabContent()}</main>
      </div>
    </div>
  );
}
