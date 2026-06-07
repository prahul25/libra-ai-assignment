import { useState, useEffect, useCallback } from 'react';
import ExpenseForm from './ExpenseForm';
import ExpenseFilter from './ExpenseFilter';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { Expense, ExpenseFormData } from '../types';

interface ExpensesResponse {
  expenses: Expense[];
  total: number;
  page: number;
  pages: number;
}

const ExpenseList = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filters, setFilters] = useState({ search: '', category: '' });
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      params.append('page', String(page));
      params.append('limit', '10');
      const { data } = await api.get<ExpensesResponse>(`/expenses?${params}`);
      setExpenses(data.expenses);
      setTotalPages(data.pages);
    } catch { } finally { setLoading(false); }
  }, [filters, page]);

  useEffect(() => { fetchExpenses(); }, [fetchExpenses]);

  const openAddForm = () => { setEditing(null); setShowForm(true); };
  const openEditForm = (exp: Expense) => { setEditing(exp); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditing(null); };

  const handleCreate = async (formData: ExpenseFormData) => {
    try { await api.post('/expenses', formData); addToast('Expense added successfully', 'success'); closeForm(); setPage(1); fetchExpenses(); }
    catch (err: any) { addToast(err.response?.data?.message || 'Failed to create expense', 'error'); }
  };

  const handleUpdate = async (formData: ExpenseFormData) => {
    if (!editing) return;
    try { await api.put(`/expenses/${editing._id}`, formData); addToast('Expense updated successfully', 'success'); closeForm(); fetchExpenses(); }
    catch (err: any) { addToast(err.response?.data?.message || 'Failed to update expense', 'error'); }
  };

  const handleDelete = async (id: string) => {
    try { await api.delete(`/expenses/${id}`); addToast('Expense deleted', 'success'); setDeletingId(null); fetchExpenses(); }
    catch { addToast('Failed to delete expense', 'error'); }
  };

  const categoryIcon: Record<string, string> = { Food: '🍽️', Transport: '🚗', Shopping: '🛍️', Entertainment: '🎬', Bills: '📄', Healthcare: '🏥', Education: '📚', Other: '📌' };

  return (
    <div className="max-w-[1000px] mx-auto animate-[fadeInUp_0.45s_ease]">
      {showForm && <ExpenseForm initialData={editing ?? undefined} onSubmit={editing ? handleUpdate : handleCreate} onCancel={closeForm} />}

      <div className="flex justify-between items-start mb-6 max-sm:flex-col max-sm:gap-4">
        <div>
          <h1 className="text-[1.75rem] font-extrabold tracking-tight m-0 text-(--text-primary)">Expenses</h1>
          <p className="text-sm text-(--text-secondary) mt-1">Track and manage all your transactions</p>
        </div>
        <button onClick={openAddForm} className="inline-flex items-center gap-2 py-2.5 px-5.5 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white rounded-lg text-sm font-semibold cursor-pointer border-none transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(99,102,241,0.35)] animate-[glow-pulse_2.5s_ease-in-out_infinite]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Expense
        </button>
      </div>

      <ExpenseFilter filters={filters} onChange={(f) => { setFilters(f); setPage(1); }} />

      {loading ? (
        <div className="bg-(--bg-card) dark:bg-(--card-dark) backdrop-blur-[12px] border border-white/60 dark:border-white/6 rounded-2xl p-5 shadow-(--shadow)">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-4 py-3.5 border-b border-(--border-light) last:border-b-0">
              {[1, 2, 3, 4, 5].map((j) => (
                <div key={j} className="h-4 rounded-md bg-gradient-to-r from-(--border-light) via-(--bg-card) to-(--border-light) bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]" style={{ width: j === 3 ? '36%' : '14%' }} />
              ))}
            </div>
          ))}
        </div>
      ) : expenses.length === 0 ? (
        <div className="text-center py-16 px-8 bg-(--bg-card) dark:bg-(--card-dark) backdrop-blur-[12px] border border-white/60 dark:border-white/6 rounded-2xl shadow-(--shadow) flex flex-col items-center">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          <h3 className="text-lg font-bold mt-5 mb-1.5 text-(--text-primary)">No expenses found</h3>
          <p className="text-sm text-(--text-secondary) mb-6">Get started by adding your first expense.</p>
          <button onClick={openAddForm} className="inline-flex items-center gap-2 py-2.5 px-5.5 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white rounded-lg text-sm font-semibold cursor-pointer border-none transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(99,102,241,0.35)]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Expense
          </button>
        </div>
      ) : (
        <>
          <div className="bg-(--bg-card) dark:bg-(--card-dark) backdrop-blur-[12px] border border-white/60 dark:border-white/6 rounded-2xl shadow-(--shadow) overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-left text-[0.71875rem] text-(--text-muted) uppercase tracking-[0.06em] font-bold">
                    <th className="p-4 pr-5 border-b border-(--border-table)">Date</th>
                    <th className="p-4 pr-5 border-b border-(--border-table)">Category</th>
                    <th className="p-4 pr-5 border-b border-(--border-table)">Description</th>
                    <th className="p-4 pr-5 border-b border-(--border-table) text-right">Amount</th>
                    <th className="p-4 pr-5 border-b border-(--border-table) text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((exp, idx) => (
                    <tr key={exp._id} className="animate-[fadeIn_0.35s_ease_forwards] opacity-0 transition-colors duration-150 hover:bg-(--table-hover)" style={{ animationDelay: `${idx * 0.035}s` }}>
                      <td className="p-4 pr-5 text-sm border-b border-(--border-light) text-(--text-muted) whitespace-nowrap">{new Date(exp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                      <td className="p-4 pr-5 text-sm border-b border-(--border-light)">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-(--accent-soft) text-(--accent) whitespace-nowrap">{categoryIcon[exp.category] && `${categoryIcon[exp.category]} `}{exp.category}</span>
                      </td>
                      <td className="p-4 pr-5 text-sm border-b border-(--border-light) text-(--text-primary) max-w-60 whitespace-nowrap overflow-hidden text-ellipsis">{exp.description}</td>
                      <td className="p-4 pr-5 text-sm border-b border-(--border-light) font-bold text-(--accent) text-right tabular-nums">₹{exp.amount.toFixed(2)}</td>
                      <td className="p-4 pr-5 border-b border-(--border-light) text-right">
                        <span className="inline-flex items-center gap-0.5">
                          <button onClick={() => openEditForm(exp)} title="Edit" className="inline-flex items-center justify-center w-8 h-8 border-none bg-transparent rounded-md cursor-pointer text-(--text-muted) transition-all hover:bg-(--btn-secondary-bg) hover:text-(--accent)">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          </button>
                          {deletingId === exp._id ? (
                            <span className="inline-flex items-center gap-0.5 animate-[slideDown_0.2s_ease]">
                              <span className="text-[0.6875rem] font-bold text-(--danger) uppercase mr-0.5">Sure?</span>
                              <button onClick={() => handleDelete(exp._id)} title="Confirm" className="inline-flex items-center justify-center w-8 h-8 border-none bg-transparent rounded-md cursor-pointer text-(--success) transition-all hover:bg-(--success-soft)">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                              </button>
                              <button onClick={() => setDeletingId(null)} title="Cancel" className="inline-flex items-center justify-center w-8 h-8 border-none bg-transparent rounded-md cursor-pointer text-(--text-muted) transition-all hover:bg-(--btn-secondary-bg) hover:text-(--text-primary)">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                              </button>
                            </span>
                          ) : (
                            <button onClick={() => setDeletingId(exp._id)} title="Delete" className="inline-flex items-center justify-center w-8 h-8 border-none bg-transparent rounded-md cursor-pointer text-(--text-muted) transition-all hover:bg-(--btn-secondary-bg) hover:text-(--danger)">
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                            </button>
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-center items-center gap-2 mt-6">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="inline-flex items-center gap-1.5 py-2 px-4 border border-(--border) bg-(--bg-card) text-(--text-primary) rounded-lg text-xs font-medium cursor-pointer transition-all disabled:opacity-35 disabled:cursor-not-allowed hover:not-disabled:border-(--accent) hover:not-disabled:text-(--accent)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
              Previous
            </button>
            <span className="text-xs font-medium text-(--text-secondary) mx-2">Page {page} of {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="inline-flex items-center gap-1.5 py-2 px-4 border border-(--border) bg-(--bg-card) text-(--text-primary) rounded-lg text-xs font-medium cursor-pointer transition-all disabled:opacity-35 disabled:cursor-not-allowed hover:not-disabled:border-(--accent) hover:not-disabled:text-(--accent)">
              Next
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ExpenseList;
