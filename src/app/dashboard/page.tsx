import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardClient from "./dashboard-client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .neq("status", "archived")
    .order("created_at", { ascending: false });

  const { data: users } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: stats } = await supabase
    .from("user_milestones")
    .select("milestone_type, progress")
    .eq("user_id", user.id);

  const islandVisits = stats?.find(s => s.milestone_type === "island_visits")?.progress || 0;
  const atollsVisited = stats?.find(s => s.milestone_type === "atolls_visited")?.progress || 0;

  // Get total visits count from island_visits table
  const { count: totalVisits } = await supabase
    .from("island_visits")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  // Get achieved milestones count
  const { data: achievedMilestones } = await supabase
    .from("user_milestones")
    .select("*")
    .eq("user_id", user.id)
    .gte("progress", 100); // This assumes we store target in progress or need to check differently

  // For now, count milestones where progress >= target (simplified)
  const { data: allMilestones } = await supabase
    .from("user_milestones")
    .select("*")
    .eq("user_id", user.id);

  const achievedCount = allMilestones?.filter(m => m.progress >= 1).length || 0; // Simplified

  const activeEvents = events?.filter(e => e.status === "active" || e.status === "scheduled") || [];
  const completedEvents = events?.filter(e => e.status === "completed") || [];

  // Map snake_case DB columns to camelCase for client component
  const usersData = (users || []).map(u => ({
    ...u,
    firstName: u.first_name ?? null,
    lastName: u.last_name ?? null,
    email: u.email,
    role: u.role,
    createdAt: u.created_at ?? new Date().toISOString(),
  }));

  // Prepare real dashboard data for client
  const totalEvents = events?.length || 0;
  const totalUsers = users?.length || 0;
  const activeEventsCount = activeEvents.length;
  const completedEventsCount = completedEvents.length;

  // Revenue calculation from events (if events have pricing)
  const totalRevenue = events?.reduce((sum, e) => sum + (e.price || 0), 0) || 0;

  // Recent events for activity feed
  const recentEvents = (events || []).slice(0, 5).map(e => ({
    id: e.id,
    title: e.title,
    status: e.status,
    date: e.created_at,
    location: e.location,
  }));

  // Upcoming events for quick stats
  const upcomingEvents = (events || [])
    .filter(e => e.status === "scheduled" && new Date(e.start_date) > new Date())
    .slice(0, 5)
    .map(e => ({
      id: e.id,
      title: e.title,
      date: e.start_date,
      location: e.location,
    }));

  return (
    <DashboardLayout user={user}>
      <DashboardClient
        totalEvents={totalEvents}
        totalUsers={totalUsers}
        activeEventsCount={activeEventsCount}
        completedEventsCount={completedEventsCount}
        totalRevenue={totalRevenue}
        islandVisits={islandVisits}
        atollsVisited={atollsVisited}
        totalVisits={totalVisits || 0}
        achievedCount={achievedCount}
        recentEvents={recentEvents}
        upcomingEvents={upcomingEvents}
        usersData={usersData}
      />
    </DashboardLayout>
  );
}