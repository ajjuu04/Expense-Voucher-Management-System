/* Status badge */
export function StatusBadge({ status }) {
  const styles = {
    DRAFT:    'bg-[#8a8a8a] text-white',
    PENDING:  'bg-[#FFB64D] text-white',
    APPROVED: 'bg-[#2ed8b6] text-white',
    REJECTED: 'bg-[#FF5370] text-white',
  };
  const labels = {
    DRAFT: 'Draft', PENDING: 'Pending', APPROVED: 'Approved', REJECTED: 'Rejected',
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${styles[status] || styles.DRAFT}`}>
      {labels[status] || status}
    </span>
  );
}

/* Spinner */
export function Loader() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-[#aaa]">
      <div className="w-9 h-9 border-4 border-[#4099ff] border-t-transparent rounded-full animate-spin mb-3"></div>
      <p className="text-sm">Loading...</p>
    </div>
  );
}

export function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatAmount(a) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(a || 0);
}
