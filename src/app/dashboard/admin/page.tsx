import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminClient from "./admin-client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: users } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: pendingUsers } = await supabase
    .from("users")
    .select("*")
    .eq("approval_status", "pending")
    .order("created_at", { ascending: false });

  // Map snake_case DB columns to camelCase for client component
  const mapUser = (u: any) => ({
    ...u,
    firstName: u.first_name ?? null,
    lastName: u.last_name ?? null,
    profileImageUrl: u.profile_image_url ?? null,
    approvalStatus: u.approval_status ?? "pending",
    isActive: u.is_active ?? true,
    serviceNumber: u.service_number ?? null,
    mobile: u.mobile ?? null,
    createdAt: u.created_at ?? new Date().toISOString(),
  });

  return (
    <DashboardLayout user={user}>
      <AdminClient
        currentUser={user}
        users={users?.map(mapUser) || []}
        pendingUsers={pendingUsers?.map(mapUser) || []}
      />
    </DashboardLayout>
  );
}