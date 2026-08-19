import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("approval_status", "pending")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(users || []);
  } catch (error) {
    console.error("Error fetching pending users:", error);
    return NextResponse.json({ error: "Failed to fetch pending users" }, { status: 500 });
  }
}
