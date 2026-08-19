import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: Request,
  { params }: { params: { islandId: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { equipmentIds } = body;

    const { data: visit, error } = await supabase
      .from("island_visits")
      .insert({
        island_id: params.islandId,
        user_id: user.id,
        visit_type: "manual",
      })
      .select()
      .single();

    if (error) throw error;

    if (equipmentIds && equipmentIds.length > 0) {
      const visitEquipment = equipmentIds.map((equipmentId: string) => ({
        visit_id: visit.id,
        equipment_id: equipmentId,
      }));

      const { error: veError } = await supabase
        .from("island_visit_equipment")
        .insert(visitEquipment);

      if (veError) throw veError;
    }

    return NextResponse.json(visit);
  } catch (error) {
    console.error("Error checking in:", error);
    return NextResponse.json({ error: "Failed to check in" }, { status: 500 });
  }
}
