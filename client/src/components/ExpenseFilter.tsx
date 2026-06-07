import { Category } from '../types';

const CATEGORIES: Category[] = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Healthcare', 'Education', 'Other'];

interface ExpenseFilterProps {
  filters: { search: string; category: string };
  onChange: (filters: { search: string; category: string }) => void;
}

const ExpenseFilter = ({ filters, onChange }: ExpenseFilterProps) => {
  return (
    <div className="flex gap-3 mb-5 flex-wrap">
      <div className="relative flex-1 min-w-55">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text-muted) pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" placeholder="Search expenses..." value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="w-full py-2.5 pl-10 pr-3.5 text-sm border border-(--border) rounded-lg bg-(--bg-card) dark:bg-white/6 text-(--text-primary) outline-none transition-all focus:border-(--accent) focus:shadow-[0_0_0_3px_var(--accent-soft)]" />
      </div>
      <div className="relative">
        <select value={filters.category}
          onChange={(e) => onChange({ ...filters, category: e.target.value })}
          className="py-2.5 px-3.5 pr-9 text-sm border border-(--border) rounded-lg bg-(--bg-card) dark:bg-white/6 text-(--text-primary) outline-none transition-all focus:border-(--accent) focus:shadow-[0_0_0_3px_var(--accent-soft)] appearance-none cursor-pointer min-w-[150px]">
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text-muted) pointer-events-none" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
    </div>
  );
};

export default ExpenseFilter;
