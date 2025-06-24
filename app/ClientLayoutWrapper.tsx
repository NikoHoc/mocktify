'use client';

import { usePathname } from "next/navigation";
import { UserNavbar } from "../components/UserNavbar";
import { UserFooter } from "../components/UserFooter";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
 
  const noUserLayoutRoutes = ["/sign-in"];

  const isExcluded = noUserLayoutRoutes.includes(pathname);
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin || isExcluded) {
    return <>{children}</>;
  }

  return (
    <>
      <UserNavbar />
      <div className="h-flex py-12">{children}</div>
      <UserFooter />
    </>
  );
}
