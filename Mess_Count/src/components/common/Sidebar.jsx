import * as React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Home, Users, Settings, Vote, BarChart } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.jsx";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const navigationByRole = {
  STUDENT: [
    { title: "Home", url: "/student", icon: Home },
    { title: "My Meals", url: "/student/meals", icon: BookOpen },
  ],
  MESS_STAFF: [
    { title: "Home", url: "/staff", icon: Home },
    { title: "Count", url: "/staff/count", icon: BookOpen },
  ],
  STUDENT_REP: [
    { title: "Home", url: "/rep", icon: Home },
    { title: "My Meals", url: "/rep/meals", icon: BookOpen },
    { title: "Add Polls", url: "/rep/poll", icon: Vote },
    { title: "Poll Results", url: "/rep/results", icon: BarChart },
  ],
  ADMIN: [
    { title: "Dashboard", url: "/admin", icon: Home },
    { title: "Users", url: "/admin/users", icon: Users },
    { title: "Attendance", url: "/admin/attendance", icon: BookOpen },
  ],
  SUPER_ADMIN: [
    { title: "Dashboard", url: "/super-admin", icon: Home },
    { title: "All Users", url: "/super-admin/users", icon: Users },
    { title: "System Settings", url: "/super-admin/settings", icon: Settings },
    { title: "Audit Logs", url: "/super-admin/attendance", icon: BookOpen },
  ],
};

export function AppSidebar() {
  const { user } = useAuth();

  if (!user) return null;

  const navItems = navigationByRole[user.role] || [];

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Users className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">{user.name}</span>
                  <span className="text-xs text-gray-500 capitalize">
                    {user.role.toLowerCase().replace("_", " ")}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link to={item.url} className="flex items-center gap-2">
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
