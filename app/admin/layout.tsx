import { Metadata } from "next";

import SideBar from "@/components/admin/side-bar";
import TopBar from "@/components/admin/top-bar";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Admin",
}

const AdminLayout = async (props: {
  children: React.ReactNode;
}) => {
  return (
    <div className="lg:flex bg-secondary min-h-screen">
      <SideBar className={cn(
        "hidden bg-background",
        "lg:block lg:fixed"
      )} />
      <main className={cn(
        "w-full",
        "lg:ml-72"
      )}>
        <TopBar />
        <div className="p-4">{props.children}</div>
      </main>
    </div>
  )
}

export default AdminLayout;
