import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../Layout';
import { getAllVouchers } from '../../api';
import { StatusBadge, Loader, formatDate, formatAmount } from '../../helpers';

const TABS = ['ALL','PENDING','APPROVED','REJECTED'];

export default function AccAllVouchers() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    getAllVouchers().then(r => setVouchers(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'ALL' ? vouchers : vouchers.filter(v => v.status === filter);

  return (
    <Layout title="All Vouchers">
      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-header">
              <h5>All Vouchers</h5>
              <span className="d-block m-t-5 text-muted" style={{ fontSize: 12 }}>
                Read-only view — {vouchers.length} total vouchers
              </span>
            </div>
            <div className="card-block">
              <ul className="nav nav-tabs m-b-20">
                {TABS.map(s => (
                  <li className="nav-item" key={s}>
                    <a className={`nav-link${filter === s ? ' active' : ''}`} href="#!" onClick={e => { e.preventDefault(); setFilter(s); }}>
                      {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
                      {s !== 'ALL' && (
                        <span className="badge badge-secondary ml-1">{vouchers.filter(v => v.status === s).length}</span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
              {loading ? <Loader /> : filtered.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <i className="fa fa-inbox fa-3x d-block m-b-10"></i>
                  <p>No vouchers found.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr><th>Voucher #</th><th>Employee</th><th>Title</th><th>Amount</th><th>Date</th><th>Status</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                      {filtered.map(v => (
                        <tr key={v.id}>
                          <td><span className="voucher-number">{v.voucherNumber}</span></td>
                          <td>{v.employee?.name || '—'}</td>
                          <td>{v.expenseTitle}</td>
                          <td><strong>{formatAmount(v.amount)}</strong></td>
                          <td>{formatDate(v.expDate)}</td>
                          <td><StatusBadge status={v.status} /></td>
                          <td>
                            <button className="btn btn-primary btn-sm" onClick={() => navigate(`/accounts/vouchers/${v.id}`)}>
                              <i className="fa fa-eye"></i> View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
