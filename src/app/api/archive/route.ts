import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: events, error } = await supabase
      .from("events")
      .select("*")
      .eq("status", "archived")
      .order("updated_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(events || []);
  } catch (error) {
    console.error("Error fetching archived events:", error);
    return NextResponse.json({ error: "Failed to fetch archived events" }, { status: 500 });
  }
}
