import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    let query = supabase.from("user_milestones");

    if (action === "clear-all") {
      const { error } = await query.delete().neq("id", "00000000-0000-0000-0000-000000000000");
      if (error) throw error;
      return NextResponse.json({ success: true, cleared: true });
    }

    if (action === "refresh-all") {
      const { data: milestones, error } = await query.select("*");
      if (error) throw error;

      for (const milestone of milestones || []) {
        await supabase
          .from("user_milestones")
          .update({ achieved_at: milestone.progress >= milestone.target_value ? new Date().toISOString() : null })
          .eq("id", milestone.id);
      }

      return NextResponse.json({ success: true, refreshed: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error managing milestones:", error);
    return NextResponse.json({ error: "Failed to manage milestones" }, { status: 500 });
  }
}
