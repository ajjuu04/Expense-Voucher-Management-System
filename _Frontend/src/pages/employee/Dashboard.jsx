import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../Layout';
import { getMyVouchers } from '../../api';
import { StatusBadge, Loader, formatDate, formatAmount } from '../../helpers';

export default function EmpDashboard() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getMyVouchers().then(r => setVouchers(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const c = {
    total:    vouchers.length,
    draft:    vouchers.filter(v => v.status === 'DRAFT').length,
    pending:  vouchers.filter(v => v.status === 'PENDING').length,
    approved: vouchers.filter(v => v.status === 'APPROVED').length,
    rejected: vouchers.filter(v => v.status === 'REJECTED').length,
  };

  return (
    <Layout title="Dashboard">

      {/* Stat cards — gradient style */}
      <div className="row">
        <div className="col-xl-3 col-md-6">
          <div className="card bg-c-blue order-card">
            <div className="card-block">
              <h6 className="m-b-20">Total Vouchers</h6>
              <h2 className="text-right">
                <i className="fa fa-file-text-o f-left"></i>
                <span>{c.total}</span>
              </h2>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6">
          <div className="card bg-c-grey order-card">
            <div className="card-block">
              <h6 className="m-b-20">Draft</h6>
              <h2 className="text-right">
                <i className="fa fa-pencil f-left"></i>
                <span>{c.draft}</span>
              </h2>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6">
          <div className="card bg-c-yellow order-card">
            <div className="card-block">
              <h6 className="m-b-20">Pending Approval</h6>
              <h2 className="text-right">
                <i className="fa fa-clock-o f-left"></i>
                <span>{c.pending}</span>
              </h2>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6">
          <div className="card bg-c-green order-card">
            <div className="card-block">
              <h6 className="m-b-20">Approved</h6>
              <h2 className="text-right">
                <i className="fa fa-check f-left"></i>
                <span>{c.approved}</span>
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Vouchers table */}
      <div className="row">
        <div className="col-xl-12">
          <div className="card">
            <div className="card-header">
              <h5>Recent Vouchers</h5>
              <span className="d-block m-t-5 text-muted" style={{ fontSize: 12 }}>Your expense vouchers</span>
              <div className="card-header-right">
                <button className="btn btn-primary btn-sm" onClick={() => navigate('/employee/create')}>
                  <i className="fa fa-plus"></i> New Voucher
                </button>
              </div>
            </div>
            <div className="card-block">
              {loading ? <Loader /> : vouchers.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <i className="fa fa-inbox fa-3x m-b-15 d-block"></i>
                  <p>No vouchers yet. <a href="#!" onClick={e => { e.preventDefault(); navigate('/employee/create'); }}>Create your first one</a>.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover m-b-0">
                    <thead>
                      <tr>
                        <th>Voucher #</th>
                        <th>Title</th>
                        <th>Amount</th>
                        <th>Expense Date</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vouchers.slice(0, 8).map(v => (
                        <tr key={v.id}>
                          <td><span className="voucher-number">{v.voucherNumber}</span></td>
                          <td>{v.expenseTitle}</td>
                          <td><strong>{formatAmount(v.amount)}</strong></td>
                          <td>{formatDate(v.expDate)}</td>
                          <td><StatusBadge status={v.status} /></td>
                          <td>
                            <button className="btn btn-primary btn-sm" onClick={() => navigate(`/employee/vouchers/${v.id}`)}>
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
