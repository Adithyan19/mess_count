import { X, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function Sidebar({
    navItems,
    isOpen,
    onClose,
    activeRoute,
    onRouteChange,
}) {
    const { user, logout } = useAuth();

    const getAccentColor = () => {
        switch (user?.role.toLowerCase()) {
            case "super_admin":
                return "purple";
            case "admin":
                return "blue";
            case "mess_staff":
                return "green";
            case "student":
                return "orange";
            default:
                return "blue";
        }
    };

    const accentColor = getAccentColor();
    const prettyRole = user?.role?.replace(/_/g, " ").toLowerCase();

    return (
        <aside
            className={`
        fixed top-16 left-0 z-30 w-64 h-[calc(100vh-4rem)] bg-white shadow-lg
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
        >
            {/* Mobile close button */}
            <div className="flex items-center justify-between p-4 border-b lg:hidden">
                <h3 className="font-semibold text-gray-800">Menu</h3>
                <button
                    onClick={onClose}
                    className="p-1 rounded-md hover:bg-gray-100"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Navigation Items */}
            <nav className="mt-4 lg:mt-0 flex-1 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.path}
                            onClick={() => {
                                onRouteChange(item.path);
                                onClose();
                            }}
                            className={`
                w-full flex items-center px-6 py-3 text-left
                transition-colors duration-200
                ${
                    activeRoute === item.path
                        ? `bg-${accentColor}-100 text-${accentColor}-700 border-l-4 border-${accentColor}-500`
                        : "text-gray-700 hover:bg-gray-100"
                }
              `}
                        >
                            <Icon className="mr-3 h-5 w-5" />
                            <span className="font-medium">{item.name}</span>
                        </button>
                    );
                })}
            </nav>

            {/* User info and logout at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
                <button
                    onClick={logout}
                    className="w-full flex items-center px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                    <LogOut className="mr-3 h-5 w-5" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
