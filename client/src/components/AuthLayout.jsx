import { Link } from 'react-router-dom';
import NetworkBackground3D from './NetworkBackground3D';

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-900">
            {/* 3D Network Background */}
            <NetworkBackground3D />

            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
                <div className="absolute -bottom-8 right-0 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
            </div>

            {/* Glass Panel */}
            <div className="relative z-10 w-full max-w-md p-8 glass-panel-dark rounded-2xl shadow-2xl mx-4">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center space-x-2 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-xl">3D</span>
                        </div>
                        <span className="text-2xl font-bold text-white tracking-tight">Interior<span className="font-light text-slate-400">Design</span></span>
                    </Link>
                    <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
                    <p className="text-slate-400">{subtitle}</p>
                </div>

                {children}
            </div>
        </div>
    );
};

export default AuthLayout;
