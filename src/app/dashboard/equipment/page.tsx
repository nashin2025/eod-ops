import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EquipmentClient from "./equipment-client";

export default async function EquipmentPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: equipment } = await supabase
    .from("equipment")
    .select("*")
    .order("atoll", { ascending: true })
    .order("island", { ascending: true });

  const { data: islands } = await supabase.from("islands").select("*").order("atoll").order("name");

  return (
    <EquipmentClient
      user={user}
      equipment={equipment || []}
      islands={islands || []}
    />
  );
}
