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
      <div className="bg-white rounded-md shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h5 className="text-[14px] font-bold text-[#444] m-0">Pending Approvals</h5>
          <p className="text-[12px] text-[#999] mt-0.5">{vouchers.length} voucher{vouchers.length !== 1 ? 's' : ''} awaiting review</p>
        </div>
        <div className="p-5">
          {loading ? <Loader /> : vouchers.length === 0 ? (
            <div className="text-center py-8 text-[#aaa]">
              <i className="fa-solid fa-circle-check text-4xl block mb-2 text-[#2ed8b6]"></i>
              <p className="text-sm">No pending vouchers!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-[13.5px] text-[#666]">
                <thead>
                  <tr className="bg-[#fafafa] text-[13px] text-[#444] font-bold">
                    {['Voucher #','Employee','Title','Department','Amount','Date','Action'].map(h => (
                      <th key={h} className="text-left px-4 py-2 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {vouchers.map(v => (
                    <tr key={v.id} className="border-t border-[#f3f3f3]">
                      <td className="px-4 py-2.5"><span className="font-mono bg-[#f0f4ff] text-[#4099ff] px-2 py-0.5 rounded text-[12px] font-bold">{v.voucherNumber}</span></td>
                      <td className="px-4 py-2.5">{v.employee?.name || '—'}</td>
                      <td className="px-4 py-2.5">{v.expenseTitle}</td>
                      <td className="px-4 py-2.5">{v.department}</td>
                      <td className="px-4 py-2.5 font-bold">{formatAmount(v.amount)}</td>
                      <td className="px-4 py-2.5">{formatDate(v.expDate)}</td>
                      <td className="px-4 py-2.5">
                        <button onClick={() => navigate(`/director/vouchers/${v.id}`)}
                          className="btn-grad-primary text-white text-[12px] font-semibold px-3 py-1 rounded border-none cursor-pointer">
                          <i className="fa-solid fa-gavel mr-1"></i> Review
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
    </Layout>
  );
}
