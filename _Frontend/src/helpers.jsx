/* Status badge using Bootstrap 4 badge classes */
export function StatusBadge({ status }) {
  const map = {
    DRAFT:    'badge-secondary',
    PENDING:  'badge-warning',
    APPROVED: 'badge-success',
    REJECTED: 'badge-danger',
  };
  const label = {
    DRAFT:    'Draft',
    PENDING:  'Pending Approval',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
  };
  return (
    <span className={`badge ${map[status] || 'badge-secondary'}`}>
      {label[status] || status}
    </span>
  );
}

/* Bootstrap 4 spinner */
export function Loader() {
  return (
    <div className="pcoded-loader">
      <div className="spinner-border" role="status">
        <span className="sr-only">Loading...</span>
      </div>
      <p className="m-t-10 text-muted" style={{ fontSize: 13 }}>Loading...</p>
    </div>
  );
}

export function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatAmount(a) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', minimumFractionDigits: 2,
  }).format(a || 0);
}
