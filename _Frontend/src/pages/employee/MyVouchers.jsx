import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../Layout';
import { getMyVouchers } from '../../api';
import { StatusBadge, Loader, formatDate, formatAmount } from '../../helpers';

const TABS = ['ALL','DRAFT','PENDING','APPROVED','REJECTED'];

export default function MyVouchers() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    getMyVouchers().then(r => setVouchers(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'ALL' ? vouchers : vouchers.filter(v => v.status === filter);

  return (
    <Layout title="My Vouchers">
      <div className="bg-white rounded-md shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h5 className="text-[14px] font-bold text-[#444] m-0">My Expense Vouchers</h5>
            <p className="text-[12px] text-[#999] mt-0.5">{vouchers.length} total vouchers</p>
          </div>
          <button onClick={() => navigate('/employee/create')}
            className="btn-grad-primary text-white text-[13px] font-semibold px-4 py-1.5 rounded border-none cursor-pointer">
            <i className="fa-solid fa-plus mr-1"></i> New Voucher
          </button>
        </div>
        <div className="p-5">
          {/* Tabs */}
          <div className="flex gap-1 border-b border-gray-200 mb-5">
            {TABS.map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-4 py-2 text-[13px] font-semibold border-none bg-transparent cursor-pointer
                  ${filter === s ? 'text-[#4099ff] border-b-2 border-[#4099ff]' : 'text-[#666]'}`}>
                {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
                {s !== 'ALL' && (
                  <span className="ml-1 bg-[#8a8a8a] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    {vouchers.filter(v => v.status === s).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {loading ? <Loader /> : filtered.length === 0 ? (
            <div className="text-center py-8 text-[#aaa]">
              <i className="fa-solid fa-inbox text-4xl block mb-2"></i>
              <p className="text-sm">No vouchers found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-[13.5px] text-[#666]">
                <thead>
                  <tr className="bg-[#fafafa] text-[13px] text-[#444] font-bold">
                    {['Voucher #','Title','Department','Amount','Date','Status','Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-2 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(v => (
                    <tr key={v.id} className="border-t border-[#f3f3f3]">
                      <td className="px-4 py-2.5">
                        <span className="font-mono bg-[#f0f4ff] text-[#4099ff] px-2 py-0.5 rounded text-[12px] font-bold">{v.voucherNumber}</span>
                      </td>
                      <td className="px-4 py-2.5">{v.expenseTitle}</td>
                      <td className="px-4 py-2.5">{v.department}</td>
                      <td className="px-4 py-2.5 font-bold">{formatAmount(v.amount)}</td>
                      <td className="px-4 py-2.5">{formatDate(v.expDate)}</td>
                      <td className="px-4 py-2.5"><StatusBadge status={v.status} /></td>
                      <td className="px-4 py-2.5 flex gap-2">
                        <button onClick={() => navigate(`/employee/vouchers/${v.id}`)}
                          className="btn-grad-primary text-white text-[12px] font-semibold px-3 py-1 rounded border-none cursor-pointer">
                          View
                        </button>
                        {v.status === 'DRAFT' && (
                          <button onClick={() => navigate(`/employee/vouchers/${v.id}/edit`)}
                            className="btn-grad-warning text-white text-[12px] font-semibold px-3 py-1 rounded border-none cursor-pointer">
                            <i className="fa-solid fa-pencil mr-1"></i> Edit
                          </button>
                        )}
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
