import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "STUDENT") {
    redirect(user.role === "COMPANY" ? "/employer" : user.role === "INSTITUTION" ? "/institution" : "/admin");
  }

  return (
    <DashboardShell
      role={user.role}
      userName={user.name}
      userEmail={user.email}
      userImage={user.image}
    >
      {children}
    </DashboardShell>
  );
}
