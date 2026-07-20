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
    setLoading(true);
    setApiErr('');
    try {
      const res = await apiLogin(form.email, form.password);
      login(res.data);
      const role = res.data.role;
      navigate(
        role === 'EMPLOYEE' ? '/employee/dashboard'
        : role === 'DIRECTOR' ? '/director/dashboard'
        : '/accounts/dashboard'
      );
    } catch (err) {
      setApiErr(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const set = (k) => (e) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    setErrors(v => ({ ...v, [k]: '' }));
  };

  /* ── Exact HTML structure from lOGIN INDEX.php ── */
  return (
    <section className="login p-fixed d-flex align-items-center text-center bg-primary common-img-bg">
      <div className="container">
        <div className="row">
          <div className="col-sm-12">

            {/* Authentication card — auth-body + login-card + card-block */}
            <div className="login-card card-block auth-body mr-auto ml-auto">

              <form action="" className="md-float-material" onSubmit={handleSubmit}>

                {/* Logo / Brand */}
                <div className="text-center m-b-20">
                  <i className="icofont icofont-briefcase" style={{ fontSize: 40, color: '#4099ff' }}></i>
                  <p style={{ fontSize: 13, color: '#aaa', marginTop: 4, marginBottom: 0 }}>
                    Expense Voucher Management
                  </p>
                </div>

                <div className="auth-box">

                  {/* Title row */}
                  <div className="row m-b-20">
                    <div className="col-md-12">
                      <h3 className="text-left txt-primary">Sign In</h3>

                      {/* API error */}
                      {apiErr && (
                        <h6 className="text-danger text-left m-t-5">{apiErr}</h6>
                      )}
                    </div>
                  </div>

                  <hr />

                  {/* Email */}
                  <div className="input-group">
                    <input
                      id="admin_email"
                      type="email"
                      className="form-control"
                      placeholder="Your Email Address"
                      name="admin_email"
                      value={form.email}
                      onChange={set('email')}
                    />
                    <span className="md-line"></span>
                    {errors.email && (
                      <small className="text-danger text-left d-block m-t-5">{errors.email}</small>
                    )}
                  </div>

                  {/* Password */}
                  <div className="input-group">
                    <input
                      id="admin_pass"
                      type="password"
                      className="form-control"
                      placeholder="Password"
                      name="admin_pass"
                      value={form.password}
                      onChange={set('password')}
                    />
                    <span className="md-line"></span>
                    {errors.password && (
                      <small className="text-danger text-left d-block m-t-5">{errors.password}</small>
                    )}
                  </div>

                  {/* Remember me row */}
                  <div className="row m-t-25 text-left">
                    <div className="col-sm-7 col-xs-12">
                      <div className="checkbox-fade fade-in-primary">
                        <label>
                          <input type="checkbox" value="" />
                          <span className="cr">
                            <i className="cr-icon icofont icofont-ui-check txt-primary"></i>
                          </span>
                          <span className="text-inverse">Remember me</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Submit button row */}
                  <div className="row m-t-30">
                    <div className="col-md-12">
                      <button
                        type="submit"
                        name="admin_btn"
                        className="btn btn-primary btn-md btn-block waves-effect text-center m-b-20"
                        disabled={loading}
                      >
                        {loading ? 'Signing in...' : 'Sign in'}
                      </button>
                    </div>
                  </div>



                </div>
              </form>
            </div>
            {/* end authentication card */}

          </div>
        </div>
      </div>
    </section>
  );
}
