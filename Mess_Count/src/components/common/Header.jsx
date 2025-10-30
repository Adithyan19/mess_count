import { useAuth } from "../../hooks/useAuth.jsx";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

function Header() {
  const { logout } = useAuth();

  return (
    <header className="h-16 bg-white shadow flex items-center justify-between px-4 gap-2 border-b">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-4" />
        <h1 className="text-xl font-bold">Mess Count</h1>
      </div>
      <Button
        onClick={logout}
        className="text-sm text-red-600 hover:text-white"
      >
        Logout
      </Button>
    </header>
  );
}

export default Header;
