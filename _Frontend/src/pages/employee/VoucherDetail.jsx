import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../Layout';
import { getVoucher, uploadSignature, submitVoucher, deleteVoucher } from '../../api';
import { StatusBadge, Loader, formatDate, formatAmount } from '../../helpers';

export default function EmpVoucherDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [v, setV] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sigLoading, setSigLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const fileRef = useRef();

  const load = () =>
    getVoucher(id).then(r => setV(r.data)).catch(() => {}).finally(() => setLoading(false));

  useEffect(() => { load(); }, [id]);

  const handleSignature = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSigLoading(true); setMsg({});
    try {
      await uploadSignature(id, file);
      setMsg({ type: 'success', text: 'Signature uploaded successfully!' });
      load();
    } catch (err) {
      setMsg({ type: 'danger', text: err.response?.data?.message || 'Upload failed' });
    } finally { setSigLoading(false); }
  };

  const handleSubmit = async () => {
    setSubmitLoading(true); setMsg({});
    try {
      await submitVoucher(id);
      setMsg({ type: 'success', text: 'Voucher submitted for approval!' });
      load();
    } catch (err) {
      setMsg({ type: 'danger', text: err.response?.data?.message || 'Submit failed' });
    } finally { setSubmitLoading(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this draft?')) return;
    try {
      await deleteVoucher(id);
      navigate('/employee/vouchers');
    } catch (err) {
      setMsg({ type: 'danger', text: err.response?.data?.message || 'Delete failed' });
    }
  };

  if (loading) return <Layout title="Voucher Detail"><Loader /></Layout>;
  if (!v) return <Layout title="Voucher Detail"><div className="alert alert-danger">Voucher not found.</div></Layout>;

  return (
    <Layout title="Voucher Detail">

      {msg.text && (
        <div className={`alert alert-${msg.type} alert-dismissible`}>
          <button type="button" className="close" onClick={() => setMsg({})}>
            <span>&times;</span>
          </button>
          {msg.text}
        </div>
      )}

      <div className="row">
        {/* Main details card */}
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

              {v.status === 'REJECTED' && v.rejectReason && (
                <div className="alert alert-danger m-t-15">
                  <strong><i className="fa fa-times-circle"></i> Rejection Reason:</strong> {v.rejectReason}
                </div>
              )}

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
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column: Signature + Actions */}
        <div className="col-md-4">
          {/* Signature card (only for DRAFT) */}
          {v.status === 'DRAFT' && (
            <div className="card">
              <div className="card-header">
                <h5>Your Signature</h5>
              </div>
              <div className="card-block">
                <div className="sig-upload-box" onClick={() => fileRef.current.click()}>
                  {v.employeeSignUrl ? (
                    <img
                      src={`http://localhost:8080${v.employeeSignUrl}`}
                      alt="Signature"
                      className="sig-preview"
                    />
                  ) : (
                    <div className="text-muted m-b-10">
                      <i className="fa fa-upload fa-2x d-block m-b-10"></i>
                      <small>Click to upload signature image</small>
                    </div>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleSignature}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm m-t-5"
                    disabled={sigLoading}
                    onClick={(e) => { e.stopPropagation(); fileRef.current.click(); }}
                  >
                    {sigLoading ? 'Uploading...' : v.employeeSignUrl ? 'Change Signature' : 'Upload Signature'}
                  </button>
                </div>
                {!v.employeeSignUrl && (
                  <small className="text-warning d-block m-t-10">
                    <i className="fa fa-exclamation-triangle"></i> Signature required before submitting
                  </small>
                )}
              </div>
            </div>
          )}

          {/* Actions card (only for DRAFT) */}
          {v.status === 'DRAFT' && (
            <div className="card">
              <div className="card-header"><h5>Actions</h5></div>
              <div className="card-block">
                <button
                  className="btn btn-success btn-block m-b-10"
                  onClick={handleSubmit}
                  disabled={submitLoading || !v.employeeSignUrl}
                >
                  <i className="fa fa-paper-plane"></i> {submitLoading ? 'Submitting...' : 'Submit for Approval'}
                </button>
                <button
                  className="btn btn-warning btn-block m-b-10"
                  onClick={() => navigate(`/employee/vouchers/${id}/edit`)}
                >
                  <i className="fa fa-pencil"></i> Edit Voucher
                </button>
                <button className="btn btn-danger btn-block" onClick={handleDelete}>
                  <i className="fa fa-trash"></i> Delete Draft
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

    </Layout>
  );
}
