import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="text-lg font-semibold text-brand-700"
        >
          JobScrape
        </button>

        <div className="flex items-center gap-4 text-sm">
          {user?.email && <span className="text-slate-500">{user.email}</span>}
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-md border border-slate-300 text-slate-600 hover:bg-slate-100"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
