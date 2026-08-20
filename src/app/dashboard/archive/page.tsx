import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ArchiveClient from "./archive-client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default async function ArchivePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("status", "archived")
    .order("updated_at", { ascending: false });

  return (
    <DashboardLayout user={user}>
      <ArchiveClient events={events || []} />
    </DashboardLayout>
  );
}