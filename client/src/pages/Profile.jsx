import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackgroundVariant3D from '../components/BackgroundVariant3D';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check for user data in localStorage
        const savedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (!savedUser || !token) {
            // Redirect to login if not authenticated
            navigate('/login');
        } else {
            setUser(JSON.parse(savedUser));
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
                <div className="text-xl">Loading Profile...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 relative overflow-hidden font-sans">
            {/* Dynamic Background */}
            <BackgroundVariant3D color="#4f46e5" />
            <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-gray-900/95 to-slate-900/90 pointer-events-none"></div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 py-28 sm:px-6 lg:px-8">
                {/* Main Card */}
                <div className="bg-gray-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden ring-1 ring-white/5 mx-auto">

                    {/* Cover Image Section */}
                    <div className="h-60 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay group-hover:scale-105 transition-transform duration-700"></div>
                        <div className="absolute bottom-6 right-6">
                            <span className="bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-semibold text-white border border-white/15 shadow-lg tracking-wide uppercase">
                                Pro Member
                            </span>
                        </div>
                    </div>

                    <div className="px-6 sm:px-10 pb-12">
                        {/* Profile Header & Avatar */}
                        <div className="flex flex-col md:flex-row items-center md:items-end -mt-20 mb-10 gap-6 md:gap-8 relative z-20">
                            {/* Avatar */}
                            <div className="w-36 h-36 rounded-full bg-gray-800 p-1.5 shadow-2xl ring-4 ring-gray-900 overflow-hidden shrink-0">
                                <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-5xl text-white font-bold shadow-inner">
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                            </div>

                            {/* User Info */}
                            <div className="flex-1 text-center md:text-left mt-2 md:mt-0">
                                <h1 className="text-4xl font-bold text-white mb-1 tracking-tight">{user.name}</h1>
                                <p className="text-indigo-400 font-medium text-lg">@{user.username || user.name?.toLowerCase().replace(/\s/g, '')}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 mt-4 md:mt-0 w-full md:w-auto">
                                <button
                                    onClick={() => {/* Edit Logic */ }}
                                    className="flex-1 md:flex-none px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/20 active:scale-95 transition-all text-sm tracking-wide"
                                >
                                    Edit Profile
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex-1 md:flex-none px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 rounded-xl font-semibold active:scale-95 transition-all text-sm tracking-wide"
                                >
                                    Log Out
                                </button>
                            </div>
                        </div>

                        {/* Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 pt-4 border-t border-gray-800/50">
                            {/* Left Column: Account Info */}
                            <div className="lg:col-span-1 space-y-8">
                                <div>
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 ml-1">Account Details</h3>
                                    <div className="space-y-3">
                                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
                                            <p className="text-xs text-gray-400 mb-1 group-hover:text-indigo-400 transition-colors">Email Address</p>
                                            <p className="text-sm font-medium text-white truncate" title={user.email}>{user.email}</p>
                                        </div>
                                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
                                            <p className="text-xs text-gray-400 mb-1 group-hover:text-indigo-400 transition-colors">Membership</p>
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-medium text-white capitalize">{user.role || 'User'}</p>
                                                {user.role === 'admin' && <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded border border-red-500/20">ADMIN</span>}
                                            </div>
                                        </div>
                                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
                                            <p className="text-xs text-gray-400 mb-1 group-hover:text-indigo-400 transition-colors">Joined</p>
                                            <p className="text-sm font-medium text-white">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Stats & Activity */}
                            <div className="lg:col-span-2">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 ml-1">Performance Overview</h3>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                                    {[
                                        { label: 'Projects', value: '0', color: 'text-indigo-400' },
                                        { label: 'Designs', value: '0', color: 'text-purple-400' },
                                        { label: 'Followers', value: '0', color: 'text-pink-400' },
                                        { label: 'Views', value: '0', color: 'text-cyan-400' },
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-gray-800/50 p-5 rounded-2xl border border-gray-700/50 flex flex-col items-center justify-center text-center hover:bg-gray-800 hover:scale-105 transition-all duration-300">
                                            <span className={`text-2xl sm:text-3xl font-bold ${stat.color} mb-1 font-mono`}>{stat.value}</span>
                                            <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">{stat.label}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Placeholder for Recent Activity or Bio */}
                                <div className="bg-gray-800/30 rounded-3xl p-6 sm:p-8 border border-dashed border-gray-700/50">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="text-xl">✨</span>
                                        <h4 className="text-white font-semibold">Designer Bio</h4>
                                    </div>
                                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                        Welcome to your profile! Here you can manage your projects, view your designs, and update your account settings. Start creating amazing 3D spaces today using the Studio tools.
                                    </p>
                                    <button onClick={() => navigate('/advanced-editor')} className="text-indigo-400 text-sm font-medium hover:text-indigo-300 flex items-center gap-1 group">
                                        Start a new design <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="text-center mt-8 text-gray-600 text-xs">
                    &copy; 2026 Interior Design Studio. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default Profile;
