import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EventsClient from "./events-client";

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
    <EventsClient
      user={user}
      events={events || []}
      islands={islands || []}
    />
  );
}
