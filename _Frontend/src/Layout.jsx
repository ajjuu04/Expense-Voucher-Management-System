import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const NAV = {
  EMPLOYEE: [
    { to: '/employee/dashboard', icon: 'fa-solid fa-house',       label: 'Dashboard' },
    { to: '/employee/create',    icon: 'fa-solid fa-circle-plus', label: 'Create Voucher' },
    { to: '/employee/vouchers',  icon: 'fa-solid fa-receipt',     label: 'My Vouchers' },
  ],
  DIRECTOR: [
    { to: '/director/dashboard', icon: 'fa-solid fa-house',      label: 'Dashboard' },
    { to: '/director/pending',   icon: 'fa-solid fa-clock',      label: 'Pending Approvals' },
    { to: '/director/vouchers',  icon: 'fa-solid fa-list-check', label: 'All Vouchers' },
  ],
  ACCOUNT_TEAM: [
    { to: '/accounts/dashboard', icon: 'fa-solid fa-house',   label: 'Dashboard' },
    { to: '/accounts/vouchers',  icon: 'fa-solid fa-receipt', label: 'All Vouchers' },
  ],
};

export default function Layout({ children, title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/login');
  };

  const navItems = NAV[user?.role] || [];
  const initials = user?.email?.[0]?.toUpperCase() || '?';
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-[#f3f3f3]">

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`fixed top-0 left-0 h-full w-[235px] bg-[#2c3e50] z-30 flex flex-col
        transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="pt-[60px] overflow-y-auto flex-1">
          <div className="px-5 py-3 text-[13px] font-extrabold tracking-widest text-white/60 uppercase">
            {user?.role}
          </div>
          <nav className="mt-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-5 py-3 text-[13.5px] no-underline border-l-[3px] transition-none
                  ${isActive(item.to)
                    ? 'text-white bg-[rgba(64,153,255,0.18)] border-[#4099ff]'
                    : 'text-white/65 border-transparent hover:text-white hover:bg-white/[0.07]'
                  }`}
              >
                <i className={`${item.icon} w-5 text-center ${isActive(item.to) ? 'text-[#4099ff]' : ''}`}></i>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      <nav className="fixed top-0 left-0 right-0 h-[60px] bg-white shadow-sm z-40 flex items-stretch lg:pl-[235px]">
        <div className="flex items-center px-5 gap-3 bg-[#2c3e50] text-white
          absolute top-0 left-0 h-full w-full lg:w-[235px] z-50">
          <button
            className="lg:hidden text-white/80 text-xl bg-transparent border-none cursor-pointer p-0"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i className="fa-solid fa-bars-staggered"></i>
          </button>
          <span className="font-bold text-[17px] tracking-wide whitespace-nowrap">
            <i className="icofont icofont-briefcase mr-2"></i>
            ExpenseVoucherMS
          </span>
        </div>

        <div className="ml-auto flex items-center pr-4 relative z-[60]">
          <div
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <div className="w-[34px] h-[34px] rounded-full flex items-center justify-center font-bold text-sm text-white"
              style={{ background: 'linear-gradient(45deg, #4099ff, #73b4ff)' }}>
              {initials}
            </div>
            <span className="hidden sm:block text-[13px] text-[#666]">{user?.email}</span>
            <i className="fa-solid fa-angle-down text-[10px] text-[#999]"></i>
          </div>

          {profileOpen && (
            <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-100 z-50">
              <div className="px-4 py-2 text-[11px] font-bold tracking-widest text-[#999] uppercase border-b border-gray-100">
                {user?.role}
              </div>
              <a href="#!" onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 text-[13px] text-[#555] no-underline hover:bg-gray-50">
                <i className="fa-solid fa-right-from-bracket"></i> Logout
              </a>
            </div>
          )}
        </div>
      </nav>

      <main className="lg:ml-[235px] pt-[60px] min-h-screen">
        <div className="p-5">
          <div className="bg-white rounded-md shadow-sm px-5 py-4 mb-5 flex items-center justify-between">
            <h5 className="m-0 text-[15px] font-bold text-[#444]">{title}</h5>
            <nav className="text-[13px] text-[#888] flex items-center gap-1">
              <a href="#!" className="text-[#4099ff] no-underline">Home</a>
              <span className="mx-1">/</span>
              <span>{title}</span>
            </nav>
          </div>
          {children}
        </div>
      </main>

    </div>
  );
}
