import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{}> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const islandId = searchParams.get("islandId");

    let query = supabase
      .from("island_visits")
      .select(`
        *,
        island_visit_equipment (
          equipment_id,
          equipment:equipments (id, name, type)
        )
      `)
      .eq("user_id", user.id)
      .order("visited_at", { ascending: false });

    if (islandId) {
      query = query.eq("island_id", islandId);
    }

    const { data: visits, error } = await query;

    if (error) throw error;

    // Transform to include equipmentUsed array
    const visitsWithEquipment = (visits || []).map(visit => ({
      ...visit,
      equipmentUsed: visit.island_visit_equipment?.map((ve: any) => ve.equipment?.name).filter(Boolean) || [],
    }));

    return NextResponse.json(visitsWithEquipment || []);
  } catch (error) {
    console.error("Error fetching island visits:", error);
    return NextResponse.json({ error: "Failed to fetch island visits" }, { status: 500 });
  }
}