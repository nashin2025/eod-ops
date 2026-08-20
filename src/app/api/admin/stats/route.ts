import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
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

    // Fetch all statistics in parallel
    const [
      { count: totalUsers },
      { count: activeUsers },
      { count: pendingUsers },
      { count: totalEvents },
      { count: activeEvents },
      { count: completedEvents },
      { count: totalEquipment },
      { count: availableEquipment },
      { count: damagedEquipment },
      { data: recentUsers },
      { data: recentEvents },
      { data: userRoles },
      { data: eventsByStatus },
    ] = await Promise.all([
      supabase.from("users").select("*", { count: "exact", head: true }),
      supabase.from("users").select("*", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("users").select("*", { count: "exact", head: true }).eq("approval_status", "pending"),
      supabase.from("events").select("*", { count: "exact", head: true }),
      supabase.from("events").select("*", { count: "exact", head: true }).in("status", ["active", "scheduled"]),
      supabase.from("events").select("*", { count: "exact", head: true }).eq("status", "completed"),
      supabase.from("equipment").select("*", { count: "exact", head: true }),
      supabase.from("equipment").select("*", { count: "exact", head: true }).eq("status", "available"),
      supabase.from("equipment").select("*", { count: "exact", head: true }).eq("status", "damaged"),
      supabase.from("users").select("id, email, first_name, last_name, role, approval_status, created_at").order("created_at", { ascending: false }).limit(5),
      supabase.from("events").select("id, title, atoll, island, status, created_at").order("created_at", { ascending: false }).limit(5),
      supabase.from("users").select("role").then(({ data }) => ({ data: data?.reduce((acc: Record<string, number>, u) => { acc[u.role] = (acc[u.role] || 0) + 1; return acc; }, {}) })),
      supabase.from("events").select("status").then(({ data }) => ({ data: data?.reduce((acc: Record<string, number>, e) => { acc[e.status] = (acc[e.status] || 0) + 1; return acc; }, {}) })),
    ]);

    // Calculate user growth (last 30 days vs previous 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const [{ count: usersLast30 }, { count: usersPrev30 }] = await Promise.all([
      supabase.from("users").select("*", { count: "exact", head: true }).gte("created_at", thirtyDaysAgo.toISOString()),
      supabase.from("users").select("*", { count: "exact", head: true }).gte("created_at", sixtyDaysAgo.toISOString()).lt("created_at", thirtyDaysAgo.toISOString()),
    ]);

    const userGrowth = usersPrev30 && usersPrev30 > 0 
      ? ((usersLast30 || 0) - usersPrev30) / usersPrev30 * 100 
      : 0;

    return NextResponse.json({
      overview: {
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        pendingUsers: pendingUsers || 0,
        totalEvents: totalEvents || 0,
        activeEvents: activeEvents || 0,
        completedEvents: completedEvents || 0,
        totalEquipment: totalEquipment || 0,
        availableEquipment: availableEquipment || 0,
        damagedEquipment: damagedEquipment || 0,
        userGrowth: Math.round(userGrowth * 10) / 10,
      },
      recentUsers: recentUsers || [],
      recentEvents: recentEvents || [],
      userRoles: userRoles || {},
      eventsByStatus: eventsByStatus || {},
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json({ error: "Failed to fetch admin stats" }, { status: 500 });
  }
}