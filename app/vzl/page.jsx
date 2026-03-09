'use client';
import { useState, useEffect } from 'react';
import { Trash2, Plus, LogOut, Pencil } from 'lucide-react';

export default function AdminPanel() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');

  // Social & admin state
  const [social, setSocial] = useState({ email: '', phone: '', links: [] });
  const [admin, setAdmin] = useState({ password: 'admin123' });

  // Editor modal state (minimal UI)
  const [editorModal, setEditorModal] = useState({
    isOpen: false,
    type: '',
    mode: 'edit',
    index: null,
  });
  const [tempProject, setTempProject] = useState({
    title: '',
    description: '',
    tech: '',
    category: '',
    image: '',
    github: '',
  });
  const [tempSkill, setTempSkill] = useState({
    name: '',
    logo: '',
    color: '#000000',
  });
  const [tempContact, setTempContact] = useState({ email: '', phone: '' });
  const [tempSocialLink, setTempSocialLink] = useState({
    platform: '',
    url: '',
    icon: '',
    showInHero: false,
  });

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null,
  });

  const [imageUploading, setImageUploading] = useState(false);

  // Handle project image upload
  const handleImageUpload = async (file) => {
    if (!file) return;
    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const activeToken = token || localStorage.getItem('adminToken') || '';
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'x-admin-token': activeToken },
        body: formData,
      });
      if (res.ok) {
        const { url } = await res.json();
        setTempProject((prev) => ({ ...prev, image: url }));
      } else {
        showMessage('Image upload failed', true);
      }
    } catch {
      showMessage('Error uploading image', true);
    } finally {
      setImageUploading(false);
    }
  };

  // Check for saved token
  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    if (savedToken) {
      setToken(savedToken);
      setAuthenticated(true);
      fetchData();
    }
  }, []);

  // Fetch data from API
  const fetchData = async (savedToken = token) => {
    try {
      const [projectsRes, skillsRes, socialRes, adminRes] = await Promise.all([
        fetch('/api/content/projects'),
        fetch('/api/content/skills'),
        fetch('/api/content/social'),
        fetch('/api/content/admin'),
      ]);
      const projectsData = await projectsRes.json();
      const skillsData = await skillsRes.json();
      const socialData = await socialRes.json();
      const adminData = await adminRes.json();
      setProjects(projectsData);
      setSkills(skillsData);
      setSocial(socialData);
      setAdmin(adminData);
    } catch (error) {
      showMessage('Error loading data', true);
    }
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const adminData = await fetch('/api/content/admin').then(r => r.json());
      if (password === adminData.password) {
        const newToken = adminData.password;
        setToken(newToken);
        setAuthenticated(true);
        localStorage.setItem('adminToken', newToken);
        setPassword('');
        fetchData(newToken);
        showMessage('Authenticated successfully');
      } else {
        showMessage('Invalid password', true);
      }
    } catch (error) {
      showMessage('Error verifying password', true);
    }
  };

  // Handle logout
  const handleLogout = () => {
    setAuthenticated(false);
    setToken('');
    localStorage.removeItem('adminToken');
    setProjects([]);
    setSkills([]);
  };

  // Show message
  const showMessage = (msg, isError = false) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  // Update project
  const updateProject = async (index, updatedProject) => {
    const newProjects = [...projects];
    newProjects[index] = updatedProject;

    setLoading(true);
    try {
      const response = await fetch('/api/content/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token,
        },
        body: JSON.stringify(newProjects),
      });

      if (response.ok) {
        setProjects(newProjects);
        showMessage('Project updated');
      } else {
        showMessage('Failed to update project', true);
      }
    } catch (error) {
      showMessage('Error updating project', true);
    } finally {
      setLoading(false);
    }
  };

  // Delete project
  const deleteProject = async (index) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Project',
      message: `Are you sure you want to delete "${projects[index].title}"? This action cannot be undone.`,
      onConfirm: () => performDeleteProject(index),
      onCancel: () => setConfirmModal({ ...confirmModal, isOpen: false }),
    });
  };

  const performDeleteProject = async (index) => {
    setConfirmModal({ ...confirmModal, isOpen: false });

    const newProjects = projects.filter((_, i) => i !== index);

    setLoading(true);
    try {
      const response = await fetch('/api/content/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token,
        },
        body: JSON.stringify(newProjects),
      });

      if (response.ok) {
        setProjects(newProjects);
        showMessage('Project deleted');
      } else {
        showMessage('Failed to delete project', true);
      }
    } catch (error) {
      showMessage('Error deleting project', true);
    } finally {
      setLoading(false);
    }
  };

  // Add project
  const addProject = async (projectData) => {
    const techArray = projectData.tech.split(',').map((t) => t.trim()).filter(Boolean);

    if (!projectData.title || !projectData.description || techArray.length === 0) {
      showMessage('Please fill in all fields', true);
      return;
    }

    const project = {
      ...projectData,
      tech: techArray,
    };

    const updatedProjects = [...projects, project];
    setLoading(true);

    try {
      const response = await fetch('/api/content/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token,
        },
        body: JSON.stringify(updatedProjects),
      });

      if (response.ok) {
        setProjects(updatedProjects);
        showMessage('Project added');
      } else {
        showMessage('Failed to add project', true);
      }
    } catch (error) {
      showMessage('Error adding project', true);
    } finally {
      setLoading(false);
    }
  };

  // Update skill
  const updateSkill = async (index, updatedSkill) => {
    const newSkills = [...skills];
    newSkills[index] = updatedSkill;

    setLoading(true);
    try {
      const response = await fetch('/api/content/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token,
        },
        body: JSON.stringify(newSkills),
      });

      if (response.ok) {
        setSkills(newSkills);
        showMessage('Skill updated');
      } else {
        showMessage('Failed to update skill', true);
      }
    } catch (error) {
      showMessage('Error updating skill', true);
    } finally {
      setLoading(false);
    }
  };

  // Delete skill
  const deleteSkill = async (index) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Skill',
      message: `Are you sure you want to delete "${skills[index].name}"? This action cannot be undone.`,
      onConfirm: () => performDeleteSkill(index),
      onCancel: () => setConfirmModal({ ...confirmModal, isOpen: false }),
    });
  };

  const performDeleteSkill = async (index) => {
    setConfirmModal({ ...confirmModal, isOpen: false });

    const newSkills = skills.filter((_, i) => i !== index);

    setLoading(true);
    try {
      const response = await fetch('/api/content/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token,
        },
        body: JSON.stringify(newSkills),
      });

      if (response.ok) {
        setSkills(newSkills);
        showMessage('Skill deleted');
      } else {
        showMessage('Failed to delete skill', true);
      }
    } catch (error) {
      showMessage('Error deleting skill', true);
    } finally {
      setLoading(false);
    }
  };

  // Add skill
  const addSkill = async (skillData) => {
    if (!skillData.name || !skillData.logo) {
      showMessage('Please fill in all fields', true);
      return;
    }

    const skill = {
      ...skillData,
      type: 'image',
    };

    const updatedSkills = [...skills, skill];
    setLoading(true);

    try {
      const response = await fetch('/api/content/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token,
        },
        body: JSON.stringify(updatedSkills),
      });

      if (response.ok) {
        setSkills(updatedSkills);
        showMessage('Skill added');
      } else {
        showMessage('Failed to add skill', true);
      }
    } catch (error) {
      showMessage('Error adding skill', true);
    } finally {
      setLoading(false);
    }
  };

  // Update social info
  const updateSocial = async (updatedSocial) => {
    setLoading(true);
    try {
      const response = await fetch('/api/content/social', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token,
        },
        body: JSON.stringify(updatedSocial),
      });

      if (response.ok) {
        setSocial(updatedSocial);
        showMessage('Social info updated');
      } else {
        showMessage('Failed to update social info', true);
      }
    } catch (error) {
      showMessage('Error updating social info', true);
    } finally {
      setLoading(false);
    }
  };

  const openProjectEditor = (mode, index = null) => {
    if (mode === 'edit' && index !== null) {
      const project = projects[index];
      setTempProject({
        ...project,
        tech: Array.isArray(project.tech) ? project.tech.join(', ') : project.tech,
      });
    } else {
      setTempProject({ title: '', description: '', tech: '', category: '', image: '', github: '' });
    }
    setEditorModal({ isOpen: true, type: 'project', mode, index });
  };

  const openSkillEditor = (mode, index = null) => {
    if (mode === 'edit' && index !== null) {
      const skill = skills[index];
      setTempSkill({ name: skill.name, logo: skill.logo, color: skill.color || '#000000' });
    } else {
      setTempSkill({ name: '', logo: '', color: '#000000' });
    }
    setEditorModal({ isOpen: true, type: 'skill', mode, index });
  };

  const openContactEditor = () => {
    setTempContact({ email: social.email || '', phone: social.phone || '' });
    setEditorModal({ isOpen: true, type: 'contact', mode: 'edit', index: null });
  };

  const openSocialLinkEditor = (index = null) => {
    if (index !== null) {
      const link = social.links[index];
      setTempSocialLink({ platform: link.platform, url: link.url, icon: link.icon, showInHero: link.showInHero ?? false });
      setEditorModal({ isOpen: true, type: 'socialLink', mode: 'edit', index });
    } else {
      setTempSocialLink({ platform: '', url: '', icon: '', showInHero: false });
      setEditorModal({ isOpen: true, type: 'socialLink', mode: 'add', index: null });
    }
  };

  // Toggle showInHero for a social link
  const toggleHeroLink = async (index) => {
    const link = social.links[index];
    const currentlyShown = link.showInHero ?? false;
    const heroCount = social.links.filter((l) => l.showInHero).length;
    if (!currentlyShown && heroCount >= 4) {
      showMessage('Maximum 4 links can be shown in Hero', true);
      return;
    }
    const updatedLinks = social.links.map((l, i) =>
      i === index ? { ...l, showInHero: !currentlyShown } : l
    );
    await updateSocial({ ...social, links: updatedLinks });
  };

  const closeEditor = () => {
    setEditorModal({ ...editorModal, isOpen: false });
  };

  const saveEditor = async () => {
    if (editorModal.type === 'project') {
      if (editorModal.mode === 'add') {
        await addProject(tempProject);
      } else if (editorModal.index !== null) {
        const updatedProject = {
          ...tempProject,
          tech: tempProject.tech.split(',').map((t) => t.trim()).filter(Boolean),
        };
        await updateProject(editorModal.index, updatedProject);
      }
    }

    if (editorModal.type === 'skill') {
      if (editorModal.mode === 'add') {
        await addSkill(tempSkill);
      } else if (editorModal.index !== null) {
        await updateSkill(editorModal.index, { ...tempSkill, type: 'image' });
      }
    }

    if (editorModal.type === 'contact') {
      await updateSocial({ ...social, email: tempContact.email, phone: tempContact.phone });
    }

    if (editorModal.type === 'socialLink' && editorModal.index !== null) {
      const updatedLinks = [...social.links];
      updatedLinks[editorModal.index] = { ...tempSocialLink };
      await updateSocial({ ...social, links: updatedLinks });
    }

    if (editorModal.type === 'socialLink' && editorModal.mode === 'add') {
      if (!tempSocialLink.platform || !tempSocialLink.url) {
        showMessage('Platform and URL are required', true);
        return;
      }
      const heroCount = social.links.filter((l) => l.showInHero).length;
      const newLink = {
        ...tempSocialLink,
        showInHero: tempSocialLink.showInHero && heroCount < 4,
      };
      await updateSocial({ ...social, links: [...social.links, newLink] });
    }

    closeEditor();
  };

  // Delete social link
  const deleteSocialLink = async (index) => {
    const updatedSocial = {
      ...social,
      links: social.links.filter((_, i) => i !== index),
    };

    setLoading(true);
    try {
      const response = await fetch('/api/content/social', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token,
        },
        body: JSON.stringify(updatedSocial),
      });

      if (response.ok) {
        setSocial(updatedSocial);
        showMessage('Social link deleted');
      } else {
        showMessage('Failed to delete social link', true);
      }
    } catch (error) {
      showMessage('Error deleting social link', true);
    } finally {
      setLoading(false);
    }
  };

  // Update admin password
  const updatePassword = async () => {
    if (!admin.password || admin.password.length < 4) {
      showMessage('Password must be at least 4 characters', true);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/content/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token,
        },
        body: JSON.stringify(admin),
      });

      if (response.ok) {
        // Sync new password as token so all subsequent requests stay authenticated
        const newToken = admin.password;
        setToken(newToken);
        localStorage.setItem('adminToken', newToken);
        showMessage('Password updated successfully');
      } else {
        showMessage('Failed to update password', true);
      }
    } catch (error) {
      showMessage('Error updating password', true);
    } finally {
      setLoading(false);
    }
  };

  // Login form
  if (!authenticated) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Admin Panel
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              Enter your password to continue
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all"
                  placeholder="Enter password"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-600 hover:bg-slate-700 dark:bg-slate-500 dark:hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-all duration-300"
              >
                Sign In
              </button>
            </form>

            {message && (
              <div className={`mt-4 p-3 rounded-lg text-sm ${message.includes('successfully') ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'}`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  // Admin panel
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Admin Panel
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition-all"
          >
            <LogOut size={18} />
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${message.includes('successfully') || message.includes('updated') || message.includes('added') || message.includes('deleted') ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'}`}>
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-300 dark:border-gray-700 flex-wrap">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-6 py-3 font-semibold transition-all ${activeTab === 'projects' ? 'text-slate-600 dark:text-slate-400 border-b-2 border-slate-600 dark:border-slate-400' : 'text-slate-400 dark:text-slate-500'}`}
          >
            Projects ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-6 py-3 font-semibold transition-all ${activeTab === 'skills' ? 'text-slate-600 dark:text-slate-400 border-b-2 border-slate-600 dark:border-slate-400' : 'text-slate-400 dark:text-slate-500'}`}
          >
            Skills ({skills.length})
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`px-6 py-3 font-semibold transition-all ${activeTab === 'social' ? 'text-slate-600 dark:text-slate-400 border-b-2 border-slate-600 dark:border-slate-400' : 'text-slate-400 dark:text-slate-500'}`}
          >
            Social & Contact
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-6 py-3 font-semibold transition-all ${activeTab === 'admin' ? 'text-slate-600 dark:text-slate-400 border-b-2 border-slate-600 dark:border-slate-400' : 'text-slate-400 dark:text-slate-500'}`}
          >
            Admin Settings
          </button>
        </div>

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h2>
              <button
                onClick={() => openProjectEditor('add')}
                aria-label="Add project"
                className="w-10 h-10 flex items-center justify-center bg-slate-600 hover:bg-slate-700 dark:bg-slate-500 dark:hover:bg-slate-600 text-white rounded-lg transition-all"
              >
                <Plus size={18} />
              </button>
            </div>

            {projects.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
                <p className="text-slate-600 dark:text-slate-400">No projects yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                    {project.image && (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-36 object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    )}
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{project.title}</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{project.category}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                            {(project.tech?.length || 0)} tech
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openProjectEditor('edit', index)}
                            aria-label="Edit project"
                            className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-slate-50 dark:hover:bg-gray-700 transition-all"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => deleteProject(index)}
                            aria-label="Delete project"
                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">
                        {project.description}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-2 break-all">
                        {project.github}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Skills</h2>
              <button
                onClick={() => openSkillEditor('add')}
                aria-label="Add skill"
                className="w-10 h-10 flex items-center justify-center bg-slate-600 hover:bg-slate-700 dark:bg-slate-500 dark:hover:bg-slate-600 text-white rounded-lg transition-all"
              >
                <Plus size={18} />
              </button>
            </div>

            {skills.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
                <p className="text-slate-600 dark:text-slate-400">No skills yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skills.map((skill, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{skill.name}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 break-all">{skill.logo}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openSkillEditor('edit', index)}
                          aria-label="Edit skill"
                          className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-slate-50 dark:hover:bg-gray-700 transition-all"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => deleteSkill(index)}
                          aria-label="Delete skill"
                          className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: skill.color || '#000000' }} />
                      <span className="text-xs text-slate-500 dark:text-slate-500">{skill.color || '#000000'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Social & Contact Tab */}
        {activeTab === 'social' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Information</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{social.email || 'No email set'}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{social.phone || 'No phone set'}</p>
              </div>
              <button
                onClick={openContactEditor}
                aria-label="Edit contact info"
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-slate-50 dark:hover:bg-gray-700 transition-all"
              >
                <Pencil size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Social Links</h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                    {social.links ? social.links.filter(l => l.showInHero).length : 0}/4 shown in Hero
                  </span>
                  <button
                    onClick={() => openSocialLinkEditor()}
                    aria-label="Add social link"
                    className="w-9 h-9 flex items-center justify-center bg-slate-600 hover:bg-slate-700 dark:bg-slate-500 dark:hover:bg-slate-600 text-white rounded-lg transition-all"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {social.links && social.links.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
                  <p className="text-slate-600 dark:text-slate-400">No social links yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {social.links && social.links.map((link, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{link.platform}</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 break-all">{link.url}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openSocialLinkEditor(index)}
                            aria-label="Edit social link"
                            className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-slate-50 dark:hover:bg-gray-700 transition-all"
                          >
                            <Pencil size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-xs text-slate-500 dark:text-slate-400">Show in Hero</span>
                        <button
                          onClick={() => toggleHeroLink(index)}
                          aria-label={link.showInHero ? 'Remove from Hero' : 'Show in Hero'}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                            link.showInHero
                              ? 'bg-slate-600 dark:bg-slate-500'
                              : 'bg-slate-200 dark:bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                              link.showInHero ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Admin Settings Tab */}
        {activeTab === 'admin' && (
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Admin Settings</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Admin Password
                  </label>
                  <input
                    type="password"
                    value={admin.password}
                    onChange={(e) => setAdmin({ ...admin, password: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-500"
                    placeholder="New password"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Minimum 4 characters</p>
                </div>

                <button
                  onClick={updatePassword}
                  disabled={loading}
                  className="bg-slate-600 hover:bg-slate-700 dark:bg-slate-500 dark:hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>

              </div>
            </div>
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {editorModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {editorModal.mode === 'add' ? 'Add' : 'Edit'}{' '}
                {editorModal.type === 'project' && 'Project'}
                {editorModal.type === 'skill' && 'Skill'}
                {editorModal.type === 'contact' && 'Contact Info'}
                {editorModal.type === 'socialLink' && 'Social Link'}
              </h3>

              {editorModal.type === 'project' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={tempProject.title}
                    onChange={(e) => setTempProject({ ...tempProject, title: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Title"
                  />
                  <input
                    type="text"
                    value={tempProject.category}
                    onChange={(e) => setTempProject({ ...tempProject, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Category"
                  />
                  <textarea
                    value={tempProject.description}
                    onChange={(e) => setTempProject({ ...tempProject, description: e.target.value })}
                    className="md:col-span-2 w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                    placeholder="Description"
                    rows="3"
                  />
                  <input
                    type="text"
                    value={tempProject.tech}
                    onChange={(e) => setTempProject({ ...tempProject, tech: e.target.value })}
                    className="md:col-span-2 w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Tech (comma-separated)"
                  />
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400">Project Image</label>
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white hover:bg-slate-50 dark:hover:bg-gray-600 transition-all">
                        {imageUploading ? 'Uploading...' : 'Upload Image'}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e.target.files[0])}
                          disabled={imageUploading}
                        />
                      </label>
                      {tempProject.image && (
                        <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px]">{tempProject.image}</span>
                      )}
                    </div>
                    {tempProject.image && (
                      <img
                        src={tempProject.image}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-lg border border-slate-200 dark:border-gray-600"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    )}
                  </div>
                  <input
                    type="text"
                    value={tempProject.github}
                    onChange={(e) => setTempProject({ ...tempProject, github: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="GitHub URL"
                  />
                </div>
              )}

              {editorModal.type === 'skill' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    value={tempSkill.name}
                    onChange={(e) => setTempSkill({ ...tempSkill, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Name"
                  />
                  <input
                    type="text"
                    value={tempSkill.logo}
                    onChange={(e) => setTempSkill({ ...tempSkill, logo: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Logo URL"
                  />
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={tempSkill.color}
                      onChange={(e) => setTempSkill({ ...tempSkill, color: e.target.value })}
                      className="w-12 h-10 rounded-lg border border-slate-300 dark:border-gray-600 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={tempSkill.color}
                      onChange={(e) => setTempSkill({ ...tempSkill, color: e.target.value })}
                      className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                    />
                  </div>
                </div>
              )}

              {editorModal.type === 'contact' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="email"
                    value={tempContact.email}
                    onChange={(e) => setTempContact({ ...tempContact, email: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Email"
                  />
                  <input
                    type="tel"
                    value={tempContact.phone}
                    onChange={(e) => setTempContact({ ...tempContact, phone: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Phone"
                  />
                </div>
              )}

              {editorModal.type === 'socialLink' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      value={tempSocialLink.platform}
                      onChange={(e) => setTempSocialLink({ ...tempSocialLink, platform: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Platform"
                    />
                    <input
                      type="url"
                      value={tempSocialLink.url}
                      onChange={(e) => setTempSocialLink({ ...tempSocialLink, url: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="URL"
                    />
                    <input
                      type="text"
                      value={tempSocialLink.icon}
                      onChange={(e) => setTempSocialLink({ ...tempSocialLink, icon: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Icon (Lucide)"
                    />
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Show in Hero <span className="text-xs text-slate-400">(max 4)</span></span>
                    <button
                      type="button"
                      onClick={() => {
                        const heroCount = social.links.filter((l, i) => i !== editorModal.index && l.showInHero).length;
                        if (!tempSocialLink.showInHero && heroCount >= 4) {
                          showMessage('Maximum 4 links can be shown in Hero', true);
                          return;
                        }
                        setTempSocialLink({ ...tempSocialLink, showInHero: !tempSocialLink.showInHero });
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                        tempSocialLink.showInHero
                          ? 'bg-slate-600 dark:bg-slate-500'
                          : 'bg-slate-200 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                          tempSocialLink.showInHero ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-3 justify-end mt-6">
                <button
                  onClick={closeEditor}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-slate-50 dark:hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEditor}
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-slate-600 hover:bg-slate-700 text-white transition-all disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {confirmModal.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {confirmModal.message}
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={confirmModal.onCancel}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-slate-50 dark:hover:bg-gray-700 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmModal.onConfirm}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
