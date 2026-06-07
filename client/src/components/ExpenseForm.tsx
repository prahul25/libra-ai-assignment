import { useState, useEffect } from 'react';
import { ExpenseFormData, Category } from '../types';

const CATEGORIES: { value: Category; icon: string }[] = [
  { value: 'Food', icon: '🍽️' }, { value: 'Transport', icon: '🚗' },
  { value: 'Shopping', icon: '🛍️' }, { value: 'Entertainment', icon: '🎬' },
  { value: 'Bills', icon: '📄' }, { value: 'Healthcare', icon: '🏥' },
  { value: 'Education', icon: '📚' }, { value: 'Other', icon: '📌' },
];

interface ExpenseFormProps {
  initialData?: ExpenseFormData;
  onSubmit: (data: ExpenseFormData) => void;
  onCancel: () => void;
}

const ExpenseForm = ({ initialData, onSubmit, onCancel }: ExpenseFormProps) => {
  const [form, setForm] = useState<ExpenseFormData>({
    amount: initialData?.amount || 0,
    category: initialData?.category || 'Food',
    description: initialData?.description || '',
    date: initialData?.date || new Date().toISOString().split('T')[0],
  });
  const [error, setError] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleClose = () => { setVisible(false); setTimeout(onCancel, 200); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.amount || Number(form.amount) <= 0) { setError('Amount must be a positive number'); return; }
    if (!form.description.trim()) { setError('Description is required'); return; }
    if (form.description.length > 200) { setError('Description cannot exceed 200 characters'); return; }
    onSubmit({ amount: Number(form.amount), category: form.category, description: form.description.trim(), date: form.date });
  };

  return (
    <div className={`fixed inset-0 z-[9999] bg-black/55 backdrop-blur-xs flex items-center justify-center p-4 transition-opacity duration-250 ${visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={handleClose}>
      <div className={`w-full max-w-[520px] max-h-[90vh] overflow-y-auto bg-(--bg-card) dark:bg-(--card-dark) backdrop-blur-[20px] border border-white/60 dark:border-white/6 rounded-2xl shadow-(--shadow-xl) transition-all duration-300 ${visible ? 'scale-100 translate-y-0' : 'scale-[0.92] translate-y-3'}`}
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4 pt-6 pb-3 px-7">
          <div className="flex items-start gap-3.5">
            <span className="text-2xl leading-none mt-0.5">{initialData ? '✏️' : '➕'}</span>
            <div>
              <h3 className="text-lg font-bold text-(--text-primary)">{initialData ? 'Edit Expense' : 'New Expense'}</h3>
              <p className="text-xs text-(--text-secondary) mt-0.5">{initialData ? 'Update the details below' : 'Fill in the details below'}</p>
            </div>
          </div>
          <button onClick={handleClose} className="flex items-center justify-center w-8 h-8 border-none bg-(--btn-secondary-bg) text-(--text-muted) rounded-md cursor-pointer transition-all hover:bg-(--btn-secondary-hover) hover:text-(--text-primary) shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-7 pb-7">
          {error && <div className="text-sm text-(--danger) p-2.5 bg-red-500/8 rounded-md mb-4">{error}</div>}

          <div className="mb-4.5">
            <label className="block text-xs font-semibold text-(--text-secondary) mb-1.5">Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-(--text-muted) pointer-events-none">₹</span>
              <input type="number" name="amount" placeholder="0.00" step="0.01" min="0" autoFocus value={form.amount || ''} onChange={handleChange}
                className="w-full py-3.5 pr-4 pl-11 text-2xl font-bold border-2 border-(--border) rounded-lg bg-(--input-bg) dark:bg-white/6 text-(--text-primary) outline-none transition-all focus:border-(--accent) focus:shadow-[0_0_0_4px_var(--accent-soft)]" />
            </div>
          </div>

          <div className="mb-4.5">
            <label className="block text-xs font-semibold text-(--text-secondary) mb-1.5">Category</label>
            <div className="grid grid-cols-4 gap-2 max-sm:grid-cols-4">
              {CATEGORIES.map(({ value, icon }) => (
                <button key={value} type="button"
                  className={`flex flex-col items-center gap-1 py-2.5 px-1.5 border-2 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                    form.category === value
                      ? 'border-(--accent) bg-(--accent-soft) text-(--accent) font-semibold'
                      : 'border-(--border) bg-(--input-bg) dark:bg-white/6 text-(--text-secondary) hover:border-(--accent) hover:text-(--accent)'
                  }`}
                  onClick={() => setForm({ ...form, category: value })}>
                  <span className="text-xl leading-none">{icon}</span>
                  <span className="leading-none">{value}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4.5">
            <label htmlFor="modal-desc" className="block text-xs font-semibold text-(--text-secondary) mb-1.5">Description</label>
            <input id="modal-desc" type="text" name="description" placeholder="What was this expense for?" maxLength={200} value={form.description} onChange={handleChange}
              className="w-full px-4 py-3 text-sm border-2 border-(--border) rounded-lg bg-(--input-bg) dark:bg-white/6 text-(--text-primary) outline-none transition-all focus:border-(--accent) focus:shadow-[0_0_0_4px_var(--accent-soft)]" />
          </div>

          <div className="mb-4.5">
            <label htmlFor="modal-date" className="block text-xs font-semibold text-(--text-secondary) mb-1.5">Date</label>
            <input id="modal-date" type="date" name="date" value={form.date} onChange={handleChange}
              className="w-full px-4 py-3 text-sm border-2 border-(--border) rounded-lg bg-(--input-bg) dark:bg-white/6 text-(--text-primary) outline-none transition-all focus:border-(--accent) focus:shadow-[0_0_0_4px_var(--accent-soft)]" />
          </div>

          <div className="flex gap-3 pt-5 mt-6 border-t border-(--border-light)">
            <button type="button" onClick={handleClose} className="flex-1 py-3 bg-(--btn-secondary-bg) text-(--btn-secondary-text) rounded-lg text-sm font-medium cursor-pointer transition-all hover:bg-(--btn-secondary-hover)">Cancel</button>
            <button type="submit" className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white rounded-lg text-sm font-semibold cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(99,102,241,0.35)]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              {initialData ? 'Update Expense' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
