import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DashboardData } from '../types';

const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6'];

const AnimatedNumber = ({ value, prefix = '' }: { value: number; prefix?: string }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const duration = 1000;
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(0 + value * eased);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value]);
  return <>{prefix}{display.toFixed(2)}</>;
};

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get<DashboardData>('/expenses/dashboard').then(({ data }) => setData(data)).catch(() => setError('Failed to load dashboard'));
  }, []);

  if (!data) return (
    <div className="max-w-[1000px] mx-auto pt-4">
      <div className="h-8 w-65 rounded-md bg-gradient-to-r from-(--border-light) via-(--bg-card) to-(--border-light) bg-[length:200%_100%] animate-[shimmer_1.5s_infinite] mb-3" />
      <div className="h-5 w-45 rounded-md bg-gradient-to-r from-(--border-light) via-(--bg-card) to-(--border-light) bg-[length:200%_100%] animate-[shimmer_1.5s_infinite] mb-9" />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5">
        {[1, 2, 3].map((i) => <div key={i} className="h-30 rounded-2xl bg-gradient-to-r from-(--border-light) via-(--bg-card) to-(--border-light) bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]" />)}
      </div>
    </div>
  );

  const categoryData = data.recentTransactions.reduce<{ name: string; value: number }[]>((acc, t) => {
    const existing = acc.find(item => item.name === t.category);
    if (existing) existing.value += t.amount;
    else acc.push({ name: t.category, value: t.amount });
    return acc;
  }, []);

  const greeting = () => { const h = new Date().getHours(); if (h < 12) return 'Morning'; if (h < 18) return 'Afternoon'; return 'Evening'; };

  return (
    <div className="max-w-[1000px] mx-auto animate-[fadeInUp_0.45s_ease]">
      <div className="flex justify-between items-center mb-8 max-sm:flex-col max-sm:items-start max-sm:gap-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl animate-[float_3s_ease-in-out_infinite]">👋</span>
          <div>
            <h1 className="text-[1.625rem] font-extrabold tracking-tight m-0 text-(--text-primary)">Good {greeting()}</h1>
            <p className="text-sm text-(--text-secondary) mt-0.5"><strong className="text-(--text-primary)">{user?.name}</strong>, here's your financial overview</p>
          </div>
        </div>
        <button onClick={() => navigate('/expenses')} className="inline-flex items-center gap-2 py-2.5 px-5.5 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white rounded-lg text-sm font-semibold cursor-pointer border-none transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(99,102,241,0.35)] animate-[glow-pulse_2.5s_ease-in-out_infinite] whitespace-nowrap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Expense
        </button>
      </div>

      {error && <div className="text-sm text-(--danger) mb-4 p-3 bg-red-500/8 rounded-lg">{error}</div>}

      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5 mb-8">
        {[
          { grad: 'from-(--bg-card) to-[rgba(99,102,241,0.06)]', icon: 'text-[#818cf8] bg-[rgba(99,102,241,0.12)]', svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>, label: 'All time', title: 'Total Expenses', value: data.totalExpenses.total || 0, count: data.totalExpenses.count || 0, delay: '0.05s' },
          { grad: 'from-(--bg-card) to-[rgba(16,185,129,0.06)]', icon: 'text-[#34d399] bg-[rgba(16,185,129,0.12)]', svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, label: 'This month', title: 'Monthly Spending', value: data.monthlyExpenses.total || 0, count: data.monthlyExpenses.count || 0, delay: '0.1s' },
          { grad: 'from-(--bg-card) to-[rgba(245,158,11,0.06)]', icon: 'text-[#fbbf24] bg-[rgba(245,158,11,0.12)]', svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>, label: 'Quick link', title: 'Manage Expenses', value: null, count: null, delay: '0.15s', action: true },
        ].map((card, i) => (
          <div key={i} onClick={() => card.action && navigate('/expenses')} style={{ animationDelay: card.delay }}
            className={`relative p-6 rounded-2xl backdrop-blur-[12px] border border-white/60 dark:border-white/6 shadow-(--shadow) transition-all duration-300 hover:-translate-y-1 hover:shadow-(--shadow-xl) animate-[fadeInUp_0.5s_ease_forwards] opacity-0 bg-gradient-to-br ${card.grad} ${card.action ? 'cursor-pointer' : ''}`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${card.icon}`}>{card.svg}</div>
              <span className={`text-[0.71875rem] font-semibold uppercase tracking-[0.04em] ${card.label === 'All time' || card.label === 'This month' ? 'text-(--success)' : 'text-(--text-muted)'}`}>{card.label}</span>
            </div>
            {card.action ? (
              <>
                <p className="text-xl font-bold text-(--text-primary) m-0">Manage Expenses</p>
                <p className="text-xs text-(--text-muted) mt-1">View, edit or add new →</p>
              </>
            ) : (
              <>
                <p className="text-[1.75rem] font-extrabold text-(--text-primary) m-0 tabular-nums leading-tight">
                  <span className="text-lg font-semibold text-(--text-muted) mr-0.5">₹</span>
                  <AnimatedNumber value={card.value || 0} />
                </p>
                <p className="text-xs text-(--text-muted) mt-1">{card.title} · {card.count} transactions</p>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <div className="p-6 rounded-2xl bg-(--bg-card) dark:bg-(--card-dark) backdrop-blur-[12px] border border-white/60 dark:border-white/6 shadow-(--shadow) animate-[fadeInUp_0.5s_ease_forwards] opacity-0" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold m-0 text-(--text-primary)">Monthly Spending</h3>
            <span className="text-[0.625rem] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-full bg-(--accent-soft) text-(--accent)">Bar</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={[{ name: 'This Month', amount: data.monthlyExpenses.total || 0 }]} margin={{ top: 8, right: 8, left: -10, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: 10, boxShadow: 'var(--shadow-lg)', backdropFilter: 'blur(12px)' }} cursor={{ fill: 'var(--table-hover)' }} />
              <Bar dataKey="amount" fill="url(#barGradient)" radius={[8, 8, 0, 0]} maxBarSize={60} />
              <defs><linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#818cf8" /><stop offset="100%" stopColor="#6366f1" /></linearGradient></defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="p-6 rounded-2xl bg-(--bg-card) dark:bg-(--card-dark) backdrop-blur-[12px] border border-white/60 dark:border-white/6 shadow-(--shadow) animate-[fadeInUp_0.5s_ease_forwards] opacity-0" style={{ animationDelay: '0.25s' }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold m-0 text-(--text-primary)">By Category</h3>
            <span className="text-[0.625rem] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-full bg-(--accent-soft) text-(--accent)">Pie</span>
          </div>
          {categoryData.length === 0 ? (
            <div className="flex items-center justify-center h-60 text-sm text-(--text-muted)">No data yet</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={48} paddingAngle={4}>
                    {categoryData.map((_, index) => (<Cell key={index} fill={COLORS[index % COLORS.length]} />))}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: 10, boxShadow: 'var(--shadow-lg)' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 justify-center mt-2 px-2">
                {categoryData.map((item, i) => (
                  <span key={item.name} className="flex items-center gap-1 text-[0.6875rem] font-medium text-(--text-secondary)">
                    <span className="w-1.75 h-1.75 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                    {item.name}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-(--bg-card) dark:bg-(--card-dark) backdrop-blur-[12px] border border-white/60 dark:border-white/6 shadow-(--shadow) animate-[fadeInUp_0.5s_ease_forwards] opacity-0" style={{ animationDelay: '0.3s' }}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-bold m-0 text-(--text-primary)">Recent Transactions</h3>
          <button onClick={() => navigate('/expenses')} className="bg-none border-none text-(--accent) text-sm font-semibold cursor-pointer p-0 transition-all hover:underline">View All →</button>
        </div>
        {data.recentTransactions.length === 0 ? (
          <div className="text-center py-10 text-(--text-muted)">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="mx-auto"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            <p className="mt-3 text-sm">No transactions yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left text-[0.6875rem] text-(--text-muted) uppercase tracking-[0.06em] font-bold">
                  <th className="pb-2.5 pr-4 border-b border-(--border-table)">Date</th>
                  <th className="pb-2.5 pr-4 border-b border-(--border-table)">Category</th>
                  <th className="pb-2.5 pr-4 border-b border-(--border-table)">Description</th>
                  <th className="pb-2.5 pr-4 border-b border-(--border-table) text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.recentTransactions.map((t, idx) => (
                  <tr key={t._id} style={{ animation: `fadeIn 0.35s ease ${0.35 + idx * 0.05}s forwards` }} className="opacity-0 transition-colors duration-150 hover:bg-(--table-hover)">
                    <td className="py-3 pr-4 border-b border-(--border-light) text-sm text-(--text-muted) whitespace-nowrap">{new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                    <td className="py-3 pr-4 border-b border-(--border-light)"><span className="inline-block px-2.5 py-1 rounded-full text-[0.71875rem] font-semibold bg-(--accent-soft) text-(--accent)">{t.category}</span></td>
                    <td className="py-3 pr-4 border-b border-(--border-light) text-sm text-(--text-primary) max-w-50 whitespace-nowrap overflow-hidden text-ellipsis">{t.description}</td>
                    <td className="py-3 pr-4 border-b border-(--border-light) text-sm font-bold text-(--accent) text-right tabular-nums">₹{t.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
