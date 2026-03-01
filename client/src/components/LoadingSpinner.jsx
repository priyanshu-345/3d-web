const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center min-h-screen pointer-events-none z-[100]" style={{ background: '#020617' }}>
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin" />
          <div className="absolute inset-2 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>
        <p className="text-slate-400 text-sm font-medium tracking-wide">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
