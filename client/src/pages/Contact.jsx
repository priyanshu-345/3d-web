import { useState } from 'react';
import api from '../utils/api';
import TextMorph from '../components/TextMorph';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/contact', formData);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden" style={{ background: '#020617' }}>

      {/* CSS Animated Background (lightweight, no WebGL) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[15%] w-[400px] h-[400px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.2), transparent 70%)', animation: 'contactOrb1 12s ease-in-out infinite alternate' }} />
        <div className="absolute bottom-[15%] right-[10%] w-[350px] h-[350px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.15), transparent 70%)', animation: 'contactOrb2 15s ease-in-out infinite alternate' }} />
        <div className="absolute top-[50%] left-[50%] w-[300px] h-[300px] rounded-full blur-2xl"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.12), transparent 70%)', transform: 'translate(-50%,-50%)', animation: 'contactOrb3 10s ease-in-out infinite alternate' }} />
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className="absolute rounded-full" style={{
            width: `${1 + Math.random() * 3}px`, height: `${1 + Math.random() * 3}px`,
            left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
            background: ['#6366f1', '#a855f7', '#3b82f6', '#ec4899', '#fff'][i % 5],
            opacity: 0.2 + Math.random() * 0.5,
            animation: `contactStar ${3 + Math.random() * 5}s ease-in-out infinite alternate`,
            animationDelay: `${Math.random() * 4}s`,
          }} />
        ))}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <style>{`
          @keyframes contactOrb1 { from{transform:translate(0,0) scale(1)} to{transform:translate(40px,-30px) scale(1.15)} }
          @keyframes contactOrb2 { from{transform:translate(0,0) scale(1)} to{transform:translate(-30px,20px) scale(1.1)} }
          @keyframes contactOrb3 { from{transform:translate(-50%,-50%) scale(1)} to{transform:translate(-50%,-50%) scale(1.2)} }
          @keyframes contactStar { from{transform:scale(1);opacity:.2} to{transform:scale(1.5);opacity:.8} }
        `}</style>
      </div>

      {/* Header */}
      <section className="py-20 relative z-10 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6 text-blur-reveal">
            <span className="gradient-text-animated text-glow-blue">Get In</span> <TextMorph words={['Touch', 'Contact', 'Connect']} className="gradient-text-purple" />
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto font-light fade-in-up delay-200">
            Have a question or want to start a <span className="text-indigo-400 font-semibold">3D project</span>? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="pb-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Contact Form */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl fade-in-left delay-300">
              <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>

              {submitted && (
                <div className="bg-green-500/20 border border-green-500/50 text-green-300 px-4 py-3 rounded-lg mb-6">
                  Thank you! Your message has been sent. We'll get back to you soon.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-500 transition-all"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-500 transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-500 transition-all"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-500 transition-all"
                    placeholder="What is this regarding?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-500 resize-none transition-all"
                    placeholder="Tell us about your project..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-white text-indigo-900 px-6 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg hover:shadow-indigo-500/50"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="fade-in-right delay-400">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-8 shadow-xl">
                <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
                <div className="space-y-8">
                  <div className="flex items-start group">
                    <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mr-4 group-hover:bg-indigo-500/40 transition-colors border border-indigo-500/30">
                      <svg className="w-6 h-6 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1 group-hover:text-indigo-400 transition-colors">Phone</h3>
                      <p className="text-slate-400">+1 (555) 123-4567</p>
                      <p className="text-slate-400">+1 (555) 123-4568</p>
                    </div>
                  </div>

                  <div className="flex items-start group">
                    <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mr-4 group-hover:bg-indigo-500/40 transition-colors border border-indigo-500/30">
                      <svg className="w-6 h-6 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1 group-hover:text-indigo-400 transition-colors">Email</h3>
                      <p className="text-slate-400">info@interiordesigner.com</p>
                      <p className="text-slate-400">support@interiordesigner.com</p>
                    </div>
                  </div>

                  <div className="flex items-start group">
                    <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mr-4 group-hover:bg-indigo-500/40 transition-colors border border-indigo-500/30">
                      <svg className="w-6 h-6 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1 group-hover:text-indigo-400 transition-colors">Address</h3>
                      <p className="text-slate-400">123 Design Street</p>
                      <p className="text-slate-400">New York, NY 10001</p>
                      <p className="text-slate-400">United States</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl shadow-xl p-8 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-4">Business Hours</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-white/20 pb-2">
                      <span>Monday - Friday</span>
                      <span className="font-mono">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between border-b border-white/20 pb-2">
                      <span>Saturday</span>
                      <span className="font-mono">10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span className="text-indigo-200">Closed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
