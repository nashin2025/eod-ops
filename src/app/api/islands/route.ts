import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: islands, error } = await supabase
      .from("islands")
      .select("*")
      .order("atoll", { ascending: true })
      .order("name", { ascending: true });

    if (error) throw error;

    return NextResponse.json(islands || []);
  } catch (error) {
    console.error("Error fetching islands:", error);
    return NextResponse.json({ error: "Failed to fetch islands" }, { status: 500 });
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
      .from("islands")
      .insert(body)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating island:", error);
    return NextResponse.json({ error: "Failed to create island" }, { status: 500 });
  }
}
