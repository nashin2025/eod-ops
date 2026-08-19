import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { eventId } = params;

    const { data: existing, error: checkError } = await supabase
      .from("event_participants")
      .select("*")
      .eq("event_id", eventId)
      .eq("user_id", user.id)
      .single();

    if (existing) {
      const { error: deleteError } = await supabase
        .from("event_participants")
        .delete()
        .eq("event_id", eventId)
        .eq("user_id", user.id);

      if (deleteError) throw deleteError;

      await supabase.rpc("decrement_participant_count", { event_id: eventId });

      return NextResponse.json({ joined: false });
    }

    const { data, error } = await supabase
      .from("event_participants")
      .insert({
        event_id: eventId,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;

    await supabase.rpc("increment_participant_count", { event_id: eventId });

    return NextResponse.json({ joined: true, participant: data });
  } catch (error) {
    console.error("Error joining event:", error);
    return NextResponse.json({ error: "Failed to join event" }, { status: 500 });
  }
}
