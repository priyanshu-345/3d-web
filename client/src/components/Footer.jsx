import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white border-t border-gray-900 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">3D</span>
              </div>
              <span className="text-xl font-bold text-white">Interior<span className="font-light text-slate-400">Design</span></span>
            </Link>
            <p className="text-slate-400 mb-6 max-w-sm leading-relaxed">
              Transform your space with stunning 3D interior designs.
              Experience the future of interior design visualization today.
            </p>
            <div className="flex space-x-4">
              {['Facebook', 'Instagram', 'Twitter'].map((social) => (
                <a key={social} href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1">
                  <span className="sr-only">{social}</span>
                  <div className="w-5 h-5 bg-current mask-social" />
                  {/* Simplified Icon Placeholder */}
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 tracking-wide">Explore</h3>
            <ul className="space-y-4">
              {[
                { label: 'Home', path: '/' },
                { label: 'About Us', path: '/about' },
                { label: 'Gallery', path: '/gallery' },
                { label: '3D Studio', path: '/interior-studio' },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-slate-400 hover:text-indigo-400 hover:pl-2 transition-all duration-300 flex items-center">
                    <span className="mr-2">›</span> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 tracking-wide">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start group">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center mr-3 group-hover:bg-indigo-600 transition-colors">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <span className="text-slate-400 pt-1">info@interiordesigner.com</span>
              </li>
              <li className="flex items-start group">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center mr-3 group-hover:bg-indigo-600 transition-colors">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                <span className="text-slate-400 pt-1">+1 (555) 123-4567</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-900 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} 3D Interior Designer. Crafted with <span className="text-red-500">❤</span> for the Web.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;











