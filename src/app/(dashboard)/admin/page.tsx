import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminClient from "./admin-client";

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

  return (
    <AdminClient
      currentUser={user}
      users={users || []}
      pendingUsers={pendingUsers || []}
    />
  );
}
