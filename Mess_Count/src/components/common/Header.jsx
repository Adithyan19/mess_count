import { useAuth } from "../../hooks/useAuth.jsx";

function Header() {
  const { logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow z-40 flex items-center justify-between px-4">
      <h1 className="text-xl font-bold">Mess Count</h1>
      <button onClick={logout} className="text-sm text-red-600 hover:underline">
        Logout
      </button>
    </header>
  );
}

export default Header;
