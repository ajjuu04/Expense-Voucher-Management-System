import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../Layout';
import { getVoucher } from '../../api';
import { StatusBadge, Loader, formatDate, formatAmount } from '../../helpers';

export default function AccVoucherDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [v, setV] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVoucher(id).then(r => setV(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Layout title="Voucher Detail"><Loader /></Layout>;
  if (!v) return <Layout title="Voucher Detail"><div className="alert alert-danger">Voucher not found.</div></Layout>;

  return (
    <Layout title="Voucher Detail">
      <div className="alert alert-info">
        <i className="fa fa-info-circle"></i> <strong>Read-only view</strong> — Accounts team cannot modify vouchers.
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5>
                <span className="voucher-number mr-2">{v.voucherNumber}</span>
                <StatusBadge status={v.status} />
              </h5>
              <span className="d-block m-t-5" style={{ fontSize: 13, color: '#666' }}>{v.expenseTitle}</span>
            </div>
            <div className="card-block">
              <div className="row">
                <div className="col-sm-6 m-b-15">
                  <p className="detail-label">Employee</p>
                  <p className="detail-value">{v.employee?.name} <small className="text-muted">({v.employee?.empId})</small></p>
                </div>
                <div className="col-sm-6 m-b-15">
                  <p className="detail-label">Department</p>
                  <p className="detail-value">{v.department || '—'}</p>
                </div>
                <div className="col-sm-6 m-b-15">
                  <p className="detail-label">Category</p>
                  <p className="detail-value">{v.expenseCategory || '—'}</p>
                </div>
                <div className="col-sm-6 m-b-15">
                  <p className="detail-label">Expense Date</p>
                  <p className="detail-value">{formatDate(v.expDate)}</p>
                </div>
                <div className="col-sm-6 m-b-15">
                  <p className="detail-label">Voucher Date</p>
                  <p className="detail-value">{formatDate(v.voucherDate)}</p>
                </div>
                <div className="col-sm-6 m-b-15">
                  <p className="detail-label">Created At</p>
                  <p className="detail-value">{formatDate(v.createdAt)}</p>
                </div>
                <div className="col-sm-12 m-b-15">
                  <p className="detail-label">Amount</p>
                  <p className="amount-large">{formatAmount(v.amount)}</p>
                </div>
                {v.expenseDesc && (
                  <div className="col-sm-12 m-b-15">
                    <p className="detail-label">Description</p>
                    <p className="detail-value" style={{ lineHeight: 1.7 }}>{v.expenseDesc}</p>
                  </div>
                )}
              </div>

              {(v.status === 'APPROVED' || v.status === 'REJECTED') && (
                <div className="row m-t-10">
                  {v.director && (
                    <div className="col-sm-6 m-b-15">
                      <p className="detail-label">Reviewed By</p>
                      <p className="detail-value">{v.director.name}</p>
                    </div>
                  )}
                  {v.approvalDate && (
                    <div className="col-sm-6 m-b-15">
                      <p className="detail-label">Review Date</p>
                      <p className="detail-value">{formatDate(v.approvalDate)}</p>
                    </div>
                  )}
                  {v.rejectReason && (
                    <div className="col-sm-12">
                      <div className="alert alert-danger">
                        <strong>Rejection Reason:</strong> {v.rejectReason}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {v.employeeSignUrl && (
                <div className="m-t-15">
                  <p className="detail-label">Employee Signature</p>
                  <img src={`http://localhost:8080${v.employeeSignUrl}`} alt="Employee Signature" className="sig-preview" />
                </div>
              )}
              {v.directorSignUrl && (
                <div className="m-t-10">
                  <p className="detail-label">Director Signature</p>
                  <img src={`http://localhost:8080${v.directorSignUrl}`} alt="Director Signature" className="sig-preview" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-block text-center">
              <button className="btn btn-secondary btn-block" onClick={() => navigate('/accounts/vouchers')}>
                <i className="fa fa-arrow-left"></i> Back to List
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
