import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Sparkles, Float } from '@react-three/drei';

// --- Galaxy Background Component ---
const Galaxy = () => {
    const groupRef = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        // Constant rotation
        if (groupRef.current) {
            groupRef.current.rotation.y = t * 0.05;

            // Mouse Interaction (Parallax)
            const { x, y } = state.pointer;
            groupRef.current.rotation.x = -y * 0.2;
            groupRef.current.rotation.z = x * 0.2;
        }
    });

    return (
        <group ref={groupRef}>
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <Sparkles count={1000} scale={20} size={4} speed={0.4} opacity={0.6} color="#A855F7" />
            <Sparkles count={1000} scale={20} size={2} speed={0.4} opacity={0.4} color="#6366F1" />
            <Float speed={1} rotationIntensity={0.5} floatIntensity={0.2}>
                <mesh position={[5, 5, -10]}>
                    <sphereGeometry args={[1, 32, 32]} />
                    <meshStandardMaterial color="#6366F1" emissive="#4F46E5" emissiveIntensity={2} />
                </mesh>
            </Float>
        </group>
    );
};

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const { token, user } = await authAPI.login(formData);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            navigate('/');
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-black">
            {/* 3D Galaxy Background */}
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
                    <color attach="background" args={['#000000']} />
                    <ambientLight intensity={0.5} />
                    <Galaxy />
                </Canvas>
            </div>

            {/* Login Glass Panel */}
            <div className="relative z-10 w-full max-w-md p-8 bg-slate-900/40 backdrop-blur-xl rounded-2xl shadow-2xl mx-4 border border-white/10 animate-fade-in-up">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center space-x-2 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-xl">3D</span>
                        </div>
                        <span className="text-2xl font-bold text-white tracking-tight">Interior<span className="font-light text-slate-400">Design</span></span>
                    </Link>
                    <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                    <p className="text-slate-400">Sign in to explore the cosmos of design.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-500 transition-all outline-none hover:bg-slate-800/70"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-slate-300">Password</label>
                            <a href="#" className="text-sm text-indigo-400 hover:text-indigo-300">Forgot Password?</a>
                        </div>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-500 transition-all outline-none hover:bg-slate-800/70"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-lg shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-indigo-500/25"
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>

                    <div className="text-center mt-6">
                        <p className="text-slate-400">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-semibold">
                                Create Account
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
