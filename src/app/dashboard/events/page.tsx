import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EventsClient from "./events-client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default async function EventsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .neq("status", "archived")
    .order("created_at", { ascending: false });

  const { data: islands } = await supabase.from("islands").select("*").order("atoll").order("name");

  return (
    <DashboardLayout user={user}>
      <EventsClient
        user={user}
        events={events || []}
        islands={islands || []}
      />
    </DashboardLayout>
  );
}