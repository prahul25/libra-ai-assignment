import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) {
      setError('All fields are required');
      return;
    }
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4 animate-[fadeInUp_0.5s_ease]">
      <div className="w-full max-w-[420px] bg-(--bg-card) dark:bg-(--card-dark) backdrop-blur-[20px] border border-white/60 dark:border-white/6 rounded-2xl shadow-(--shadow-xl) p-9 max-sm:p-6">
        <div className="text-center mb-7">
          <div className="text-4xl text-(--accent) mb-3">◈</div>
          <h2 className="text-2xl font-bold text-(--text-primary) dark:text-[#e8e8f0] mb-1">Welcome back</h2>
          <p className="text-sm text-(--text-secondary)">Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <p className="text-sm text-(--danger) text-center p-2.5 bg-red-500/8 rounded-md">{error}</p>}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-email" className="text-xs font-semibold text-(--text-secondary)">Email</label>
            <input id="login-email" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange}
              className="px-3 py-3 text-sm border border-(--border) rounded-lg bg-(--input-bg) dark:bg-white/6 text-(--text-primary) transition-all outline-none focus:border-(--accent) focus:shadow-[0_0_0_3px_var(--accent-soft)]" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-password" className="text-xs font-semibold text-(--text-secondary)">Password</label>
            <input id="login-password" type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange}
              className="px-3 py-3 text-sm border border-(--border) rounded-lg bg-(--input-bg) dark:bg-white/6 text-(--text-primary) transition-all outline-none focus:border-(--accent) focus:shadow-[0_0_0_3px_var(--accent-soft)]" />
          </div>
          <button type="submit" className="w-full py-3 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white rounded-lg text-sm font-semibold cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(99,102,241,0.4)]">Sign In</button>
        </form>
        <p className="text-center text-xs text-(--text-secondary) mt-6">
          Don't have an account? <Link to="/register" className="text-(--accent) font-semibold no-underline hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
