import { useAuth } from "../../hooks/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && !allowedRoles.includes(user.role)) {
      const roleHomeMap = {
        STUDENT: "/student",
        STUDENT_REP: "/rep",
        MESS_STAFF: "/staff",
        ADMIN: "/admin",
        SUPER_ADMIN: "/super-admin",
      };

      const homeUrl = roleHomeMap[user.role] || "/student";
      navigate(homeUrl, { replace: true });
    }
  }, [user, loading, allowedRoles, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  if (user && allowedRoles.includes(user.role)) {
    return children;
  }

  return null;
}
