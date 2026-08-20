import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    // Map camelCase frontend fields to snake_case database columns
    const updateData: Record<string, unknown> = {};
    if (body.role !== undefined) updateData.role = body.role;
    if (body.approvalStatus !== undefined) updateData.approval_status = body.approvalStatus;
    if (body.approval_status !== undefined) updateData.approval_status = body.approval_status;
    if (body.isActive !== undefined) updateData.is_active = body.isActive;
    if (body.is_active !== undefined) updateData.is_active = body.is_active;
    if (body.firstName !== undefined) updateData.first_name = body.firstName;
    if (body.first_name !== undefined) updateData.first_name = body.first_name;
    if (body.lastName !== undefined) updateData.last_name = body.lastName;
    if (body.last_name !== undefined) updateData.last_name = body.last_name;
    if (body.profileImageUrl !== undefined) updateData.profile_image_url = body.profileImageUrl;
    if (body.profile_image_url !== undefined) updateData.profile_image_url = body.profile_image_url;
    if (body.serviceNumber !== undefined) updateData.service_number = body.serviceNumber;
    if (body.service_number !== undefined) updateData.service_number = body.service_number;
    if (body.mobile !== undefined) updateData.mobile = body.mobile;

    const { data, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", params.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabase
      .from("users")
      .delete()
      .eq("id", params.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
