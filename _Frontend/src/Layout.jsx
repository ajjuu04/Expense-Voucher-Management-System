import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

/* Nav items per role — same icons as sidenav.php (ti-* Themify icons) */
const NAV = {
  EMPLOYEE: [
    { to: '/employee/dashboard', icon: 'ti-home', label: 'Dashboard', letter: 'D' },
    { to: '/employee/create',    icon: 'ti-plus',    label: 'Create Voucher', letter: 'C' },
    { to: '/employee/vouchers',  icon: 'ti-receipt', label: 'My Vouchers',    letter: 'V' },
  ],
  DIRECTOR: [
    { to: '/director/dashboard', icon: 'ti-home',       label: 'Dashboard',         letter: 'D' },
    { to: '/director/pending',   icon: 'ti-time',        label: 'Pending Approvals', letter: 'P' },
    { to: '/director/vouchers',  icon: 'ti-layout-list-thumb', label: 'All Vouchers', letter: 'V' },
  ],
  ACCOUNTS: [
    { to: '/accounts/dashboard', icon: 'ti-home',    label: 'Dashboard',   letter: 'D' },
    { to: '/accounts/vouchers',  icon: 'ti-receipt', label: 'All Vouchers', letter: 'V' },
  ],
};

export default function Layout({ children, title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/login');
  };

  const navItems = NAV[user?.role] || [];
  const initials = user?.email?.[0]?.toUpperCase() || '?';

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div id="pcoded" className="pcoded">
      {/* Sidebar Overlay (Hidden by default, shown when sidebar is open on mobile) */}
      <div 
        className={`pcoded-overlay-box ${sidebarOpen ? 'd-block' : 'd-none'} d-lg-none`}
        onClick={() => setSidebarOpen(false)}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1026, transition: 'opacity 0.3s' }}
      ></div>
      <div className="pcoded-container navbar-wrapper">

        {/* ══════════════════════════════════════
            HEADER  — headernav.php structure
        ══════════════════════════════════════ */}
        <nav className="navbar header-navbar pcoded-header">
          <div className="navbar-wrapper">

            {/* Logo area — same dark bg as sidebar */}
            <div className="navbar-logo">
              <a
                className="mobile-menu"
                id="mobile-collapse"
                href="#!"
                onClick={(e) => { e.preventDefault(); setSidebarOpen(!sidebarOpen); }}
              >
                <i className="ti-menu"></i>
              </a>
              <Link to="#!" className="brand-text">
                <i className="icofont icofont-briefcase" style={{ marginRight: 6 }}></i>
                ExpenseVoucherMS
              </Link>
            </div>

            {/* Header nav items */}
            <div className="navbar-container container-fluid">
              <ul className="nav-left">
                <li>
                  <div className="sidebar_toggle">
                    <a href="#!" onClick={(e) => { e.preventDefault(); setSidebarOpen(!sidebarOpen); }}>
                      <i className="ti-menu"></i>
                    </a>
                  </div>
                </li>
              </ul>

              <ul className="nav-right">
                {/* User Profile Dropdown */}
                <li
                  className={`user-profile header-notification${profileOpen ? ' open' : ''}`}
                  onClick={() => setProfileOpen(!profileOpen)}
                >
                  <a href="#!" onClick={(e) => e.preventDefault()}>
                    <div className="user-avatar-circle">{initials}</div>
                    <span className="d-none d-sm-inline" style={{ fontSize: 13, color: '#666', marginLeft: 6 }}>
                      {user?.email}
                    </span>
                    <i className="ti-angle-down" style={{ fontSize: 10, marginLeft: 4, color: '#999' }}></i>
                  </a>
                  <ul className="show-notification profile-notification">
                    <li>
                      <h6 style={{ padding: '10px 15px', margin: 0, borderBottom: '1px solid #f1f1f1', color: '#999', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase' }}>
                        {user?.role}
                      </h6>
                    </li>
                    <li>
                      <a href="#!" onClick={handleLogout}>
                        <i className="ti-layout-sidebar-left"></i> Logout
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>

          </div>
        </nav>

        {/* ══════════════════════════════════════
            MAIN CONTAINER  — template.php
        ══════════════════════════════════════ */}
        <div className="pcoded-main-container">
          <div className="pcoded-wrapper">

            {/* ══════════════════════════════════
                SIDEBAR  — sidenav.php structure
            ══════════════════════════════════ */}
            <nav className={`pcoded-navbar${sidebarOpen ? ' open' : ''}`}>
              <div className="pcoded-inner-navbar main-menu">
                <div className="pcoded-navigatio-lavel">{user?.role}</div>
                <ul className="pcoded-item pcoded-left-item">
                  {navItems.map((item) => (
                    <li key={item.to} className={isActive(item.to) ? 'active' : ''}>
                      <Link to={item.to} onClick={() => setSidebarOpen(false)}>
                        <span className="pcoded-micon">
                          <i className={item.icon}></i>
                          <b>{item.letter}</b>
                        </span>
                        <span className="pcoded-mtext">{item.label}</span>
                        <span className="pcoded-mcaret"></span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>

            {/* ══════════════════════════════════
                CONTENT AREA — template.php
            ══════════════════════════════════ */}
            <div className="pcoded-content">
              <div className="pcoded-inner-content">
                <div className="main-body">
                  <div className="page-wrapper">

                    {/* Breadcrumb / Page Header */}
                    <div className="page-header">
                      <div className="row align-items-center">
                        <div className="col-md-6">
                          <div className="page-header-title">
                            <h5 className="m-b-0">{title}</h5>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <ul className="breadcrumb justify-content-md-end">
                            <li className="breadcrumb-item">
                              <a href="#!">Home</a>
                            </li>
                            <li className="breadcrumb-item active">{title}</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Page Body — injected content */}
                    <div className="page-body">
                      {children}
                    </div>

                    {/* Style Selector placeholder */}
                    <div id="styleSelector"></div>

                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
