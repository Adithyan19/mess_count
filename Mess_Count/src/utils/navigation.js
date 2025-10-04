// src/utils/navigation.js
import {
    Users,
    UserPlus,
    ChefHat,
    BarChart3,
    QrCode,
    Scan,
    Clock,
    IdCard,
    UtensilsCrossed,
} from "lucide-react";

export const getNavItemsByRole = (role) => {
    const navigationConfig = {
        SUPER_ADMIN: [
            { name: "Create Admin", path: "/create-admin", icon: UserPlus },
            { name: "Promote Admin", path: "/promote-admin", icon: Users },
            { name: "Add Mess Staff", path: "/add-mess-staff", icon: ChefHat },
            {
                name: "All Food Counts",
                path: "/all-food-counts",
                icon: BarChart3,
            },
        ],
        ADMIN: [
            { name: "Food Count", path: "/food-count", icon: BarChart3 },
            { name: "Food Taken", path: "/food-taken", icon: UtensilsCrossed },
            { name: "Add Student", path: "/add-student", icon: UserPlus },
            { name: "Student Logs", path: "/student-logs", icon: Clock },
        ],
        MESS_STAFF: [
            { name: "Scan QR", path: "/scan-qr", icon: Scan },
            {
                name: "Confirm Food",
                path: "/confirm-food",
                icon: UtensilsCrossed,
            },
            { name: "Log Meal Time", path: "/log-meal-time", icon: Clock },
        ],
        STUDENT: [
            { name: "Student ID & QR", path: "/student-id", icon: IdCard },
            { name: "Mess Food", path: "/mess-food", icon: UtensilsCrossed },
        ],
    };

    return navigationConfig[role] || [];
};
