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

  const c = { total: vouchers.length, pending: vouchers.filter(v => v.status==='PENDING').length, approved: vouchers.filter(v => v.status==='APPROVED').length, rejected: vouchers.filter(v => v.status==='REJECTED').length };
  const totalApproved = vouchers.filter(v => v.status === 'APPROVED').reduce((s, v) => s + v.amount, 0);

  return (
    <Layout title="Accounts Dashboard">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
        {[
          { label: 'Total Vouchers', value: c.total,    cls: 'bg-c-blue',   icon: 'fa-solid fa-file-lines' },
          { label: 'Pending',        value: c.pending,  cls: 'bg-c-yellow', icon: 'fa-solid fa-clock' },
          { label: 'Approved',       value: c.approved, cls: 'bg-c-green',  icon: 'fa-solid fa-check' },
          { label: 'Rejected',       value: c.rejected, cls: 'bg-c-red',    icon: 'fa-solid fa-times' },
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

      <div className="bg-white rounded-md shadow-sm p-5 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#aaa] mb-1">Total Approved Amount</p>
          <p className="text-[26px] font-bold text-[#4099ff]">{formatAmount(totalApproved)}</p>
        </div>
        <button onClick={() => navigate('/accounts/vouchers')}
          className="btn-grad-primary text-white text-[13px] font-semibold px-5 py-2 rounded border-none cursor-pointer">
          <i className="fa-solid fa-list mr-1"></i> View All Vouchers
        </button>
      </div>
    </Layout>
  );
}
