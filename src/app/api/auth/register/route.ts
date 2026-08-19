import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { email, password, firstName, lastName } = await request.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/callback`,
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (data.user) {
      // Create user profile in users table
      const { error: profileError } = await supabase.from("users").insert({
        id: data.user.id,
        email: data.user.email,
        first_name: firstName,
        last_name: lastName,
        role: "agent",
        approval_status: "pending",
        is_active: true,
      });

      if (profileError) {
        console.error("Profile creation error:", profileError);
        // Don't fail registration if profile creation fails
      }
    }

    return NextResponse.json({ user: data.user, session: data.session });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}