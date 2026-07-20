import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../Layout';
import { getAllVouchers } from '../../api';
import { Loader, formatAmount } from '../../helpers';

export default function AccDashboard() {
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
    totalApproved: vouchers.filter(v => v.status === 'APPROVED').reduce((s, v) => s + v.amount, 0),
  };

  return (
    <Layout title="Accounts Dashboard">

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
              <h6 className="m-b-20">Pending</h6>
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
        <div className="col-md-12">
          <div className="card">
            <div className="card-block d-flex align-items-center justify-content-between">
              <div>
                <p className="detail-label m-b-5">Total Approved Amount</p>
                <h2 className="amount-large m-b-0">{formatAmount(c.totalApproved)}</h2>
              </div>
              <div>
                <button className="btn btn-primary" onClick={() => navigate('/accounts/vouchers')}>
                  <i className="fa fa-list"></i> View All Vouchers
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </Layout>
  );
}
