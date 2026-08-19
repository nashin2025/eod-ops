import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: readStatus, error: readError } = await supabase
      .from("user_chat_read_status")
      .select("last_read_created_at")
      .eq("user_id", user.id)
      .single();

    if (readError && readError.code !== "PGRST116") throw readError;

    if (!readStatus?.last_read_created_at) {
      const { count, error: countError } = await supabase
        .from("chat_messages")
        .select("*", { count: "exact", head: true })
        .neq("user_id", user.id);

      if (countError) throw countError;

      return NextResponse.json({ unreadCount: count || 0, latestMessageId: null });
    }

    const { count, error: countError } = await supabase
      .from("chat_messages")
      .select("*", { count: "exact", head: true })
      .gt("created_at", readStatus.last_read_created_at)
      .neq("user_id", user.id);

    if (countError) throw countError;

    const { data: latestMessage } = await supabase
      .from("chat_messages")
      .select("id")
      .neq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    return NextResponse.json({
      unreadCount: count || 0,
      latestMessageId: latestMessage?.id || null,
    });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    return NextResponse.json({ error: "Failed to fetch unread count" }, { status: 500 });
  }
}
