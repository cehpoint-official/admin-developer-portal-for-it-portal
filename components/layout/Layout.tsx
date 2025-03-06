import { User } from "@/lib/types";
import Header from "./Header";
import SideBar from "./Sidebar";

interface LayoutProps {
  user: User;
  title: string;
  description?: string;
  children: React.ReactNode;
}
const Layout = ({ user, title, description, children }: LayoutProps) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:block ">
        <SideBar
          role={user.role}
          userName={user.name}
          userAvatar={user.avatar}
        />
      </div>
      <div className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">
          <Header title={title} description={description} />
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
