import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardClient from "./dashboard-client";

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

  return (
    <DashboardClient
      user={user}
      events={events || []}
      users={usersData}
      activeEventsCount={activeEvents.length}
      completedEventsCount={completedEvents.length}
      visitedIslands={islandVisits}
      atollsVisited={atollsVisited}
      teamMembersCount={users?.length || 0}
    />
  );
}