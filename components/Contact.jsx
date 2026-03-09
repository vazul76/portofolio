'use client';
import { Mail, Phone, MapPin, Github, Linkedin, Instagram, Facebook, Send } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Contact() {
  const [status, setStatus] = useState('');
  const [socialLinks, setSocialLinks] = useState([]);
  const [contactInfo, setContactInfo] = useState({ email: '', phone: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/content/social');
        const data = await response.json();
        setSocialLinks(data.links || []);
        setContactInfo({ email: data.email || '', phone: data.phone || '' });
      } catch (error) {
        console.error('Error loading contact info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);

    setStatus('sending');

    try {
      // Ganti YOUR_FORM_ID dengan ID dari Formspree kamu
      const response = await fetch('https://formspree.io/f/xeoywjkn', {
        method: 'POST',
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setStatus('success');
        form.reset();
        setTimeout(() => setStatus(''), 3000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus(''), 3000);
      }
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus(''), 3000);
    }
  };

  return (
    <section id="contact" className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-gray-900 transition-all duration-500 py-20 md:py-0">
      <div className="max-w-6xl mx-auto px-8 w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Contact
          </h2>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Contact Form */}
          <div className="bg-white dark:bg-gray-800/90 rounded-3xl p-8 transition-all duration-500 shadow-xl">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send Message</h3>

            {/* Success/Error Message */}
            {status === 'success' && (
              <div className="p-4 bg-slate-100 dark:bg-slate-500/20 rounded-xl text-slate-700 dark:text-slate-400 text-center font-semibold mb-6">
                ✓ Message sent successfully!
              </div>
            )}
            {status === 'error' && (
              <div className="p-4 bg-red-100 dark:bg-red-500/20 rounded-xl text-red-700 dark:text-red-400 text-center font-semibold mb-6">
                ✗ Failed to send. Please try again.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-300"
                  placeholder="Type your name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-300"
                  placeholder="aa@example.com"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  required
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-300"
                  placeholder="Project Discussion"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-300 resize-none"
                  placeholder="Tell me about your project..."
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full px-6 py-4 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 dark:from-slate-500 dark:to-slate-600 dark:hover:from-slate-600 dark:hover:to-slate-700 text-white font-bold rounded-full transition-all duration-300 shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {status === 'sending' ? 'Sending...' : (
                  <>
                    <span>Send Message</span>
                    <Send size={20} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column - Contact Info & Social */}
          <div className="flex flex-col justify-between space-y-6">
            {/* Contact Information */}
            <div className="bg-white dark:bg-gray-800/90 rounded-3xl p-8 transition-all duration-500 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Contact Information</h3>

              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-500/20 flex items-center justify-center flex-shrink-0">
                    <Mail className="text-slate-600 dark:text-slate-400" size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Email</h4>
                    <p className="text-gray-900 dark:text-white font-medium break-all">
                      {contactInfo.email || 'info@yourwebsite.com'}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-500/20 flex items-center justify-center flex-shrink-0">
                    <Phone className="text-slate-600 dark:text-slate-400" size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Phone</h4>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {contactInfo.phone || '+62 812 3456 7890 (WA)'}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-500/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-slate-600 dark:text-slate-400" size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Location</h4>
                    <p className="text-gray-900 dark:text-white font-medium">
                      Indonesia
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Follow Me */}
            <div className="bg-white dark:bg-gray-800/90 rounded-3xl p-8 transition-all duration-500 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Follow Me</h3>

              <div className="grid grid-cols-2 gap-4">
                {socialLinks.map((link, index) => {
                  const iconMap = {
                    Github: Github,
                    Linkedin: Linkedin,
                    Mail: Mail,
                    Instagram: Instagram,
                    Facebook: Facebook,
                  };
                  const IconComponent = iconMap[link.icon] || Github;
                  
                  return (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-slate-50 dark:hover:bg-gray-750 border border-gray-200 dark:border-gray-600 rounded-full transition-all duration-300 hover:scale-105 hover:border-slate-500 group"
                    >
                      <IconComponent className="text-gray-600 dark:text-gray-400 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors" size={20} />
                      <span className="text-gray-700 dark:text-gray-300 group-hover:text-slate-600 dark:group-hover:text-white transition-colors font-medium">{link.platform}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}