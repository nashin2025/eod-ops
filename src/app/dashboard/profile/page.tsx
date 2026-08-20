import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileClient from "./profile-client";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  // Map snake_case DB columns to camelCase for client component
  const userData = {
    ...user,
    ...profile,
    firstName: profile?.first_name ?? user.user_metadata?.first_name ?? null,
    lastName: profile?.last_name ?? user.user_metadata?.last_name ?? null,
    profileImageUrl: profile?.profile_image_url ?? user.user_metadata?.avatar_url ?? null,
    approvalStatus: profile?.approval_status ?? "pending",
    isActive: profile?.is_active ?? true,
    serviceNumber: profile?.service_number ?? null,
    mobile: profile?.mobile ?? null,
    createdAt: profile?.created_at ?? new Date().toISOString(),
    updatedAt: profile?.updated_at ?? new Date().toISOString(),
  };

  return (
    <ProfileClient user={userData} />
  );
}
