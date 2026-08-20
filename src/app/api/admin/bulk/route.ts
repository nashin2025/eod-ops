import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin only" }, { status: 403 });
    }

    const body = await request.json();
    const { action, userIds, data: updateData } = body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ error: "No users selected" }, { status: 400 });
    }

    // Prevent admin from modifying themselves in bulk actions
    const filteredIds = userIds.filter(id => id !== user.id);
    if (filteredIds.length !== userIds.length) {
      return NextResponse.json({ error: "Cannot perform bulk action on yourself" }, { status: 400 });
    }

    let result;

    switch (action) {
      case "approve":
        result = await supabase
          .from("users")
          .update({ approval_status: "approved", is_active: true })
          .in("id", filteredIds)
          .select();
        break;

      case "reject":
        result = await supabase
          .from("users")
          .update({ approval_status: "rejected", is_active: false })
          .in("id", filteredIds)
          .select();
        break;

      case "activate":
        result = await supabase
          .from("users")
          .update({ is_active: true })
          .in("id", filteredIds)
          .select();
        break;

      case "deactivate":
        result = await supabase
          .from("users")
          .update({ is_active: false })
          .in("id", filteredIds)
          .select();
        break;

      case "delete":
        result = await supabase
          .from("users")
          .delete()
          .in("id", filteredIds);
        break;

      case "role":
        if (!updateData?.role) {
          return NextResponse.json({ error: "Role required for role change" }, { status: 400 });
        }
        result = await supabase
          .from("users")
          .update({ role: updateData.role })
          .in("id", filteredIds)
          .select();
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    if (result.error) throw result.error;

    return NextResponse.json({ 
      success: true, 
      affected: result.data?.length || filteredIds.length,
      action 
    });
  } catch (error) {
    console.error("Error performing bulk action:", error);
    return NextResponse.json({ error: "Failed to perform bulk action" }, { status: 500 });
  }
}