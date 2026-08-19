import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EventShareClient from "./event-share-client";

export default async function EventSharePage({
  params,
}: {
  params: { eventId: string };
}) {
  const supabase = await createClient();

  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", params.eventId)
    .single();

  if (error || !event) {
    redirect("/login");
  }

  return <EventShareClient event={event} />;
}
