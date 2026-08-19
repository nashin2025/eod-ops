import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const atoll = url.searchParams.get("atoll");
    const type = url.searchParams.get("type");
    const status = url.searchParams.get("status");

    let query = supabase.from("equipment").select("*");

    if (atoll) query = query.eq("atoll", atoll);
    if (type) query = query.eq("type", type);
    if (status) query = query.eq("status", status);

    const { data: equipment, error } = await query.order("atoll", { ascending: true }).order("island", { ascending: true });

    if (error) throw error;

    return NextResponse.json(equipment || []);
  } catch (error) {
    console.error("Error fetching equipment:", error);
    return NextResponse.json({ error: "Failed to fetch equipment" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { data, error } = await supabase
      .from("equipment")
      .insert({
        ...body,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating equipment:", error);
    return NextResponse.json({ error: "Failed to create equipment" }, { status: 500 });
  }
}
