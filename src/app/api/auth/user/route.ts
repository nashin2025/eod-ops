import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError && profileError.code !== "PGRST116") {
      console.error("Error fetching profile:", profileError);
    }

    const userData = profile || {
      id: user.id,
      email: user.email || "",
      firstName: user.user_metadata?.first_name || null,
      lastName: user.user_metadata?.last_name || null,
      profileImageUrl: user.user_metadata?.avatar_url || null,
      role: "agent" as const,
      approvalStatus: "pending" as const,
      isActive: true,
      serviceNumber: null,
      mobile: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Auth user error:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
