import AboutHero3D from '../components/AboutHero3D';
import BackgroundVariant3D from '../components/BackgroundVariant3D';
import TextMorph from '../components/TextMorph';
import blackVideo from './black.mp4';

const About = () => {
  return (
    <div className="min-h-screen bg-transparent relative">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-0"
      >
        <source src={blackVideo} type="video/mp4" />
      </video>
      <div className="fixed inset-0 bg-transparent z-0"></div>

      {/* Header */}
      <section className="text-white py-24 relative overflow-hidden z-10 w-full">
        {/* New 3D Background - Optional or Transparent */}
        {/* <BackgroundVariant3D color="#6366f1" /> remove if video is sufficient, or keep as subtle overlay */}


        <div className="absolute inset-0 bg-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6 tracking-tight text-blur-reveal">
            <span className="gradient-text-animated text-glow-purple">About</span> <TextMorph words={['Us', 'Our Vision', 'Our Mission', 'Our Team']} className="gradient-text-gold" />
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto font-light fade-in-up delay-200 text-glow-soft">
            Leading the <span className="gradient-text-blue font-semibold">future</span> of interior design with cutting-edge <span className="gradient-text-purple font-semibold">3D visualization</span> technology.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 text-blur-reveal gradient-text-purple text-hover-lift">
                Refining Reality
              </h2>
              <div className="space-y-6 text-lg text-white leading-relaxed text-glow-soft">
                <p className="fade-in-up delay-100">
                  We started with a simple vision: to make interior design <span className="gradient-text-gold font-semibold">accessible</span>, visual, and exciting for everyone.
                  Traditional 2D blueprints and mood boards can't capture the true essence of a space.
                </p>
                <p className="fade-in-up delay-200">
                  That's why we've embraced <span className="gradient-text-blue font-semibold text-hover-glow">Real-time 3D technology</span> to bring your dream interiors to life. With our platform,
                  you can explore every corner, see how light plays in the space, and truly understand how your design
                  will look and feel before you buy a single piece of furniture.
                </p>
                <p className="fade-in-up delay-300">
                  Whether you're redesigning your home, planning a commercial space, or just exploring ideas,
                  we're here to make the process <span className="gradient-text-purple font-semibold">seamless</span> and <span className="gradient-text-animated font-semibold">inspiring</span>.
                </p>
              </div>
            </div>

            {/* 3D Video Element */}
            <div className="h-full w-full fade-in-right delay-400">
              <AboutHero3D />
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-transparent p-8 hover-tilt fade-in-left delay-200 transition-smooth group">
              <h3 className="text-2xl font-bold text-white mb-4 gradient-text-purple text-hover-lift">Our Mission</h3>
              <p className="text-slate-300 leading-relaxed text-glow-soft group-hover:text-white transition-colors">
                To <span className="gradient-text-gold font-semibold">democratize</span> interior design by making professional 3D visualization accessible to everyone,
                enabling informed decisions and bringing design dreams to <span className="gradient-text-blue font-semibold">reality</span>.
              </p>
            </div>
            <div className="bg-transparent p-8 hover-tilt fade-in-right delay-300 transition-smooth group">
              <h3 className="text-2xl font-bold text-white mb-4 gradient-text-blue text-hover-lift">Our Vision</h3>
              <p className="text-slate-300 leading-relaxed text-glow-soft group-hover:text-white transition-colors">
                To become the <span className="gradient-text-purple font-semibold">leading platform</span> for 3D interior design visualization, where technology meets
                creativity to transform how people design and <span className="gradient-text-animated font-semibold">experience</span> their spaces.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="bg-transparent p-8 fade-in-up delay-400">
            <h2 className="text-3xl font-bold text-white mb-8 text-center text-blur-reveal">
              Our <span className="gradient-text-animated">Values</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center fade-in-up delay-500 text-hover-scale group">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 transition-smooth hover:scale-110 group-hover:bg-white/20 border border-white/10">
                  <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 gradient-text-gold text-hover-lift">Innovation</h3>
                <p className="text-white text-glow-soft transition-colors">We constantly push boundaries with the latest 3D technology.</p>
              </div>
              <div className="text-center fade-in-up delay-600 text-hover-scale group">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 transition-smooth hover:scale-110 group-hover:bg-white/20 border border-white/10">
                  <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 gradient-text-purple text-hover-lift">Customer Focus</h3>
                <p className="text-white text-glow-soft transition-colors">Your satisfaction and success are at the heart of everything we do.</p>
              </div>
              <div className="text-center fade-in-up delay-700 text-hover-scale group">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 transition-smooth hover:scale-110 group-hover:bg-white/20 border border-white/10">
                  <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 gradient-text-blue text-hover-lift">Excellence</h3>
                <p className="text-white text-glow-soft transition-colors">We strive for perfection in every design and interaction.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;











