import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../Layout';
import { createVoucher } from '../../api';

const CATEGORIES = ['Travel','Meals','Accommodation','Office Supplies','Entertainment','Medical','Training','Other'];

export default function CreateVoucher() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ department:'', expenseTitle:'', expenseCategory:'', expenseDescription:'', expenseDate:'', amount:'' });
  const [errors, setErrors] = useState({});
  const [apiErr, setApiErr] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.department.trim()) e.department = 'Department is required';
    if (!form.expenseTitle.trim()) e.expenseTitle = 'Expense title is required';
    if (!form.expenseDate) e.expenseDate = 'Date is required';
    if (!form.amount) e.amount = 'Amount is required';
    else if (parseFloat(form.amount) <= 0) e.amount = 'Amount must be greater than 0';
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
      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-header">
              <h5>Create Expense Voucher</h5>
              <span className="d-block m-t-5 text-muted" style={{ fontSize: 12 }}>
                Saved as Draft — upload signature and submit when ready.
              </span>
            </div>
            <div className="card-block">

              {apiErr && <div className="alert alert-danger">{apiErr}</div>}

              <form onSubmit={handleSubmit}>
                <div className="row">

                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="department">Department <span className="text-danger">*</span></label>
                      <input
                        id="department"
                        type="text"
                        className={`form-control ${errors.department ? 'is-invalid' : ''}`}
                        placeholder="e.g. Sales, HR, Finance"
                        value={form.department}
                        onChange={set('department')}
                      />
                      {errors.department && <div className="invalid-feedback">{errors.department}</div>}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="expenseCategory">Expense Category</label>
                      <select
                        id="expenseCategory"
                        className="form-control"
                        value={form.expenseCategory}
                        onChange={set('expenseCategory')}
                      >
                        <option value="">Select category</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="expenseTitle">Expense Title <span className="text-danger">*</span></label>
                      <input
                        id="expenseTitle"
                        type="text"
                        className={`form-control ${errors.expenseTitle ? 'is-invalid' : ''}`}
                        placeholder="Short description of the expense"
                        value={form.expenseTitle}
                        onChange={set('expenseTitle')}
                      />
                      {errors.expenseTitle && <div className="invalid-feedback">{errors.expenseTitle}</div>}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="expenseDate">Expense Date <span className="text-danger">*</span></label>
                      <input
                        id="expenseDate"
                        type="date"
                        className={`form-control ${errors.expenseDate ? 'is-invalid' : ''}`}
                        value={form.expenseDate}
                        onChange={set('expenseDate')}
                      />
                      {errors.expenseDate && <div className="invalid-feedback">{errors.expenseDate}</div>}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="amount">Amount (₹) <span className="text-danger">*</span></label>
                      <input
                        id="amount"
                        type="number"
                        min="0.01"
                        step="0.01"
                        className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                        placeholder="0.00"
                        value={form.amount}
                        onChange={set('amount')}
                      />
                      {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="expenseDescription">Description</label>
                      <textarea
                        id="expenseDescription"
                        className="form-control"
                        rows="3"
                        placeholder="Additional details about this expense…"
                        value={form.expenseDescription}
                        onChange={set('expenseDescription')}
                      />
                    </div>
                  </div>

                </div>

                <div className="form-group m-t-10">
                  <button type="submit" className="btn btn-primary m-r-10" disabled={loading}>
                    <i className="fa fa-save"></i> {loading ? 'Saving...' : 'Save as Draft'}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
                    Cancel
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
