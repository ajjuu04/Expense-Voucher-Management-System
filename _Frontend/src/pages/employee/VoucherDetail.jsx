import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../Layout';
import { getVoucher, uploadSignature, submitVoucher, deleteVoucher } from '../../api';
import { StatusBadge, Loader, formatDate, formatAmount } from '../../helpers';

const DetailRow = ({ label, value }) => (
  <div className="mb-4">
    <p className="text-[11px] font-bold uppercase tracking-wider text-[#aaa] mb-1">{label}</p>
    <p className="text-[15px] text-[#444] font-medium">{value || '—'}</p>
  </div>
);

export default function EmpVoucherDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [v, setV] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sigLoading, setSigLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const fileRef = useRef();

  const load = () => getVoucher(id).then(r => setV(r.data)).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, [id]);

  const handleSignature = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setSigLoading(true); setMsg({});
    try { await uploadSignature(id, file); setMsg({ type: 'success', text: 'Signature uploaded!' }); load(); }
    catch (err) { setMsg({ type: 'danger', text: err.response?.data?.message || 'Upload failed' }); }
    finally { setSigLoading(false); }
  };

  const handleSubmit = async () => {
    setSubmitLoading(true); setMsg({});
    try { await submitVoucher(id); setMsg({ type: 'success', text: 'Voucher submitted for approval!' }); load(); }
    catch (err) { setMsg({ type: 'danger', text: err.response?.data?.message || 'Submit failed' }); }
    finally { setSubmitLoading(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this draft?')) return;
    try { await deleteVoucher(id); navigate('/employee/vouchers'); }
    catch (err) { setMsg({ type: 'danger', text: 'Delete failed' }); }
  };

  if (loading) return <Layout title="Voucher Detail"><Loader /></Layout>;
  if (!v) return <Layout title="Voucher Detail"><div className="text-[#c0392b]">Voucher not found.</div></Layout>;

  const alertCls = msg.type === 'success'
    ? 'bg-green-50 border-[#2ed8b6] text-[#16a085]'
    : 'bg-red-50 border-[#FF5370] text-[#c0392b]';

  return (
    <Layout title="Voucher Detail">
      {msg.text && (
        <div className={`border-l-4 px-4 py-3 rounded mb-4 text-sm flex justify-between ${alertCls}`}>
          <span>{msg.text}</span>
          <button onClick={() => setMsg({})} className="bg-transparent border-none cursor-pointer text-inherit font-bold">&times;</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main details */}
        <div className="lg:col-span-2 bg-white rounded-md shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <span className="font-mono bg-[#f0f4ff] text-[#4099ff] px-2 py-0.5 rounded text-[13px] font-bold">{v.voucherNumber}</span>
              <StatusBadge status={v.status} />
            </div>
            <p className="text-[13px] text-[#666] mt-1">{v.expenseTitle}</p>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 gap-4">
              <DetailRow label="Department" value={v.department} />
              <DetailRow label="Category" value={v.expenseCategory} />
              <DetailRow label="Expense Date" value={formatDate(v.expDate)} />
              <DetailRow label="Voucher Date" value={formatDate(v.voucherDate)} />
            </div>
            <div className="mb-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#aaa] mb-1">Amount</p>
              <p className="text-[26px] font-bold text-[#4099ff]">{formatAmount(v.amount)}</p>
            </div>
            {v.expenseDesc && <DetailRow label="Description" value={v.expenseDesc} />}
            {v.status === 'REJECTED' && v.rejectReason && (
              <div className="bg-red-50 border-l-4 border-[#FF5370] text-[#c0392b] px-4 py-3 rounded text-sm mt-2">
                <strong>Rejection Reason:</strong> {v.rejectReason}
              </div>
            )}
          </div>
        </div>

        {/* Right column — only for DRAFT */}
        {v.status === 'DRAFT' && (
          <div className="flex flex-col gap-5">
            {/* Signature upload */}
            <div className="bg-white rounded-md shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h5 className="text-[14px] font-bold text-[#444] m-0">Your Signature</h5>
              </div>
              <div className="p-5">
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-5 text-center cursor-pointer"
                  onClick={() => fileRef.current.click()}>
                  {v.employeeSignUrl
                    ? <img src={`http://localhost:8080${v.employeeSignUrl}`} alt="Signature" className="max-h-[80px] mx-auto mb-3" />
                    : <div className="text-[#aaa] mb-3"><i className="fa-solid fa-upload text-2xl block mb-2"></i><small>Click to upload</small></div>
                  }
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleSignature} />
                  <button type="button" disabled={sigLoading}
                    className="bg-[#e8e8e8] text-[#555] text-[12px] font-semibold px-3 py-1 rounded border-none cursor-pointer mt-2"
                    onClick={e => { e.stopPropagation(); fileRef.current.click(); }}>
                    {sigLoading ? 'Uploading...' : v.employeeSignUrl ? 'Change' : 'Upload Signature'}
                  </button>
                </div>
                {!v.employeeSignUrl && (
                  <p className="text-[#FFB64D] text-xs mt-2"><i className="fa-solid fa-triangle-exclamation mr-1"></i>Required before submitting</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-md shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h5 className="text-[14px] font-bold text-[#444] m-0">Actions</h5>
              </div>
              <div className="p-5 flex flex-col gap-3">
                <button onClick={handleSubmit} disabled={submitLoading || !v.employeeSignUrl}
                  className="btn-grad-success w-full text-white text-[13px] font-semibold py-2 rounded border-none cursor-pointer disabled:opacity-50">
                  <i className="fa-solid fa-paper-plane mr-1"></i> {submitLoading ? 'Submitting...' : 'Submit for Approval'}
                </button>
                <button onClick={() => navigate(`/employee/vouchers/${id}/edit`)}
                  className="btn-grad-warning w-full text-white text-[13px] font-semibold py-2 rounded border-none cursor-pointer">
                  <i className="fa-solid fa-pencil mr-1"></i> Edit Voucher
                </button>
                <button onClick={handleDelete}
                  className="btn-grad-danger w-full text-white text-[13px] font-semibold py-2 rounded border-none cursor-pointer">
                  <i className="fa-solid fa-trash mr-1"></i> Delete Draft
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
