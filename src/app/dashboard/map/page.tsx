import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MapClient from "./map-client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default async function MapPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: events } = await supabase.from("events").select("*");
  const { data: islands } = await supabase.from("islands").select("*");

  return (
    <DashboardLayout user={user}>
      <MapClient
        user={user}
        events={events || []}
        islands={islands || []}
      />
    </DashboardLayout>
  );
}