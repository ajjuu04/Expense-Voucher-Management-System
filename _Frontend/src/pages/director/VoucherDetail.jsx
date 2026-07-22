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
    const file = e.target.files[0]; if (!file) return;
    setSigLoading(true); setMsg({});
    try { await uploadDirectorSignature(id, file); setMsg({ type: 'success', text: 'Director signature uploaded!' }); load(); }
    catch (err) { setMsg({ type: 'danger', text: err.response?.data?.message || 'Upload failed' }); }
    finally { setSigLoading(false); }
  };

  const handleApprove = async () => {
    setActionLoading(true); setMsg({});
    try { await approveVoucher(id); setMsg({ type: 'success', text: 'Voucher approved!' }); load(); }
    catch (err) { setMsg({ type: 'danger', text: err.response?.data?.message || 'Approve failed' }); }
    finally { setActionLoading(false); }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) { setRejectErr('Reason is required'); return; }
    setActionLoading(true); setRejectModal(false); setMsg({});
    try { await rejectVoucher(id, rejectReason); setMsg({ type: 'warning', text: 'Voucher rejected.' }); setRejectReason(''); load(); }
    catch (err) { setMsg({ type: 'danger', text: err.response?.data?.message || 'Reject failed' }); }
    finally { setActionLoading(false); }
  };

  if (loading) return <Layout title="Voucher Detail"><Loader /></Layout>;
  if (!v) return <Layout title="Voucher Detail"><div className="text-[#c0392b]">Voucher not found.</div></Layout>;

  const alertCls = msg.type === 'success' ? 'bg-green-50 border-[#2ed8b6] text-[#16a085]'
    : msg.type === 'warning' ? 'bg-yellow-50 border-[#FFB64D] text-[#d68910]'
    : 'bg-red-50 border-[#FF5370] text-[#c0392b]';

  return (
    <Layout title="Voucher Detail">
      {msg.text && (
        <div className={`border-l-4 px-4 py-3 rounded mb-4 text-sm flex justify-between ${alertCls}`}>
          <span>{msg.text}</span>
          <button onClick={() => setMsg({})} className="bg-transparent border-none cursor-pointer font-bold">&times;</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
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
              {[['Employee', `${v.employee?.name||'—'} (${v.employee?.empId||''})`], ['Department', v.department], ['Category', v.expenseCategory], ['Expense Date', formatDate(v.expDate)]].map(([label, value]) => (
                <div key={label} className="mb-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#aaa] mb-1">{label}</p>
                  <p className="text-[15px] text-[#444] font-medium">{value || '—'}</p>
                </div>
              ))}
            </div>
            <div className="mb-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#aaa] mb-1">Amount</p>
              <p className="text-[26px] font-bold text-[#4099ff]">{formatAmount(v.amount)}</p>
            </div>
            {v.employeeSignUrl && (
              <div className="mb-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#aaa] mb-2">Employee Signature</p>
                <img src={`http://localhost:8080${v.employeeSignUrl}`} alt="Employee Signature" className="max-h-[80px] border border-gray-200 rounded p-1" />
              </div>
            )}
            {v.status === 'REJECTED' && v.rejectReason && (
              <div className="bg-red-50 border-l-4 border-[#FF5370] text-[#c0392b] px-4 py-3 rounded text-sm mt-2">
                <strong>Rejection Reason:</strong> {v.rejectReason}
              </div>
            )}
          </div>
        </div>

        {v.status === 'PENDING' && (
          <div className="flex flex-col gap-5">
            <div className="bg-white rounded-md shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h5 className="text-[14px] font-bold text-[#444] m-0">Director Signature</h5>
              </div>
              <div className="p-5">
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-5 text-center cursor-pointer"
                  onClick={() => fileRef.current.click()}>
                  {v.directorSignUrl
                    ? <img src={`http://localhost:8080${v.directorSignUrl}`} alt="Director Sig" className="max-h-[80px] mx-auto mb-3" />
                    : <div className="text-[#aaa] mb-3"><i className="fa-solid fa-upload text-2xl block mb-2"></i><small>Click to upload</small></div>
                  }
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleSignature} />
                  <button type="button" disabled={sigLoading}
                    className="bg-[#e8e8e8] text-[#555] text-[12px] font-semibold px-3 py-1 rounded border-none cursor-pointer mt-2"
                    onClick={e => { e.stopPropagation(); fileRef.current.click(); }}>
                    {sigLoading ? 'Uploading...' : v.directorSignUrl ? 'Change' : 'Upload Signature'}
                  </button>
                </div>
                {!v.directorSignUrl && (
                  <p className="text-[#FFB64D] text-xs mt-2"><i className="fa-solid fa-triangle-exclamation mr-1"></i>Upload before approving</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-md shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100"><h5 className="text-[14px] font-bold text-[#444] m-0">Actions</h5></div>
              <div className="p-5 flex flex-col gap-3">
                <button onClick={handleApprove} disabled={actionLoading || !v.directorSignUrl}
                  className="btn-grad-success w-full text-white text-[13px] font-semibold py-2 rounded border-none cursor-pointer disabled:opacity-50">
                  <i className="fa-solid fa-check mr-1"></i> {actionLoading ? 'Processing...' : 'Approve Voucher'}
                </button>
                <button onClick={() => setRejectModal(true)} disabled={actionLoading}
                  className="btn-grad-danger w-full text-white text-[13px] font-semibold py-2 rounded border-none cursor-pointer">
                  <i className="fa-solid fa-times mr-1"></i> Reject Voucher
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {rejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setRejectModal(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-[420px] shadow-xl" onClick={e => e.stopPropagation()}>
            <h5 className="text-[17px] font-bold text-[#444] mb-3">Reject Voucher</h5>
            <p className="text-[13px] text-[#999] mb-4">Provide a reason — the employee will see this.</p>
            <textarea rows="3" placeholder="e.g. Missing receipt, amount exceeds policy…"
              value={rejectReason} onChange={e => { setRejectReason(e.target.value); setRejectErr(''); }}
              className={`w-full border rounded px-3 py-2 text-[14px] text-[#555] outline-none focus:border-[#4099ff] ${rejectErr ? 'border-[#FF5370]' : 'border-[#e0e0e0]'}`} />
            {rejectErr && <p className="text-[#FF5370] text-xs mt-1">{rejectErr}</p>}
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setRejectModal(false)}
                className="bg-[#e8e8e8] text-[#555] text-[13px] font-semibold px-4 py-2 rounded border-none cursor-pointer">Cancel</button>
              <button onClick={handleReject}
                className="btn-grad-danger text-white text-[13px] font-semibold px-4 py-2 rounded border-none cursor-pointer">
                <i className="fa-solid fa-times mr-1"></i> Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
