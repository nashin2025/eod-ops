import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: stats, error } = await supabase
      .from("user_milestones")
      .select("milestone_type, progress")
      .eq("user_id", user.id)
      .order("milestone_level", { ascending: false });

    if (error) throw error;

    const islandVisits = stats?.find(s => s.milestone_type === "island_visits")?.progress || 0;
    const atollsVisited = stats?.find(s => s.milestone_type === "atolls_visited")?.progress || 0;

    const { count: totalVisits } = await supabase
      .from("island_visits")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    return NextResponse.json({
      totalIslands: islandVisits,
      totalVisits: totalVisits || 0,
      uniqueAtolls: atollsVisited,
    });
  } catch (error) {
    console.error("Error fetching milestone stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
