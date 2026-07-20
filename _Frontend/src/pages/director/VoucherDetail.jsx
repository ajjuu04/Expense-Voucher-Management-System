import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../Layout';
import { getVoucher, uploadDirectorSignature, approveVoucher, rejectVoucher } from '../../api';
import { StatusBadge, Loader, formatDate, formatAmount } from '../../helpers';

export default function DirVoucherDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [v, setV] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sigLoading, setSigLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectErr, setRejectErr] = useState('');
  const fileRef = useRef();

  const load = () => getVoucher(id).then(r => setV(r.data)).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, [id]);

  const handleSignature = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSigLoading(true); setMsg({});
    try {
      await uploadDirectorSignature(id, file);
      setMsg({ type: 'success', text: 'Director signature uploaded!' });
      load();
    } catch (err) {
      setMsg({ type: 'danger', text: err.response?.data?.message || 'Upload failed' });
    } finally { setSigLoading(false); }
  };

  const handleApprove = async () => {
    setActionLoading(true); setMsg({});
    try {
      await approveVoucher(id);
      setMsg({ type: 'success', text: 'Voucher approved successfully!' });
      load();
    } catch (err) {
      setMsg({ type: 'danger', text: err.response?.data?.message || 'Approve failed' });
    } finally { setActionLoading(false); }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) { setRejectErr('Rejection reason is required'); return; }
    setActionLoading(true); setRejectModal(false); setMsg({});
    try {
      await rejectVoucher(id, rejectReason);
      setMsg({ type: 'warning', text: 'Voucher rejected.' });
      setRejectReason('');
      load();
    } catch (err) {
      setMsg({ type: 'danger', text: err.response?.data?.message || 'Reject failed' });
    } finally { setActionLoading(false); }
  };

  if (loading) return <Layout title="Voucher Detail"><Loader /></Layout>;
  if (!v) return <Layout title="Voucher Detail"><div className="alert alert-danger">Voucher not found.</div></Layout>;

  return (
    <Layout title="Voucher Detail">

      {msg.text && (
        <div className={`alert alert-${msg.type} alert-dismissible`}>
          <button type="button" className="close" onClick={() => setMsg({})}><span>&times;</span></button>
          {msg.text}
        </div>
      )}

      <div className="row">
        {/* Details card */}
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

              {/* Employee signature */}
              {v.employeeSignUrl && (
                <div className="m-t-15">
                  <p className="detail-label">Employee Signature</p>
                  <img src={`http://localhost:8080${v.employeeSignUrl}`} alt="Employee Signature" className="sig-preview" />
                </div>
              )}

              {/* Rejection reason */}
              {v.status === 'REJECTED' && v.rejectReason && (
                <div className="alert alert-danger m-t-15">
                  <strong><i className="fa fa-times-circle"></i> Rejection Reason:</strong> {v.rejectReason}
                </div>
              )}

              {/* Approval info */}
              {v.status === 'APPROVED' && (
                <div className="row m-t-15">
                  <div className="col-sm-6">
                    <p className="detail-label">Approved By</p>
                    <p className="detail-value">{v.director?.name || '—'}</p>
                  </div>
                  <div className="col-sm-6">
                    <p className="detail-label">Approval Date</p>
                    <p className="detail-value">{formatDate(v.approvalDate)}</p>
                  </div>
                  {v.directorSignUrl && (
                    <div className="col-sm-12 m-t-10">
                      <p className="detail-label">Director Signature</p>
                      <img src={`http://localhost:8080${v.directorSignUrl}`} alt="Director Signature" className="sig-preview" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Signature + Actions (only for PENDING) */}
        {v.status === 'PENDING' && (
          <div className="col-md-4">
            {/* Director signature upload */}
            <div className="card">
              <div className="card-header"><h5>Director Signature</h5></div>
              <div className="card-block">
                <div className="sig-upload-box" onClick={() => fileRef.current.click()}>
                  {v.directorSignUrl ? (
                    <img src={`http://localhost:8080${v.directorSignUrl}`} alt="Director Signature" className="sig-preview" />
                  ) : (
                    <div className="text-muted m-b-10">
                      <i className="fa fa-upload fa-2x d-block m-b-10"></i>
                      <small>Click to upload your signature</small>
                    </div>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleSignature} />
                  <button type="button" className="btn btn-secondary btn-sm m-t-5" disabled={sigLoading}
                    onClick={(e) => { e.stopPropagation(); fileRef.current.click(); }}>
                    {sigLoading ? 'Uploading...' : v.directorSignUrl ? 'Change Signature' : 'Upload Signature'}
                  </button>
                </div>
                {!v.directorSignUrl && (
                  <small className="text-warning d-block m-t-10">
                    <i className="fa fa-exclamation-triangle"></i> Upload signature before approving
                  </small>
                )}
              </div>
            </div>

            {/* Approve / Reject actions */}
            <div className="card">
              <div className="card-header"><h5>Actions</h5></div>
              <div className="card-block">
                <button
                  className="btn btn-success btn-block m-b-10"
                  onClick={handleApprove}
                  disabled={actionLoading || !v.directorSignUrl}
                >
                  <i className="fa fa-check"></i> {actionLoading ? 'Processing...' : 'Approve Voucher'}
                </button>
                <button className="btn btn-danger btn-block" onClick={() => setRejectModal(true)} disabled={actionLoading}>
                  <i className="fa fa-times"></i> Reject Voucher
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectModal && (
        <div className="modal-overlay" onClick={() => setRejectModal(false)}>
          <div className="modal-dialog-custom" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Reject Voucher</div>
            <p className="text-muted m-b-15" style={{ fontSize: 13 }}>
              Provide a reason for rejection. The employee will see this.
            </p>
            <div className="form-group">
              <label>Rejection Reason <span className="text-danger">*</span></label>
              <textarea
                className={`form-control ${rejectErr ? 'is-invalid' : ''}`}
                rows="3"
                placeholder="e.g. Missing receipt, amount exceeds policy…"
                value={rejectReason}
                onChange={e => { setRejectReason(e.target.value); setRejectErr(''); }}
              />
              {rejectErr && <div className="invalid-feedback">{rejectErr}</div>}
            </div>
            <div className="text-right m-t-15">
              <button className="btn btn-secondary mr-2" onClick={() => setRejectModal(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleReject}>
                <i className="fa fa-times"></i> Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

    </Layout>
  );
}
