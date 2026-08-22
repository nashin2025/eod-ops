import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Check user profile for approval status
    if (data.user) {
      const { data: profile } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user.id)
        .single();

      if (profile?.approval_status !== "approved") {
        return NextResponse.json(
          { error: "Account pending approval", redirectTo: "/pending" },
          { status: 403 }
        );
      }
    }

    return NextResponse.json({ user: data.user, session: data.session });
  } catch (error) {
    console.error("Email/password login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}