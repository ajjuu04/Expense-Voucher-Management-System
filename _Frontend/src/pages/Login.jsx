import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { login as apiLogin } from '../api';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiErr, setApiErr] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true); setApiErr('');
    try {
      const res = await apiLogin(form.email, form.password);
      login(res.data);
      const role = res.data.role;
      navigate(role === 'EMPLOYEE' ? '/employee/dashboard' : role === 'DIRECTOR' ? '/director/dashboard' : '/accounts/dashboard');
    } catch (err) {
      setApiErr(err.response?.data?.message || 'Invalid email or password');
    } finally { setLoading(false); }
  };

  const set = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setErrors(v => ({ ...v, [k]: '' })); };

  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ background: 'linear-gradient(45deg, #4099ff, #73b4ff)' }}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-[440px] mx-4 p-8">

        {/* Brand */}
        <div className="text-center mb-6">
          <i className="icofont icofont-briefcase text-[40px] text-[#4099ff]"></i>
          <p className="text-[13px] text-[#aaa] mt-1">Expense Voucher Management</p>
        </div>

        <h3 className="text-[18px] font-bold text-[#4099ff] mb-4">Sign In</h3>

        {apiErr && <div className="text-[#c0392b] text-sm mb-3">{apiErr}</div>}

        <hr className="border-gray-200 mb-5" />

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-5">
            <input
              type="email"
              placeholder="Your Email Address"
              value={form.email}
              onChange={set('email')}
              className="w-full border-b border-gray-300 py-2 text-[14px] text-[#555] bg-transparent outline-none focus:border-[#4099ff]"
            />
            {errors.email && <p className="text-[#FF5370] text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="mb-6">
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={set('password')}
              className="w-full border-b border-gray-300 py-2 text-[14px] text-[#555] bg-transparent outline-none focus:border-[#4099ff]"
            />
            {errors.password && <p className="text-[#FF5370] text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Remember me */}
          <div className="flex items-center gap-2 mb-6">
            <input type="checkbox" id="remember" className="cursor-pointer" />
            <label htmlFor="remember" className="text-[13px] text-[#666] cursor-pointer">Remember me</label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-white text-[14px] font-semibold rounded cursor-pointer border-none btn-grad-primary"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

      </div>
    </div>
  );
}
