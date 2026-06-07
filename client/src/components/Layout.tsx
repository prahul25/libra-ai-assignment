import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';
import { ReactNode } from 'react';

const GitHubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const Layout = ({ children }: { children: ReactNode }) => {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-(--bg) dark:bg-(--bg-dark) transition-colors">
      <nav className="sticky top-0 z-50 flex items-center justify-between h-16 px-6 bg-[linear-gradient(135deg,#0f0c29,#302b63,#24243e)] text-white shadow-lg backdrop-blur-[12px]">
        <div className="flex items-center gap-6">
          <Link to={user ? '/dashboard' : '/login'} className="flex items-center gap-2 font-bold text-lg no-underline text-white">
            <span className="text-(--accent) text-2xl leading-none">◈</span>
            <span className="bg-gradient-to-r from-[#f0f0ff] to-[#c7d2fe] bg-clip-text text-transparent leading-none">ExpenseTracker</span>
          </Link>
          {user && (
            <div className="flex items-center gap-0.5 max-md:hidden">
              <Link to="/dashboard" className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white/60 no-underline rounded-md transition-all hover:text-white hover:bg-white/10">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                Dashboard
              </Link>
              <Link to="/expenses" className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white/60 no-underline rounded-md transition-all hover:text-white hover:bg-white/10">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                Expenses
              </Link>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <a href="https://github.com/prahul25/libra-ai-assignment" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-9 h-9 text-white/60 no-underline rounded-md transition-all hover:text-white hover:bg-white/10" title="GitHub">
            <GitHubIcon />
          </a>
          <button onClick={toggleTheme} className="flex items-center justify-center w-9 h-9 text-white/60 rounded-md transition-all hover:text-white hover:bg-white/10 cursor-pointer text-lg bg-none border-none" title="Toggle theme">
            {dark ? '☀️' : '🌙'}
          </button>
          {user ? (
            <>
              <div className="flex items-center gap-2 px-2 py-0.5 ml-1.5">
                <span className="flex items-center justify-center w-7.5 h-7.5 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white text-xs font-bold shrink-0 leading-none">{(user.name as string).charAt(0).toUpperCase()}</span>
                <span className="text-sm font-medium text-white/60 leading-none max-md:hidden">{user.name}</span>
              </div>
              <button onClick={handleLogout} className="px-3.5 py-1.5 bg-red-500/15 text-red-300 border-none rounded-md cursor-pointer text-xs font-medium whitespace-nowrap transition-all hover:bg-red-500/25 hover:text-white leading-none">Logout</button>
            </>
          ) : (
            <div className="flex items-center gap-1.5">
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-white/60 no-underline rounded-md transition-all hover:text-white hover:bg-white/10 leading-none">Login</Link>
              <Link to="/register" className="px-5 py-2 text-sm font-semibold text-white no-underline rounded-md bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] transition-all hover:opacity-90 hover:-translate-y-0.5 leading-none">Get Started</Link>
            </div>
          )}
        </div>
      </nav>
      <main className="max-w-[1100px] mx-auto p-8 max-md:p-4 animate-[fadeIn_0.4s_ease]">{children}</main>
    </div>
  );
};

export default Layout;
