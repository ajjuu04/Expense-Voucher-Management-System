import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../Layout';
import { getAllVouchers } from '../../api';
import { StatusBadge, Loader, formatAmount } from '../../helpers';

export default function DirDashboard() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getAllVouchers().then(r => setVouchers(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const c = {
    total:    vouchers.length,
    pending:  vouchers.filter(v => v.status === 'PENDING').length,
    approved: vouchers.filter(v => v.status === 'APPROVED').length,
    rejected: vouchers.filter(v => v.status === 'REJECTED').length,
  };
  const pending = vouchers.filter(v => v.status === 'PENDING').slice(0, 6);

  return (
    <Layout title="Director Dashboard">

      <div className="row">
        <div className="col-xl-3 col-md-6">
          <div className="card bg-c-blue order-card">
            <div className="card-block">
              <h6 className="m-b-20">Total Vouchers</h6>
              <h2 className="text-right"><i className="fa fa-file-text-o f-left"></i><span>{c.total}</span></h2>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6">
          <div className="card bg-c-yellow order-card">
            <div className="card-block">
              <h6 className="m-b-20">Awaiting Review</h6>
              <h2 className="text-right"><i className="fa fa-clock-o f-left"></i><span>{c.pending}</span></h2>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6">
          <div className="card bg-c-green order-card">
            <div className="card-block">
              <h6 className="m-b-20">Approved</h6>
              <h2 className="text-right"><i className="fa fa-check f-left"></i><span>{c.approved}</span></h2>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6">
          <div className="card bg-c-red order-card">
            <div className="card-block">
              <h6 className="m-b-20">Rejected</h6>
              <h2 className="text-right"><i className="fa fa-times f-left"></i><span>{c.rejected}</span></h2>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-12">
          <div className="card">
            <div className="card-header">
              <h5>Pending Approvals</h5>
              <span className="d-block m-t-5 text-muted" style={{ fontSize: 12 }}>Vouchers awaiting your review</span>
              <div className="card-header-right">
                <button className="btn btn-primary btn-sm" onClick={() => navigate('/director/pending')}>
                  View All Pending
                </button>
              </div>
            </div>
            <div className="card-block">
              {loading ? <Loader /> : pending.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <i className="fa fa-check-circle fa-3x d-block m-b-10 text-success"></i>
                  <p>No pending vouchers — all caught up!</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr><th>Voucher #</th><th>Employee</th><th>Title</th><th>Amount</th><th>Status</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                      {pending.map(v => (
                        <tr key={v.id}>
                          <td><span className="voucher-number">{v.voucherNumber}</span></td>
                          <td>{v.employee?.name || '—'}</td>
                          <td>{v.expenseTitle}</td>
                          <td><strong>{formatAmount(v.amount)}</strong></td>
                          <td><StatusBadge status={v.status} /></td>
                          <td>
                            <button className="btn btn-primary btn-sm" onClick={() => navigate(`/director/vouchers/${v.id}`)}>
                              <i className="fa fa-gavel"></i> Review
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
