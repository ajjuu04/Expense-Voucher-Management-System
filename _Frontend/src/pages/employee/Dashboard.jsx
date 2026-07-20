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
  };

  return (
    <Layout title="Dashboard">

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
        {[
          { label: 'Total Vouchers',   value: c.total,    cls: 'bg-c-blue',   icon: 'fa-solid fa-file-lines' },
          { label: 'Draft',            value: c.draft,    cls: 'bg-c-grey',   icon: 'fa-solid fa-pencil' },
          { label: 'Pending Approval', value: c.pending,  cls: 'bg-c-yellow', icon: 'fa-solid fa-clock' },
          { label: 'Approved',         value: c.approved, cls: 'bg-c-green',  icon: 'fa-solid fa-check' },
        ].map(({ label, value, cls, icon }) => (
          <div key={label} className={`${cls} rounded-md p-5 text-white`}>
            <p className="text-[13px] font-semibold opacity-90 mb-2">{label}</p>
            <div className="flex items-center justify-between">
              <i className={`${icon} text-2xl opacity-70`}></i>
              <span className="text-3xl font-bold">{value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent vouchers */}
      <div className="bg-white rounded-md shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h5 className="text-[14px] font-bold text-[#444] m-0">Recent Vouchers</h5>
            <p className="text-[12px] text-[#999] mt-0.5">Your expense vouchers</p>
          </div>
          <button onClick={() => navigate('/employee/create')}
            className="btn-grad-primary text-white text-[13px] font-semibold px-4 py-1.5 rounded border-none cursor-pointer">
            <i className="fa-solid fa-plus mr-1"></i> New Voucher
          </button>
        </div>
        <div className="p-5">
          {loading ? <Loader /> : vouchers.length === 0 ? (
            <div className="text-center py-8 text-[#aaa]">
              <i className="fa-solid fa-inbox text-4xl block mb-2"></i>
              <p className="text-sm">No vouchers yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-[13.5px] text-[#666]">
                <thead>
                  <tr className="bg-[#fafafa] text-[13px] text-[#444] font-bold">
                    <th className="text-left px-4 py-2">Voucher #</th>
                    <th className="text-left px-4 py-2">Title</th>
                    <th className="text-left px-4 py-2">Amount</th>
                    <th className="text-left px-4 py-2">Date</th>
                    <th className="text-left px-4 py-2">Status</th>
                    <th className="text-left px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {vouchers.slice(0, 8).map(v => (
                    <tr key={v.id} className="border-t border-[#f3f3f3]">
                      <td className="px-4 py-2.5">
                        <span className="font-mono bg-[#f0f4ff] text-[#4099ff] px-2 py-0.5 rounded text-[12px] font-bold">{v.voucherNumber}</span>
                      </td>
                      <td className="px-4 py-2.5">{v.expenseTitle}</td>
                      <td className="px-4 py-2.5 font-bold">{formatAmount(v.amount)}</td>
                      <td className="px-4 py-2.5">{formatDate(v.expDate)}</td>
                      <td className="px-4 py-2.5"><StatusBadge status={v.status} /></td>
                      <td className="px-4 py-2.5">
                        <button onClick={() => navigate(`/employee/vouchers/${v.id}`)}
                          className="btn-grad-primary text-white text-[12px] font-semibold px-3 py-1 rounded border-none cursor-pointer">
                          View
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
