import { useRoutes } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth.jsx";
import { routes } from "./routes/routes.jsx";
import Login from "./components/auth/login.jsx";

function AppContent() {
  const { user, loading } = useAuth();
  const routeElements = useRoutes(routes);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        <span className="ml-3 text-white text-lg">Loading...</span>
      </div>
    );
  }

  if (!user) return <Login />;

  return routeElements;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
