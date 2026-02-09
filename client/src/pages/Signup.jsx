import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { authAPI } from '../utils/api';

const Signup = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error when user types
        if (error) setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            const { confirmPassword, ...registerData } = formData;
            await authAPI.register(registerData);

            // Registration successful
            // You might want to automatically login or redirect to login
            alert('Account created successfully! Please sign in.');
            navigate('/login');
        } catch (err) {
            console.error('Signup error:', err);
            // Handle different error structures (message, error.message, etc)
            setError(err.response?.data?.message || 'Failed to create account. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Create Account"
            subtitle="Join thousands of designers building their dream spaces."
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-500 transition-all outline-none"
                        placeholder="John Doe"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-500 transition-all outline-none"
                        placeholder="you@example.com"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-500 transition-all outline-none"
                        placeholder="••••••••"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-500 transition-all outline-none"
                        placeholder="••••••••"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-lg shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Creating Account...' : 'Create Account'}
                </button>

                <div className="text-center mt-6">
                    <p className="text-slate-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold">
                            Sign In
                        </Link>
                    </p>
                </div>
            </form>
        </AuthLayout>
    );
};

export default Signup;
