import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    // Map camelCase frontend fields to snake_case database columns
    const updateData: Record<string, unknown> = {};
    if (body.firstName !== undefined) updateData.first_name = body.firstName;
    if (body.first_name !== undefined) updateData.first_name = body.first_name;
    if (body.lastName !== undefined) updateData.last_name = body.lastName;
    if (body.last_name !== undefined) updateData.last_name = body.last_name;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.mobile !== undefined) updateData.mobile = body.mobile;
    if (body.serviceNumber !== undefined) updateData.service_number = body.serviceNumber;
    if (body.service_number !== undefined) updateData.service_number = body.service_number;
    if (body.profileImageUrl !== undefined) updateData.profile_image_url = body.profileImageUrl;
    if (body.profile_image_url !== undefined) updateData.profile_image_url = body.profile_image_url;

    const { data, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", user.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
