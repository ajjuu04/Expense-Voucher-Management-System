import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../Layout';
import { createVoucher } from '../../api';

const CATEGORIES = ['Travel','Meals','Accommodation','Office Supplies','Entertainment','Medical','Training','Other'];

const Field = ({ label, required, error, children }) => (
  <div className="mb-4">
    <label className="block text-[13px] font-semibold text-[#555] mb-1">
      {label} {required && <span className="text-[#FF5370]">*</span>}
    </label>
    {children}
    {error && <p className="text-[#FF5370] text-xs mt-1">{error}</p>}
  </div>
);

const inputCls = (err) =>
  `w-full border rounded px-3 py-2 text-[14px] text-[#555] outline-none focus:border-[#4099ff] ${err ? 'border-[#FF5370]' : 'border-[#e0e0e0]'}`;

export default function CreateVoucher() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ department:'', expenseTitle:'', expenseCategory:'', expenseDescription:'', expenseDate:'', amount:'' });
  const [errors, setErrors] = useState({});
  const [apiErr, setApiErr] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.department.trim()) e.department = 'Required';
    if (!form.expenseTitle.trim()) e.expenseTitle = 'Required';
    if (!form.expenseDate) e.expenseDate = 'Required';
    if (!form.amount || parseFloat(form.amount) <= 0) e.amount = 'Must be > 0';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true); setApiErr('');
    try {
      const res = await createVoucher({ ...form, amount: parseFloat(form.amount) });
      navigate(`/employee/vouchers/${res.data.id}`);
    } catch (err) {
      setApiErr(err.response?.data?.message || 'Failed to create voucher');
    } finally { setLoading(false); }
  };

  const set = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setErrors(v => ({ ...v, [k]: '' })); };

  return (
    <Layout title="Create Voucher">
      <div className="bg-white rounded-md shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h5 className="text-[14px] font-bold text-[#444] m-0">Create Expense Voucher</h5>
          <p className="text-[12px] text-[#999] mt-0.5">Saved as Draft — upload signature and submit when ready.</p>
        </div>
        <div className="p-5">
          {apiErr && <div className="bg-red-50 border-l-4 border-[#FF5370] text-[#c0392b] px-4 py-3 rounded mb-4 text-sm">{apiErr}</div>}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
              <Field label="Department" required error={errors.department}>
                <input type="text" className={inputCls(errors.department)} placeholder="e.g. Sales, HR" value={form.department} onChange={set('department')} />
              </Field>
              <Field label="Expense Category" error={errors.expenseCategory}>
                <select className={inputCls(false)} value={form.expenseCategory} onChange={set('expenseCategory')}>
                  <option value="">Select category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <div className="md:col-span-2">
                <Field label="Expense Title" required error={errors.expenseTitle}>
                  <input type="text" className={inputCls(errors.expenseTitle)} placeholder="Short description" value={form.expenseTitle} onChange={set('expenseTitle')} />
                </Field>
              </div>
              <Field label="Expense Date" required error={errors.expenseDate}>
                <input type="date" className={inputCls(errors.expenseDate)} value={form.expenseDate} onChange={set('expenseDate')} />
              </Field>
              <Field label="Amount (₹)" required error={errors.amount}>
                <input type="number" min="0.01" step="0.01" className={inputCls(errors.amount)} placeholder="0.00" value={form.amount} onChange={set('amount')} />
              </Field>
              <div className="md:col-span-2">
                <Field label="Description" error={null}>
                  <textarea rows="3" className={inputCls(false)} placeholder="Additional details…" value={form.expenseDescription} onChange={set('expenseDescription')} />
                </Field>
              </div>
            </div>
            <div className="flex gap-3 mt-2">
              <button type="submit" disabled={loading}
                className="btn-grad-primary text-white text-[13px] font-semibold px-5 py-2 rounded border-none cursor-pointer">
                <i className="fa-solid fa-save mr-1"></i> {loading ? 'Saving...' : 'Save as Draft'}
              </button>
              <button type="button" onClick={() => navigate(-1)}
                className="bg-[#e8e8e8] text-[#555] text-[13px] font-semibold px-5 py-2 rounded border-none cursor-pointer">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
