import { getCurrentUser } from "@/lib/session";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return (
      <div className="container-page py-24 text-center text-sm text-zinc-500">
        Anda tidak memiliki akses ke portal admin.
      </div>
    );
  }

  return (
    <DashboardShell
      role="ADMIN"
      userName={user.name ?? ""}
      userEmail={user.email ?? ""}
      userImage={user.image}
    >
      {children}
    </DashboardShell>
  );
}
