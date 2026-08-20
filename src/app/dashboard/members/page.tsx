import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MembersClient from "./members-client";

export default async function MembersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: users } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  // Map snake_case DB columns to camelCase for client component
  const usersData = (users || []).map(u => ({
    ...u,
    firstName: u.first_name ?? null,
    lastName: u.last_name ?? null,
    profileImageUrl: u.profile_image_url ?? null,
    serviceNumber: u.service_number ?? null,
    mobile: u.mobile ?? null,
    createdAt: u.created_at ?? new Date().toISOString(),
  }));

  return (
    <MembersClient
      currentUser={user}
      users={usersData}
    />
  );
}
