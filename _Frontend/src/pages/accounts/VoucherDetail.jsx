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
  if (!v) return <Layout title="Voucher Detail"><div className="text-[#c0392b]">Voucher not found.</div></Layout>;

  return (
    <Layout title="Voucher Detail">
      <div className="bg-blue-50 border-l-4 border-[#4099ff] text-[#2471a3] px-4 py-3 rounded mb-4 text-sm">
        <i className="fa-solid fa-circle-info mr-1"></i> <strong>Read-only view</strong> — Accounts team cannot modify vouchers.
      </div>

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
              {[['Employee', `${v.employee?.name||'—'} (${v.employee?.empId||''})`], ['Department', v.department], ['Category', v.expenseCategory], ['Expense Date', formatDate(v.expDate)], ['Voucher Date', formatDate(v.voucherDate)], ['Created', formatDate(v.createdAt)]].map(([label, value]) => (
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
            {v.rejectReason && (
              <div className="bg-red-50 border-l-4 border-[#FF5370] text-[#c0392b] px-4 py-3 rounded text-sm mb-4">
                <strong>Rejection Reason:</strong> {v.rejectReason}
              </div>
            )}
            {v.employeeSignUrl && (
              <div className="mb-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#aaa] mb-2">Employee Signature</p>
                <img src={`http://localhost:8080${v.employeeSignUrl}`} alt="Employee Sig" className="max-h-[80px] border border-gray-200 rounded p-1" />
              </div>
            )}
            {v.directorSignUrl && (
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#aaa] mb-2">Director Signature</p>
                <img src={`http://localhost:8080${v.directorSignUrl}`} alt="Director Sig" className="max-h-[80px] border border-gray-200 rounded p-1" />
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="bg-white rounded-md shadow-sm p-5">
            <button onClick={() => navigate('/accounts/vouchers')}
              className="w-full bg-[#e8e8e8] text-[#555] text-[13px] font-semibold py-2 rounded border-none cursor-pointer">
              <i className="fa-solid fa-arrow-left mr-1"></i> Back to List
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
