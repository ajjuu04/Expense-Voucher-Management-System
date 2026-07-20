import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../Layout';
import { getVouchersByStatus } from '../../api';
import { Loader, formatDate, formatAmount } from '../../helpers';

export default function PendingApprovals() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getVouchersByStatus('PENDING').then(r => setVouchers(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <Layout title="Pending Approvals">
      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-header">
              <h5>Pending Approvals</h5>
              <span className="d-block m-t-5 text-muted" style={{ fontSize: 12 }}>
                {vouchers.length} voucher{vouchers.length !== 1 ? 's' : ''} awaiting your review
              </span>
            </div>
            <div className="card-block">
              {loading ? <Loader /> : vouchers.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <i className="fa fa-check-circle fa-3x d-block m-b-10 text-success"></i>
                  <p>No pending vouchers!</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Voucher #</th>
                        <th>Employee</th>
                        <th>Title</th>
                        <th>Department</th>
                        <th>Amount</th>
                        <th>Expense Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vouchers.map(v => (
                        <tr key={v.id}>
                          <td><span className="voucher-number">{v.voucherNumber}</span></td>
                          <td>{v.employee?.name || '—'}</td>
                          <td>{v.expenseTitle}</td>
                          <td>{v.department}</td>
                          <td><strong>{formatAmount(v.amount)}</strong></td>
                          <td>{formatDate(v.expDate)}</td>
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
